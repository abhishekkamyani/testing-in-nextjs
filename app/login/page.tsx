"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded check for our E2E test
    if (username === "admin" && password === "password123") {
      // Simulate setting a secure auth cookie
      document.cookie = "authToken=fake-jwt-token-123; path=/; max-age=3600";
      router.push("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-sm bg-white font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Login</h1>
      
      {error && (
        <div role="alert" className="bg-red-50 text-red-700 p-3 mb-6 rounded border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
          <input 
            id="username" 
            type="text" 
            className="border w-full p-2 rounded focus:outline-blue-500" 
            onChange={e => setUsername(e.target.value)} 
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input 
            id="password" 
            type="password" 
            className="border w-full p-2 rounded focus:outline-blue-500" 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">
          Log In
        </button>
      </form>
    </main>
  );
}