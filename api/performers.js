export default async function handler(req, res) {
  try {
    // 1️⃣ Make sure env vars exist
    if (!process.env.NOTION_SECRET || !process.env.NOTION_DATABASE_ID) {
      return res.status(500).json({
        error: "Missing Notion API key or Database ID"
      });
    }

    // 2️⃣ Call Notion API correctly
    const response = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      }
    );

    // 3️⃣ Handle Notion errors
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({
        error: "Notion API error",
        details: errorData
      });
    }

    // 4️⃣ Send results to frontend
    const data = await response.json();
    res.status(200).json(data.results);

  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
