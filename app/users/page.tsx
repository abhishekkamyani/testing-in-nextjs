"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedUser, setLoadedUser] = useState<string | null>(null);

  const fetchRandomUser = async () => {
    setLoadedUser(null);
    // Hitting a real, public API
    const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const data = await res.json();
    setLoadedUser(data.name);
  };

  return (
    <main className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">User Directory</h1>

      {/* Hydration Trap: Controlled Input */}
      <div className="mb-8">
        <label htmlFor="search" className="block text-sm font-medium mb-2">Search Users</label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type a name..."
          className="border rounded px-3 py-2 w-full"
        />
        <p className="mt-2 text-sm text-gray-600" data-testid="search-echo">
          Searching for: {searchTerm || "..."}
        </p>
      </div>

      {/* Network Wait Trap: Real API Call */}
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <button 
          onClick={fetchRandomUser}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Load Random User
        </button>
        {loadedUser && (
          <p className="mt-4 text-green-700 font-medium" data-testid="loaded-user">
            Successfully loaded: {loadedUser}
          </p>
        )}
      </div>

      {/* Client-Side Routing */}
      <div className="border-t pt-6">
        <Link 
          href="/users/123-admin" 
          className="text-blue-600 hover:underline"
        >
          View Admin Profile
        </Link>
      </div>
    </main>
  );
}