export interface CommentType {
  id: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}

export interface PostProps {
  id: number;
  userId: number;
  userName: string;
  content: string;
  media?: string[];
  likes: number[];
  comments: CommentType[];
  createdAt: string;
  refreshFeed?: () => void;
}
