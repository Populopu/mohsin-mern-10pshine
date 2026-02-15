import { useEffect, useState } from "react";
import ProfileModal from "./profileModal";
import { getAuthHeaders } from "../utils/auth";
import { toast } from "react-toastify";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/user/profile", {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      toast.error(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setSubmitting(true);
      console.log("Uploading avatar:", file.name);

      const res = await fetch("http://localhost:5000/api/user/avatar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Avatar upload response:", data);

      if (!res.ok) throw new Error(data.message || "Avatar upload failed");

      toast.success("Profile picture updated");
      setUser(data); 
      fetchProfile(); 
      return data;
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error(err.message || "Avatar upload failed");
      throw err; 
    } finally {
      setSubmitting(false);
    }
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      setSubmitting(true);

      const res = await fetch(
        "http://localhost:5000/api/user/change-password",
        {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await res.json();
      console.log("Change password response:", data); 
      
      if (!res.ok) throw new Error(data.message || "Password update failed");

      toast.success(data.message || "Password changed successfully");
      return data; 
    } catch (err) {
      console.error("Change password error:", err);
      toast.error(err.message || "Password update failed");
      throw err; 
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button className="profile-btn" onClick={() => setOpen(true)}>
        👤
      </button>

      {open && (
        <ProfileModal
          user={user}
          loading={loading}
          onClose={() => setOpen(false)}
          onAvatarUpload={uploadAvatar}
          onChangePassword={changePassword}
        />
      )}
    </>
  );
};

export default Profile;
