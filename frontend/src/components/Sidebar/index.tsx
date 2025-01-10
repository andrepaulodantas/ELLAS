import React from "react";
import { Text, SelectBox, Button } from "..";

type DropDownOption = {
  label: string;
  value: string;
};

interface SidebarProps {
  selectedCategory: string | null;
  onCategoryChange: (option: DropDownOption) => void;
  questionOptions: DropDownOption[];
  selectedQuestion: string | null;
  onQuestionChange: (option: DropDownOption) => void;
  onReset: () => void;
  selectedTime?: string | null;
  onTimeChange?: (option: DropDownOption) => void;
  timeOptions?: DropDownOption[];
  isTimeDropdownEnabled?: boolean;
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
            options={[
              { label: "Initiatives", value: "initiatives" },
              { label: "Policies", value: "policies" },
              { label: "Factors", value: "factors" },
            ]}
            value={
              selectedCategory
                ? { label: selectedCategory, value: selectedCategory }
                : null
            }
            onChange={onCategoryChange}
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
            value={
              selectedQuestion
                ? { label: selectedQuestion, value: selectedQuestion }
                : null
            }
            onChange={onQuestionChange}
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
              value={
                selectedTime
                  ? { label: selectedTime, value: selectedTime }
                  : null
              }
              onChange={onTimeChange}
              className="w-full border-gray-300_01 border rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
