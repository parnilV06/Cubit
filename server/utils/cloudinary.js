const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadImage = async (fileBuffer, folder, options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                ...options
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

module.exports = {
    uploadImage
};
