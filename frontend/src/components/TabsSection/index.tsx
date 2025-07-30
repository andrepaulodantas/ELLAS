import React from "react";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { Text, Img } from "..";

type TabsSectionProps = {
  selectedTab: string; // Representa a aba atualmente selecionada
  onTabChange: (tab: string) => void; // Função chamada ao mudar de aba
  children: React.ReactNode[];
};

const TabsSection: React.FC<TabsSectionProps> = ({
  selectedTab,
  onTabChange,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/open-data/1", label: "Map", icon: "images/img_iconx18_9.svg" },
    { path: "/open-data/2", label: "Bars", icon: "images/img_iconx18_11.svg" },
    { path: "/open-data/3", label: "Lines", icon: "images/img_iconx18_12.svg" },
  ];

  const getTabClass = (tab: string) => {
    return selectedTab === tab
      ? "text-gray-700 font-medium border-b-2 border-gray-700"
      : "text-gray-500 hover:text-gray-700";
  };

  return (
    <Tabs
      selectedIndex={tabs.findIndex((tab) => tab.path === selectedTab)}
      onSelect={(index) => onTabChange(tabs[index].path)}
      className="w-full"
      selectedTabClassName="!text-gray-700 font-medium border-gray-700 border-b-2 bg-white-A700"
      selectedTabPanelClassName="mt-4"
    >
      <TabList className="flex flex-row gap-4 border-b">
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            className={`cursor-pointer p-2 ${getTabClass(tab.path)}`}
            onClick={() => navigate(tab.path)}
          >
            <Text as="p" className="inline">
              {tab.label}
            </Text>
            <Img src={tab.icon} alt={`${tab.label} Icon`} className="ml-2" />
          </Tab>
        ))}
      </TabList>

      {React.Children.map(children, (child, index) => (
        <TabPanel key={index} className="p-4">
          {child}
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default TabsSection;
