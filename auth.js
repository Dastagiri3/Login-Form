import { auth, db } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SIGNUP
window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Save user in DB
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      createdAt: new Date()
    });

    alert("Signup Successful ✅");
  } catch (error) {
    alert(error.message);
  }
};

// LOGIN
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful ✅");

    // redirect
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
};
