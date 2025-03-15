

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { 
    getAuth, signInWithEmailAndPassword ,sendPasswordResetEmail ,GoogleAuthProvider,signInWithPopup
} from
    "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCT9IhThW8qFhs2Yilyr-AsQaC8XNDloq0",
    authDomain: "cuvette-tech-8e3e2.firebaseapp.com",
    projectId: "cuvette-tech-8e3e2",
    storageBucket: "cuvette-tech-8e3e2.firebasestorage.app",
    messagingSenderId: "462947281460",
    appId: "1:462947281460:web:de37949441bb56756df861",
    measurementId: "G-Y3QJMC47GE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();

const loginButton = document.querySelector('.loginButton')

loginButton.addEventListener('click', function (event) {
    event.preventDefault()

    // Input Data
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            
            const user = userCredential.user;

            user.reload().then(() => {
                if (user.emailVerified) {
                    // Go back two folders and then enter login page 
                    window.location.href = "../../docs/index.html";
                } else {
                    alert("Please verify your email before logging in.");
                }
            });

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
        });

})

document.querySelector('.forgotPasswordButton').addEventListener('click', function () {
    const email = prompt("Enter your email to reset password:");
    
    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Show the Bootstrap modal
                let forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
                forgotPasswordModal.show();
            })
            .catch((error) => {
                alert(error.message);
            });
    }
});

const googleSignUp = document.querySelector('.googleLogin')
const provider = new GoogleAuthProvider();

googleSignUp.addEventListener('click' , function(event){
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            window.location.href = "../../docs/index.html";
            console.log(user);
        })
        .catch((error) => {
            console.error(error.message);
            alert(error.message);
        });
})