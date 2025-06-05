import React, { useState } from "react";
import { Pencil } from "lucide-react"; // Optional: using lucide-react icons

function Profile() {
  const defaultImage = "Images/profile.jpeg";
  const [image, setImage] = useState(defaultImage);
  const [showModal, setShowModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    name: "Kratik Paliwal",
    headline: "Full Stack",
    skills: "React, Node, MongoDB",
    location: "India",
  });

  const [formData, setFormData] = useState({ ...profileData });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
      setShowModal(false);
    }
  };

  const handleDeletePhoto = () => {
    setImage(defaultImage);
    setShowModal(false);
  };

  const handleEditClick = () => {
    setFormData(profileData);
    setShowEditForm(true);
  };

  const handleSave = () => {
    setProfileData(formData);
    setShowEditForm(false);
  };

  return (
    <>
      {/* Profile Section */}
      <div className="pt-15">
        <div className="h-64 w-full bg-white flex items-center justify-start pl-6 relative">
          <div className="relative">
            <img
              src={image}
              alt="profile"
              onClick={() => setShowModal(true)}
              className="h-32 w-32 rounded-full object-cover border-2 border-blue-400 shadow-lg cursor-pointer"
            />
            <label
              htmlFor="profileImage"
              className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-blue-600"
            >
              Change
            </label>
          </div>

          {/* Profile Info */}
          <div className="ml-6 space-y-1 text-black">
            <div className="text-xl font-semibold">{profileData.name}</div>
            <div className="text-md">{profileData.headline}</div>
            <div className="text-sm">Skills: {profileData.skills}</div>
            <div className="text-sm">Location: {profileData.location}</div>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEditClick}
            className="absolute top-4 right-6 text-gray-600 hover:text-gray-800"
            title="Edit Profile"
          >
            <Pencil size={20} />
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Update Profile Photo</h2>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="profileImage"
              className="block w-full bg-blue-500 text-white py-2 rounded mb-2 cursor-pointer hover:bg-blue-600"
            >
              Upload Photo
            </label>

            <button
              onClick={handleDeletePhoto}
              className="block w-full bg-red-500 text-white py-2 rounded mb-2 hover:bg-red-600"
            >
              Delete Photo
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="block w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-3">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="headline"
              >
                Headline
              </label>
              <input
                id="headline"
                type="text"
                placeholder="Enter your headline"
                value={formData.headline}
                onChange={(e) =>
                  setFormData({ ...formData, headline: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1" htmlFor="skills">
                Skills
              </label>
              <input
                id="skills"
                type="text"
                placeholder="Enter your skills"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="location"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="Enter your location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
