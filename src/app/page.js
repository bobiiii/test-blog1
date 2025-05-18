import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
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
  );
}
