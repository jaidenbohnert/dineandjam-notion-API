import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    // Query the Notion database
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100, // adjust if needed
    });

    // Map Notion pages to performer objects
    const performers = response.results.map(page => {
      const props = page.properties || {};

      return {
        id: page.id,
        name: props.Name?.title?.[0]?.text?.content || "No Name",
        genre: props.Genre?.rich_text?.[0]?.text?.content || "Unknown Genre",
        bio: props.Bio?.rich_text?.[0]?.text?.content || "",
        profilePicture: props.ProfilePicture?.files?.[0]?.file?.url 
                        || props.ProfilePicture?.files?.[0]?.external?.url
                        || "https://via.placeholder.com/200",
        contactEmail: props.ContactEmail?.email || "",
        // Add any additional fields here
      };
    });

    // Allow requests from any origin (GitHub Pages)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      // preflight request
      res.status(200).end();
      return;
    }

    // Send JSON response
    res.status(200).json(performers);

  } catch (error) {
    console.error("Serverless function error:", error);

    // Send detailed error in dev mode, generic in prod
    res.status(500).json({ error: "Server Error fetching performers" });
  }
}
