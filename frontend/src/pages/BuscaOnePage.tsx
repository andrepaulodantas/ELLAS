import React from 'react';
import { Tabs, TabList, Tab, TabPanel, tabStyles } from '../components/TabsConfig';
import { useLanguage } from '../contexts/LanguageContext';

const BuscaOnePage: React.FC = () => {
  const { translations } = useLanguage();

  return (
    <div className={tabStyles.container}>
      <div className={tabStyles.content}>
        <div className={tabStyles.header}>
          <h1 className={tabStyles.title}>
            {translations.openData || 'Open Data'}
          </h1>
        </div>

        <Tabs>
          <TabList>
            <Tab className={tabStyles.tab}>
              <span className="hidden md:inline">{translations.visualization?.table || 'Table View'}</span>
              <span className="md:hidden">Table</span>
            </Tab>
            <Tab className={tabStyles.tab}>
              <span className="hidden md:inline">{translations.visualization?.map || 'Map View'}</span>
              <span className="md:hidden">Map</span>
            </Tab>
            <Tab className={tabStyles.tab}>
              <span className="hidden md:inline">{translations.visualization?.chart || 'Chart View'}</span>
              <span className="md:hidden">Chart</span>
            </Tab>
          </TabList>

          <TabPanel>
            <div className="min-w-full overflow-x-auto">
              <div className="min-h-[400px]">
                <h2 className="text-xl font-semibold mb-4">Table View Content</h2>
                {/* Add your table component here */}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="min-h-[400px]">
              <h2 className="text-xl font-semibold mb-4">Map View Content</h2>
              {/* Add your map component here */}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="min-h-[400px]">
              <h2 className="text-xl font-semibold mb-4">Chart View Content</h2>
              {/* Add your chart component here */}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default BuscaOnePage; 