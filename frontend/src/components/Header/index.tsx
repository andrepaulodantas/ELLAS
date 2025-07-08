import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  InputBase,
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import TuneIcon from "@mui/icons-material/Tune";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import LanguageSwitcher from "../LanguageSwitcher";
import { questionQueries } from "../../utils/questions";

const StyledAppBar = styled(AppBar)`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const NavButton = styled(Button)`
  color: #4a2b4e !important;
  font-weight: 600;
  padding: 8px 16px;
  text-transform: none;
  font-size: 16px;
  position: relative;
  white-space: nowrap;
  opacity: 1;

  &:hover {
    color: #ff4081 !important;
    opacity: 1;
  }

  @media (max-width: 1024px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const LoginButton = styled(Button)`
  background-color: #4a2b4e;
  color: white;
  padding: 8px 24px;
  border-radius: 25px;
  text-transform: none;
  font-size: 16px;
  transition: all 0.3s ease;
  white-space: nowrap;

  @media (max-width: 1024px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const Logo = styled("img")`
  height: 45px;
  width: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
  object-fit: contain;
  margin: 8px 0;

  @media (max-width: 1024px) {
    height: 40px;
  }

  @media (max-width: 600px) {
    height: 35px;
  }
`;

const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
  padding: 8px 0;

  @media (max-width: 1024px) {
    padding: 4px 0;
  }
`;

const NavContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 2;

  @media (max-width: 1024px) {
    gap: 1;
  }
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    border-radius: 8px;
    margin-top: 8px;
    min-width: 180px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    background-color: white;
  }

  .MuiMenuItem-root {
    padding: 12px 24px;
    font-size: 14px;
    color: #4a2b4e;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 64, 129, 0.08);
      color: #ff4081;
    }
  }
`;

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 280px;
    background-color: white;
    padding: 20px 0;
  }
`;

const DrawerListItem = styled(ListItem)<{ component?: React.ElementType }>`
  padding: 12px 24px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 64, 129, 0.08);
  }

  .MuiListItemText-primary {
    color: #4a2b4e;
    font-size: 16px;
    font-weight: 500;
  }
`;

const SearchContainer = styled(Box)`
  background: linear-gradient(
    135deg,
    rgba(255, 192, 203, 0.2) 0%,
    rgba(147, 112, 219, 0.2) 100%
  );
  padding: 20px 0;
  position: relative;
  overflow: hidden;
  min-height: 80vh;
  display: flex;
  align-items: flex-start;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.45) 0%,
      rgba(255, 255, 255, 0.35) 50%,
      rgba(255, 255, 255, 0.45) 100%
    );
    z-index: 1;
  }
`;

const BackgroundSlider = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const BackgroundImage = styled("div")<{ image: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  &.active {
    opacity: 0.7;
  }
`;

const NavigationButton = styled(IconButton)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 12px;
  color: #4a2b4e;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  &.prev {
    left: 20px;
  }

  &.next {
    right: 20px;
  }

  svg {
    font-size: 2rem;
  }
`;

const ContentWrapper = styled(Box)`
  position: relative;
  z-index: 2;
  width: 100%;

  /* Garante que os elementos interativos dentro do ContentWrapper tenham z-index maior */
  .interactive-element {
    position: relative;
    z-index: 100;
  }
`;

const SearchBox = styled(Box)`
  background: white;
  border-radius: 30px;
  padding: 6px;
  display: flex;
  align-items: stretch;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 24px 0;
  width: 115%;
  max-width: 1000px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 12px;
    gap: 12px;
    width: 100%;
  }
`;

const SearchInnerBox = styled(Box)`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  padding-right: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 12px;
    padding-right: 0;
  }
`;

const SearchButton = styled(Button)`
  background-color: #ff4081;
  color: white;
  border-radius: 30px;
  padding: 6px 24px;
  text-transform: none;
  font-weight: 500;
  font-size: 16px;
  margin: 6px 6px 6px 0;
  height: 48px;
  min-width: 120px;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: #f50057;
    box-shadow: 0 4px 12px rgba(255, 64, 129, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 64, 129, 0.2);
  }

  .MuiSvgIcon-root {
    font-size: 20px;
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
  }
`;

const FieldDivider = styled(Box)`
  width: 0px;
  height: 36px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 0;

  @media (max-width: 768px) {
    width: 100%;
    height: 1px;
    margin: 8px 0;
  }
`;

const KnowMoreButton = styled(Button)`
  background-color: #4a2b4e;
  color: white;
  padding: 12px 32px;
  border-radius: 25px;
  text-transform: none;
  font-size: 16px;
  margin-top: 24px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #5c375f;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(74, 43, 78, 0.2);
  }

  .MuiSvgIcon-root {
    font-size: 20px;
    margin-left: 4px;
  }
`;

const CategorySelect = styled(Box)`
  position: relative;
  width: 100%;
  min-width: 200px;
  margin: 0 8px;

  select {
    width: 100%;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    outline: none;
    font-size: 16px;
    color: #4a2b4e;
    background: transparent;
    cursor: pointer;
    appearance: none;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:focus {
      background-color: rgba(74, 43, 78, 0.05);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    option {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      padding: 10px;
      max-width: 100%;
    }

    @media (max-width: 768px) {
      font-size: 14px;
      padding: 10px 14px;
    }
  }

  @media (max-width: 768px) {
    margin: 0;
    width: 100%;
  }
`;

// Custom dropdown components
const CustomDropdown = styled(Box)`
  position: relative;
  width: 100%;
  min-width: 200px;
  z-index: 1000;
`;

const DropdownButton = styled(Box)`
  width: 100%;
  padding: 12px 10px;
  border-radius: 8px;
  background-color: white;
  font-size: 16px;
  color: #4a2b4e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  border: 1px solid rgba(0, 0, 0, 0.08);
  min-height: 48px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: rgba(74, 43, 78, 0.05);
    border-color: rgba(0, 0, 0, 0.12);
  }

  &.disabled {
    opacity: 0.7;
    cursor: not-allowed;

    &:hover {
      background-color: white;
      border-color: rgba(0, 0, 0, 0.08);
    }
  }

  .dropdown-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: calc(100% - 30px);
    font-weight: 400;
  }

  .dropdown-icon {
    color: #4a2b4e;
    margin-left: 8px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 14px;
  }
`;

const DropdownList = styled(Box)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  margin-top: 4px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #b8b8b8;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    max-height: 250px;
  }
