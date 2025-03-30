import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import "./styles.css";

const Footer = () => {
  const { translations } = useLanguage();

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
            <div className="footer-column left-column">
              <h3 className="footer-title">{translations.footer.contacts}</h3>
              <div className="footer-links">
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

              <h3 className="footer-title connect-title">
                {translations.footer.connect}
              </h3>
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/ellas.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <img
                    src="/images/RS/img_facebook.svg"
                    alt="Facebook"
                    className="social-icon-img"
                  />
                </a>
                <a
                  href="https://www.instagram.com/ellas.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <img
                    src="/images/RS/img_instagram.svg"
                    alt="Instagram"
                    className="social-icon-img"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/ellasnetwork/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <img
                    src="/images/RS/img_linkedin.svg"
                    alt="LinkedIn"
                    className="social-icon-img"
                  />
                </a>
                <a
                  href="mailto:ellas.latinamerica@gmail.com"
                  className="social-circle"
                  aria-label="Email"
                  title="Email"
                >
                  <img
                    src="/images/RS/img_email.svg"
                    alt="Email"
                    className="social-icon-img"
                  />
                </a>
                <a
                  href="https://ellas.ufmt.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle"
                  aria-label="Website"
                  title="Website"
                >
                  <img
                    src="/images/RS/img_globe.svg"
                    alt="Website"
                    className="social-icon-img"
                  />
                </a>
              </div>
            </div>

            {/* Center Column */}
            <div className="footer-column center-column">
              <h3 className="footer-title">{translations.partners}</h3>
              <div className="partner-logo-main">
                <a
                  href="https://www.idrc.ca/en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/img_idrc_logo_branca.png"
                    alt="IDRC"
                    className="idrc-logo"
                  />
                </a>
              </div>

              <h3 className="footer-title institutions-title">
                {translations.institutions}
              </h3>
              <div className="institutions-row">
                <a
                  href="https://www.ufmt.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="institution-link"
                  title="UFMT"
                >
                  <img
                    src="/images/UNIVERSIDADES/UFMT.svg"
                    alt="UFMT"
                    className="institution-logo"
                  />
                </a>
                <a
                  href="https://www.utfpr.edu.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="institution-link"
                  title="UTFPR"
                >
                  <img
                    src="/images/UNIVERSIDADES/UFPR.svg"
                    alt="UTFPR"
                    className="institution-logo"
                  />
                </a>
                <a
                  href="https://www.ufsc.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="institution-link"
                  title="UFSC"
                >
                  <img
                    src="/images/UNIVERSIDADES/UFSC.svg"
                    alt="UFSC"
                    className="institution-logo"
                  />
                </a>
                <a
                  href="https://www.uff.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="institution-link"
                  title="UFF"
                >
                  <img
                    src="/images/UNIVERSIDADES/UFF.svg"
                    alt="UFF"
                    className="institution-logo"
                  />
                </a>
                <a
                  href="https://www.ulima.edu.pe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="institution-link"
                  title="Universidad de Lima"
                >
                  <img
                    src="/images/UNIVERSIDADES/UL.svg"
                    alt="Universidad de Lima"
                    className="institution-logo"
                  />
                </a>
                <a
                  href="https://www.umsa.bo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="institution-link"
                  title="Universidad Mayor de San Andrés"
                >
                  <img
                    src="/images/UNIVERSIDADES/UMPDA.svg"
                    alt="Universidad Mayor de San Andrés"
                    className="institution-logo"
                  />
                </a>
                <a
                  href="https://www.ucb.edu.bo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="institution-link"
                  title="Universidad Católica Boliviana"
                >
                  <img
                    src="/images/UNIVERSIDADES/UCB.svg"
                    alt="Universidad Católica Boliviana"
                    className="institution-logo"
                  />
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div className="footer-column right-column">
              <h3 className="footer-title">
                {translations.footer.usefulLinks}
              </h3>
              <div className="footer-links">
                <Link to="/accessibility" className="footer-link">
                  {translations.footer.accessibility}
                </Link>
                <Link to="/terms" className="footer-link">
                  {translations.footer.terms}
                </Link>
                <Link to="/privacy" className="footer-link">
                  {translations.footer.privacy}
                </Link>
              </div>

              <div className="copyright-container">
                <p className="copyright-text">{translations.footer.rights}</p>
                <p className="copyright-text">© 2024 ELLAS</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
