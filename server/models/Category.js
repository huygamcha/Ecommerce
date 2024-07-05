const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const slugify = require("slugify");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục không được bỏ trống"],
      maxLength: [50, "Tên danh mục không được vượt quá 50 kí tự"],
      unique: [true, "Tên danh mục không được trùng"],
    },
    no: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    pic: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// khi lưu tạo slug
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, locale: "vi" });
    this.link = `${process.env.BACKEND}/${this.slug}`;
  }
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  if (this._update.name) {
    const update = this.getUpdate();
    update.slug = slugify(update.name, { lower: true, locale: "vi" });
    update.link = `${process.env.BACKEND}/${update.slug}`;
  }
  next();
});

const Category = model("category", categorySchema);
module.exports = Category;
