import { onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


const userName = document.querySelector("#userName");
const userImage = document.querySelector("#userImage");
const logoutBtn = document.querySelector("#logoutBtn");
const div = document.querySelector(".mainHeroBlogPositioner");

let blogArray = []


// For Signout
logoutBtn.addEventListener('click', event => {
    event.preventDefault()

    signOut(auth).then(() => {
        window.location = "login.html"
    }).catch((error) => {
        console.log(error);
    })
})

// TO CHECK THE STATE OF THE USER
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid)

        let users = await getData()
        console.log(users)

        userName.innerHTML = users.fullname
        userImage.src = users.imgUrl
    } else {
        window.location = "login.html";
    }
});

async function getData() {
    let user;
    const q = query(collection(db, "users"), where("userUid", "==", auth.currentUser.uid))

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        user = doc.data();
    });

    return user;
}

async function getBlogDataFromFirestore() {
  const q = query(collection(db, "blogs"))

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
      blogArray.push(doc.data())
      renderItems(blogArray)
  });
}

getBlogDataFromFirestore()


function renderItems(arr) {
  arr.map(item => {
    div.innerHTML += `
    
    <div class="blogContainer bg-white px-5 py-4  rounded w-50">
      <div class="blogContent d-flex gap-3">
        <img src="${item.blogImage}" alt="" width="75px" height="80px" style="border-radius: 12px;">
        <div class="blogInfo">
          <h5 class="TitleHead">${item.Title}</h5>
          <span class="userInformation fw-semibold">${item.userName} - ${item.date}</span>
        </div>
      </div>
      <div class="blogDescription mt-3">
        <p>${item.Description}</p>
      </div>
      <div class="blogAnchorTag">
        <a href="singleuser.html?currentUserUid=${item.currentUserUid}" id="specificUser">see all from this user</a>
      </div>
    </div>

    `

    const specificUserId = item.currentUserUid
    const stringed = JSON.stringify(specificUserId)
    localStorage.setItem('uid' , stringed)
  })
}