import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No se recibió ninguna imagen",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "fulldrinks/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            status: "error",
            message: "No se pudo subir la imagen",
          });
        }

        res.json({
          status: "success",
          payload: {
            url: result.secure_url,
            publicId: result.public_id,
          },
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
