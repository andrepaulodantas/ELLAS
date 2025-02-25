import React from "react";
import { Text, Button } from "..";
import SelectBox, { SelectOption } from "../SelectBox";

interface DropDownOption extends SelectOption {
  value: string;
}

interface SidebarProps {
  selectedCategory: DropDownOption | null;
  onCategoryChange: (option: DropDownOption | null) => void;
  questionOptions: DropDownOption[];
  selectedQuestion: DropDownOption | null;
  onQuestionChange: (option: DropDownOption | null) => void;
  onReset: () => void;
  selectedTime?: DropDownOption | null;
  onTimeChange?: (option: DropDownOption | null) => void;
  timeOptions?: DropDownOption[];
  isTimeDropdownEnabled?: boolean;
  categoryOptions: DropDownOption[];
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onCategoryChange,
  questionOptions,
  selectedQuestion,
  onQuestionChange,
  onReset,
  selectedTime,
  onTimeChange,
  timeOptions = [],
  isTimeDropdownEnabled = false,
  categoryOptions,
}) => {
  return (
    <div className="h-auto w-[29%] md:w-full bg-white-A700 shadow-md p-6 sm:p-4">
      {/* Reset Button */}
      <Button
        size="xs"
        variant="outline"
        className="mb-4 gap-2.5 w-full rounded-[35px]"
        onClick={onReset}
      >
        Restart
      </Button>

      <div className="flex flex-col gap-6">
        {/* Category Selection */}
        <div>
          <Text size="3xl" as="p" className="mb-2">
            Category
          </Text>
          <SelectBox
            shape="round"
            name="categoria"
            placeholder="Select Category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={(option) =>
              onCategoryChange(option as DropDownOption | null)
            }
            className="w-full border-gray-300_01 border rounded-md"
          />
        </div>

        {/* Question Selection */}
        <div>
          <Text size="3xl" as="p" className="mb-2">
            Question
          </Text>
          <SelectBox
            shape="round"
            name="pergunta"
            placeholder="Select Question"
            options={questionOptions}
            value={selectedQuestion}
            onChange={(option) =>
              onQuestionChange(option as DropDownOption | null)
            }
            className="w-full border-gray-300_01 border rounded-md"
          />
        </div>

        {/* Time Selection */}
        {isTimeDropdownEnabled && (
          <div>
            <Text size="3xl" as="p" className="mb-2">
              Time
            </Text>
            <SelectBox
              shape="round"
              name="tempo"
              placeholder="Select Time"
              options={timeOptions}
              value={selectedTime}
              onChange={(option) =>
                onTimeChange?.(option as DropDownOption | null)
              }
              className="w-full border-gray-300_01 border rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
