import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LOGO from "./assets/LOGO.png";
import "./index.css";

function App() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isEV = params.get("type") === "ev";

  const [formData, setFormData] = useState({
    phoneNumber: "",
    chargingFacility: isEV ? "YES" : "NO",
    amount: isEV ? 2 : 1,
  });

  useEffect(() => {
    if (!isEV) {
      setFormData((prev) => ({ ...prev, chargingFacility: "NO", amount: 1 }));
    }
  }, [isEV]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phoneNumber.trim() === "") {
      alert("Please Enter Your Mobile Number");
      return;
    }

    try {
      const response = await fetch("https://parko-backend.onrender.com/order", {
        method: "POST",
        body: JSON.stringify({
          amount: formData.amount * 100,
          currency: "INR",
          receipt: "receipt101",
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();

      const options = {
        key: "rzp_test_yMwT16HLYlclAp",
        amount: formData.amount * 100,
        currency: "INR",
        name: "Parko",
        description: "Payment for Parking",
        image: LOGO,
        order_id: order.id,
        handler: async function (response) {
          const validateRes = await fetch("https://parko-backend.onrender.com/order/validate", {
            method: "POST",
            body: JSON.stringify(response),
            headers: { "Content-Type": "application/json" },
          });

          const jsonRes = await validateRes.json();

          if (jsonRes.msg === "Success") {
            alert("Your Payment is Successful! 🎉 Gate opened.");
            
            await fetch(
              `https://c8a4-2409-40f4-40ce-54b7-a01e-1e30-c25-f34b.ngrok-free.app/open_gate?status=success&charging=${formData.chargingFacility}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                mode: "cors",
              }
            )
              .then((res) => res.json())
              .then((data) => console.log("ESP8266 Response:", data))
              .catch((error) => console.error("ESP8266 Request Error:", error.message));
          } else {
            alert("Your Payment Failed ⚠️.");
          }
        },
        prefill: {
          name: "Sarwesh",
          email: "sarweshchandran@gmail.com",
          contact: formData.phoneNumber,
        },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row items-center justify-center mt-10 gap-3">
        <img src={LOGO} alt="Logo" className="h-[60px] w-auto" />
        <h1 className="text-5xl font-medium text-[#181818]">Parko</h1>
      </div>
      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-[70%] min-w-[50%]">
        <div className="flex flex-col">
          <label htmlFor="mobileNum" className="text-xl sm:text-lg text-[#181818]">
            Enter Your Mobile Number
          </label>
          <input
            type="tel"
            id="mobileNum"
            name="mobileNum"
            placeholder="Enter 10-digit Mobile Number"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                phoneNumber: e.target.value.replace(/[^0-9]/g, "").slice(0, 10),
              }))
            }
            maxLength="10"
            className="pl-[20px] mt-2 w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#181818]"
          />
        </div>
        {isEV && (
          <div className="flex flex-col mt-6">
            <label htmlFor="chargingFacility" className="text-xl sm:text-lg text-[#181818]">
              Do you need Charging Facility for your EV?
            </label>
            <select
              id="chargingFacility"
              value={formData.chargingFacility}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  chargingFacility: e.target.value,
                  amount: e.target.value === "YES" ? 2 : 1,
                }))
              }
              className="mt-2 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#181818]"
            >
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        )}
        <div className="mt-6 text-2xl text-center">
          <h1 className="text-[#181818]">₹ {formData.amount}/-</h1>
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-[#181818] text-[#EDEDED] text-xl py-3 rounded-md cursor-pointer"
        >
          PAY NOW
        </button>
      </form>
    </div>
  );
}

export default App;
