import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SingleCard from "./components/SingleCard";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../services/api";

const Search = () => {
  const { t } = useTranslation(); // <-- Added i18n

  const navigate = useNavigate();
  const [sideBarSearchData, setSideBarSearchData] = useState({
    searchTerm: "",
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (searchTermFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSideBarSearchData({
        searchTerm: searchTermFromUrl || "",
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchAllPackages = async () => {
      setLoading(true);
      setShowMoreBtn(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await apiFetch(`/api/package/get-packages?${searchQuery}`);
        const data = await res.json();
        setLoading(false);
        setAllPackages(data?.packages);

        if (data?.packages?.length > 8) {
          setShowMoreBtn(true);
        } else {
          setShowMoreBtn(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPackages();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBarSearchData({
        ...sideBarSearchData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "offer") {
      setSideBarSearchData({
        ...sideBarSearchData,
        [e.target.id]: e.target.checked ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarSearchData({ ...sideBarSearchData, sort, order });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarSearchData.searchTerm);
    urlParams.set("offer", sideBarSearchData.offer);
    urlParams.set("sort", sideBarSearchData.sort);
    urlParams.set("order", sideBarSearchData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreSClick = async () => {
    const numberOfPackages = allPackages.length;
    const startIndex = numberOfPackages;

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);

    const searchQuery = urlParams.toString();
    const res = await apiFetch(`/api/package/get-packages?${searchQuery}`);
    const data = await res.json();

    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }

    setAllPackages([...allPackages, ...data?.packages]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* ---------------- Sidebar ---------------- */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Search */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              {t("search.search")}:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder={t("search.search-placeholder")}
              className="border rounded-lg p-3 w-full"
              value={sideBarSearchData.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Offer */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">{t("search.type")}:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sideBarSearchData.offer}
                onChange={handleChange}
              />
              <span>{t("search.offer")}</span>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">{t("search.sort")}:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="p-3 border rounded-lg"
            >
              <option value="packagePrice_desc">
                {t("search.high-to-low")}
              </option>
              <option value="packagePrice_asc">
                {t("search.low-to-high")}
              </option>
              <option value="packageRating_desc">
                {t("search.top-rated")}
              </option>
              <option value="packageTotalRatings_desc">
                {t("search.most-rated")}
              </option>
              <option value="createdAt_desc">{t("search.latest")}</option>
              <option value="createdAt_asc">{t("search.oldest")}</option>
            </select>
          </div>

          <button className="bg-[#EB662B] rounded-lg text-white p-3 uppercase hover:opacity-95">
            {t("search.search-btn")}
          </button>
        </form>
      </div>

      {/* ---------------- Main Content ---------------- */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold border-b p-3 text-slate-700 mt-5">
          {t("search.package-results")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-1">
          {!loading && allPackages.length === 0 && (
            <p className="text-xl text-slate-700">
              {t("search.no-packages")}
            </p>
          )}

          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              {t("search.loading")}
            </p>
          )}

          {!loading &&
            allPackages &&
            allPackages.map((packageData, i) => (
              <SingleCard key={i} packageData={packageData} />
            ))}
        </div>

        {showMoreBtn && (
          <button
            onClick={onShowMoreSClick}
            className="text-sm bg-green-700 text-white hover:underline p-2 m-3 rounded text-center w-max"
          >
            {t("search.show-more")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
