// src/components/CustomTabs.js

import React from "react";
import { Tabs as OriginalTabs, UncontrolledTabs as OriginalUncontrolledTabs, TabList as OriginalTabList, Tab as OriginalTab, TabPanel as OriginalTabPanel } from "react-tabs";

export const Tabs = ({ children = null, ...props }) => {
  return <OriginalTabs {...props}>{children}</OriginalTabs>;
};

export const UncontrolledTabs = ({ children = null, ...props }) => {
  return <OriginalUncontrolledTabs {...props}>{children}</OriginalUncontrolledTabs>;
};

export const TabList = ({ children = null, ...props }) => {
  return <OriginalTabList {...props}>{children}</OriginalTabList>;
};

export const Tab = ({ children = null, ...props }) => {
  return <OriginalTab {...props}>{children}</OriginalTab>;
};

export const TabPanel = ({ children = null, ...props }) => {
  return <OriginalTabPanel {...props}>{children}</OriginalTabPanel>;
};
