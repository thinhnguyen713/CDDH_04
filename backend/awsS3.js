const AWS = require("aws-sdk");
const multer = require("multer");
const path = require("path");


const soundwavevs = "soundwavecloud";

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
 

// tải lên một tệp công khai
const singlePublicFileUpload = async (file) => {
  const { originalname, buffer } = await file;
  // Đặt tên tệp bằng timestamp + phần mở rộng của tệp
  const Key = new Date().getTime().toString() + path.extname(originalname);

  const uploadParams = {
    Bucket: soundwavevs, 
    Key, 
    Body: buffer, 
    ACL: "public-read", 
  };

  const result = await s3.upload(uploadParams).promise();
  return result.Location; // urlurl của tệp trên S3
};

//  tải lên nhiều tệp công khai
const multiplePublicFileUpload = async (files) => {
  return await Promise.all(files.map((file) => singlePublicFileUpload(file)));
};

// tải lên một tệp riêng tư
const singlePrivateFileUpload = async (file) => {
  const { originalname, buffer } = await file;
  const Key = new Date().getTime().toString() + path.extname(originalname);

  const uploadParams = {
    Bucket: soundwavevs,
    Key,
    Body: buffer,
  };

  const result = await s3.upload(uploadParams).promise();
  return result.Key;
};

// tải lên nhiều tệp riêng tư
const multiplePrivateFileUpload = async (files) => {
  return await Promise.all(files.map((file) => singlePrivateFileUpload(file)));
};

//  tạo URL có chữ ký để tải tệp riêng tư
const retrievePrivateFile = (key) => {
  let fileUrl;
  if (key) {
    fileUrl = s3.getSignedUrl("getObject", {
      Bucket: soundwavevs,
      Key: key,
    });
  }
  return fileUrl || key;
};

//  Cấu hình Multer

// lưu trữ file 
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, ""); 
  },
});

// Middleware xử lý tải lên một tệp
const singleMulterUpload = (nameOfKey) =>
  multer({ storage: storage }).single(nameOfKey);

// Middleware xử lý tải lên nhiều tệp
const multipleMulterUpload = (nameOfKey) =>
  multer({ storage: storage }).array(nameOfKey);

//  xuất các hàm để sử dụng 

module.exports = {
  s3,
  singlePublicFileUpload, // 1 tệp public 
  multiplePublicFileUpload, // nhiều tệp public 
  singlePrivateFileUpload, //1 tệp private  ->key
  multiplePrivateFileUpload, //nhiều tệp private 
  retrievePrivateFile, //tạo signed truy cập file private 
  singleMulterUpload, 
  multipleMulterUpload, 
};
