import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const location = useLocation();
  const activeLink = location.pathname;

  const { i18n, t } = useTranslation();

  const linkClass = (path) =>
    `hover:underline hover:scale-105 transition-all duration-150 whitespace-nowrap 
     ${activeLink === path ? "underline text-orange-500" : ""}`;

  const langButtonStyle =
    "px-3 py-1 rounded-md border text-sm cursor-pointer hover:bg-gray-100";

  const handleLangChange = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-50">
      <div className="bg-white max-w-7xl mx-auto p-4 text-gray-800">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex-1">
            <Link to={`/`}>
              <h1 className="text-4xl font-bold text-[#EB662B]">{t("Tripify")}</h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex justify-center flex-1">
            <ul className="flex items-center gap-x-8 text-lg whitespace-nowrap">
              <li className={linkClass("/")}>
                <Link to="/">{t("Home")}</Link>
              </li>
              <li className={linkClass("/search")}>
                <Link to="/search">{t("Bookings")}</Link>
              </li>
              <li className={linkClass("/about")}>
                <Link to="/about">{t("About")}</Link>
              </li>
              <li className={linkClass("/contact")}>
                <Link to="/contact">{t("Contact")}</Link>
              </li>
              <li className={linkClass("/blog")}>
                <Link to="/blog">{t("Blog")}</Link>
              </li>

              {/* Language Dropdown */}
              {/* Language Dropdown (no 'Lang' text) */}
              <div className="relative">
                <button
                  className="px-3 py-1 text-sm bg-white border rounded-md shadow-sm hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => setLangOpen(!langOpen)}
                >
                  {i18n.language === "en"
                    ? "EN"
                    : i18n.language === "hi"
                      ? "HI"
                      : i18n.language === "ne"
                        ? "NE"
                        : i18n.language === "doi"
                          ? "DOI"
                          : i18n.language === "ta"
                            ? "TA"
                            : "EN"}
                  <span>▼</span>
                </button>

                {langOpen && (
                  <div className="absolute right-0 bg-white shadow-lg rounded-md mt-2 p-1 w-32 z-50 border">
                    <button
                      className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      onClick={() => handleLangChange("en")}
                    >
                      English
                    </button>

                    <button
                      className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      onClick={() => handleLangChange("hi")}
                    >
                      हिन्दी
                    </button>

                    <button
                      className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      onClick={() => handleLangChange("doi")}
                    >
                      Dogri
                    </button>

                    <button
                      className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      onClick={() => handleLangChange("ne")}
                    >
                      Nepali
                    </button>

                    <button
                      className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      onClick={() => handleLangChange("ta")}
                    >
                      Tamil
                    </button>
                    <button
                      className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      onClick={() => handleLangChange("sp")}
                    >
                      Spanish
                    </button>
                  </div>
                )}
              </div>


            </ul>
          </div>

          {/* Profile/Login */}
          <div className="flex-1 flex justify-end items-center">
            {currentUser ? (
              <Link to={`/profile/${currentUser.user_role === 1 ? "admin" : "user"}`}>
                <img
                  src={`${currentUser?.avatar}` || defaultProfileImg}
                  alt="avatar"
                  className="border w-10 h-10 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link className="bg-orange-500 text-white px-8 py-2 rounded-full" to="/login">
                {t("Login")}
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="text-3xl ml-4 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="flex flex-col gap-4 mt-4 text-lg md:hidden">
            <li className={linkClass("/")}>
              <Link to="/">{t("Home")}</Link>
            </li>
            <li className={linkClass("/search")}>
              <Link to="/search">{t("Bookings")}</Link>
            </li>
            <li className={linkClass("/about")}>
              <Link to="/about">{t("About")}</Link>
            </li>
            <li className={linkClass("/contact")}>
              <Link to="/contact">{t("Contact")}</Link>
            </li>
            <li className={linkClass("/blog")}>
              <Link to="/blog">{t("Blog")}</Link>
            </li>

            {/* Mobile Language selector */}
            <div className="flex gap-2 mt-4">
              <button className={langButtonStyle} onClick={() => handleLangChange("en")}>English</button>
              <button className={langButtonStyle} onClick={() => handleLangChange("hi")}>हिन्दी</button>
            </div>
          </ul>
        )}

        <hr className="border border-orange-500 mt-2" />
      </div>
    </div>
  );
};

export default Header;
