import Stripe from 'stripe';
import { getPerformerFee } from './performers.js'; // your Notion fetch

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { performerId } = req.body;

  if (!performerId) return res.status(400).json({ error: 'Missing performerId' });

  try {
    // 1️⃣ Fetch performer fee from Notion
    const performerFee = await getPerformerFee(performerId); // in dollars
    if (!performerFee) throw new Error('Performer fee not found');

    // 2️⃣ Calculate website fee (10%)
    const websiteFee = performerFee * 0.10;

    // 3️⃣ Calculate taxes (let's say 8%)
    const taxAmount = (performerFee + websiteFee) * 0.08;

    const totalAmount = performerFee + websiteFee + taxAmount;

    // 4️⃣ Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Booking for Performer ${performerId}`,
            },
            unit_amount: Math.round(totalAmount * 100), // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VERCEL_URL}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
