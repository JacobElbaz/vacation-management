import { useState } from "react";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const TruncatedText = ({ text, maxLength = 50, className = "" }: TruncatedTextProps) => {
  const [showFullText, setShowFullText] = useState(false);

  if (!text || text.length <= maxLength) {
    return <span className={className}>{text || "-"}</span>;
  }

  const truncated = text.substring(0, maxLength) + "...";

  const handleClick = () => {
    setShowFullText(true);
  };

  const handleClose = () => {
    setShowFullText(false);
  };

  return (
    <>
      <span 
        className={`text-truncate ${className}`}
        style={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={handleClick}
        title="Click to see full text"
      >
        {truncated}
      </span>

      {showFullText && (
        <>
          <div className="modal-backdrop show" onClick={handleClose}></div>
          <div
            className="modal show"
            style={{ display: "block", zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Full Text</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose}
                  ></button>
                </div>
                <div className="modal-body">
                  <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {text}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TruncatedText;

