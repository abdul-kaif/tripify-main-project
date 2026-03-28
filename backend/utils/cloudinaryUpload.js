import fs from "fs";
import path from "path";

const uploadToCloudinary = async (fileBuffer) => {
  try {
    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const fileName = Date.now() + ".jpg";
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, fileBuffer);

    return {
      secure_url: `http://localhost:8000/uploads/${fileName}`,
      public_id: fileName
    };

  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export default uploadToCloudinary;