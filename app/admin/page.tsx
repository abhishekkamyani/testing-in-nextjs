"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the auth cookie exists. If not, kick them out!
    if (!document.cookie.includes("authToken=fake-jwt-token-123")) {
      router.push("/login");
    } else {
      setIsAuth(true);
    }
  }, [router]);

  // Prevent flashing the protected content
  if (!isAuth) return null; 

  return (
    <main className="max-w-2xl mx-auto mt-20 p-8 font-sans">
      <h1 className="text-3xl font-bold text-green-700">Welcome to the Secure Admin Panel</h1>
      <p className="mt-4 text-gray-600 text-lg">If you can see this, you are successfully authenticated!</p>
    </main>
  );
}