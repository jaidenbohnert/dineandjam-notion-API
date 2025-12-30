import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_SECRET });

export default async function handler(req, res) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const response = await notion.databases.query({ database_id: databaseId });
    res.status(200).json(response.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Notion API error", details: err.message });
  }
}
