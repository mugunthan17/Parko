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
    amount: isEV ? 15 : 10,
  });

  useEffect(() => {
    if (!isEV) {
      setFormData((prev) => ({ ...prev, chargingFacility: "NO", amount: 10 }));
    }
  }, [isEV]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      body: JSON.stringify({
        amount: formData.amount * 100,
        currency: "INR",
        receipt: "receipt101",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const order = await response.json();

    var options = {
      "key": "rzp_test_yMwT16HLYlclAp",
      "amount": formData.amount * 100,
      "currency": "INR",
      "name": "Parko",
      "description": "Payment for Parking",
      "image": LOGO,
      "order_id": order.id,
      "handler": async function (response) {
        const validateRes = await fetch("http://localhost:5000/order/validate", {
          method: "POST",
          body: JSON.stringify(response),
          headers: { "Content-Type": "application/json" },
        });

        const jsonRes = await validateRes.json();
        console.log(jsonRes);

        if (jsonRes.msg === "Success") {
          alert("Your Payment is Success!! 🎉. Gate opened to park your car");
        } else {
          alert("Your Payment is Failed!! ⚠️.");
        }
      },
      "prefill": {
        "name": "Sarwesh",
        "email": "sarweshBhai@gmail.com",
        "contact": formData.phoneNumber
      },
      "theme": { "color": "#3399cc" }
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
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
            onChange={(e) => setFormData((prev) => ({
              ...prev, phoneNumber: e.target.value.replace(/[^0-9]/g, "").slice(0, 10)
            }))}
            maxLength="10"
            className="pl-[20px] mt-2 w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#181818]"
          />
        </div>
        {isEV && (
          <div className="flex flex-col mt-6">
            <label htmlFor="chargingFacility" className="text-xl sm:text-lg text-[#181818]">
              Do You Need Charging Facility for Your EV?
            </label>
            <select
              id="chargingFacility"
              value={formData.chargingFacility}
              onChange={(e) => setFormData((prev) => ({
                ...prev, chargingFacility: e.target.value, amount: e.target.value === "YES" ? 15 : 10
              }))}
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