`;

const DropdownItem = styled(Box)`
  padding: 12px 16px;
  font-size: 14px;
  color: #4a2b4e;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 64, 129, 0.08);
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
  }
`;

const SearchInput = styled(InputBase)`
  flex: 1;
  margin-left: 8px;
  font-size: 16px;

  input {
    padding: 12px 16px;
    width: 100%;

    &::placeholder {
      color: #666;
      opacity: 0.8;
    }
  }
`;

interface MenuItem {
  label: string;
  path?: string;
  submenu?: Array<{
    label: string;
    path: string;
  }>;
}

// Adicionar definição do StyledMenuItem
const StyledMenuItem = styled(MenuItem)`
  padding: 12px 16px;
  font-size: 14px;
  color: #4a2b4e;
  white-space: normal;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 64, 129, 0.08);
  }

  &:last-child {
    border-bottom: none;
  }
`;

// Adicione um novo estilo para o botão de busca avançada
const AdvancedSearchButton = styled(Button)`
  background-color: #ff6b81;
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  text-transform: none;
  font-size: 14px;
  margin-left: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: #ff5672;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 107, 129, 0.3);
  }
  
  svg {
    font-size: 18px;
  }
`;

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { language, setLanguage, translations } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState<string[]>([]);
  const [questionDropdownOpen, setQuestionDropdownOpen] = useState(false);
  const questionButtonRef = useRef<HTMLDivElement>(null);
  const images = [
    "/images/img_fundo_home_1.png",
    "/images/img_fundo_home_3.png",
  ];

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Update filtered questions when category changes
  useEffect(() => {
    if (selectedCategory) {
      const currentLang = language as "pt" | "en" | "es";
      // Get questions from the questions.ts file based on selected category
      const questions = questionQueries[selectedCategory]?.[currentLang] || [];
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions([]);
    }
    setSelectedQuestion("");
    setQuestionDropdownOpen(false);
  }, [selectedCategory, language]);

  const handleClose = () => {
    setLangAnchor(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleExternalLink = (url: string) => {
    const langPrefix = language === "pt" ? "pt" : language;
    const urlWithLang = url.replace("/pt/", `/${langPrefix}/`);
    window.open(urlWithLang, "_blank");
  };

  const menuItems: MenuItem[] = [
    {
      label: translations.navigation.home,
      path: "/",
    },
    {
      label: translations.navigation.about,
      path: "https://ellas.ufmt.br/pt/sobre-nos/o-projeto/",
    },
    {
      label: translations.navigation.openData,
      path: "/buscaone",
    },
    {
      label: translations.navigation.supportELLAS,
      path: "https://ellas.ufmt.br/pt/parceiros/",
    },
    {
      label: translations.navigation.contact,
      path: "https://ellas.ufmt.br/pt/inicio/",
    },
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (!item.path) return;

    if (item.path.startsWith("http")) {
      handleExternalLink(item.path);
    } else {
      handleNavigation(item.path);
    }
  };

  const toggleQuestionDropdown = () => {
    if (!selectedCategory) return;
    setQuestionDropdownOpen(!questionDropdownOpen);
  };

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question);
    setQuestionDropdownOpen(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.append("category", selectedCategory);

      const countriesInAlphabeticalOrder =
        "Argentina,Bolivia,Brazil,Chile,Colombia,Mexico,Peru";

      if (selectedCategory === "initiatives" && !selectedQuestion) {
        params.append("preselect", countriesInAlphabeticalOrder);
      } else if (selectedCategory === "policies" && !selectedQuestion) {
        params.append("preselect", countriesInAlphabeticalOrder);
      } else if (selectedCategory === "factors" && !selectedQuestion) {
        params.append("preselect", countriesInAlphabeticalOrder);
      } else if (selectedCategory === "otherData" && !selectedQuestion) {
        params.append("preselect", countriesInAlphabeticalOrder);
      }
    }

    if (selectedQuestion) {
      params.append("queryType", encodeURIComponent(selectedQuestion));
    }

    navigate(`/buscaone?${params.toString()}`);
  };

  // Função para obter o texto do placeholder de acordo com o idioma
  const getPlaceholderText = () => {
    if (!translations.common?.selectQuestion) {
      // Fallback case if translations aren't loaded
      const placeholders = {
        pt: "Selecione uma Pergunta",
        en: "Select a Question",
        es: "Seleccione una Pregunta",
      };
      return (
        placeholders[language as keyof typeof placeholders] || placeholders.pt
      );
    }
    return translations.common.selectQuestion;
  };

  // Função para navegar para a página de busca avançada
  const handleAdvancedSearch = () => {
    navigate("/advanced-search");
  };

  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="lg">
          <StyledToolbar>
            <Logo
              src="/images/img_logo_ellas_portal_prancheta.png"
              alt="ELLAS"
              onClick={() => handleNavigation("/")}
            />

            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ color: "#4A2B4E" }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <NavContainer>
                {menuItems.map((item, index) => (
                  <NavButton
                    key={index}
                    onClick={() => handleMenuItemClick(item)}
                  >
                    {item.label}
                  </NavButton>
                ))}

                <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                  <LanguageSwitcher />
                </Box>

                {/* Botão de Busca Avançada */}
                <AdvancedSearchButton 
                  onClick={handleAdvancedSearch}
                  variant="contained"
                >
                  <TuneIcon />
                  {language === 'pt' ? 'Busca Avançada' : 
                   language === 'es' ? 'Búsqueda Avanzada' : 'Advanced Search'}
                </AdvancedSearchButton>
              </NavContainer>
            )}
          </StyledToolbar>
        </Container>

        <StyledDrawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          <List>
            {menuItems.map((item, index) => (
              <DrawerListItem
                key={index}
                onClick={() => handleMenuItemClick(item)}
              >
                <ListItemText primary={item.label} />
              </DrawerListItem>
            ))}
            <DrawerListItem>
              <LanguageSwitcher />
            </DrawerListItem>
          </List>
        </StyledDrawer>
      </StyledAppBar>

      {isHomePage && (
        <SearchContainer>
          <BackgroundSlider>
            {images.map((image, index) => (
              <BackgroundImage
                key={index}
                image={image}
                className={currentImageIndex === index ? "active" : ""}
              />
            ))}
          </BackgroundSlider>

          <NavigationButton
            className="prev"
            onClick={handlePrevImage}
            size="large"
          >
            <NavigateBeforeIcon />
          </NavigationButton>

          <NavigationButton
            className="next"
            onClick={handleNextImage}
            size="large"
          >
            <NavigateNextIcon />
          </NavigationButton>

          <ContentWrapper>
            <Container maxWidth="lg">
              <Box
                sx={{
                  maxWidth: 600,
                  textAlign: "left",
                  position: "relative",
                  zIndex: 2,
                  mt: 15,
                  mb: 8,
                  "@media (min-width: 1200px)": {
                    ml: "10%",
                  },
                }}
              >
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    color: "#4A2B4E",
                    fontWeight: 600,
                    mb: 3,
                    lineHeight: 1.3,
                    fontSize: { xs: "2rem", md: "2.8rem" },
                    maxWidth: "800px",
                  }}
                >
                  {translations.home?.title ||
                    "Dados abertos para Equidade de Gênero em Ciência e Tecnologia na América Latina"}
                </Typography>

                <KnowMoreButton
                  variant="contained"
                  onClick={() =>
                    window.open("https://ellas.ufmt.br/", "_blank")
                  }
                  endIcon={<NavigateNextIcon />}
                >
                  {translations.common?.learnMore || "Saiba mais"}
                </KnowMoreButton>

                <SearchBox>
                  <SearchInnerBox>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flex: { xs: "1", sm: "0.6" },
                        pl: 2,
                        width: "100%",
                      }}
                    >
                      <IconButton size="medium" sx={{ color: "#4A2B4E", p: 1 }}>
                        <CategoryIcon sx={{ fontSize: 22 }} />
                      </IconButton>
                      <CategorySelect sx={{ width: "100%" }}>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value="">
                            {translations.common?.chooseCategory ||
                              (() => {
                                const placeholders = {
                                  pt: "Escolha uma Categoria",
                                  en: "Choose a Category",
                                  es: "Elija una Categoría",
                                };
                                return (
                                  placeholders[
                                    language as keyof typeof placeholders
                                  ] || placeholders.pt
                                );
                              })()}
                          </option>
                          <option value="initiatives">
                            {translations.categories?.initiatives ||
                              (() => {
                                const placeholders = {
                                  pt: "Iniciativas",
                                  en: "Initiatives",
                                  es: "Iniciativas",
                                };
                                return (
                                  placeholders[
                                    language as keyof typeof placeholders
                                  ] || placeholders.pt
                                );
                              })()}
                          </option>
                          <option value="policies">
                            {translations.categories?.policies || "Políticas"}
                          </option>
                          <option value="factors">
                            {translations.categories?.factors || "Fatores"}
                          </option>
                          <option value="otherData">
                            {translations.categories?.otherData ||
                              "Outros Dados"}
                          </option>
                        </select>
                      </CategorySelect>
                    </Box>

                    <FieldDivider
                      sx={{ display: { xs: "block", sm: "none" } }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flex: { xs: "1", sm: "1.2" },
                        pl: { xs: 2, sm: 1 },
                        pr: 1,
                        width: "100%",
                        position: "relative",
                        ml: { xs: 0, sm: 0 },
                      }}
                    >
                      <DropdownButton
                        ref={questionButtonRef}
                        onClick={toggleQuestionDropdown}
                        className={!selectedCategory ? "disabled" : ""}
                        sx={{ width: "100%" }}
                      >
                        <Typography
                          className="dropdown-text"
                          sx={{
                            color: selectedQuestion
                              ? "#4A2B4E"
                              : "rgba(0, 0, 0, 0.6)",
                            fontWeight: selectedQuestion ? 500 : 400,
                            fontSize: { xs: "14px", sm: "16px" },
                          }}
                        >
                          {selectedQuestion || getPlaceholderText()}
                        </Typography>
                        {selectedCategory && (
                          <Box className="dropdown-icon">
                            {questionDropdownOpen ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </Box>
                        )}
                      </DropdownButton>

                      <Popper
                        open={questionDropdownOpen}
                        anchorEl={questionButtonRef.current}
                        role={undefined}
                        placement="bottom-start"
                        transition
                        disablePortal={false}
                        style={{
                          zIndex: 9999,
                          width: questionButtonRef.current?.offsetWidth,
                          marginTop: "2px",
                        }}
                        modifiers={[
                          {
                            name: "preventOverflow",
                            enabled: true,
                            options: {
                              altAxis: true,
                              altBoundary: true,
                              tether: true,
                              rootBoundary: "document",
                              padding: 8,
                            },
                          },
                        ]}
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin:
                                placement === "bottom-start"
                                  ? "left top"
                                  : "left bottom",
                            }}
                          >
                            <Paper
                              elevation={8}
                              sx={{
                                mt: 1,
                                maxHeight: 300,
                                overflow: "auto",
                                width: "100%",
                                borderRadius: "8px",
                              }}
                            >
                              <ClickAwayListener
                                onClickAway={() =>
                                  setQuestionDropdownOpen(false)
                                }
                              >
                                <Box>
                                  {filteredQuestions.map((question, idx) => (
                                    <StyledMenuItem
                                      key={idx}
                                      onClick={() =>
                                        handleQuestionSelect(question)
                                      }
                                    >
                                      {question}
                                    </StyledMenuItem>
                                  ))}
                                </Box>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </Box>
                  </SearchInnerBox>

                  <SearchButton
                    variant="contained"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{
                      minWidth: { xs: "100%", sm: "120px" },
                      margin: { xs: 0, sm: "6px" },
                    }}
                  >
                    {translations.common?.search || "Pesquisar"}
                  </SearchButton>
                </SearchBox>
              </Box>
            </Container>
          </ContentWrapper>
        </SearchContainer>
      )}
    </>
  );
};

export default Header;
