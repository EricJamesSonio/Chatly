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
    Array.isArray(posts) && posts.length > 0
      ? posts.map((p: any) => ({
          id: p.id,
          // Include both snake_case and camelCase versions
          user_id: p.user_id ?? p.userId,
          user_name: p.user_name ?? p.userName,
          userId: p.user_id ?? p.userId,
          userName: p.user_name ?? p.userName,
          content: p.content,
          media: p.media ?? [],
          likes: p.likes ?? [],
          created_at: p.created_at ?? p.createdAt,
          createdAt: p.created_at ?? p.createdAt,
          comments: (p.comments ?? []).map((c: any) => ({
            id: c.id,
            user_id: c.user_id ?? c.userId,
            user_name: c.user_name ?? c.userName,
            userId: c.user_id ?? c.userId,
            userName: c.user_name ?? c.userName,
            content: c.content,
            created_at: c.created_at ?? c.createdAt,
            createdAt: c.created_at ?? c.createdAt,
          })),
        }))
      : [];

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
