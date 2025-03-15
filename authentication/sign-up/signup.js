

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

import {
    getAuth, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber ,
    GoogleAuthProvider, signInWithPopup , sendEmailVerification
}
    from
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

const signupButton = document.querySelector('.emailSignUp')

signupButton.addEventListener('click', function (event) {
    event.preventDefault()

    // Input Data
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            
            sendEmailVerification(user)
                .then(() => {
                    alert("Please check your Inbox to verify email and then Login into your Account !");
                });
           
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
            // ..
        });

})

// Phone Verification Button
const sendOtpButton = document.querySelector('.otp-btn')
const phoneSignUp = document.querySelector('.phoneSignUp')



sendOtpButton.addEventListener('click', function (event) {
    const phoneNumber = document.getElementById('phone').value

    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
            console.log("reCAPTCHA verified!");
        },
        'expired-callback': () => {
            console.log("reCAPTCHA expired. Please refresh.");
        }
    });

    const appVerifier = window.recaptchaVerifier; // Use the reCAPTCHA instance

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            alert("OTP Sent!");
        })
        .catch((error) => {
            console.error("Error sending OTP:", error);
            alert(error.message);
        });

    signInWithPhoneNumber

})

phoneSignUp.addEventListener('click', function (event) {
    const otpCode = document.getElementById('otp').value;

    window.confirmationResult.confirm(otpCode)
        .then((result) => {
            alert("Phone number verified!");
            window.location.href = "../../docs/index.html";
            console.log(result.user);
        })
        .catch((error) => {
            console.error("OTP Verification Failed:", error);
            alert(error.message);
        });
})

const googleSignUp = document.querySelector('.googleSignUp')
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

