
"use client";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail } from "firebase/auth";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    alert("Login Google berhasil!");
  };

  const sendOTP = async () => {
    await sendSignInLinkToEmail(auth, email, {
      url: window.location.origin,
      handleCodeInApp: true,
    });
    window.localStorage.setItem("emailForSignIn", email);
    alert("Link login dikirim ke email!");
  };

  return (
    <div>
      <h1>Login ScripPaste</h1>
      <button onClick={googleLogin}>Login dengan Google</button>
      <div>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <button onClick={sendOTP}>Login Email OTP</button>
      </div>
    </div>
  );
}
