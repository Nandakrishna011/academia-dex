// app/sitemap.js

export default function sitemap() {
  const baseUrl = "https://academia-dex.vercel.app";

  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/dashboard` },
    { url: `${baseUrl}/attendance` },
    { url: `${baseUrl}/marks` },
    { url: `${baseUrl}/timetable` },
    { url: `${baseUrl}/planner` },
  ];
}
