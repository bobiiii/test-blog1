"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="bg-white rounded-xl shadow-lg p-12 flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
            KathySmith Blogs
          </h1>
          <Link
            href="/blog"
            className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-400 to-blue-400 text-white rounded-lg shadow hover:from-pink-500 hover:to-blue-500 transition font-semibold text-lg"
          >
            Explore Blogs
          </Link>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-xl p-8 max-w-md text-center">
            <p className="text-gray-700">
              All content (including images, videos, and text) is sourced from a WordPress database (where available) and is used purely as an example,
            </p>
            <button
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
