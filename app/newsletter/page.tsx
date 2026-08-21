"use client";

import React, { useState } from "react";

export default function NewsletterPage() {
  const [submitted, setSubmitted] = useState(false);

  // FIX 1: Changed the outer <div> to a semantic <main> tag
  return (
    <main className="p-10 font-sans max-w-md mx-auto mt-10 border shadow-sm bg-white">
      <h1 className="text-gray-900 text-2xl mb-4 font-bold">Subscribe to our Newsletter</h1>

      <img 
        src="https://via.placeholder.com/400x150?text=Weekly+Newsletter" 
        alt="Weekly Newsletter Banner"
        className="mb-6 rounded" 
      />

      <div className="space-y-4">
        <div>
          <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input 
            id="email-input"
            type="email" 
            placeholder="Enter your email" 
            className="border border-gray-300 p-2 w-full rounded" 
          />
        </div>

        {/* FIX 2: Darkened the button to bg-blue-700 for proper contrast */}
        <button
          className="bg-blue-700 text-white p-2 w-full rounded text-center cursor-pointer hover:bg-blue-800 font-medium"
          onClick={() => setSubmitted(true)}
        >
          Submit
        </button>
      </div>

      {submitted && (
        <p className="mt-4 text-green-600 font-medium">Thanks for subscribing!</p>
      )}
    </main>
  );
}