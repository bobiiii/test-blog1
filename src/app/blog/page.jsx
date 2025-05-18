"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryCards from "./CategoryCards";

const categoriesSample = [
  {
    id: 1,
    title: "Technology",
    desc: "Latest trends and insights in technology.",
    image: "https://picsum.photos/400/250?random=1",
    slug: "technology",
  },
  {
    id: 2,
    title: "Travel",
    desc: "Explore the world with our travel guides.",
    image: "https://picsum.photos/400/250?random=2",
    slug: "travel",
  },
  {
    id: 3,
    title: "Food",
    desc: "Delicious recipes and food stories.",
    image: "https://picsum.photos/400/250?random=3",
    slug: "food",
  },
  {
    id: 4,
    title: "Lifestyle",
    desc: "Tips for a better and happier life.",
    image: "https://picsum.photos/400/250?random=4",
    slug: "lifestyle",
  },
  {
    id: 5,
    title: "Lifestyle",
    desc: "Tips for a better and happier life.",
    image: "https://picsum.photos/400/250?random=4",
    slug: "lifestyle",
  },
  {
    id: 6,
    title: "Lifestyle",
    desc: "Tips for a better and happier life.",
    image: "https://picsum.photos/400/250?random=4",
    slug: "lifestyle",
  },
  {
    id: 7,
    title: "Lifestyle",
    desc: "Tips for a better and happier life.",
    image: "https://picsum.photos/400/250?random=4",
    slug: "lifestyle",
  },
  {
    id: 8,
    title: "Lifestyle",
    desc: "Tips for a better and happier life.",
    image: "https://picsum.photos/400/250?random=4",
    slug: "lifestyle",
  },
  {
    id: 9,
    title: "Lifestyle",
    desc: "Tips for a better and happier life.",
    image: "https://picsum.photos/400/250?random=4",
    slug: "lifestyle",
  },
  {
    id: 10,
    title: "Lifestyle",
    desc: "Tips for a better and happier life.",
    image: "https://picsum.photos/400/250?random=4",
    slug: "lifestyle",
  },
];

export default function BlogCategoriesPage() {
  const [categories, setcategories] = useState([]);
  const [parentcategories, setParentcategories] = useState([]);
  const tabs = parentcategories.map((cat) => {return {name :cat.name, id: cat.id}});

  const [activeTab, setActiveTab] = useState(tabs[0] || {name : "Food", id: 118});

  useEffect(() => {
    async function getData() {
      const ParentcategoriesData = await fetch(
        "https://www.kathysmith.com/wp-json/wp/v2/categories?parent=0"
      );
      const categoriesData = await fetch(
        "https://www.kathysmith.com/wp-json/wp/v2/categories"
      );
      const res = await categoriesData.json();
      const res2 = await ParentcategoriesData.json();
      setcategories(res);
      setParentcategories(res2);
    }

    getData();
  }, []);


  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-purple-700">
        Blog Categories
      </h1>
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 mx-2 rounded-t-lg font-semibold transition-colors duration-200 ${
              activeTab.name === tab.name
                ? "bg-purple-700 text-white"
                : "bg-white text-purple-700 border border-purple-200"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {/* Cards */}

<CategoryCards parentId={activeTab.id}  activeTab={activeTab} categoriesSample={categoriesSample}/>

      {/* <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
        {filteredCategories.length === 0 ? (
          <div className="text-gray-500 text-lg">
            No categories found for "{activeTab}"
          </div>
        ) : (
          filteredCategories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/blog/category/${cat.slug}`}
              className="group w-64 h-auto"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:-translate-y-2 hover:shadow-2xl duration-300 flex flex-col h-full">
                <img
                  src={categoriesSample[i % categoriesSample.length].image}
                  alt={cat.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-purple-800 mb-2 group-hover:underline">
                      {cat.name}
                    </h2>
                    {cat?.description ? (
                      <p className="text-gray-600">{cat.description}</p>
                    ) : (
                      <p className="text-red-600">
                        No description available in DB
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div> */}
    </main>
  );
}
