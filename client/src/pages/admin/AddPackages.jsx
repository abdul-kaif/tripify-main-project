import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddPackages = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageImages: [],
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
  };

  const handleFile = (e) => {
    const files = e.target.files;
    setFormData((prevData) => ({
      ...prevData,
      packageImages: Array.from(files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.packageImages.length === 0) {
      toast.error(t("admin.addPackages.errors.noImage"));
      return;
    }

    if (
      formData.packageName === "" ||
      formData.packageDescription === "" ||
      formData.packageDestination === "" ||
      formData.packageAccommodation === "" ||
      formData.packageTransportation === "" ||
      formData.packageMeals === "" ||
      formData.packageActivities === "" ||
      formData.packagePrice === 0
    ) {
      toast.error(t("admin.addPackages.errors.allRequired"));
      return;
    }

    if (formData.packagePrice < 500) {
      toast.error(t("admin.addPackages.errors.priceMin"));
      return;
    }

    if (formData.packageOffer) {
      const discount = Number(formData.packageDiscountPrice);
      const price = Number(formData.packagePrice);

      if (!discount) {
        toast.error(t("admin.addPackages.errors.discountRequired"));
        return;
      }

      if (discount >= price) {
        toast.error(t("admin.addPackages.errors.discountLess"));
        return;
      }
    }

    const data = new FormData();
    data.append("packageName", formData.packageName);
    data.append("packageDescription", formData.packageDescription);
    data.append("packageDestination", formData.packageDestination);
    data.append("packageDays", formData.packageDays);
    data.append("packageNights", formData.packageNights);
    data.append("packageAccommodation", formData.packageAccommodation);
    data.append("packageTransportation", formData.packageTransportation);
    data.append("packageMeals", formData.packageMeals);
    data.append("packageActivities", formData.packageActivities);
    data.append("packagePrice", formData.packagePrice);
    data.append("packageDiscountPrice", formData.packageDiscountPrice);
    data.append("packageOffer", formData.packageOffer);

    if (Array.isArray(formData.packageImages)) {
      formData.packageImages.forEach((image) => {
        data.append("packageImages", image);
      });
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/package/create-package`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
        console.log('res',res);

      if (!res.data.success) {
        setError(res.data.message);
        setLoading(false);
        return;
      }

      toast.success(
        res.data.message || t("admin.addPackages.success.created")
      );

      setLoading(false);
      setError(false);
      navigate(`/package/${res.data.package._id}`);
    } catch (err) {
      setLoading(false);
      setError(t("admin.addPackages.errors.somethingWrong"));
    }
  };

  return (
    <div className="mt-6 w-full min-h-screen flex items-center justify-center bg-[#EB662B] text-white rounded-lg">
      <div className="w-[95%] md:w-[90%] lg:w-[80%] mx-auto flex flex-col gap-6 rounded-xl shadow-xl py-8">
        
        <h1 className="text-center text-lg font-semibold md:text-3xl md:font-bold">
          {t("admin.addPackages.heading")}
        </h1>

        <div className="flex flex-col md:flex-row gap-5 items-center justify-center px-4">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

            <div className="flex flex-col">
              <label>{t("admin.addPackages.fields.name")}</label>
              <input id="packageName" value={formData.packageName} onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none" />
            </div>

            <div className="flex flex-col">
              <label>{t("admin.addPackages.fields.description")}</label>
              <textarea id="packageDescription" value={formData.packageDescription} onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none resize-none" />
            </div>

            <div className="flex flex-col">
              <label>{t("admin.addPackages.fields.destination")}</label>
              <input id="packageDestination" value={formData.packageDestination} onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none" />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col w-full">
                <label>{t("admin.addPackages.fields.days")}</label>
                <input id="packageDays" type="number" value={formData.packageDays} onChange={handleChange}
                  className="p-2 border rounded bg-gray-200 text-gray-800 outline-none" />
              </div>
              <div className="flex flex-col w-full">
                <label>{t("admin.addPackages.fields.nights")}</label>
                <input id="packageNights" type="number" value={formData.packageNights} onChange={handleChange}
                  className="p-2 border rounded bg-gray-200 text-gray-800 outline-none" />
              </div>
            </div>

            <div className="flex flex-col">
              <label>{t("admin.addPackages.fields.accommodation")}</label>
              <textarea id="packageAccommodation" value={formData.packageAccommodation} onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none resize-none" />
            </div>

            <div className="flex flex-col">
              <label>{t("admin.addPackages.fields.transportation")}</label>
              <select id="packageTransportation" onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none">
                <option>{t("admin.addPackages.options.select")}</option>
                <option>{t("admin.addPackages.options.flight")}</option>
                <option>{t("admin.addPackages.options.train")}</option>
                <option>{t("admin.addPackages.options.boat")}</option>
                <option>{t("admin.addPackages.options.other")}</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label>{t("admin.addPackages.fields.meals")}</label>
              <textarea id="packageMeals" value={formData.packageMeals} onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none resize-none" />
            </div>

            <div className="flex flex-col">
              <label>{t("admin.addPackages.fields.activities")}</label>
              <textarea id="packageActivities" value={formData.packageActivities} onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none resize-none" />
            </div>

            <div className="flex flex-col">
              <label>{t("admin.addPackages.fields.price")}</label>
              <input id="packagePrice" type="number" value={formData.packagePrice} onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none" />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="packageOffer">{t("admin.addPackages.fields.offer")}</label>
              <input id="packageOffer" type="checkbox" checked={formData.packageOffer} onChange={handleChange}
                className="w-4 h-4" />
            </div>

            {formData.packageOffer && (
              <div className="flex flex-col">
                <label>{t("admin.addPackages.fields.discountPrice")}</label>
                <input id="packageDiscountPrice" type="number" value={formData.packageDiscountPrice} onChange={handleChange}
                  className="p-2 border rounded bg-gray-200 text-gray-800 outline-none" />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">{t("admin.addPackages.fields.uploadImages")}</label>
              <div className="relative flex items-center justify-center w-full cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition">
                <input type="file" multiple accept="image/*" onChange={handleFile}
                  className="absolute inset-0 opacity-0 cursor-pointer" />
                <span className="text-gray-500">{t("admin.addPackages.actions.selectImages")}</span>
              </div>

              {formData.packageImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {formData.packageImages.map((file, index) => {
                    const imageUrl = URL.createObjectURL(file);
                    return (
                      <div key={index} className="relative w-full aspect-square border border-gray-300 rounded overflow-hidden">
                        <img src={imageUrl} className="object-cover w-full h-full" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button type="submit" disabled={uploading || loading}
              className="text-white p-3 rounded bg-black hover:opacity-95 disabled:opacity-70 mt-2">
              {uploading
                ? t("admin.addPackages.actions.uploading")
                : loading
                ? t("admin.addPackages.actions.loading")
                : t("admin.addPackages.actions.create")}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPackages;
