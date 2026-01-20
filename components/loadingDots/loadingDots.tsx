import React from 'react';

interface LoadingDotsProps {
  text?: string;
  size?: string;
  textSize?: string;
  color?: string;
  margin?: string;
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  text,
  size,
  textSize,
  color,
  margin,
  className = "",
}) => {
  const customStyle = {
    ...(size && { "--dots-size": size }),
    ...(color && { "--dots-color": color }),
    ...(margin && { "--dots-margin": margin }),
    ...(!text && { "--dots-container-width": "auto", "--dots-margin": "0px" }),
  } as React.CSSProperties;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {text && (
        <span style={{ fontSize: textSize }} className="loading-text">
          {text}
        </span>
      )}
      <span className="loading-dots-animated" style={customStyle}></span>
    </div>
  );
};

export default LoadingDots;
