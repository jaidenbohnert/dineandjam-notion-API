import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default async function handler(req, res) {
  // CORS for GitHub Pages
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ ENV CHECK INSIDE HANDLER (serverless-safe)
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.error("Missing Notion environment variables");
    return res.status(500).json({
      success: false,
      error: "Server misconfiguration",
    });
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      page_size: 100,
    });

    const performers = response.results.map(page => {
      const p = page.properties || {};

      return {
        id: page.id,
        name: p.Name?.title?.[0]?.text?.content || "No Name",
        genre: p.Genre?.rich_text?.[0]?.text?.content || "",
        shortBio: p["Short Bio"]?.rich_text?.[0]?.text?.content || "",
        profilePicture:
          p["Profile Picture"]?.files?.[0]?.file?.url ||
          p["Profile Picture"]?.files?.[0]?.external?.url ||
          "https://via.placeholder.com/400",
        socials:
          p["Socials(Optional)"]?.rich_text?.map(t => t.text.content) || [],
        email: p.Email?.email || "",
        phone: p["Phone #"]?.phone_number || "",
        city: p.City?.rich_text?.[0]?.text?.content || "",
        availability: p.Availability?.rich_text?.[0]?.text?.content || "",
        stripeAccountId:
          p["Stripe Account ID"]?.rich_text?.[0]?.text?.content || "",
      };
    });

    return res.status(200).json({
      success: true,
      results: performers,
    });

  } catch (error) {
    console.error("Performer API error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal API failure",
      message: error.message,
    });
  }
}
