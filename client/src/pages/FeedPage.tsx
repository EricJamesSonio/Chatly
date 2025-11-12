import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/newsfeed/Post";
import CreatePost from "../components/newsfeed/CreatePost";
import { useAuth } from "../context/AuthContext";
import type { PostProps, CommentType } from "../types/posts";
import "../css/FeedPage.css";

type PostWithoutRefresh = Omit<PostProps, "refreshFeed">;

const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithoutRefresh[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/feed?userId=${user.id}`);
      const safePosts: PostWithoutRefresh[] = res.data.map((p: any) => ({
        id: p.id,
        userId: p.user_id,
        userName: p.userName,
        content: p.content,
        media: p.media || [],
        likes: p.likes || [],
        createdAt: p.created_at,
        comments: (p.comments || []).map((c: any) => ({
          id: c.id,
          userId: c.user_id,
          userName: c.userName,
          content: c.content,
          createdAt: c.created_at,
        })),
      }));
      setPosts(safePosts);
      setError(null);
    } catch (err: any) {
      console.error("❌ Failed to fetch feed", err);
      setError("Failed to fetch feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [user?.id]);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

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

export default FeedPage;
