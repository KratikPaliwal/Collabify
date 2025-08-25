import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../src/AuthContext";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([""]);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  // redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // cleanup preview object URL
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    if (skills.length < 3) setSkills([...skills, ""]);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!avatar) {
      setError("Please upload an avatar.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("fullName", fullName);
      formData.append("bio", bio);
      // Append each skill individually
      skills.forEach(skill => formData.append("skills", skill));
      formData.append("avatar", avatar);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const payload = response?.data || {};

      const createdUser =
        payload?.data?.user || payload.user || payload.data || payload || null;

      const token =
        payload?.data?.accessToken ||
        payload?.accessToken ||
        payload?.token ||
        payload?.data?.token ||
        null;

      if (!createdUser) {
        throw new Error("Signup response did not include user data.");
      }

      try {
        login(createdUser, token);
      } catch (err) {
        console.warn("AuthContext.login threw:", err);
        localStorage.setItem("user", JSON.stringify(createdUser));
        if (token) localStorage.setItem("token", token);
      }

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => navigate("/"), 700);

      // reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setFullName("");
      setBio("");
      setSkills([""]);
      setAvatar(null);
      setAvatarPreview(null);
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.response?.data?.message || err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-orange-400 mt-10">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg w-96 border border-white/20">
        <h2 className="text-3xl font-extrabold mb-2 text-blue-700 text-center mt-10">Sign Up</h2>
        <p className="text-center text-gray-600 mb-6">Join Collabify and start building</p>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {success && <p className="text-green-600 text-center mb-3">{success}</p>}

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-black text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-black text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="johndoe123"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-black text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-black text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="********"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-black text-sm font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-black h-20 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Tell us about yourself..."
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">{bio?.length || 0}/200 characters</div>
          </div>

          {/* Skills */}
          <div>
            <label className="text-black text-sm font-medium">Skills (Max 3)</label>
            <div className="space-y-2 mt-1">
              {skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder={`Skill ${index + 1}`}
                  />
                  {skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 transition-all"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {skills.length < 3 && (
              <button
                type="button"
                onClick={addSkill}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 text-sm"
              >
                + Add Skill
              </button>
            )}
          </div>

          {/* Avatar */}
          <div>
            <label className="text-black text-sm font-medium">Avatar</label>
            <label
              htmlFor="avatar-upload"
              className="mt-1 flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer text-gray-500 hover:bg-gray-50 text-sm relative overflow-hidden"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-center">Click or drag and drop the file here</span>
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setAvatar(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
            {avatar && (
              <div className="mt-2 text-sm text-gray-700">
                Selected file: <span className="font-semibold">{avatar.name}</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
