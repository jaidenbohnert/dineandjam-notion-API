import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
  throw new Error("Missing Notion environment variables");
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      page_size: 100,
    });

    const performers = response.results.map(page => {
      const p = page.properties || {};

      return {
        id: page.id,
        name: p.Name?.title?.[0]?.text?.content ?? "No Name",
        genre: p.Genre?.rich_text?.[0]?.text?.content ?? "",
        bio: p["Short Bio"]?.rich_text?.[0]?.text?.content ?? "",
        profilePicture:
          p["Profile Picture"]?.files?.[0]?.file?.url ||
          p["Profile Picture"]?.files?.[0]?.external?.url ||
          "https://via.placeholder.com/200",
        socials: p["Socials(Optional)"]?.rich_text?.map(t => t.text.content) ?? [],
        email: p.Email?.email ?? "",
        phone: p["Phone #"]?.phone_number ?? "",
        city: p.City?.rich_text?.[0]?.text?.content ?? "",
        availability: p.Availability?.rich_text?.[0]?.text?.content ?? "",
        stripeAccountId: p["Stripe Account ID"]?.rich_text?.[0]?.text?.content ?? "",
      };
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(performers);

  } catch (err) {
    console.error("API failure:", err);
    res.status(500).json({ error: "Internal API failure", message: err.message });
  }
}
