import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, query, where, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


const logoutBtn = document.querySelector("#logoutBtn")
const userName = document.querySelector("#userName")
const userImage = document.querySelector("#userImage")
const div = document.querySelector("#heroContainerContentTaker")
const headingDiv = document.querySelector("#headingContainerContent")



let userData = []
let blogData = []



// TO CHECK THE STATE OF THE USER
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        
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



// For Signout
logoutBtn.addEventListener('click', event => {
    event.preventDefault()
    
    signOut(auth).then(() => {
        window.location = "login.html"
    }).catch((error) => {
        console.log(error);
    })
})


// Get the user uid

const userUidFromIndex = localStorage.getItem("uid")
const convertedIntoNormal = JSON.parse(userUidFromIndex)
async function fetchData() {
    let DataOfUser = await getUserDataFromFirestore(convertedIntoNormal);
    let BlogsOfUser = await getBlogsDataFromFirestore(convertedIntoNormal);
    renderItems(userData, blogData);
}

fetchData();


async function getUserDataFromFirestore(userId) {
    let specificUserData;

    const q = query(collection(db, "users"), where("userUid", "==", userId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        specificUserData = doc.data()
        userData.push(doc.data())
    });

    return specificUserData;
}

async function getBlogsDataFromFirestore(userId){
    let specificUserBlogs;

    const q = query(collection(db, "blogs"), where("currentUserUid", "==", userId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        specificUserBlogs = doc.data()
        blogData.push(doc.data())
    });

    return specificUserBlogs;
}



function renderItems(userData, blogData) {
    // Render blog data
    blogData.map(blog => {
        headingDiv.innerHTML += `
            <h5 class="px-4 mt-3">All From ${blog.userName}</h5>
        `

        div.innerHTML += `
            <div class="bothLeftAndRightMainContainer d-flex px-4 align-items-center">  
                <div class="blogsMainContainerLeftSided">
                    <div class="blogContainer bg-white px-5 py-4 rounded"> 
                        <div class="blogContent d-flex gap-3">
                            <img src="${blog.blogImage}" alt="" width="75px" height="80px" style="border-radius: 12px;">
                            <div class="blogInfo">
                                <h5 class="TitleHead">${blog.Title}</h5>
                                <span class="userInformation fw-semibold">${blog.userName} - ${blog.date}</span>
                            </div>
                        </div>
                        <div class="blogDescription mt-3">
                            <p>${blog.Description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // Render user data
    userData.map(user => {
        div.innerHTML += `
            <div class="profileMainContainerRightSide">
                <div class="profileContainer">
                    <span>${user.email}</span>
                    <h3>${user.fullname}</h3>
                    <img src="${user.imgUrl}" alt="" width="200px" height="200px" style="border-radius: 12px;">
                </div>
            </div>
        `;
    });


}

renderItems(userData, blogData);