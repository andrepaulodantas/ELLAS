import React from "react";

const shapes = {
  round: "rounded-[10px]",
} as const;
const variants = {
  fill: {
    white_A700: "bg-white-A700 text-blue_gray-300_01",
  },
} as const;
const sizes = {
  sm: "h-[41px] px-[13px]",
  xs: "h-[41px] pl-[15px] pr-[35px] text-sm",
} as const;

type InputProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "size" | "prefix" | "type" | "onChange"
> &
  Partial<{
    className: string;
    name: string;
    placeholder: string;
    type: string;
    label: string;
    prefix: React.ReactNode;
    suffix: React.ReactNode;
    onChange: (value: string) => void;
    shape: keyof typeof shapes;
    variant: keyof typeof variants;
    size: keyof typeof sizes;
    color: string;
  }>;
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      children,
      label = "",
      prefix,
      suffix,
      onChange,
      shape = "round",
      variant = "fill",
      size = "xs",
      color = "white_A700",
      ...restProps
    },
    ref,
  ) => {
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (onChange) onChange(e.target.value);
    };

    return (
      <div
        className={`${className} flex items-center justify-center border border-solid ${shapes[shape]} ${variants[variant]?.[color]} ${sizes[size]}`}
      >
        {label && <span>{label}</span>}
        {prefix && <span className="mr-2">{prefix}</span>}
        <input
          ref={ref}
          type={type}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          className="bg-transparent outline-none flex-1"
          {...restProps}
        />
        {suffix && <span className="ml-2">{suffix}</span>}
      </div>
    );
  }
);

export { Input };
