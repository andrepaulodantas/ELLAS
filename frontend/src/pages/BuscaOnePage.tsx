import React from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  tabStyles,
} from "../components/TabsConfig";
import { useLanguage } from "../contexts/LanguageContext";

const BuscaOnePage: React.FC = () => {
  const { translations } = useLanguage();

  return (
    <div className={tabStyles.container}>
      <div className={tabStyles.content}>
        <div className={tabStyles.header}>
          <h1 className={tabStyles.title}>{translations.openData}</h1>
        </div>

        <Tabs>
          <TabList>
            <Tab className={tabStyles.tab}>
              <span className="hidden md:inline">
                {translations.visualization.table}
              </span>
              <span className="md:hidden">
                {translations.visualization.table}
              </span>
            </Tab>
            <Tab className={tabStyles.tab}>
              <span className="hidden md:inline">
                {translations.visualization.map}
              </span>
              <span className="md:hidden">
                {translations.visualization.map}
              </span>
            </Tab>
            <Tab className={tabStyles.tab}>
              <span className="hidden md:inline">
                {translations.visualization.chart}
              </span>
              <span className="md:hidden">
                {translations.visualization.chart}
              </span>
            </Tab>
          </TabList>

          <TabPanel>
            <div className="min-w-full overflow-x-auto">
              <div className="min-h-[400px]">
                <h2 className="text-xl font-semibold mb-4">
                  {translations.visualization.table}
                </h2>
                {/* Add your table component here */}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="min-h-[400px]">
              <h2 className="text-xl font-semibold mb-4">
                {translations.visualization.map}
              </h2>
              {/* Add your map component here */}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="min-h-[400px]">
              <h2 className="text-xl font-semibold mb-4">
                {translations.visualization.chart}
              </h2>
              {/* Add your chart component here */}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default BuscaOnePage;
