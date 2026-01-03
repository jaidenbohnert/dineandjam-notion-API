 import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
    });

    const performers = response.results.map(page => {
      const props = page.properties || {};

      return {
        id: page.id,
        name: props.Name?.title?.[0]?.text?.content || "No Name",
        genre: props.Genre?.rich_text?.[0]?.text?.content || "Unknown Genre",
        bio: props["Short Bio"]?.rich_text?.[0]?.text?.content || "",
        profilePicture:
          props["Profile Picture"]?.files?.[0]?.file?.url ||
          props["Profile Picture"]?.files?.[0]?.external?.url ||
          "https://via.placeholder.com/200",
        socialLinks: props["Socials(Optional)"]?.rich_text?.map(t => t.text.content) || [],
        email: props.Email?.email || "",
        sampleVideo: props["Sample Video(Optional)"]?.url || "",
        phone: props["Phone #"]?.phone_number || "",
        city: props.City?.rich_text?.[0]?.text?.content || "",
        availability: props.Availability?.rich_text?.[0]?.text?.content || "",
        stripeAccountId: props["Stripe Account ID"]?.rich_text?.[0]?.text?.content || "",
      };
    });

    // CORS headers for GitHub Pages
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
