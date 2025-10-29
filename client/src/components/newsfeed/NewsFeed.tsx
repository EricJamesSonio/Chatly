import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import CreatePost from "./CreatePost";

interface Media {
  url: string;
  type: string;
}

interface CommentType {
  id: number;
  userId: number;
  content: string;
}

interface PostType {
  id: number;
  userId: number;
  content: string;
  media: Media[];
  likes: number[];
  comments: CommentType[];
}

const NewsFeed: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  const fetchFeed = async () => {
    const res = await axios.get("/api/feed?userId=1"); // replace 1 with current user
    setPosts(res.data);
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
