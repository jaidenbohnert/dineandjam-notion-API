import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    // Minimal query to validate credentials
    const response = await notion.databases.query({ database_id: databaseId, page_size: 1 });

    res.status(200).json({ success: true, results: response.results.length });
  } catch (error) {
    console.error("Notion API invocation failed:", error);
    res.status(500).json({ 
      error: "Failed to fetch Notion database. Check API key, database ID, and permissions.", 
      details: error.message 
    });
  }
}
