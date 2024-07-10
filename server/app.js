var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

var app = express();
app.use(
  cors({
    origin: "*",
  })
);

// console.log(`${process.env.CONNECTION_STRING}${process.env.DB_NAME}`);
mongoose.connect(`${process.env.CONNECTION_STRING}${process.env.DB_NAME}`);

var categoryRouter = require("./routes/Category/router.js");
var supplierRouter = require("./routes/Supplier/router.js");
var employeeRouter = require("./routes/Employee/router.js");
var customerRouter = require("./routes/Customer/router.js");
var productRouter = require("./routes/Product/router.js");
var orderRouter = require("./routes/Order/router.js");
var cartRouter = require("./routes/Cart/router.js");
var footerRouter = require("./routes/Footer/router.js");
var tagRouter = require("./routes/Tag/router.js");
var brandRouter = require("./routes/Brand/router.js");
var bannerRouter = require("./routes/Banner/router.js");
var authRouter = require("./routes/auth/router.js");
var LocationRouter = require("./routes/Location/router.js");
var PolicyRouter = require("./routes/Policy/router.js");
const { admin } = require("./authentication/checkRole.js");
// var usersRouter = require("./routes/users");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/categories", categoryRouter);
app.use("/suppliers", supplierRouter);
app.use("/employees", employeeRouter);
app.use("/customers", customerRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/carts", cartRouter);
app.use("/footers", footerRouter);
app.use("/tags", tagRouter);
app.use("/brands", brandRouter);
app.use("/banners", bannerRouter);
app.use("/locations", LocationRouter);
app.use("/policies", PolicyRouter);
app.use("/", authRouter);

const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
});
app.post("/upload", upload.single("file"), async (req, res) => {
  const S3 = new S3Client({
    region: "auto",
    endpoint: process.env.ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  const fileKey = req.file.originalname;

  await S3.send(
    new PutObjectCommand({
      Body: req.file.buffer,
      Bucket: "min",
      Key: fileKey,
      ContentType: req.file.mimetype,
      ACL: "public-read", // Cho phép truy cập công khai
    })
  );
  // URL của tệp đã tải lên
  const fileUrl = `https://pub-50bb58cfabdd4b93abb4e154d0eada9e.r2.dev/${fileKey}`;
  res.send(`${fileUrl}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// sử dụng khi chạy pm2 ở server
// const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// })
module.exports = app;
