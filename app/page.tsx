"use client";

import React, { useState } from "react";

interface Product {
  id: string;
  name: string;
  category: "Electronics" | "Audio" | "Accessories";
  price: number;
  inStock: boolean;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Mechanical Keyboard", category: "Electronics", price: 120, inStock: true },
  { id: "2", name: "Wireless Noise-Canceling Headphones", category: "Audio", price: 250, inStock: true },
  { id: "3", name: "Ergonomic Desk Mat", category: "Accessories", price: 35, inStock: true },
  { id: "4", name: "USB-C Multiport Adapter", category: "Electronics", price: 45, inStock: false },
  { id: "5", name: "Studio Microphone", category: "Audio", price: 180, inStock: true },
];

export default function ProductExplorerPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const handleAddToCart = (productName: string) => {
    setCartCount((prev) => prev + 1);
    setToastMessage(`Added ${productName} to cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReset = () => {
    setQuery("");
    setActiveCategory("All");
  };

  return (
    <main className="max-w-4xl mx-auto p-6 font-sans">
      {/* Header & Cart Counter */}
      <header className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">TechMart Product Explorer</h1>
          <p className="text-gray-600 text-sm">Discover high-performance developer gear</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-md">
          <span className="font-medium text-blue-900" aria-label="Cart items count">
            Cart: {cartCount} {cartCount === 1 ? "item" : "items"}
          </span>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div role="status" className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {toastMessage}
        </div>
      )}

      {/* Search & Category Filter Controls */}
      <section aria-label="Filter products" className="bg-gray-50 p-4 rounded-lg border mb-6 space-y-4">
        <div>
          <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
            Search Products
          </label>
          <div className="flex gap-2">
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product title..."
              className="flex-1 border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-blue-500"
            />
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Category:</span>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Category selector">
            {["All", "Electronics", "Audio", "Accessories"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Results */}
      <section aria-label="Product list">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Available Products</h2>
          <span className="text-sm text-gray-500" data-testid="results-count">
            Showing {filteredProducts.length} results
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-gray-500 font-medium">No products found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                data-testid="product-card"
                className="border rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-2">${product.price}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-xs font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  <button
                    type="button"
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product.name)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold text-white ${
                      product.inStock ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}