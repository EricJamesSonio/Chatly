import React from "react";
import { usePosts } from "../context/PostContext";
import CreatePost from "../components/newsfeed/CreatePost";
import Post from "../components/newsfeed/Post";

const FeedPage: React.FC = () => {
  const { posts, loading, error, refreshPosts } = usePosts();

  // Safety check: make sure posts is always an array
  const safePosts = Array.isArray(posts) ? posts : [];

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
