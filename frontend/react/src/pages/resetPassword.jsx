import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false)

const navigate = useNavigate();

const handleReset = async (e) => {
  e.preventDefault();

  try {
    setLoading(true)
    const res = await fetch(
      `http://localhost:5000/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Invalid or expired link");
      return;
    }

    toast.success("Password updated successfully 🎉");
    setTimeout(() => navigate("/login"), 1500);
  } catch {
    toast.error("Server error");
  }
};

  return (
    <div className="auth-form">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
        <button disabled={loading} onClick={handleReset}>
            {loading ? "Updating..." : "Update Password"}
        </button>
    </div>
  );
};

export default ResetPassword;