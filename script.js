// ==== CONFIGURE THESE ====
const NOTION_DATABASE_ID = "2c4abfbb44b980b3a34ad366311d8388"; // your database ID
const NOTION_SECRET = "YOUR_INTEGRATION_SECRET_KEY"; // your integration token

// ==== GET THE CONTAINER ====
const container = document.getElementById("performers");

// ==== FETCH PERFORMERS FROM NOTION ====
async function fetchPerformers() {
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

    // Clear container first (optional)
    container.innerHTML = "";

    // Loop through each page/submission
    data.results.forEach(page => {
      const props = page.properties;

      // Replace these keys with your actual Notion property names
      const name = props["Name"]?.title[0]?.plain_text || "No Name";
      const stageName = props["Stage Name"]?.rich_text[0]?.plain_text || "";
      const genre = props["Genre"]?.rich_text[0]?.plain_text || "No Genre";
      const bio = props["Bio"]?.rich_text[0]?.plain_text || "No Bio";
      const availability = props["Availability"]?.rich_text[0]?.plain_text || "";

      // Create card element
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${name} ${stageName ? `(${stageName})` : ""}</h2>
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Bio:</strong> ${bio}</p>
        <p><strong>Availability:</strong> ${availability}</p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching performers from Notion:", error);
    container.innerHTML = "<p>Unable to load performers at this time.</p>";
  }
}

// ==== CALL THE FUNCTION ====
fetchPerformers();

