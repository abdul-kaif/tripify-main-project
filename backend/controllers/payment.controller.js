import payment from "../payment.js";

export const paymentController = async (req, res) => {
  try {
    const { amount } = req.body;
        console.log(amount);
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required.",
      });
    }
          console.log(amount);
    const result = await payment(amount);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: "Stripe error",
        error: result.error,
      });
    }

    res.status(200).json({  
      success: true,
      message: "Checkout session created successfully",
      url: result.url, 
    });// 👈 frontend will redirect to this
  } catch (error) {
    console.error("Payment controller error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while processing payment.",
      error: error.message,
    });
  }
};
