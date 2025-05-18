import Link from "next/link";
import React, { useEffect, useState } from "react";

function CategoryCards({
  parentId,
  activeTab,
  categoriesSample,
}) {
  const [parentcategories, setParentcategories] = useState([]);

  useEffect(() => {
    async function getData() {
      const ParentcategoriesData = await fetch(
        `https://www.kathysmith.com/wp-json/wp/v2/categories?parent=${parentId}`
      );
      const res2 = await ParentcategoriesData.json();
      setParentcategories(res2);
    }

    getData();
  }, [parentId]);
  return (
    <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
      {parentcategories.length === 0 ? (
        <div className="text-gray-500 text-lg">
          No categories found for "{activeTab.name}"
        </div>
      ) : (
        parentcategories.map((cat, i) => (
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
    </div>
  );
}

export default CategoryCards;
