import React, { useState, useEffect } from "react";
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
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import LanguageSwitcher from "../LanguageSwitcher";

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
      rgba(255, 255, 255, 0.75) 0%,
      rgba(255, 255, 255, 0.65) 50%,
      rgba(255, 255, 255, 0.75) 100%
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
    opacity: 1;
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
`;

const SearchBox = styled(Box)`
  background: white;
  border-radius: 40px;
  padding: 6px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 24px 0;
  width: 110%;
  max-width: 900px;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 12px;
    gap: 12px;
    width: 100%;
  }
`;

const SearchButton = styled(Button)`
  background-color: #ff4081;
  color: white;
  border-radius: 30px;
  padding: 12px 32px;
  text-transform: none;
  font-weight: 500;
  font-size: 16px;
  margin: 0 6px;
  height: 48px;
  min-width: 140px;

  &:hover {
    background-color: #f50057;
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

    &:focus {
      background-color: rgba(74, 43, 78, 0.05);
    }
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
  const [searchQuery, setSearchQuery] = useState("");
  const images = [
    "/images/img_fundo_home_1.png",
    "/images/img_fundo_home_3.png",
  ];

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (isHomePage) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [isHomePage, images.length]);

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
    { label: translations.navigation.home, path: "/" },
    {
      label: translations.navigation.about,
      path: "https://ellas.ufmt.br/pt/sobre-nos/o-projeto/",
    },
    { label: translations.navigation.openData, path: "/buscaone" },
    {
      label: translations.navigation.supportELLAS,
      path: "https://ellas.ufmt.br/pt/parceiros/",
    },
    { label: translations.navigation.contact, path: "https://ellas.ufmt.br/" },
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (!item.path) return;

    if (item.path.startsWith("http")) {
      handleExternalLink(item.path);
    } else {
      handleNavigation(item.path);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.append("category", selectedCategory);
    }

    if (searchQuery) {
      params.append("queryType", encodeURIComponent(searchQuery));
    }

    navigate(`/buscaone?${params.toString()}`);
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

                <SearchBox sx={{ mt: 8 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flex: 1,
                      px: 2,
                      alignItems: "center",
                      width: "100%",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 2, sm: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <IconButton size="medium" sx={{ color: "#4A2B4E", p: 1 }}>
                        <CategoryIcon sx={{ fontSize: 22 }} />
                      </IconButton>
                      <CategorySelect>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value="">
                            {translations.common?.chooseCategory ||
                              "Escolha uma Categoria"}
                          </option>
                          <option value="initiatives">
                            {translations.categories?.initiatives ||
                              "Iniciativas"}
                          </option>
                          <option value="policies">
                            {translations.categories?.policies || "Políticas"}
                          </option>
                          <option value="factors">
                            {translations.categories?.factors || "Fatores"}
                          </option>
                        </select>
                      </CategorySelect>
                    </Box>
                    <Box
                      sx={{
                        borderLeft: {
                          xs: "none",
                          sm: "1px solid rgba(0,0,0,0.1)",
                        },
                        borderTop: {
                          xs: "1px solid rgba(0,0,0,0.1)",
                          sm: "none",
                        },
                        pl: { xs: 0, sm: 2 },
                        pt: { xs: 2, sm: 0 },
                        display: "flex",
                        alignItems: "center",
                        flex: 1.5,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <IconButton size="medium" sx={{ color: "#4A2B4E", p: 1 }}>
                        <SearchIcon sx={{ fontSize: 22 }} />
                      </IconButton>
                      <SearchInput
                        placeholder={
                          translations.common?.searchPlaceholder || "Procurar"
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                      />
                    </Box>
                  </Box>
                  <SearchButton
                    variant="contained"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
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
