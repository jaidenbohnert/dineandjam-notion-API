import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { performerName, performerStripeId, price } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: `Booking: ${performerName}` },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        payment_intent_data: {
          application_fee_amount: Math.round(price * 100 * 0.05), // 5% fee
          transfer_data: { destination: performerStripeId },
        },
        success_url: "https://your-site-url/success",
        cancel_url: "https://your-site-url/cancel",
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
