import React from "react";

// Definição das formas possíveis para o botão
const shapes = {
  circle: "rounded-[50%]",
  round: "rounded-[19px]",
  square: "rounded-[0px]",
} as const;

// Definição dos estilos de variantes para o botão
const variants = {
  fill: {
    red_300_02: "bg-red-300_02 text-white-A700",
    deep_orange_200: "bg-deep_orange-200 text-white-A700",
    pink_800_02: "bg-pink-800_02 text-white-A700",
    deep_purple_200: "bg-deep_purple-200 text-white-A700",
    red_100_02: "bg-red-100_02 text-gray-700",
    teal_50: "bg-teal-50",
    white_A700_99: "bg-white-A700_99",
    pink_800_01: "bg-pink-800_01 text-white-A700",
    red_300_03: "bg-red-300_03 text-white-A700",
    blue_gray_100_02: "bg-blue_gray-100_02 text-blue_gray-300_01",
    white_A700: "bg-white-A700 text-gray-700",
    gray_700: "bg-gray-700 text-white-A700",
  },
  outline: {
    gray_700: "border-gray-700 border border-solid text-gray-700",
  },
} as const;

// Definição dos tamanhos disponíveis para o botão
const sizes = {
  xs: "h-[30px] px-3 text-[11px]",
  xl: "h-[80px] px-2.5 text-sm",
  lg: "h-[55px] px-[35px] text-sm",
  sm: "h-[38px] px-5 text-sm",
  md: "h-[38px] px-2.5",
} as const;

// Definição das propriedades do componente Button
type ButtonProps = Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "onClick"
> &
  Partial<{
    className: string;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    shape: keyof typeof shapes;
    variant: keyof typeof variants;
    size: keyof typeof sizes;
    color: keyof typeof variants["fill"];
  }>;

// Componente Button definido como funcional
const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape = "square",
  variant = "fill",
  size = "md",
  color = "gray_700",
  onClick,
  ...restProps
}) => {
  // Calcula as classes do botão com base nas propriedades passadas
  const buttonClasses = [
    className,
    "flex items-center justify-center text-center cursor-pointer",
    shapes[shape],
    sizes[size],
    variants[variant]?.[color],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} onClick={onClick} {...restProps}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export { Button };
