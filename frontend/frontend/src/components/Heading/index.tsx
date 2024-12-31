import React from "react";

const sizes = {
  "2xl": "text-[32px] font-bold leading-[38px]",
  xl: "text-2xl font-bold leading-[29px]",
  s: "text-xs font-bold",
  md: "text-sm font-bold leading-[17px]",
  xs: "text-[10px] font-bold",
  lg: "text-lg font-bold leading-5",
};

export type HeadingProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  children,
  className = "",
  size = "md",
  as,
  ...restProps
}) => {
  const Component = as || "h6";

  return (
    <Component className={`text-gray-700 font-roboto ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
