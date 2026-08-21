"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [uploadStatus, setUploadStatus] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadStatus(`Successfully uploaded: ${file.name}`);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      {/* Challenge 1: File Upload */}
      <section className="mb-10 p-6 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Profile Avatar</h2>
        <div className="mb-4">
          <label htmlFor="avatar-upload" className="block text-sm font-medium mb-2">
            Upload New Photo
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {uploadStatus && (
          <p className="text-green-600 font-medium" data-testid="upload-success">
            {uploadStatus}
          </p>
        )}
      </section>

      {/* Challenge 2: The Iframe */}
      <section className="mb-10 p-6 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Billing Portal</h2>
        <p className="text-sm text-gray-500 mb-4">Manage your subscription securely below.</p>
        
        <iframe 
          title="Secure Billing"
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head><style>body { font-family: sans-serif; padding: 20px; }</style></head>
              <body>
                <h3>Update Payment Method</h3>
                <input type="text" id="card-number" placeholder="Card Number" style="padding:8px; width:100%; border: 1px solid #ccc; border-radius: 4px;" />
                <button id="submit-card" style="margin-top:10px; padding:8px 16px; background:black; color:white; border:none; border-radius: 4px; cursor:pointer;">Save Card</button>
                <p id="billing-status" style="color:green; display:none; margin-top:10px; font-weight: bold;">Card linked successfully!</p>
                <script>
                  document.getElementById('submit-card').addEventListener('click', () => {
                    document.getElementById('billing-status').style.display = 'block';
                  });
                </script>
              </body>
            </html>
          `}
          className="w-full h-64 border-2 border-dashed border-gray-300 rounded"
        />
      </section>

      {/* Challenge 3: New Tab Navigation */}
      <section className="p-6 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Developer Resources</h2>
        <a 
          href="https://playwright.dev/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium"
          data-testid="docs-link"
        >
          Open API Documentation
        </a>
      </section>
    </main>
  );
}