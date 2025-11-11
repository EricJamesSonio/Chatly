import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import type { PostProps, CommentType } from "./Post";

import CreatePost from "./CreatePost";

const API_URL = import.meta.env.VITE_API_URL;

interface Media {
  url: string;
  type: string;
}

// PostType matches PostProps minus refreshFeed
interface PostType extends Omit<PostProps, "refreshFeed"> {
  media: Media[];
  comments: CommentType[];
}

const NewsFeed: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  const fetchFeed = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/feed?userId=1`);

      const postsWithUserName: PostType[] = res.data.map((p: any) => ({
        id: p.id,
        userId: p.user_id ?? p.userId,
        userName: p.user_name ?? p.userName,
        content: p.content,
        media: p.media || [],
        likes: p.likes || [],
        comments: (p.comments || []).map((c: any) => ({
          id: c.id,
          user_id: c.user_id,
          user_name: c.user_name,
          content: c.content,
          created_at: c.created_at,
        })),
      }));

      setPosts(postsWithUserName);
    } catch (err) {
      console.error("❌ Failed to fetch feed", err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <CreatePost refreshFeed={fetchFeed} />
      {posts.map((post) => (
        <Post key={post.id} {...post} refreshFeed={fetchFeed} />
      ))}
    </div>
  );
};

export default NewsFeed;
