import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const payment = async (amount) => {
  try {
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

      success_url: "http://localhost:5173/payment-success",

      cancel_url: "http://localhost:5173/payment-cancel",
    });

    return { url: session.url };

  } catch (error) {
    console.error("Stripe session error:", error);
    return { error: error.message };
  }
};

export default payment;