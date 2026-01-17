import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { email } = req.body;

  try {
    // Create an Express account for the performer
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email,
    });

    // Create the onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://dineandjam.com/refresh',
      return_url: 'https://dineandjam.com/success',
      type: 'account_onboarding',
    });

    res.status(200).json({ url: accountLink.url, accountId: account.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
