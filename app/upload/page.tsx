
"use client";
import { db, storage, auth } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const uploadScript = async () => {
    if (!auth.currentUser) return alert("Login dulu!");

    let imageUrl = "";
    if (image) {
      const imageRef = ref(storage, "scripts/" + image.name);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "scripts"), {
      title,
      code,
      imageUrl,
      uid: auth.currentUser.uid,
      createdAt: new Date()
    });

    alert("Script uploaded!");
  };

  return (
    <div>
      <h1>Upload Script</h1>
      <input placeholder="Judul Script" onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Code Script" onChange={e => setCode(e.target.value)} />
      <input type="file" onChange={e => setImage(e.target.files?.[0] || null)} />
      <button onClick={uploadScript}>Upload</button>
    </div>
  );
}
