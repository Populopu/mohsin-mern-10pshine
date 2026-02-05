import { useState } from "react";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true)
    const res = await fetch(
      "http://localhost:5000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to send reset link");
      return;
    }

    toast.success("Password reset link sent to your email 📧");
    setEmail("");
  } catch (err) {
    toast.error("Server error");
  }
};

  return (
    <div className="auth-form">
      <h2>Forgot Password</h2>
      <input
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
        <button disabled={loading} onClick={handleSubmit}>
            {loading ? "Sending..." : "Send reset link"}
        </button>
    </div>
  );
};

export default ForgotPassword;
