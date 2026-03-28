import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../services/api";

const UpdatePackage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getPackageData = async () => {
    try {
      const res = await apiFetch(`/api/package/get-package-data/${params?.id}`);
      const data = await res.json();

      if (data?.success) {
        setFormData({
          packageName: data.packageData.packageName,
          packageDescription: data.packageData.packageDescription,
          packageDestination: data.packageData.packageDestination,
          packageDays: data.packageData.packageDays,
          packageNights: data.packageData.packageNights,
          packageAccommodation: data.packageData.packageAccommodation,
          packageTransportation: data.packageData.packageTransportation,
          packageMeals: data.packageData.packageMeals,
          packageActivities: data.packageData.packageActivities,
          packagePrice: data.packageData.packagePrice,
          packageDiscountPrice: data.packageData.packageDiscountPrice,
          packageOffer: data.packageData.packageOffer,
          packageImages: data.packageData.packageImages,
        });
      } else {
        toast.error(t("admin.updatePackage.errors.somethingWrong"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) getPackageData();
  }, [params.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.packageImages.length === 0) {
      toast.error(t("admin.updatePackage.errors.noImage"));
      return;
    }

    if (
      !formData.packageName ||
      !formData.packageDescription ||
      !formData.packageDestination ||
      !formData.packageAccommodation ||
      !formData.packageTransportation ||
      !formData.packageMeals ||
      !formData.packageActivities ||
      formData.packagePrice === 0
    ) {
      toast.error(t("admin.updatePackage.errors.allRequired"));
      return;
    }

    if (formData.packagePrice < 500) {
      toast.error(t("admin.updatePackage.errors.priceMin"));
      return;
    }

    if (formData.packageOffer && formData.packageDiscountPrice >= formData.packagePrice) {
      toast.error(t("admin.updatePackage.errors.discountLess"));
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "packageImages") {
          form.append(key, value);
        }
      });

      formData.packageImages.forEach((img) => {
        form.append("packageImages", img);
      });

      const res = await apiFetch(`/api/package/update-package/${params?.id}`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data?.success === false) {
        setError(data?.message);
      } else {
        toast.success(t("admin.updatePackage.success.updated"));
        navigate(`/package/${params?.id}`);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(t("admin.updatePackage.errors.somethingWrong"));
    }
  };

  return (
    <>
      <div className="w-full flex flex-wrap justify-center gap-2 p-6">

        <form onSubmit={handleSubmit} className="w-full sm:w-[60%] space-y-4 shadow-md rounded-xl p-4 bg-white">

          <h1 className="text-center text-2xl font-semibold">
            {t("admin.updatePackage.heading")}
          </h1>

          <div>
            <label className="font-medium">{t("admin.updatePackage.fields.name")}</label>
            <input
              type="text"
              id="packageName"
              value={formData.packageName}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
            />
          </div>

          <div>
            <label className="font-medium">{t("admin.updatePackage.fields.description")}</label>
            <textarea
              id="packageDescription"
              value={formData.packageDescription}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
            />
          </div>

          <div>
            <label className="font-medium">{t("admin.updatePackage.fields.destination")}</label>
            <input
              type="text"
              id="packageDestination"
              value={formData.packageDestination}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="font-medium">{t("admin.updatePackage.fields.days")}</label>
              <input
                type="number"
                id="packageDays"
                value={formData.packageDays}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
              />
            </div>

            <div className="flex-1">
              <label className="font-medium">{t("admin.updatePackage.fields.nights")}</label>
              <input
                type="number"
                id="packageNights"
                value={formData.packageNights}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-medium">{t("admin.updatePackage.fields.accommodation")}</label>
            <textarea
              id="packageAccommodation"
              value={formData.packageAccommodation}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
            />
          </div>

          <div>
            <label className="font-medium">
              {t("admin.updatePackage.fields.transportation")} ({t("admin.updatePackage.selected")}: {formData.packageTransportation})
            </label>

            <select
              id="packageTransportation"
              value={formData.packageTransportation}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
            >
              <option value="">{t("admin.updatePackage.options.select")}</option>
              <option value="Flight">{t("admin.updatePackage.options.flight")}</option>
              <option value="Train">{t("admin.updatePackage.options.train")}</option>
              <option value="Boat">{t("admin.updatePackage.options.boat")}</option>
              <option value="Other">{t("admin.updatePackage.options.other")}</option>
            </select>
          </div>

          <div>
            <label className="font-medium">{t("admin.updatePackage.fields.meals")}</label>
            <textarea
              id="packageMeals"
              value={formData.packageMeals}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none resize-none"
            />
          </div>

          <div>
            <label className="font-medium">{t("admin.updatePackage.fields.activities")}</label>
            <textarea
              id="packageActivities"
              value={formData.packageActivities}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none resize-none"
            />
          </div>

          <div>
            <label className="font-medium">{t("admin.updatePackage.fields.price")}</label>
            <input
              type="number"
              id="packagePrice"
              value={formData.packagePrice}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium" htmlFor="packageOffer">
              {t("admin.updatePackage.fields.offer")}
            </label>
            <input
              type="checkbox"
              id="packageOffer"
              checked={formData.packageOffer}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>

          {formData.packageOffer && (
            <div>
              <label className="font-medium">{t("admin.updatePackage.fields.discountPrice")}</label>
              <input
                type="number"
                id="packageDiscountPrice"
                value={formData.packageDiscountPrice}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
              />
            </div>
          )}

          <button className="w-full bg-[#EB662B] text-white p-3 rounded-md hover:opacity-90 disabled:opacity-80">
            {loading ? t("admin.updatePackage.actions.loading") : t("admin.updatePackage.actions.update")}
          </button>

        </form>


        {/* Right side image preview */}
        <div className="w-full sm:w-[30%] space-y-4 shadow-md rounded-xl p-4 bg-white">
          {formData.packageImages.length > 0 && (
            <div className="space-y-2">
              {formData.packageImages.map((img, i) => (
                <div key={i} className="shadow-md rounded-md p-2 flex justify-between items-center">
                  <img
                    src={`${img}`}
                    alt=""
                    className="h-20 w-20 rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default UpdatePackage;
