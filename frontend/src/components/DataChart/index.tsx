import React, { useState } from "react";
import { Box, Typography, styled } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useLanguage } from "../../contexts/LanguageContext";

const COLORS = ["#E91E63", "#FF5722", "#7C4DFF", "#FFC107"];

const OuterContainer = styled(Box)`
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  background-color: #fdf2ff;
  padding: 6rem 0;
  display: flex;
  justify-content: center;

  @media (max-width: 1024px) {
    padding: 4rem 0;
  }

  @media (max-width: 768px) {
    padding: 3rem 0;
  }

  @media (max-width: 480px) {
    padding: 2.5rem 0;
  }
`;

const ChartContainer = styled(Box)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
  display: flex;
  gap: 8rem;
  align-items: flex-start;
  justify-content: space-between;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 4rem;
    padding: 0 2rem;
    align-items: center;
  }

  @media (max-width: 768px) {
    gap: 3rem;
    padding: 0 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 2.5rem;
    padding: 0 1rem;
  }
`;

const ChartSection = styled(Box)`
  flex: 1;
  width: 500px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    flex-direction: column;
    gap: 2rem;
  }

  @media (max-width: 480px) {
    max-width: 320px;
  }
`;

const TextSection = styled(Box)`
  flex: 1;
  max-width: 560px;

  @media (max-width: 1024px) {
    text-align: center;
    max-width: 600px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const ListItem = styled(Box)`
  position: relative;
  padding-left: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: left;
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;

  &:last-child {
    margin-bottom: 0;
  }

  &:before {
    content: "•";
    position: absolute;
    left: 0;
    color: #553c9a;
    font-size: 1.25rem;
    line-height: 1;
  }
`;

const LegendContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: 1rem;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding-left: 0;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const DataChart = () => {
  const { translations } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = [
    { name: translations.dataChart.categories.policies, value: 40 },
    { name: translations.dataChart.categories.factors, value: 25 },
    { name: translations.dataChart.categories.initiatives, value: 20 },
    { name: translations.dataChart.categories.secondary, value: 15 },
  ];

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const renderCenterText = () => {
    const isMobile = window.innerWidth <= 480;
    const fontSize = isMobile ? "12px" : "14px";

    return (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: fontSize,
          fontWeight: "600",
          fill: "#553C9A",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <tspan x="50%" dy="-10">
          {translations.dataChart.centerText1}
        </tspan>
        <tspan x="50%" dy="20">
          {translations.dataChart.centerText2}
        </tspan>
      </text>
    );
  };

  return (
    <OuterContainer>
      <ChartContainer>
        <ChartSection>
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={140}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  startAngle={90}
                  endAngle={450}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{
                        filter:
                          activeIndex === index ? "brightness(1.1)" : "none",
                        transform: `scale(${activeIndex === index ? 1.05 : 1})`,
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Pie>
                {renderCenterText()}
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <LegendContainer>
            {data.map((entry, index) => (
              <Box
                key={`legend-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  opacity:
                    activeIndex === null || activeIndex === index ? 1 : 0.5,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => onPieEnter(null, index)}
                onMouseLeave={onPieLeave}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: COLORS[index],
                    borderRadius: "50%",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#4A5568",
                    fontWeight: activeIndex === index ? 600 : 400,
                  }}
                >
                  {entry.name}
                </Typography>
              </Box>
            ))}
          </LegendContainer>
        </ChartSection>

        <TextSection>
          <Typography
            variant="h4"
            sx={{
              color: "#553C9A",
              fontWeight: 600,
              mb: 2.5,
              fontSize: { xs: "1.75rem", md: "2rem" },
              lineHeight: 1.2,
            }}
          >
            {translations.dataChart.title}
          </Typography>
          <Typography
            sx={{
              color: "#4A5568",
              mb: 2.5,
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            {translations.dataChart.description1}
          </Typography>
          <Typography
            sx={{
              color: "#4A5568",
              mb: 4,
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            {translations.dataChart.description2}
          </Typography>
        </TextSection>
      </ChartContainer>
    </OuterContainer>
  );
};

export default DataChart;
