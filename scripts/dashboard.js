import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, query, where, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


const logoutBtn = document.querySelector("#logoutBtn")
const userName = document.querySelector("#userName")
const userImage = document.querySelector("#userImage")
const title = document.querySelector("#title")
const description = document.querySelector("#description")
const addBlogs = document.querySelector("#blogsBtn")
const blogDiv = document.querySelector("#blogCards")
const blogHead = document.querySelector(".headingblogs")
const postedBy = document.querySelector("#postedByRandom")



const BlogContent = []


// Cloudinary

let blogImage;

let myWidget = cloudinary.createUploadWidget({
  cloudName: 'duamkmvwc', 
  uploadPreset: 'blogging'}, (error, result) => { 
    if (!error && result && result.event === "success") { 
      console.log('Done! Here is the image info: ', result.info); 
      blogImage = result.info.secure_url
    }
  }
)

document.getElementById("upload_widget").addEventListener("click", function(){
    myWidget.open();
  }, false);

// Cloudinary Ended


// Sending Data in the firestore with a collection name "blogs"

addBlogs.addEventListener('click' , async event => {
    event.preventDefault()     
    
    let userInfo = await getData()


    let date = new Date()
    
    const day = date.getDate()
    console.log(day);
    
    let months = ["Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec"]

    let monthDate = new Date()
    
    let monthName = months[monthDate.getMonth()]; 
    console.log(monthName); 
    
    try {
    const docRef = await addDoc(collection(db, "blogs"), {
        Title: title.value,
        Description: description.value,
        currentUserUid: auth.currentUser.uid,
        blogImage: blogImage,
        date: `${day} ${monthName}`,
        userName: userInfo.fullname,
    });
    console.log("Document written with ID: ", docRef.id);
    window.location.reload()
    } catch (e) {
    console.error("Error adding document: ", e);
    }
})




// Check if the user is logged In or not


onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User uid:", user.uid);
           
        let users = await getData()
        console.log(users);
    
        userName.innerHTML = users.fullname    
        userImage.src = users.imgUrl
        
        const q = query(collection(db, "blogs"), where("currentUserUid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            BlogContent.push(doc.data())
            renderingData(BlogContent)  
            console.log(BlogContent);
        });

    } else {
        window.location = "login.html"
    }
});

    
// Get Data from Firestore
    
async function getData() {        
    let currentUser;
    
    const q = query(collection(db, "users"), where("userUid", "==", auth.currentUser.uid));
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        currentUser = doc.data()
    });
    
    return currentUser;
}


// Signout

logoutBtn.addEventListener('click' , event =>{
    event.preventDefault()

    signOut(auth).then(() => {
        window.location = "index.html"
    }).catch((error) => {
        console.log(error);
    });
})

// Get Data from firestore to render

// async function getRenderingDataFromFirestore() {
//     console.log("Auth kia a rha ha",auth);
//     const q = query(collection(db, "blogs"));

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//         BlogContent.push({ ...doc.data(), id: doc.id })
//         console.log(BlogContent);
//         
//     });
// }

// getRenderingDataFromFirestore()


// Rendering Data

function renderingData(arr) {
    arr.map((item)=>{
        blogDiv.innerHTML += `
        <div class="userBlogContent">
            <img src="${item.blogImage}" alt="" width="125px" height="125px">
            <h2 class="titleStyling">${item.Title}</h2>
            <p class="descriptionStyling">${item.Description}</p>
            <div class="userInformation d-flex justify-content-between">
                <span class="posterName">Posted by ${item.userName}</span>
                <span class="posterName">Posted on <span class="dateAndMonth">${item.date}</span></span>
            </div>
        </div>
        `
    })
}

// Conditions
// Character limit condition... should be under 150 words

