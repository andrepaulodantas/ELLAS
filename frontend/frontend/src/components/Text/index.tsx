import React from "react";

// Definição de tamanhos para diferentes classes de texto
const sizes = {
  "5xl": "text-2xl font-medium leading-[29px]",
  xs: "text-[6px] font-medium",
  lg: "text-[11px] font-normal leading-[13px]",
  s: "text-[8px] font-medium",
  "2xl": "text-sm font-normal leading-[17px]",
  "3xl": "text-lg font-medium leading-[22px]",
  "4xl": "text-xl font-normal",
  xl: "text-xs font-normal leading-[15px]",
  md: "text-[10px] font-normal",
};

// Definindo as propriedades do componente Text
export type TextProps = Partial<{
  className: string; // Classe CSS adicional
  as: React.ElementType; // Tipo de elemento HTML ou componente React
  size: keyof typeof sizes; // Tamanho do texto
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>; // Propriedades HTML padrão

// Definindo o componente Text como um componente funcional
const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  as,
  size = "2xl",
  ...restProps
}) => {
  const Component = as || "p"; // Usa o elemento passado ou o padrão <p>

  return (
    <Component
      className={`text-gray-700 font-roboto ${sizes[size]} ${className}`} // Classes CSS combinadas
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
