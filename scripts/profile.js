import { onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const userName = document.querySelector("#userName");
const userImage = document.querySelector("#userImage");
const logoutBtn = document.querySelector("#logoutBtn");
const oldPassword = document.querySelector("#oldPassword");
const newPassword = document.querySelector("#newPassword");
const repeatPassword = document.querySelector("#repeatPassword");
const saveChanges = document.querySelector("#saveChanges");
const PencilBtn = document.querySelector(".fa-pencil");
const userImg = document.querySelector(".userImage");
const userProfileName = document.querySelector("#userProfileName");
const newUserNameUpdate = document.querySelector("#newUserNameUpdate");
const saveBtn = document.querySelector("#saveBtn");

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
        userImg.src = users.imgUrl
        userProfileName.innerHTML = users.fullname
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

// Pencil Btn usage to open modal and change the username
PencilBtn.addEventListener('click', function () {
    document.querySelector(".popupContainer").style.display = "flex"
})

// To close the modal
document.querySelector('.close').addEventListener('click', function () {
    document.querySelector(".popupContainer").style.display = "none"
})

saveChanges.addEventListener('click', async (event) => {
    event.preventDefault()

    const oldPasswordValue = oldPassword.value
    const newPasswordValue = newPassword.value
    const repeatPasswordValue = repeatPassword.value

    const user = auth.currentUser;

    if (!user) {
        alert("User not logged in....")
        return;
    }

    if (newPasswordValue !== repeatPasswordValue) {
        alert("new password and repeat password are not matching.")
        return;
    }

    const credential = EmailAuthProvider.credential(user.email, oldPasswordValue)

    try {
        await reauthenticateWithCredential(user, credential)
        await updatePassword(user, newPasswordValue)
        alert("your password is update successful!")

        oldPassword.value = "";
        newPassword.value = "";
        repeatPassword.value = "";

        document.querySelector(".popupContainer").style.display = "none"
    } catch (error) {
        console.error(error);
        alert("your old password is incorrect!")
    }
});





// Username Update

saveBtn.addEventListener('click' , async event => {
    event.preventDefault()
    
    
     onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            console.log(uid)
            
        } else {
            window.location = "login.html";
        }
    });
    
    const newUserName = newUserNameUpdate.value
    userName.innerHTML = newUserName
    
    // async function getDocId() {
        // }
        let documentId;
        
        const q = query(collection(db, "users"), where("userUid", "==", auth.currentUser.uid))
    
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            documentId = doc.id;
        });
    
        const users = doc(db, "users", documentId);
        
        await updateDoc(users, {
            fullname: newUserName
        });
    
})