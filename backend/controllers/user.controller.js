import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

//update user details
import cloudinary from "../config/cloudinary.js";

const extractPublicId = (url) => {
  if (!url || typeof url !== "string") return null;

  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return null;

  // everything after /upload/
  let publicPath = url.substring(uploadIndex + 8);

  // remove version (v1234567890/)
  publicPath = publicPath.replace(/^v\d+\//, "");

  // remove file extension
  const lastDot = publicPath.lastIndexOf(".");
  if (lastDot !== -1) {
    publicPath = publicPath.substring(0, lastDot);
  }

  return publicPath;
};


export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(401).send({
      success: false,
      message: "You can only update your own account. Please log in again.",
    });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const updatedFields = {
      username: req.body.username ?? user.username,
      email: req.body.email ?? user.email,
      address: req.body.address ?? user.address,
      phone: req.body.phone ?? user.phone,
    };

    /* ---------- Avatar update ---------- */
    if (req.file) {
      // 1️⃣ delete old avatar from Cloudinary
      if (user.avatar) {
        const publicId = extractPublicId(user.avatar);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }


      // 2️⃣ upload new avatar
      const result = await uploadToCloudinary(
        req.file.buffer,
        "Tripify"
      );

      // 3️⃣ save ONLY the URL
      updatedFields.avatar = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).send({
      success: true,
      message: "User details updated successfully",
      user: rest,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({
        success: false,
        message: "Email already taken",
      });
    }

    console.error(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong while updating the user",
    });
  }
};


// update user password
export const updateUserPassword = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).send({
        success: false,
        message:
          "You can only update your own account password please login again!",
      });
    }

    const validUser = await User.findById(req.params.id);

    if (!validUser) {
      return res.status(404).send({
        success: false,
        message: "User Not Found!",
      });
    }

    const oldPassword = req.body.oldpassword;
    const newPassword = req.body.newpassword;

    const validPassword = bcryptjs.compareSync(oldPassword, validUser.password);
    if (!validPassword) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    const updatedHashedPassword = bcryptjs.hashSync(newPassword, 10);
    const updatedPassword = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          password: updatedHashedPassword,
        },
      },
      { new: true }
    );

    return res.status(201).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

//delete user


export const deleteUserAccount = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(401).send({
      success: false,
      message: "You can only delete your own account!",
    });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // 🧹 Delete avatar from Cloudinary
    if (user.avatar) {
      const publicId = extractPublicId(user.avatar);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 🗑️ Delete user from DB
    await User.findByIdAndDelete(req.params.id);

    res.clearCookie("access_token");

    res.status(200).send({
      success: true,
      message: "User account and avatar deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting user account",
    });
  }
};


//get all users admin
export const getAllUsers = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const users = await User.find({
      user_role: 0,
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    });
    if (users && users.length > 0) {
      res.send(users);
    } else {
      res.status(200).send({
        success: false,
        message: "No Users Yet!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//delete user admin

export const deleteUserAccountAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // 🧹 Delete avatar from Cloudinary
    if (user.avatar) {
      const publicId = extractPublicId(user.avatar);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 🗑️ Delete user from DB
    await User.findByIdAndDelete(req.params.id);

    res.status(200).send({
      success: true,
      message: "User account and avatar deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting user account",
    });
  }
};