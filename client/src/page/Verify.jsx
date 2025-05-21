import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const verifyemail = useAuthStore((state) => state.verifyemail);

  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyemail(token);
        setStatus("success");

        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        setStatus("error");
      }
    };

    if (token) {
      verify();
    } else {
      setStatus("error");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {status === "loading" && (
        <>
          <Loader className="animate-spin w-10 h-10 text-blue-500" />
          <p className="mt-4 text-lg font-medium">Verifying your email...</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="w-12 h-12 text-green-600" />
          <p className="mt-4 text-lg font-semibold text-green-700">
            Email verified successfully!
          </p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-12 h-12 text-red-600" />
          <p className="mt-4 text-lg font-semibold text-red-700">
            Invalid or expired verification link.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Go to Register
          </button>
        </>
      )}
    </div>
  );
}
