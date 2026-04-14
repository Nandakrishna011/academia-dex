// app/robots.js

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://academia-dex.vercel.app/sitemap.xml",
  };
}
