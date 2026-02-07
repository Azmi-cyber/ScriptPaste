
"use client";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: 15 }}>
      <Link href="/">Home</Link>
      <Link href="/upload">Upload</Link>
      <Link href="/login">Login</Link>
      <button onClick={() => signOut(auth)}>Logout</button>
    </nav>
  );
}
