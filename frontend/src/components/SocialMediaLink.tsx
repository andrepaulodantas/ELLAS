import React from "react";
import styled from "@emotion/styled";

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #fff;
  color: #4a2b4e;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 0 8px;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

interface SocialMediaLinkProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
  children: React.ReactNode;
}

const SocialMediaLink: React.FC<SocialMediaLinkProps> = ({
  href,
  onClick,
  className,
  "aria-label": ariaLabel,
  children,
}) => {
  if (href) {
    return (
      <StyledLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </StyledLink>
    );
  }

  return (
    <StyledLink
      as="button"
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </StyledLink>
  );
};

export default SocialMediaLink;
