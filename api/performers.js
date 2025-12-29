export default async function handler(req, res) {
  try {
    const NOTION_SECRET = process.env.NOTION_SECRET;
    const DATABASE_ID = process.env.NOTION_DATABASE_ID;

    if (!NOTION_SECRET || !DATABASE_ID) {
      return res.status(500).json({
        error: "Missing Notion API key or Database ID",
      });
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOTION_SECRET}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Notion API error",
        details: data,
      });
    }

    res.status(200).json(data.results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
