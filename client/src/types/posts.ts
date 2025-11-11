export interface Media {
  url: string;
  type: string;
}

export interface CommentType {
  id: number;
  user_id: number;
  user_name: string;
  content: string;
  created_at?: string;
}

export interface PostProps {
  id: number;
  userId: number;
  userName: string;
  content: string;
  media: Media[];
  likes: number[];
  comments: CommentType[];
  createdAt?: string;
  refreshFeed?: () => void;
}
