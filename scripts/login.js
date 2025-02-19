import { signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth } from "./firebaseconfig.js";

const email = document.querySelector("#email")
const password = document.querySelector("#password")
const loginBtn = document.querySelector("#loginBtn")


loginBtn.addEventListener('click' , event =>{
    event.preventDefault()
    
    console.log(email.value);
    console.log(password.value);
    
signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);  
    window.location = "dashboard.html"
    
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
    
  });
    
})