import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'src/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);  
    }
})
// const multer = multer({ storage });

export {multer, storage};