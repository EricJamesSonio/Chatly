export interface MediaItem {
  url: string;
  type: string;
}

export interface CommentType {
  id: number;
  user_id: number;
  user_name: string;
  content: string;
  created_at: string;
  // Add camelCase aliases for consistency in the frontend
  userId?: number;
  userName?: string;
  createdAt?: string;
}

export interface PostProps {
  id: number;
  user_id: number;
  user_name: string;
  content: string;
  media?: MediaItem[];
  likes: number[];
  comments: CommentType[];
  created_at: string;
  refreshFeed?: () => void;
  // Add camelCase aliases for consistency in the frontend
  userId?: number;
  userName?: string;
  createdAt?: string;
}
