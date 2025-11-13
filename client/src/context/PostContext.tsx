import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { socket } from "./socket";

const API_URL = import.meta.env.VITE_API_URL;

// Media type
export interface Media { 
  url: string; 
  type: string; 
}

// Comment type matches PostProps
export interface CommentType {
  id: number;
  user_id: number;
  user_name: string;
  content: string;
  created_at?: string;
}

// Post type matches PostProps
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
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from API
  const fetchPosts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/feed?userId=${user.id}`);
      // Normalize API data to match types
      const normalizedPosts: PostType[] = res.data.map((p: any) => ({
        id: p.id,
        userId: p.user_id ?? p.userId,
        userName: p.user_name ?? p.userName,
        content: p.content,
        media: p.media || [],
        likes: p.likes || [],
        comments: (p.comments || []).map((c: any) => ({
          id: c.id,
          user_id: c.user_id ?? c.userId,
          user_name: c.user_name ?? c.userName,
          content: c.content,
          created_at: c.created_at,
        })),
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));
      setPosts(normalizedPosts);
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
    const res = await axios.post(`${API_URL}/api/posts`, { user_id: user.id, content, media });
    // Emit socket event for real-time update
    socket.emit("post_created", res.data);
  };

  const likePost = async (postId: number) => {
    if (!user?.id) return;
    await axios.post(`${API_URL}/api/posts/${postId}/like`, { userId: user.id });
  };

  const unlikePost = async (postId: number) => {
    if (!user?.id) return;
    await axios.post(`${API_URL}/api/posts/${postId}/unlike`, { userId: user.id });
  };

  const addComment = async (postId: number, content: string) => {
    if (!user?.id) return;
    const res = await axios.post(`${API_URL}/api/posts/${postId}/comment`, { user_id: user.id, content });
    socket.emit("comment_added", res.data);
  };

  const deleteComment = async (postId: number, commentId: number) => {
    await axios.delete(`${API_URL}/api/posts/${postId}/comment/${commentId}`);
    socket.emit("comment_deleted", { postId, commentId });
  };

  // Setup real-time socket listeners
  useEffect(() => {
    if (!user?.id) return;

    fetchPosts();

    socket.connect();

    const handlePostUpdate = (updatedPost: PostType) => {
      setPosts((prev) => {
        const exists = prev.find((p) => p.id === updatedPost.id);
        if (exists) return prev.map((p) => (p.id === updatedPost.id ? updatedPost : p));
        return [updatedPost, ...prev];
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
      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <PostContext.Provider
      value={{ posts, loading, error, createPost, likePost, unlikePost, addComment, deleteComment }}
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
