"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardStats {
  activeUsers: number;
  revenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load dashboard statistics");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-8 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/settings" className="text-blue-600 hover:underline font-medium">
          Go to Settings
        </Link>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Live Overview</h2>

        {loading && (   
          <div data-testid="loading-spinner" className="text-blue-500 font-medium animate-pulse">
            Loading real-time stats...
          </div>
        )}

        {error && (
          <div role="alert" className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded border">
              <p className="text-sm text-gray-500 mb-1">Active Users</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="active-users">
                {stats.activeUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded border">
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="revenue">
                ${stats.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}