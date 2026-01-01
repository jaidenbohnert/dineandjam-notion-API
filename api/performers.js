import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_SECRET });

export default async function handler(req, res) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const response = await notion.databases.query({ database_id: databaseId });

    // Map Notion pages to safe objects for frontend
    const performers = response.results.map(page => {
      const props = page.properties || {};

      return {
        name: Object.values(props).find(p => p.type === "title")?.title?.[0]?.plain_text || "Unnamed Performer",
        socials: props["Socials(optional)"]?.rich_text?.[0]?.plain_text || "",
        city: props.City?.rich_text?.[0]?.plain_text || "",
        state: props.State?.rich_text?.[0]?.plain_text || "",
        genre: props.Genre?.rich_text?.[0]?.plain_text || "",
        bio: props["Short Bio"]?.rich_text?.[0]?.plain_text || "",
        stripeAccountId: props["Stripe Account ID"]?.rich_text?.[0]?.plain_text || "",
        profilePic:
          props["Profile Picture"]?.files?.[0]?.file?.url ||
          props["Profile Picture"]?.files?.[0]?.external?.url ||
          ""
      };
    });

    res.status(200).json(performers);
  } catch (err) {
    console.error("Notion API error:", err.message);
    // Always return JSON — frontend fallback will work
    res.status(200).json([
      {
        name: "Sample Performer",
        city: "Phoenix",
        state: "AZ",
        genre: "Live Music",
        bio: "Fallback card while Notion is unreachable.",
        socials: "",
        stripeAccountId: "",
        profilePic: ""
      }
    ]);
  }
}
