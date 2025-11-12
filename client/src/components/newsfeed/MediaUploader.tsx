import React, { useState } from "react";

export interface Media {
  url: string;
  type: "image" | "video";
}

interface MediaUploaderProps {
  onMediaChange: (media: Media[], files: File[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Media[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const mediaPreviews: Media[] = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image") ? "image" : "video", // ✅ Type assertion
    }));

    setPreviews(mediaPreviews);
    onMediaChange(mediaPreviews, selectedFiles);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
        {previews.map((media, idx) => (
          <span key={idx}>{media.url.split("/").pop()}</span>
        ))}
      </div>
    </div>
  );
};

export default MediaUploader;
