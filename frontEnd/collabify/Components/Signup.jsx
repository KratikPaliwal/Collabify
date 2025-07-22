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

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('fullName', fullName);
    formData.append('bio', bio);
    formData.append('skills', skills.join(','));
    formData.append('avatar', avatar);

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

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
    <div className="min-h-screen w-full absolute top-0 left-0 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-orange-400 mt-10 ">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg w-96 border border-white/20">

        <h2 className="text-3xl font-extrabold mb-2 text-blue-700 text-center mt-10">Sign Up</h2>
        <p className='text-center text-gray-600 mb-6'>Join Collabify and start building</p>

        <form onSubmit={handleSignup} className="space-y-5">

          <div>
            <label className="text-black text-sm font-medium flex ">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder='John Doe'
              required
            />
          </div>

          <div>
            <label className="text-black text-sm font-medium flex">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder='johndoe123'
              required
            />
          </div>

          <div>
            <label className="text-black text-sm font-medium flex ">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder='john@example.com'
              required
            />
          </div>

          <div>
            <label className="text-black text-sm font-medium flex">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder='********'
              required
            />
          </div>

          <div>
            <label className="text-black text-sm font-medium flex">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-black h-20 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Tell us about yourself..."
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">{bio?.length || 0}/200 characters</div>
          </div>

          <div>
            <label className="text-black text-sm font-medium flex">Skills (Max 3)</label>
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
                      className="px-3 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 transition-all duration-300 ease-in-out"
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
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 text-sm flex "
              >
                + Add Skill
              </button>
            )}
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Avatar</label>
            <label
              htmlFor="avatar-upload"
              className="mt-1 flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer text-gray-500 hover:bg-gray-50 text-sm transition"
            >
              Click or drag and drop the file here
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="hidden"
              />
            </label>
            <div className="text-xs text-gray-500 mt-1">Upload JPG or PNG image</div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold "
          >
            Sign Up
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
