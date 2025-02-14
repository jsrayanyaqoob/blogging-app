import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";



async function getData() {

    let userData;
    const q = query(collection(db, "users"));
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userData = doc.data()
    });

    console.log(userData);
    
}

getData()