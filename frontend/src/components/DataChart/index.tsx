import React, { useState } from "react";
import { Box, Typography, Button, styled } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Políticas", value: 30 },
  { name: "Iniciativas", value: 25 },
  { name: "Fatores", value: 25 },
  { name: "Outros", value: 20 },
];

const COLORS = ["#FF4081", "#FFA07A", "#FF69B4", "#9370DB"];

const AnimatedButton = styled(Button)`
  position: relative;
  background: linear-gradient(45deg, #ff4081 30%, #f50057 90%);
  border-radius: 25px;
  padding: 12px 30px;
  transition: all 0.3s ease;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #f50057 30%, #ff4081 90%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 64, 129, 0.4);
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const ChartContainer = styled(Box)`
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    pointer-events: none;
  }
`;

const DataChart = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{
          fontSize: activeIndex === index ? "14px" : "12px",
          fontWeight: activeIndex === index ? "bold" : "normal",
          transition: "all 0.3s ease",
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box sx={{ py: 6, px: 4 }}>
      <Box
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "left",
          position: "relative",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            position: "relative",
            display: "inline-block",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "40%",
              height: "3px",
              background: "linear-gradient(45deg, #FF4081, #f50057)",
              borderRadius: "2px",
            },
          }}
        >
          Encontre a informação que precisa no Portal ELLAS
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "text.secondary",
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          O portal ELLAS reúne dados e evidências sobre gênero em ciência e
          tecnologia na América Latina.
        </Typography>

        <ChartContainer sx={{ height: 400, mt: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{
                      filter:
                        activeIndex === index ? "brightness(1.1)" : "none",
                      transform: `scale(${activeIndex === index ? 1.1 : 1})`,
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={36}
                content={({ payload }) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 3,
                      mt: 2,
                    }}
                  >
                    {payload?.map((entry: any, index: number) => (
                      <Box
                        key={`legend-${index}`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          opacity:
                            activeIndex === null || activeIndex === index
                              ? 1
                              : 0.5,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: entry.color,
                            borderRadius: "50%",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">{entry.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <AnimatedButton variant="contained" sx={{ mt: 4 }}>
          Saiba mais
        </AnimatedButton>
      </Box>
    </Box>
  );
};

export default DataChart;
