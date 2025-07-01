import React, { useState, useRef, useLayoutEffect } from "react";

function UserInfo() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);

  // Word limit logic
  const wordCount = postContent.trim().split(/\s+/).filter(Boolean).length;
  const wordLimit = 300;

  const handlePost = () => {
    if (wordCount > wordLimit || postContent.trim() === "") return;

    const newPost = {
      id: Date.now(),
      content: postContent.trim(),
      expanded: false,
      likes: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]); // Prepend to home feed
    setPostContent("");
    setIsEditorOpen(false);
  };

  const toggleExpand = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, expanded: !post.expanded } : post
      )
    );
  };

  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + (post.liked ? -1 : 1), liked: !post.liked }
          : post
      )
    );
  };

  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      text: commentText.trim(),
      author: "You",
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  return (
    <>
      {/* Input Box (Write a Post Trigger) */}
      <div className="w-full flex justify-center mt-16">
        <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-xl flex items-center space-x-4">
          <img
            src="Images/profile.jpeg"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <input
            type="text"
            placeholder="Write a Project or Idea"
            className="flex-1 bg-gray-100 px-4 py-2 rounded-full outline-none text-black cursor-pointer"
            readOnly
            onClick={() => setIsEditorOpen(true)}
          />
        </div>
      </div>

      {/* Floating Post Editor */}
      {isEditorOpen && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl bg-white shadow-xl rounded-xl p-6">
          {/* Close Button */}
          <button
            onClick={() => {
              setIsEditorOpen(false);
              setPostContent("");
            }}
            className="absolute top-4 right-5 text-xl font-bold text-gray-500 hover:text-black"
          >
            ✖
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="Images/profile.jpeg"
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-gray-800">Kratik Paliwal</h2>
            </div>
          </div>

          {/* Textarea with word count and scroll */}
          <div className="max-h-60 overflow-y-auto pr-2">
            <textarea
              placeholder="Share your Project Idea..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full h-40 border border-gray-200 outline-none resize-none text-lg text-gray-800 placeholder-gray-500 p-3 rounded-md bg-white"
              autoFocus
            ></textarea>
          </div>

          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{wordCount} / 300 words</span>
            {wordCount > wordLimit && (
              <span className="text-red-600">Word limit exceeded!</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center mt-6">
            <button
              onClick={handlePost}
              disabled={postContent.trim() === "" || wordCount > wordLimit}
              className={`px-6 py-2 rounded-full font-semibold ${
                postContent.trim() !== "" && wordCount <= wordLimit
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-white cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Display Posts on Home Feed */}
{/* Display Posts on Home Feed */}
<div className="w-full flex justify-center mt-8">
  <div className="w-full max-w-xl space-y-4 overflow-y-auto pr-2">
    {posts.map((post) => (
      <div
        key={post.id}
        className="bg-white shadow-md rounded-xl p-4 text-gray-800 mx-auto"
      >
        {/* Profile + Name Row */}
        <div className="flex items-center space-x-3 mb-2">
          <img
            src="Images/profile.jpeg"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h3 className="font-semibold">Kratik Paliwal</h3>
        </div>

        {/* Post Content - Left Aligned */}
        <div className="text-left">
          <LineClampedText post={post} toggleExpand={toggleExpand} />
        </div>

        {/* Like & Comment Section */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => toggleLike(post.id)}
              className={`flex items-center space-x-1 transition-transform duration-200 ${
                post.liked ? "text-red-500 scale-110" : "text-gray-500"
              }`}
            >
              <span
                className={`transform transition-all duration-200 ${
                  post.liked ? "scale-125" : "scale-100"
                }`}
              >
                ❤️
              </span>
              <span className="text-sm">{post.likes} Likes</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-3 space-y-2 text-left">
            {/* Add Comment Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.commentInput;
                addComment(post.id, input.value);
                input.value = "";
              }}
              className="flex space-x-2"
            >
              <input
                name="commentInput"
                type="text"
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="text-sm bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700"
              >
                Post
              </button>
            </form>

            {/* Display Comments */}
            {post.comments.length > 0 && (
                <div className="space-y-2 mt-2">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="text-xs bg-gray-100 p-2 rounded-lg w-full"
                  >
                    <strong>{comment.author}</strong>: {comment.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
    </>
  );
}

// Component for rendering line-clamped text and showing More/Less button
function LineClampedText({ post, toggleExpand }) {
  const [showMoreButton, setShowMoreButton] = useState(false);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const totalLines = Math.round(el.scrollHeight / lineHeight);

    setShowMoreButton(totalLines > 3);
  }, []);

  return (
    <div className="relative">
      <div
        ref={textRef}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: post.expanded ? "unset" : 3,
          maxHeight: post.expanded ? "none" : "4.5em", // ~3 lines at 1.5em line height
          overflow: "hidden",
        }}
        className="whitespace-pre-line"
      >
        {post.content}
      </div>

      {/* Show More/Less button conditionally */}
      {showMoreButton && (
        <button
          onClick={() => toggleExpand(post.id)}
          className="text-blue-600 font-medium text-sm mt-1 float-right clear-both"
        >
          {post.expanded ? "Less" : "More..."}
        </button>
      )}
    </div>
  );
}

export default UserInfo;