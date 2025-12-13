// sample performer data
const performers = [
  {
    name: "John Doe",
    genre: "Jazz",
    bio: "Loves improvisation and soulful tunes."
  },
  {
    name: "Jane Smith",
    genre: "Rock",
    bio: "Energetic guitarist and singer."
  }
];

// get the container
const container = document.getElementById("performers");

// create a card for each performer
performers.forEach(performer => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${performer.name}</h2>
    <p>${performer.genre}</p>
    <p>${performer.bio}</p>
  `;
  container.appendChild(card);
});
