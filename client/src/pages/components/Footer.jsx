import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className=" max-w-7xl w-full mx-auto text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{t("Tripify")}</h2>
          <p className="text-sm">
            {t("Footer_Tag_Line")}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("Footer_Quick_Links")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                {t("Home")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("Packages")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("About")}


              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("Contact")}

              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("Footer_Contact_Us")}</h3>
          <p className="text-sm">{t("Footer_Email")}: support@tripify.com</p>
          <p className="text-sm"> {t("Footer_Phone")}</p>
          <p className="text-sm">  {t("Footer_Location")}</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4"> {t("Footer_Follow_Us")}</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-gray-300">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm border-t border-white/30 pt-4">
        © {new Date().getFullYear()} {t("Tripify")}. {t("Footer_Rights_Reserved")}.
      </div>
    </footer>
  );
};

export default Footer;
