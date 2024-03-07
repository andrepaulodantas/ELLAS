import React from "react";

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

export type TextProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  as,
  size = "2xl",
  ...restProps
}) => {
  const Component = as || "p";

  return (
    <Component className={`text-gray-700 font-roboto ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
