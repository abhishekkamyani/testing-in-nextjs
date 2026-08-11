// components/UserProfileFetcher.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// Assuming you have a UserProfileCard component (based on your coverage reports!)
// If you don't, you can replace <UserProfileCard user={user} /> with standard HTML 
// like <h1>{user.username}</h1>
import { UserProfileCard } from "./UserProfileCard"; 

export interface User {
  username: string;
  email: string;
  role: "admin" | "user";
}

// ---------------------------------------------------------------------------
// 1. THE NATIVE FETCH COMPONENT (Used for MSW & global.fetch tests)
// ---------------------------------------------------------------------------
export const UserProfileFetcher = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    fetch(`/api/users/${userId}`)
      .then(async (res) => {
        // Native fetch does NOT automatically throw errors on 404 or 500 statuses.
        // We must manually check res.ok and throw an error to trigger the catch block.
        if (!res.ok) {
            throw new Error("User not found");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load user");
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading user details...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!user) return null;

  return <UserProfileCard email={user.email} username={user.username} role={user.role} profileUrl={`/users/${userId}`} />;
};


// ---------------------------------------------------------------------------
// 2. THE LEGACY AXIOS COMPONENT (Used for jest.mock("axios") tests)
// ---------------------------------------------------------------------------
export const UserProfileAxios = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    axios
      .get(`/api/users/${userId}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load user");
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading user details...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!user) return null;

  return <UserProfileCard email={user.email} username={user.username} role={user.role} profileUrl={`/users/${userId}`} isAccountLocked={user.role === "admin"} />;
};