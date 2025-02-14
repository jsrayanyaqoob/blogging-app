import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth , db } from "./firebaseconfig.js"
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const fullName = document.querySelector("#fullName")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
const signupBtn = document.querySelector("#singupBtn")


let imgUrl;


let myWidget = cloudinary.createUploadWidget({
  cloudName: 'duamkmvwc', 
  uploadPreset: 'blogging'}, (error, result) => { 
    if (!error && result && result.event === "success") { 
      console.log('Done! Here is the image info: ', result.info); 
      imgUrl = result.info.secure_url
    }
  }
)

document.getElementById("upload_widget").addEventListener("click", function(){
    myWidget.open();
  }, false);


signupBtn.addEventListener('click' , async (event) =>{
  event.preventDefault()

  console.log(fullName.value);
  console.log(email.value);
  console.log(password.value);


  createUserWithEmailAndPassword(auth, email.value, password.value)
  .then(async (userCredential) => {
    const user = userCredential.user;
    console.log(user.uid);
    try {
      const docRef = await addDoc(collection(db, "users"), {
        fullname: fullName.value,
        email: email.value, 
        password: password.value,
        imgUrl: imgUrl,
        userUid: user.uid,
      });
      console.log("Document written with ID: ", docRef.id);
      window.location = "login.html"
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
  });
})