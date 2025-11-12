import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

interface Media { url: string; type: string }
interface CommentType { id: number; userId: number; content: string }

export interface PostType {
  id: number;
  userId: number;
  userName: string;
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
  createPost: (content: string, media: Media[]) => Promise<void>;
  likePost: (postId: number) => Promise<void>;
  unlikePost: (postId: number) => Promise<void>;
  addComment: (postId: number, content: string) => Promise<void>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, socket } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/feed?userId=${user.id}`);
      setPosts(res.data);
      setError(null);
    } catch (err: any) {
      console.error("❌ Failed to fetch posts", err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  // CRUD actions
  const createPost = async (content: string, media: Media[]) => {
    if (!user?.id) return;
    await axios.post(`${API_URL}/api/posts`, { user_id: user.id, content, media });
  };
  const likePost = async (postId: number) => { if (!user?.id) return; await axios.post(`${API_URL}/api/posts/${postId}/like`, { userId: user.id }); };
  const unlikePost = async (postId: number) => { if (!user?.id) return; await axios.post(`${API_URL}/api/posts/${postId}/unlike`, { userId: user.id }); };
  const addComment = async (postId: number, content: string) => { if (!user?.id) return; await axios.post(`${API_URL}/api/posts/${postId}/comment`, { user_id: user.id, content }); };
  const deleteComment = async (postId: number, commentId: number) => { await axios.delete(`${API_URL}/api/posts/${postId}/comment/${commentId}`); };

  useEffect(() => {
    if (!user?.id) return;

    fetchPosts();

    if (!socket) return;

    // Listen for real-time updates
    const handlePostUpdate = (updatedPost: PostType) => {
      setPosts((prev) => {
        const exists = prev.find((p) => p.id === updatedPost.id);
        if (exists) return prev.map((p) => (p.id === updatedPost.id ? updatedPost : p));
        return [updatedPost, ...prev]; // new post
      });
    };

    const handlePostDelete = (postId: number) => {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    socket.on("post_created", handlePostUpdate);
    socket.on("post_updated", handlePostUpdate);
    socket.on("post_deleted", handlePostDelete);

    return () => {
      socket.off("post_created", handlePostUpdate);
      socket.off("post_updated", handlePostUpdate);
      socket.off("post_deleted", handlePostDelete);
    };
  }, [user?.id, socket]);

  return (
    <PostContext.Provider value={{ posts, loading, error, createPost, likePost, unlikePost, addComment, deleteComment }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePosts must be used within a PostProvider");
  return context;
};
