import { useNavigate } from "react-router-dom";
import about from "../assets/images/about.jpg";
import { useTranslation } from "react-i18next";

const About = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  return (
    <div>
      <section className="w-full bg-white py-12 px-4 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Left Image Section */}
          <div className="w-full md:w-1/2">
            <img
              src={about}
              alt="Travel adventure"
              className="w-full h-full rounded-lg shadow-md object-contain"
            />
          </div>

          {/* Right Text Section */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#EB662B] mb-4">
              {t("About")} {t("Tripify")}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {t("About_At")}<span className="font-semibold text-[#EB662B]">{t("Tripify")}</span> {t("About_Description")}
            </p>
            <p className="text-gray-700 mt-4">
               {t("About_Tag_Line")}
            </p>
            <button
              onClick={() => navigate("/search")}
              className="mt-12 px-6 py-3 bg-[#EB662B] text-white rounded-lg hover:opacity-90 transition-all duration-300"
            >
              {t("About_Explore_Tours")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default About;
