import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../contexts/UserContext';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([""]);
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const handleSignup = async (e) => {
    e.preventDefault();

    const newUser = {
      username,
      email,
      password,
      fullName,
      bio,
      skills,
      avatar
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/');
    }

    setEmail('');
    setBio('');
    setSkills(null);
    setPassword('');
    setFullName('');
    setUsername('');
    setAvatar(null);
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    if (skills.length < 3) {
      setSkills([...skills, '']);
    }
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      const newSkills = skills.filter((_, i) => i !== index);
      setSkills(newSkills);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Sign Up</h2>

        <form onSubmit={handleSignup}>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black h-20 resize-none"
              placeholder="Tell us about yourself..."
              maxLength={200}
            />
            <div className="text-sm text-gray-500 mt-1">{bio?.length || 0}/200 characters</div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Skills (Maximum 3)</label>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-black"
                    placeholder={`Skill ${index + 1}`}
                  />
                  {skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                + Add Skill
              </button>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="text-sm text-gray-500 mt-1">Upload an image file (JPG, PNG, GIF)</div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}