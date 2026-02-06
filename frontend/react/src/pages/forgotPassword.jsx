import { useState } from "react";
import { toast } from "react-toastify";
import "../styles/auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

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
        toast.error(data.message || "Something went wrong");
        return;
      }

      setSent(true);
      toast.success("Reset link sent to your email");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        {sent ? (
          <p className="success-text">
            ✅ Reset link sent.  
            Please check your email and follow the instructions.
          </p>
        ) : (
          <>
            <p className="muted-text">
              Enter your email and we’ll send you a reset link.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
