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
          userId: p.userId ?? p.user_id,
          userName: p.userName ?? p.user_name,
          content: p.content,
          media: p.media ?? [],
          likes: p.likes ?? [],
          comments: (p.comments ?? []).map((c: any): CommentType => ({
            id: c.id,
            user_id: c.user_id,
            user_name: c.user_name,
            content: c.content,
            created_at: c.created_at,
          })),
          createdAt: p.createdAt ?? p.created_at,
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
