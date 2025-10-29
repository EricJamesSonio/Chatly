import React, { useState } from "react";

interface MediaUploaderProps {
  onMediaChange: (media: { url: string; type: string }[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaChange }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Convert to URL + type
    const media = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image") ? "image" : "video",
    }));
    onMediaChange(media);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        {files.map((file, idx) => (
          <span key={idx}>{file.name}</span>
        ))}
      </div>
    </div>
  );
};

export default MediaUploader;
