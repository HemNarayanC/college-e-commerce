// cloudinaryConfig.js
import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const userProfileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cozy-ecommerce/user-profiles',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
})

const vendorImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cozy-ecommerce/vendor-profiles',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
})

const vendorDocumentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cozy-ecommerce/vendor-documents',
    allowed_formats: ['pdf', 'doc', 'docx'],
  },
});

const productImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cozy-ecommerce/products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Document file filter
const documentFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(file.originalname.toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  }
  cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
};

// Image file filter (used for both product & profile images)
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(file.originalname.toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  }
  cb(new Error('Only JPEG, JPG, and PNG images are allowed!'));
};

// Upload handlers
const uploadProductImage = multer({
  storage: productImageStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: imageFileFilter,
});

const uploadVendorDocument = multer({
  storage: vendorDocumentStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: documentFileFilter,
});

const uploadUserProfile = multer({
  storage: userProfileStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: imageFileFilter,
});

const uploadVendorProfile = multer({
  storage: vendorImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter,
});

export {
  cloudinary,
  uploadProductImage,
  uploadVendorDocument,
  uploadUserProfile,
  uploadVendorProfile
};