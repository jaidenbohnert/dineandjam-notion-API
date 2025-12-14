import fetch from "node-fetch";

export default async function handler(req, res) {
  const NOTION_DATABASE_ID = "2c4abfbb44b980b3a34ad366311d8388"; // your database ID
  const NOTION_SECRET = process.env.NOTION_SECRET; // secret stored safely in environment variable

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_SECRET}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    // Send performer results to frontend
    res.status(200).json(data.results);

  } catch (error) {
    console.error("Error fetching Notion data:", error);
    res.status(500).json({ error: "Unable to fetch data from Notion" });
  }
}
