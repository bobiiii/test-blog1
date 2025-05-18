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
        // text-align: ${align};
        display: flex  ;
        justify-content: center  ;
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
        const customPadding = match.match(/custom_padding=(["'])(.*?)\1/)?.[2] || '10px 20px';

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

async function page() {
  const blogData = await fetch(
    "https://www.kathysmith.com/wp-json/wp/v2/posts/220232"
  );
  const data = await blogData.json();
  const processedContent = processContent(data.content.rendered);
  return (
    <div className="px-4">
      <h1 className="text-center text-lg text-red-500 py-8">Blog Page</h1>

      <h1>Blog ID : {data.id}</h1>
      <h1>Blog Title : {data.title.rendered}</h1>

      <h1>Blog Content : </h1>
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  );
}

export default page;
