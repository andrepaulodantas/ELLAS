import React from 'react';
import { Tab as ReactTab, TabProps, TabList as ReactTabList, TabPanel as ReactTabPanel, Tabs as ReactTabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

interface TabComponent extends React.FC<TabProps> {
  tabsRole?: string;
}

// Custom Tab component
export const Tab: TabComponent = ({ children, ...props }) => (
  <ReactTab {...props}>
    {children}
  </ReactTab>
);

Tab.tabsRole = 'Tab';

// Custom TabList component
export const TabList: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <ReactTabList className="flex flex-wrap md:flex-nowrap border-b border-gray-200">
    {children}
  </ReactTabList>
);

// Custom TabPanel component
export const TabPanel: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <ReactTabPanel className="p-4 overflow-x-auto">
    {children}
  </ReactTabPanel>
);

// Custom Tabs component
export const Tabs: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <ReactTabs
    selectedTabClassName="bg-blue-500 text-white"
    selectedTabPanelClassName="block"
    className="w-full max-w-full overflow-hidden"
  >
    {children}
  </ReactTabs>
);

// Styles for tabs
export const tabStyles = {
  tab: "px-3 py-2 text-sm md:text-base md:px-4 hover:bg-gray-100 cursor-pointer rounded-t-lg transition-colors duration-200 flex-shrink-0 text-center whitespace-nowrap",
  activeTab: "bg-blue-500 text-white",
  tabList: "flex space-x-1 md:space-x-2 overflow-x-auto scrollbar-hide border-b border-gray-200",
  tabPanel: "p-4 min-h-[300px]",
  container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  content: "bg-white rounded-lg shadow-lg p-4 md:p-6",
  header: "mb-6 md:mb-8",
  title: "text-2xl md:text-3xl font-bold text-left text-gray-900",
}; 