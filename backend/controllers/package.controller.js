import Package from "../models/package.model.js";
import braintree from "braintree";
import dotenv from "dotenv";
import Booking from "../models/booking.model.js";
dotenv.config();
import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

//helper function for extracting publicId 
const extractPublicId = (url) => {
  const parts = url.split("/upload/")[1];
  const withoutVersion = parts.replace(/^v\d+\//, "");
  return withoutVersion.substring(0, withoutVersion.lastIndexOf("."));
};

//create package
export const createPackage = async (req, res) => {
  try {
    const {
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
    } = req.body;


    if (!req.files || req.files.length === 0) {
      return res.status(400).send({
        success: false,
        message: "At least one image is required",
      });
    }

    const imageFiles = req.files.map((file) => uploadToCloudinary(file.buffer, "Tripify"));
    const results = await Promise.all(imageFiles);
    const imageFilenames = results.map((result) => result.secure_url);

    const price = Number(packagePrice);
    const discount = Number(packageDiscountPrice);
    const days = Number(packageDays);
    const nights = Number(packageNights);
    const offer = packageOffer === "true"; // because booleans also come as strings


    if (
      !packageName ||
      !packageDescription ||
      !packageDestination ||
      !packageAccommodation ||
      !packageTransportation ||
      !packageMeals ||
      !packageActivities ||
      !packageOffer
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required!",
      });
    }

    if (price < discount) {
      return res.status(400).send({
        success: false,
        message: "Regular price should be greater than discount price!",
      });
    }
    if (price <= 0 || discount < 0) {
      return res.status(400).send({
        success: false,
        message: "Price should be greater than 0!",
      });
    }
    if (days <= 0 && nights <= 0) {
      return res.status(400).send({
        success: false,
        message: "Provide days and nights!",
      });
    }

    const newPackage = await Package.create({
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
      packageImages: imageFilenames,
    });
    if (newPackage) {
      return res.status(201).send({
        success: true,
        message: "Package created successfully",
        package: newPackage, // send back the created data
      });
    }
    else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
};



//get all packages
export const getPackages = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const packages = await Package.find({
      $or: [
        { packageName: { $regex: searchTerm, $options: "i" } },
        { packageDestination: { $regex: searchTerm, $options: "i" } },
      ],
      packageOffer: offer,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    if (packages) {
      return res.status(200).send({
        success: true,
        packages,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "No Packages yet",
      });
    }
  } catch (error) {
    console.log(error);
  }
};


//get package data
export const getPackageData = async (req, res) => {
  try {
    const packageData = await Package.findById(req?.params?.id);
    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found!",
      });
    }
    return res.status(200).send({
      success: true,
      packageData,
    });
  } catch (error) {
    console.log(error);
  }
};

//update package
// export const updatePackage = async (req, res) => {
//   try {
//     const findPackage = await Package.findById(req.params.id);
//     if (!findPackage)
//       return res.status(404).send({
//         success: false,
//         message: "Package not found!",
//       });
//     const image_filename = `${req.file.filename}`;
//     const updatedPackage = await Package.findByIdAndUpdate(
//       req.params.id,
//       req.body,

//       { new: true }
//     );
//     res.status(200).send({
//       success: true,
//       message: "Package updated successfully!",
//       updatedPackage,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };


export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
    } = req.body;

    const packageToUpdate = await Package.findById(id);

    if (!packageToUpdate) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    /* ---------- Upload new images if provided ---------- */
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, "Tripify")
      );

      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((img) => img.secure_url);

      // replace old images with new ones
      packageToUpdate.packageImages = imageUrls;
    }

    /* ---------- Update fields safely ---------- */
    packageToUpdate.packageName =
      packageName ?? packageToUpdate.packageName;
    packageToUpdate.packageDescription =
      packageDescription ?? packageToUpdate.packageDescription;
    packageToUpdate.packageDestination =
      packageDestination ?? packageToUpdate.packageDestination;
    packageToUpdate.packageDays =
      packageDays ?? packageToUpdate.packageDays;
    packageToUpdate.packageNights =
      packageNights ?? packageToUpdate.packageNights;
    packageToUpdate.packageAccommodation =
      packageAccommodation ?? packageToUpdate.packageAccommodation;
    packageToUpdate.packageTransportation =
      packageTransportation ?? packageToUpdate.packageTransportation;
    packageToUpdate.packageMeals =
      packageMeals ?? packageToUpdate.packageMeals;
    packageToUpdate.packageActivities =
      packageActivities ?? packageToUpdate.packageActivities;
    packageToUpdate.packagePrice =
      packagePrice ?? packageToUpdate.packagePrice;
    packageToUpdate.packageDiscountPrice =
      packageDiscountPrice ?? packageToUpdate.packageDiscountPrice;
    packageToUpdate.packageOffer =
      packageOffer ?? packageToUpdate.packageOffer;

    await packageToUpdate.save();

    res.status(200).send({
      success: true,
      message: "Package updated successfully",
      package: packageToUpdate,
    });
  } catch (error) {
    console.log("Update error:", error);
    res.status(500).send({
      success: false,
      message: "Error updating package",
    });
  }
};


// delete package
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    // 🧹 Delete local images from uploads folder
    if (pkg.packageImages && pkg.packageImages.length > 0) {
      for (const imageUrl of pkg.packageImages) {
        try {
          const fileName = imageUrl.split("/uploads/")[1];
          if (fileName) {
            const filePath = `uploads/${fileName}`;
            const fs = await import("fs");

            if (fs.default.existsSync(filePath)) {
              fs.default.unlinkSync(filePath);
            }
          }
        } catch (err) {
          console.log("Image delete skipped:", err.message);
        }
      }
    }

    // 🗑️ Delete package from database
    await Package.findByIdAndDelete(req.params.id);

    return res.status(200).send({
      success: true,
      message: "Package deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting package",
    });
  }
};
//payment gateway api
//token
// export const braintreeTokenController = async (req, res) => {
//   try {
//     gateway.clientToken.generate({}, function (err, response) {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(response);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
