import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  styled,
} from "@mui/material";
import PolicyIcon from "@mui/icons-material/Policy";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import { useLanguage } from "../../contexts/LanguageContext";

const AnimatedCard = styled(Card)`
  height: 100%;
  border-radius: 15px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    &::before {
      transform: translateX(0);
    }

    .card-icon {
      transform: rotate(360deg) scale(1.2);
    }

    .card-title {
      transform: translateY(-5px);
    }

    .card-description {
      opacity: 0.9;
      transform: translateY(0);
    }
  }
`;

const DataCards = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const categories = [
    {
      title: "Políticas de Igualdade de Gênero",
      description: "Explore políticas implementadas para promover a igualdade de gênero na América Latina",
      icon: "/images/policy-icon.svg",
      link: "/open-data/1?category=policies&question=gender_equity_policies",
    },
    {
      title: "Iniciativas Ativas",
      description: "Descubra iniciativas ativas que promovem a participação feminina em STEM",
      icon: "/images/initiative-icon.svg",
      link: "/open-data/1?category=initiatives&question=active_initiatives",
    },
    {
      title: "Fatores de Impacto",
      description: "Analise fatores contextuais que influenciam a participação feminina em STEM",
      icon: "/images/factors-icon.svg",
      link: "/open-data/1?category=factors&question=impact_factors",
    },
    {
      title: translations.categories.otherData,
      description: "Informações complementares e estatísticas",
      icon: <DataUsageIcon sx={{ fontSize: 40 }} />,
      color: "#9370DB",
    },
  ];

  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          textAlign: "center",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -10,
            left: "50%",
            transform: "translateX(-50%)",
            width: "50px",
            height: "3px",
            background: "linear-gradient(45deg, #FF4081, #f50057)",
            borderRadius: "2px",
          },
        }}
      >
        {translations.explore}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {categories.map((category, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={category.title}
            sx={{
              opacity: 0,
              animation: "fadeInUp 0.5s forwards",
              animationDelay: `${index * 0.1}s`,
              "@keyframes fadeInUp": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(20px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <AnimatedCard
              sx={{ backgroundColor: category.color, color: "white" }}
              onClick={() => {
                if (category.link) {
                  navigate(category.link);
                }
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Box
                  className="card-icon"
                  sx={{
                    transition: "transform 0.5s ease",
                    mb: 2,
                  }}
                >
                  {category.icon}
                </Box>
                <Typography
                  variant="h6"
                  className="card-title"
                  sx={{
                    transition: "transform 0.3s ease",
                    mb: 1,
                  }}
                >
                  {category.title}
                </Typography>
                <Typography
                  variant="body2"
                  className="card-description"
                  sx={{
                    transition: "all 0.3s ease",
                    opacity: 0.8,
                    transform: "translateY(5px)",
                  }}
                >
                  {category.description}
                </Typography>
              </CardContent>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DataCards;
