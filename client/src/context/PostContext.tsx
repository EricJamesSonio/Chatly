import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface Media {
  url: string;
  type: string;
}

interface CommentType {
  id: number;
  userId: number;
  content: string;
}

export interface PostType {
  id: number;
  userId: number;
  content: string;
  media: Media[];
  likes: number[];
  comments: CommentType[];
  createdAt: string;
  updatedAt: string;
}

interface PostContextType {
  posts: PostType[];
  loading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  createPost: (content: string, media: Media[]) => Promise<void>;
  likePost: (postId: number) => Promise<void>;
  unlikePost: (postId: number) => Promise<void>;
  addComment: (postId: number, content: string) => Promise<void>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPosts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/feed?userId=${user.id}`);

      setPosts(res.data);
      setError(null);
    } catch (err: any) {
      console.error("❌ Failed to fetch posts", err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, media: Media[]) => {
    if (!user?.id) return;
    try {
      await axios.post("http://localhost:5000/api/posts", { user_id: user.id, content, media });
      refreshPosts();
    } catch (err: any) {
      console.error("❌ Failed to create post", err);
    }
  };

  const likePost = async (postId: number) => {
    if (!user?.id) return;
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/like`, { userId: user.id });
      refreshPosts();
    } catch (err: any) {
      console.error("❌ Failed to like post", err);
    }
  };

  const unlikePost = async (postId: number) => {
    if (!user?.id) return;
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/unlike`, { userId: user.id });
      refreshPosts();
    } catch (err: any) {
      console.error("❌ Failed to unlike post", err);
    }
  };

  const addComment = async (postId: number, content: string) => {
    if (!user?.id) return;
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, { user_id: user.id, content });
      refreshPosts();
    } catch (err: any) {
      console.error("❌ Failed to add comment", err);
    }
  };

  const deleteComment = async (postId: number, commentId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`);
      refreshPosts();
    } catch (err: any) {
      console.error("❌ Failed to delete comment", err);
    }
  };

  useEffect(() => {
    refreshPosts();
  }, [user?.id]);

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        refreshPosts,
        createPost,
        likePost,
        unlikePost,
        addComment,
        deleteComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePosts must be used within a PostProvider");
  return context;
};
