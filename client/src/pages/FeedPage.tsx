import React from "react";
import { usePosts } from "../context/PostContext";
import CreatePost from "../components/newsfeed/CreatePost";
import Post from "../components/newsfeed/Post";
import type { PostProps, CommentType } from "../types/posts"; // ✅ type-only import
import "../css/FeedPage.css";

// Type for posts without the refreshFeed prop
type PostWithoutRefresh = Omit<PostProps, "refreshFeed">;

const FeedPage: React.FC = () => {
  const { posts, loading, error, refreshPosts } = usePosts();

  // Ensure posts array is correctly typed
const safePosts: PostWithoutRefresh[] =
  Array.isArray(posts) ? posts.map((p: any) => ({
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
      createdAt: c.created_at
    }))
  })) : [];


  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <CreatePost refreshFeed={refreshPosts} />
      {safePosts.length > 0 ? (
        safePosts.map((post) => (
          <Post key={post.id} {...post} refreshFeed={refreshPosts} />
        ))
      ) : (
        <p>No posts to display</p>
      )}
    </div>
  );
};

export default FeedPage;
