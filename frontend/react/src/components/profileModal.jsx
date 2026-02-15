import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "../styles/profile.css";

const ProfileModal = ({
  user,
  loading,
  onClose,
  onAvatarUpload,
  onChangePassword,
}) => {
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null); 
  const formRef = useRef(null); 

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff";

  console.log("ProfileModal rendered");

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="profile-modal">
          <p className="status-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    console.log("handleFileChange triggered"); 
    if (!onAvatarUpload) {
      console.log("onAvatarUpload prop is missing");
      return;
    }
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name);

    try {
      setSubmitting(true);
      await onAvatarUpload(file);
      console.log("Avatar upload completed");
    } catch (err) {
      console.error("Avatar upload failed", err);
      toast.error("Avatar upload failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    console.log("handlePasswordSubmit triggered"); 

    if (!onChangePassword) {
      console.log("onChangePassword prop is missing");
      return;
    }

    const form = formRef.current;
    if (!form) {
      console.log("Form ref not found");
      return;
    }

    const currentPassword = form.elements.current?.value.trim() || "";
    const newPassword = form.elements.new?.value.trim() || "";
    const confirmPassword = form.elements.confirm?.value.trim() || "";

    console.log("Form values:", { currentPassword, newPassword, confirmPassword });

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      await onChangePassword({ currentPassword, newPassword });
      form.reset();
      toast.success("Password changed successfully");
    } catch (err) {
      console.error("Password change error:", err);
      toast.error("Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="profile-modal">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <img
          src={
            user.profilePic
              ? `http://localhost:5000/uploads/${user.profilePic}?t=${Date.now()}`
              : defaultAvatar
          }
          alt="avatar"
          className="avatar"
          style={{ cursor: "pointer" }}
          onClick={handleAvatarClick} 
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <p className="profile-email">
          <strong>Email:</strong> {user.email}
        </p>

        <form className="password-form" onSubmit={handlePasswordSubmit} ref={formRef}>
          <h3>Change Password</h3>

          <input
            name="current"
            type={showPass ? "text" : "password"}
            placeholder="Current password"
            required
          />

          <input
            name="new"
            type={showPass ? "text" : "password"}
            placeholder="New password"
            required
          />

          <input
            name="confirm"
            type={showPass ? "text" : "password"}
            placeholder="Confirm new password"
            required
          />

          <div className="show-pass-wrapper">
            <label>
              <input
                type="checkbox"
                checked={showPass}
                onChange={() => setShowPass(!showPass)}
              />
              Show passwords
            </label>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
