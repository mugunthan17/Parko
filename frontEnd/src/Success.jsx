import SuccessImg from "./assets/Success.png";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={SuccessImg} alt="Success" className="w-32 h-32 mb-4" />
      <h1 className="text-2xl font-bold text-green-600">Payment Success 🎉!!</h1>
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Go Back
      </button>
    </div>
  );
}

export default Success;