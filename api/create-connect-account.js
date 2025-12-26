import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const account = await stripe.accounts.create({
      type: "express",
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://dineandjam.com/onboarding-refresh",
      return_url: "https://dineandjam.com/onboarding-complete",
      type: "account_onboarding",
    });

    res.json({
      url: accountLink.url,
      accountId: account.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
