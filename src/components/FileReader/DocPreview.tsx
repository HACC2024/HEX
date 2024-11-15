import React from "react";

interface DocPreviewProps {
  content: string;
  className?: string;
}

const DocPreview: React.FC<DocPreviewProps> = ({ content, className = "" }) => {
  // Basic sanitization function
  const sanitizeContent = (html: string) => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/g, "")
      .replace(/on\w+='[^']*'/g, "");
  };

  return (
    <div className={`card shadow ${className}`}>
      <div className="card-body">
        <div
          className="doc-content overflow-auto"
          style={{
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.6",
            color: "#333",
            maxHeight: "70vh",
            padding: "1rem",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content) }} />
        </div>
      </div>
    </div>
  );
};

export default DocPreview;
