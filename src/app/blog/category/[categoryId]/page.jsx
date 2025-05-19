import React from 'react';
import Link from 'next/link';

async function getCategoryBySlug(slug) {
  const res = await fetch(
    `https://www.kathysmith.com/wp-json/wp/v2/categories?slug=${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch category");
  const data = await res.json();
  return data[0];
}

async function getPostsByCategory(categoryId) {
  const res = await fetch(
    `https://www.kathysmith.com/wp-json/wp/v2/posts?categories=${categoryId}&_embedper_page=80`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function CategoryPage({ params }) {
  const { categoryId } = await params;
  const category = await getCategoryBySlug(categoryId);
  const posts = await getPostsByCategory(category?.id);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
      padding: "2rem"
    }}>
      <div style={{
        maxWidth: 960, // Increased max width for better layout
        margin: "2rem auto",
        background: "#fff",
        borderRadius: "0.5rem", // Slightly less rounded
        boxShadow: "0 8px 16px rgba(0,0,0,0.08)", // More pronounced shadow
        padding: "2rem",
      }}>
        {category ? (
          <>
            <h1 style={{ fontSize: "2.5rem", color: "#4f46e5", marginBottom: "1rem", textAlign: "center" }}>
              {category.name}
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.1rem", marginBottom: "2rem", textAlign: "center" }}>
              {category.description || "No description available."}
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Responsive grid
              gap: "1.5rem",
              marginTop: "2rem",
            }}>
              {posts && posts.length > 0 ? (
                posts.map(post => {
                  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                  return (
                    <div key={post.id} style={{
                      background: "#f9f9f9",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.04)",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%", // Make cards take full available height in the grid row
                    }}>
                      {featuredImageUrl && (
                        <img
                          src={featuredImageUrl}
                          alt={post.title.rendered}
                          style={{
                            width: "100%",
                            height: "200px", // Fixed height for images
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1 }}>
                        <div>
                          <h3 style={{ color: "#334155", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.2rem" }}>
                            {post.title.rendered}
                          </h3>
                          <div
                            style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.75rem" }}
                            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                          />
                        </div>
                        {/* <Link href={post.link} style={{ color: "#4f46e5", fontWeight: 500, textDecoration: "none", marginTop: "0.5rem" }}> */}
                        <Link href={`/blog/category/${categoryId}/${post.slug}`} style={{ color: "#4f46e5", fontWeight: 500, textDecoration: "none", marginTop: "0.5rem" }}>
                          Read More
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: "#a1a1aa", marginTop: "2rem", textAlign: "center" }}>No posts found in this category.</p>
              )}
            </div>
          </>
        ) : (
          <p style={{ color: "#ef4444", textAlign: "center" }}>Category not found.</p>
        )}
      </div>
    </div>
  );
}