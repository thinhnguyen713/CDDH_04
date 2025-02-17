import React, { useState, useEffect } from "react";

const CommentSection = ({ songId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/comments/${songId}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [songId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const res = await fetch("http://localhost:5000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        songId,
        userId: "user789", 
        content: newComment,
      }),
    });

    const data = await res.json();
    setComments([data, ...comments]);
  };

  const handleLike = async (commentId) => {
    await fetch(`http://localhost:5000/comments/like/${commentId}`, {
      method: "POST",
    });
    setComments(comments.map(cmt => cmt.id === commentId ? { ...cmt, likes: cmt.likes + 1 } : cmt));
  };

  return (
    <div>
      <h3>Bình luận</h3>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={handleCommentSubmit}>Gửi</button>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p><strong>{comment.userId}</strong>: {comment.content}</p>
            <button onClick={() => handleLike(comment.id)}>❤️ {comment.likes}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
