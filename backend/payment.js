import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const payment = async (amount) => {
  try {
    // ✅ Use CLIENT_URL (fallback to localhost for development)
    const baseUrl =
      process.env.CLIENT_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Travel Package",
              description: "Payment for your selected travel package",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      // ✅ FIXED URLs
      success_url: `${baseUrl}/payment-success`,
      cancel_url: `${baseUrl}/payment-cancel`,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe session error:", error);
    return { error: error.message };
  }
};

export default payment;