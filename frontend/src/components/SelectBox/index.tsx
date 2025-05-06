import React, { forwardRef } from "react";
import Select, {
  ActionMeta,
  components,
  DropdownIndicatorProps,
  StylesConfig,
} from "react-select";
import { GroupBase } from "react-select";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectBoxProps {
  options: SelectOption[];
  value?: SelectOption | null;
  onChange?: (
    option: SelectOption | null,
    actionMeta?: ActionMeta<SelectOption>
  ) => void;
  className?: string;
  indicator?: React.ReactNode;
  name?: string;
  placeholder?: string;
  shape?: string;
  size?: string;
  variant?: string;
  color?: string;
  isMulti?: boolean;
  [key: string]: any;
}

const SelectBox = forwardRef<any, SelectBoxProps>(
  (
    {
      className = "",
      indicator,
      name = "",
      options = [],
      placeholder = "Select",
      shape = "",
      size = "",
      variant = "",
      color = "",
      onChange,
      value,
      isMulti = false,
      ...restProps
    },
    ref
  ) => {
    const getClassName = () => {
      const shapes: { [key: string]: string } = {
        round: "rounded",
        square: "square",
      };
      const sizes: { [key: string]: string } = {
        sm: "py-1 px-2 text-sm",
        md: "py-2 px-4",
        lg: "py-3 px-6 text-lg",
      };
      const variants: { [key: string]: string } = {
        fill: "bg-white",
        outline: "border border-gray-300",
      };
      const colors: { [key: string]: string } = {
        white_A700: "bg-white-A700 text-gray-900",
        gray_900: "bg-gray-900 text-white",
      };

      return `${className} ${shapes[shape] || ""} ${sizes[size] || ""} ${
        variants[variant] || ""
      } ${colors[color] || ""}`;
    };

    const CustomDropdownIndicator = (
      props: DropdownIndicatorProps<SelectOption, boolean>
    ) => {
      return indicator ? (
        <div>{indicator}</div>
      ) : (
        <components.DropdownIndicator {...props} />
      );
    };

    // Customize styles for better mobile experience
    const customStyles: StylesConfig<SelectOption, boolean> = {
      control: (provided, state) => ({
        ...provided,
        minHeight: '38px',
        fontSize: '14px',
        '@media (max-width: 550px)': {
          fontSize: '13px',
          minHeight: '34px',
        },
      }),
      placeholder: (provided) => ({
        ...provided,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '@media (max-width: 550px)': {
          fontSize: '13px',
        },
      }),
      menu: (provided) => ({
        ...provided,
        zIndex: 9999,
        '@media (max-width: 550px)': {
          width: 'calc(100% + 20px)',
          left: '-10px', // Expand beyond container
        },
      }),
      menuList: (provided) => ({
        ...provided,
        maxHeight: '40vh', // Limit height on mobile
        '@media (max-width: 550px)': {
          maxHeight: '35vh',
        },
      }),
      option: (provided, state) => ({
        ...provided,
        fontSize: '14px',
        padding: '8px 12px',
        '@media (max-width: 550px)': {
          fontSize: '13px',
          padding: '10px',
        },
      }),
      singleValue: (provided) => ({
        ...provided,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: 'calc(100% - 20px)',
        '@media (max-width: 550px)': {
          fontSize: '13px',
        },
      }),
    };

    return (
      <Select<SelectOption, boolean>
        ref={ref}
        options={options}
        className={getClassName()}
        placeholder={placeholder}
        isMulti={isMulti}
        value={value}
        styles={customStyles}
        onChange={(newValue: any, actionMeta: ActionMeta<SelectOption>) => {
          if (onChange) {
            onChange(newValue as SelectOption | null, actionMeta);
          }
        }}
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: CustomDropdownIndicator,
        }}
        {...restProps}
      />
    );
  }
);

export default SelectBox;
