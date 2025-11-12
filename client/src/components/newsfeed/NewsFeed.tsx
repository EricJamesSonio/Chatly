import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import CreatePost from "./CreatePost";
import { useAuth } from "../../context/AuthContext";
import type { PostProps, CommentType } from "../../types/posts";

const API_URL = import.meta.env.VITE_API_URL;

const NewsFeed: React.FC = () => {
  const { user } = useAuth(); // ✅ get logged-in user from context
  const [posts, setPosts] = useState<Omit<PostProps, "refreshFeed">[]>([]);

  const fetchFeed = async () => {
    if (!user) return; // ✅ ensure user is logged in
    try {
      const res = await axios.get(`${API_URL}/api/feed?userId=${user.id}`);

      const postsWithUserName: Omit<PostProps, "refreshFeed">[] = res.data.map((p: any) => ({
        id: p.id,
        userId: p.user_id ?? p.userId,
        userName: p.user_name ?? p.userName ?? p.userName, // fallback
        content: p.content,
        media: p.media || [],
        likes: p.likes || [],
        comments: (p.comments || []).map((c: any): CommentType => ({
          id: c.id,
          user_id: c.user_id,
          user_name: c.user_name,
          content: c.content,
          created_at: c.created_at,
        })),
        createdAt: p.created_at,
      }));

      setPosts(postsWithUserName);
    } catch (err) {
      console.error("❌ Failed to fetch feed", err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [user?.id]); // ✅ re-fetch if user changes

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <CreatePost refreshFeed={fetchFeed} />
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} {...post} refreshFeed={fetchFeed} />)
      ) : (
        <p>No posts to display</p>
      )}
    </div>
  );
};

export default NewsFeed;
