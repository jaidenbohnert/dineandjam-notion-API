export default async function handler(req, res) {
  // Allow browser access
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    const DATABASE_ID = process.env.NOTION_DATABASE_ID;

    if (!NOTION_API_KEY || !DATABASE_ID) {
      return res.status(500).json({
        error: "Missing Notion API key or Database ID",
      });
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Notion API error",
        details: data,
      });
    }

    return res.status(200).json(data.results);
  } catch (error) {
    return res.status(500).json({
      error: "Server error fetching performers",
      message: error.message,
    });
  }
}
