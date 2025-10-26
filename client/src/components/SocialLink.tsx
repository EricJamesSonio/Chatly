import React from "react";

interface SocialLinksProps {
  facebook?: string;
  tiktok?: string;
  instagram?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ facebook, tiktok, instagram }) => {
  return (
    <div className="social-links">
      <h4>Social Links</h4>
      <div className="links">
        {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
        {tiktok && <a href={tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>}
        {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
      </div>
    </div>
  );
};

export default SocialLinks;
