import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { performerName, stripeAccountId } = req.body;

    if (!stripeAccountId) {
      return res.status(400).json({ error: "Performer not ready for payouts" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking: ${performerName}`,
            },
            unit_amount: 5000, // $50 example
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 250, // 5% of $50
        transfer_data: {
          destination: stripeAccountId,
        },
      },
      success_url: "https://dineandjam.com/success",
      cancel_url: "https://dineandjam.com/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
