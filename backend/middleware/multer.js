// import multer from 'multere';

// const storage=multer.diskStorage({
//   filename:function(req,file,callback){
//     callback(null,file,originalname)
//   }
// })

// const upload=multer({storage})

// export default upload

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ✅ Folder should already exist
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

export default upload;
