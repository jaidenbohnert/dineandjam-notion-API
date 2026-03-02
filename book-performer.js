// Replace these with real data pulled from your Notion/Tally API
const performerData = {
  name: "John Doe",
  pricePerHour: 50, // $50/hr
  phone: "123-456-7890",
  email: "john@example.com"
};

// Display performer info
document.getElementById("performer-name").textContent = performerData.name;
document.getElementById("performer-price").textContent = performerData.pricePerHour.toFixed(2);
document.getElementById("performer-phone").textContent = performerData.phone;

// Grab input and total elements
const hoursInput = document.getElementById("hours");
const feeDisplay = document.getElementById("fee");
const totalDisplay = document.getElementById("total");

// Update totals whenever user types hours
hoursInput.addEventListener("input", () => {
  const hours = parseFloat(hoursInput.value) || 0;
  const baseTotal = hours * performerData.pricePerHour;
  const fee = baseTotal * 0.07; // 7% fee
  const total = baseTotal + fee;

  feeDisplay.textContent = fee.toFixed(2);
  totalDisplay.textContent = total.toFixed(2);
});

// Handle submission
document.getElementById("submit-request").addEventListener("click", () => {
  // Create a message
  const message = `
Hello ${performerData.name}!

You have a new performance request:
- Hours: ${hoursInput.value}
- Total: $${totalDisplay.textContent}
`;

  // Use Tally webhook or email/SMS service here
  // Example: window.open("mailto:" + performerData.email + "?subject=Performance Request&body=" + encodeURIComponent(message));
  alert("Request sent! You can integrate email/SMS API here.");
});
