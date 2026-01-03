import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
    });

    // Map Notion pages to performer objects
    const performers = response.results.map(page => {
      const props = page.properties || {};

      return {
        id: page.id,
        name: props.Name?.title?.[0]?.text?.content || "No Name",
        genre: props.Genre?.rich_text?.[0]?.text?.content || "Unknown Genre",
        bio: props["short bio"]?.rich_text?.[0]?.text?.content || "",
        profilePicture:
          props["profile picture"]?.files?.[0]?.file?.url ||
          props["profile picture"]?.files?.[0]?.external?.url ||
          "https://via.placeholder.com/200",
        socialLinks: props.Socials?.rich_text?.map(t => t.text.content) || [],
        email: props.email?.email || "",
        sampleVideo: props["sample video(Optional)"]?.url || "",
        phone: props["phone #"]?.phone_number || "",
        city: props.City?.rich_text?.[0]?.text?.content || "",
        availability: props.Availability?.rich_text?.[0]?.text?.content || "",
        stripeAccountId: props["stripe account ID"]?.rich_text?.[0]?.text?.content || "",
      };
    });

    // CORS headers so GitHub Pages can fetch
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    res.status(200).json(performers);

  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({ error: "Server Error fetching performers" });
  }
}
