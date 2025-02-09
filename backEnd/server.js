const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  }
  catch (error) {
    res.status(500).send("Error");
  }
});

app.post("/order/validate", async (req, res) => {
  const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
  const sha = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
  const digest=sha.digest("hex");
  if(digest!==razorpay_signature){
    return res.status(400).json({msg:"Failed"});
  }
  res.json({
    msg:"Success",
    paymentId:razorpay_payment_id,
  })

});

app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`);
})




// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();
// const port = 5000;

// // Middleware to parse JSON and handle CORS
// app.use(cors());
// app.use(bodyParser.json());

// // Dummy in-memory storage for payment requests (You can replace this with a real database)
// const payments = [];

// // Handle POST request for payments
// app.post("/api/payments", (req, res) => {
//   const { vehicleType, phoneNumber, amount, chargingFacility } = req.body;

//   // Validate input (you can enhance this further based on your requirements)
//   if (!vehicleType || !phoneNumber || !amount) {
//     return res.status(400).json({ message: "Missing required fields." });
//   }

//   // Store the payment data in the dummy database (or process it)
//   const paymentRequest = {
//     vehicleType,
//     phoneNumber,
//     amount,
//     chargingFacility: vehicleType === "EV" ? chargingFacility : null,  // Include chargingFacility only if EV
//     date: new Date(),
//   };

//   // Log the vehicle type and payment request
//   console.log("Received payment request for vehicle type:", vehicleType);
//   console.log("Full payment request data:", paymentRequest);

//   payments.push(paymentRequest);

//   // Send a response back to the client
//   res.status(200).json({
//     message: "Payment request received successfully!",
//     paymentDetails: paymentRequest,
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });



// /*
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     // Send payment details to the backend to create an order
//     const response = await axios.post("http://localhost:5000/api/payments", {
//       vehicleType: isEV ? "EV" : "Non-EV",
//       phoneNumber: formData.phoneNumber,
//       amount: formData.amount * 100, // Convert amount to paise (Razorpay accepts paise)
//       chargingFacility: isEV ? formData.chargingFacility : undefined,
//     });

//     const { order_id } = response.data; // Get order ID from backend

//     if (!order_id) {
//       alert("Error: Order ID not received.");
//       return;
//     }

//     // Configure Razorpay options
//     const options = {
//       key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay Key ID
//       amount: formData.amount * 100, // Amount in paise
//       currency: "INR",
//       name: "Parko",
//       description: "Parking Payment",
//       image: LOGO, // Your app logo
//       order_id, // Razorpay Order ID from backend
//       handler: function (response) {
//         alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

//         // Send success confirmation to backend
//         axios.post("http://localhost:5000/api/payment-success", {
//           paymentId: response.razorpay_payment_id,
//           orderId: response.razorpay_order_id,
//           signature: response.razorpay_signature,
//         }).then((res) => {
//           console.log("Payment confirmed:", res.data);
//         }).catch((err) => {
//           console.error("Payment confirmation failed:", err);
//         });
//       },
//       prefill: {
//         name: "Customer",
//         email: "customer@example.com",
//         contact: formData.phoneNumber,
//       },
//       theme: {
//         color: "#181818",
//       },
//     };

//     const rzp1 = new window.Razorpay(options);
//     rzp1.open();
//   } catch (error) {
//     console.error("Error initiating payment:", error);
//     alert("Payment initiation failed. Please try again.");
//   }
// };


// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// require("dotenv").config();

// const app = express();
// const port = 5000;

// app.use(cors());
// app.use(bodyParser.json());

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,  // Use environment variable
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Handle payment request and create an order
// app.post("/api/payments", async (req, res) => {
//   const { vehicleType, phoneNumber, amount, chargingFacility } = req.body;

//   if (!vehicleType || !phoneNumber || !amount) {
//     return res.status(400).json({ message: "Missing required fields." });
//   }

//   try {
//     const order = await razorpay.orders.create({
//       amount: (amount * 100), // Razorpay expects amount in paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     });

//     res.json({
//       message: "Order created successfully!",
//       order_id: order.id, // Send Razorpay Order ID to frontend
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ message: "Error creating Razorpay order." });
//   }
// });

// // Handle successful payment verification
// app.post("/api/payment-success", (req, res) => {
//   const { paymentId, orderId, signature } = req.body;
//   const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(`${orderId}|${paymentId}`)
//     .digest("hex");

//   if (generatedSignature === signature) {
//     res.json({ message: "Payment verified successfully!" });
//   } else {
//     res.status(400).json({ message: "Payment verification failed." });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
// */


