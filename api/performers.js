import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    const response = await notion.databases.query({ database_id: databaseId });

    const performers = response.results.map(page => {
      const props = page.properties;

      return {
        id: page.id,
        name: props.Name?.title?.[0]?.text?.content || "No Name",
        genre: props.Genre?.rich_text?.[0]?.text?.content || "Unknown Genre",
        bio: props.Bio?.rich_text?.[0]?.text?.content || "",
        profilePicture: props.ProfilePicture?.url || "https://via.placeholder.com/200"
      };
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(performers);

  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({ error: "Server Error" });
  }
}
