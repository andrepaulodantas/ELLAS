import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import "./styles.css";

const Footer = () => {
  const { translations } = useLanguage();

  const institutionLogos = [
    { src: "img_ufmt_oficial_branca.png", alt: "UFMT" },
    { src: "img_uftpr_branca.png", alt: "UTFPR" },
    { src: "img_logouff_vertica.png", alt: "UFF" },
    { src: "img_vertical_extens.png", alt: "Universidad Mayor de San Andrés" },
    {
      src: "img_200px_universid.png",
      alt: "Universidad Nacional de San Agustín",
    },
    { src: "img_blancopeq.png", alt: "Universidad Católica Boliviana" },
  ];

  return (
    <>
      {/* Barra colorida acima do footer */}
      <div className="color-bar">
        <div className="color-bar-segment"></div>
        <div className="color-bar-segment"></div>
        <div className="color-bar-segment"></div>
        <div className="color-bar-segment"></div>
        <div className="color-bar-segment"></div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Left Column */}
            <div>
              <h3 className="footer-title">{translations.footer.contacts}</h3>
              <div>
                <a href="https://ellas.ufmt.br" className="footer-link">
                  www.ellas.ufmt.br
                </a>
                <a
                  href="https://www.instagram.com/ellas.network/"
                  className="footer-link"
                >
                  @ellas.network
                </a>
                <a
                  href="mailto:ellas.latinamerica@gmail.com"
                  className="footer-link"
                >
                  ellas.latinamerica@gmail.com
                </a>
              </div>

              <h3 className="footer-title mt-6">
                {translations.footer.connect}
              </h3>
              <div className="social-icons">
                <a
                  href="https://www.instagram.com/ellas.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/img_instagram.svg"
                    alt="Instagram"
                    className="social-icon"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/ellasnetwork/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/img_linkedin.svg"
                    alt="LinkedIn"
                    className="social-icon"
                  />
                </a>
                <a
                  href="https://www.facebook.com/ellas.network"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/img_facebook.svg"
                    alt="Facebook"
                    className="social-icon"
                  />
                </a>
              </div>
            </div>

            {/* Center Column */}
            <div className="text-center">
              <h3 className="footer-title">{translations.partners}</h3>
              <div className="mb-8">
                <img
                  src="/images/img_idrc_logo_branca.png"
                  alt="IDRC"
                  className="h-16 w-auto mx-auto"
                />
              </div>

              <h3 className="footer-title">{translations.institutions}</h3>
              <div className="partner-logos-grid">
                {institutionLogos.map((logo, index) => (
                  <div key={index} className="partner-logo-container">
                    <img
                      src={`/images/${logo.src}`}
                      alt={logo.alt}
                      className="partner-logo"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="text-right md:text-right">
              <h3 className="footer-title">
                {translations.footer.usefulLinks}
              </h3>
              <div>
                <a href="/accessibility" className="footer-link">
                  {translations.footer.accessibility}
                </a>
                <a href="/terms" className="footer-link">
                  {translations.footer.terms}
                </a>
                <a href="/privacy" className="footer-link">
                  {translations.footer.privacy}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="copyright">
          © 2024 ELLAS - {translations.footer.rights}
        </div>
      </footer>
    </>
  );
};

export default Footer;
