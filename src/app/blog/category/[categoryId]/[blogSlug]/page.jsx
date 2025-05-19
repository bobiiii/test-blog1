import React from "react";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

export function processContent(content) {
  if (!content) return "";

  // Step 1: Decode HTML entities
  const decodedContent = content.replace(/&[^;]+;/g, (match) => {
    const entities = {
      "&#8221;": '"',
      "&#8243;": '"',
      "&#038;": "&",
      "&amp;": "&",
      "&quot;": '"',
      "&nbsp;": " ",
    };
    return entities[match] || match;
  });

  // Step 2: Process Divi shortcodes
  const processedContent = decodedContent
    .replace(
      /\[et_pb_code[^\]]*?\](.*?)\[\/et_pb_code\]/gs,
      (match, content) => {
        const iframeMatch = content.match(/<iframe.*?<\/iframe>/s);
        const alignMatch = match.match(/module_alignment=(["'])(.*?)\1/);
        const align = alignMatch ? alignMatch[2] : "center"; // Default to center if not found

        if (iframeMatch) {
          const iframe = iframeMatch[0];
          return `
      <div style="
        // border: 10px solid #ccc;
        text-align: left;
        display: flex  ;
        justify-content: ${align};  ;
        max-width: 100%;
      ">
        ${iframe}
      </div>
    `;
        }
        return "";
      }
    )
    .replace(/\[et_pb_image[^\]]*?\]/g, (match) => {
      // Extract attributes
      const src = match.match(/src=(["'])(.*?)\1/)?.[2] || "";
      const alt = match.match(/title_text=(["'])(.*?)\1/)?.[2] || "";
      const align =
        match.match(/module_alignment=(["'])(.*?)\1/)?.[2] || "center";
      const width = match.match(/width=(["'])(.*?)\1/)?.[2] || "100%";
      const link = match.match(/url=(["'])(.*?)\1/)?.[2];

      // Build image HTML
      let imgHTML = `
  <img 
      src="${src}" 
      alt="${alt}"
      style="
      // border: 10px solid #ccc;
        max-width: ${width};
        height: auto;
        display: block;
        // margin-left: auto;
        // margin-right: auto;
        margin: 10px auto
      "
    >


  `;

      // Wrap with link if needed
      if (link) {
        imgHTML = `<a href="${link}">${imgHTML}</a>`;
      }

      // Container div for alignment
      return `
    <div style="text-align: ${align}">
      ${imgHTML}
    </div>
  `;
    })
    .replace(/\[et_pb_cta[^\]]*?\]/g, (match) => {
      // Extract attributes
      const buttonUrl = match.match(/button_url=(["'])(.*?)\1/)?.[2] || "";
      const buttonText = match.match(/button_text=(["'])(.*?)\1/)?.[2] || "";
      const buttonTextColor =
        match.match(/button_text_color=(["'])(.*?)\1/)?.[2] || "#ffffff";
      const buttonBgColor =
        match.match(/button_bg_color=(["'])(.*?)\1/)?.[2] || "#63aae0";
      const buttonFont =
        match.match(/button_font=(["'])(.*?)\1/)?.[2] || "Arial|700"; // Default font
      const buttonTextSize =
        match.match(/button_text_size=(["'])(.*?)\1/)?.[2] || "21px";
      const customPadding =
        match.match(/custom_padding=(["'])(.*?)\1/)?.[2] || "10px 20px";

      const minHeight = match.match(/min_height=(["'])(.*?)\1/)?.[2] || "auto";

      // Split font family and weight
      const [buttonFontFamily, buttonFontWeight] = buttonFont.split("|");

      if (buttonUrl && buttonText) {
        return `
      <div  style=" min-height:${minHeight}; padding: ${customPadding}; text-align: center; ">
      <a
  href="${buttonUrl}"
  style="
    background-color: ${buttonBgColor};
    color: ${buttonTextColor};
    font-family: ${buttonFontFamily};
    font-weight: ${buttonFontWeight};
    font-size: ${buttonTextSize};
    text-decoration: none;
    display: inline-block;
    // border: 10px solid red;
    border-radius: 3px;
    padding: 10px 20px;
  "
>
  ${buttonText} 
</a>
      </div>
    `;
      }
      return ""; // Return empty if URL or text is missing
    })

    .replace(/\[[^\]]+\]/g, ""); // Remove other shortcodes

  // Step 3: Safe HTML
  return purify.sanitize(processedContent, {
    ALLOWED_TAGS: [
      "p",
      "div",
      "span",
      "br",
      "em",
      "strong",
      "b",
      "i",
      "a",
      "img",
      "h1",
      "h2",
      "h3",
      "iframe",
      "center",
    ],
    ALLOWED_ATTR: [
      "style",
      "href",
      "target",
      "src",
      "alt",
      "class",
      "title",
      "loading",
      "frameborder",
      "allow",
      "allowfullscreen",
      "width",
      "height",
      "referrerpolicy",
      "allowtransparency",
      "scrolling",
    ],
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allowfullscreen", "referrerpolicy", "loading"],
  });
}

async function page({ params }) {
  const { blogSlug } = await params;

  // GET /wp-json/wp/v2/posts?slug=your-post-slug
  const blogData = await fetch(
    `https://www.kathysmith.com/wp-json/wp/v2/posts?slug=${blogSlug}`
  );

  const dataArray = await blogData.json();
  const data = dataArray[0];
  if (!data) {
    return <div>Blog not found</div>;
  }
  const processedContent = processContent(data.content.rendered);

  // Example yoga background image (royalty-free, unsplash)
  const yogaBg =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80";

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(20,20,40,0.7), rgba(20,20,40,0.7)), url('/yoga2.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "80vw",
          maxHeight: "95vh",
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <article
          className="overflow-y-auto prose max-w-5xl w-full mx-auto rounded-xl shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "4px solid #39ff14",
            boxShadow: "0 0 40px #39ff14, 0 0 10px #fff",
            padding: "2.5rem",
            margin: "2rem 0",
            backdropFilter: "blur(2px)",
          }}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>
    </div>
  );
}

export default page;
