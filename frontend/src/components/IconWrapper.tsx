import React from "react";
import { IconType } from "react-icons";

interface IconWrapperProps {
  icon: IconType;
  size?: number;
  color?: string;
}

// Usando uma função para renderizar o ícone
const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  size = 24,
  color,
}) => {
  // Criamos uma função que renderiza o ícone de forma segura
  const renderIcon = () => {
    // Verificamos se o ícone existe no React Icons
    if (icon) {
      // Usamos o ícone como uma função (que é como os ícones do react-icons funcionam)
      return icon({ size, color });
    }
    return null;
  };

  return <span>{renderIcon()}</span>;
};

export default IconWrapper;
