// import { useEffect, useState } from "react";
// import ProfileModal from "./profileModal";
// import { getAuthHeaders } from "../utils/auth";
// import { toast } from "react-toastify";
// import "../styles/profile.css"

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   /* ---------- FETCH PROFILE ---------- */
//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("http://localhost:5000/api/users/profile", {
//         headers: getAuthHeaders()
//       });
//       const data = await res.json();
//       setUser(data);
//     } catch {
//       toast.error("Failed to load profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   /* ---------- AVATAR UPLOAD (FormData!) ---------- */
//   const uploadAvatar = async (file) => {

//   const formData = new FormData();
//   formData.append("image", file);

//   try {
//     const res = await fetch(
//       "http://localhost:5000/api/users/avatar", // confirm this route
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // or your getAuthHeaders without Content-Type
//         },
//         body: formData
//       }
//     );

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);

//     toast.success("Profile picture updated");

//     // 🔥 IMPORTANT
//     setUser(data);  // update immediately
//     fetchProfile(); // optional refresh

//   } catch (err) {
//     toast.error(err.message || "Avatar upload failed");
//   }
// };

//   /* ---------- CHANGE PASSWORD ---------- */
// const changePassword = async ({currentPassword, newPassword}) => {
//   try {
//     const res = await fetch(
//       "http://localhost:5000/api/users/change-password",
//       {
//         method: "PUT",
//         headers: {
//           ...getAuthHeaders(),
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({currentPassword, newPassword})
//       }
//     );

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);

//     toast.success(data.message);
//   } catch (err) {
//     toast.error(err.message || "Password update failed");
//   }
// };

//   return (
//     <>
//       <button className="profile-btn" onClick={() => setOpen(true)}>
//         👤
//       </button>

//       {open && (
//         <ProfileModal
//           user={user}
//           loading={loading}
//           onClose={() => setOpen(false)}
//           onAvatarUpload={uploadAvatar}
//           onChangePassword={changePassword}
//         />
//       )}
//     </>
//   );
// };

// export default Profile;
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

  /* ---------- FETCH PROFILE ---------- */
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

  /* ---------- AVATAR UPLOAD ---------- */
  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setSubmitting(true);
      console.log("Uploading avatar:", file.name); // Debug log

      const res = await fetch("http://localhost:5000/api/user/avatar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // only auth header
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Avatar upload response:", data); // Debug log

      if (!res.ok) throw new Error(data.message || "Avatar upload failed");

      toast.success("Profile picture updated");
      setUser(data); // update user immediately
      fetchProfile(); // optional refresh
      return data;
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error(err.message || "Avatar upload failed");
      throw err; // Re-throw so modal knows it failed
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- CHANGE PASSWORD ---------- */
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
      console.log("Change password response:", data); // Debug log
      
      if (!res.ok) throw new Error(data.message || "Password update failed");

      toast.success(data.message || "Password changed successfully");
      return data; // Return the response data
    } catch (err) {
      console.error("Change password error:", err);
      toast.error(err.message || "Password update failed");
      throw err; // Re-throw so modal knows it failed
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
