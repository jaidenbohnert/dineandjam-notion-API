import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export default async function handler(req, res) {
  // ✅ CORS HEADERS (THIS FIXES YOUR ERROR)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const response = await notion.databases.query({
      database_id: "2c4abfbb44b980b3a34ad366311d8388",
    });

    res.status(200).json(response.results);
  } catch (error) {
    console.error("Notion API error:", error);
    res.status(500).json({ error: error.message });
  }
}
