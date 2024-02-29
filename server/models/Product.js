const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const slugify = require("slugify");

const productSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Tên sản phẩm không được bỏ trống"],
      maxLength: [50, "Tên sản phẩm không được quá 50 kí tự"],
      unique: [true, "Tên sản phẩm không được trùng"],
    },

    price: {
      type: Number,
      // require: [true, "Giá sản phẩm không được bỏ trống"],
      default: 0,
      min: [0, "Giá sản phẩm không được âm"],
    },

    discount: {
      type: Number,
      // require: [true, "Phần trăm giảm giá sản phẩm không được bỏ trống"],
      default: 0,
      min: [0, "Phần trăm giảm giá sản phẩm không được âm"],
      max: [75, "Phần trăm giảm giá sản phẩm không được nhỏ hơn 75%"],
    },

    stock: {
      type: Number,
      // require: [true, "Số lượng sản phẩm không được bỏ trống"],
      default: 0,
      min: [0, "Số lượng sản phẩm không được âm"],
    },

    age: {
      type: Number,
      // require: [true, "Số lượng sản phẩm không được bỏ trống"],
      default: 0,
      min: [0, "Độ tuổi sản phẩm không được âm"],
    },

    description: {
      type: String,
      // require: [true, "Mô tả sản phẩm không được bỏ trống"],
      maxLength: [3000, "Mô tả sản phẩm không được quá 3000 kí tự"],
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },

    brandId: {
      type: Schema.Types.ObjectId,
      ref: "brand",
      required: true,
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "supplier",
      // required: true,
    },

    tagList: [
      {
        type: Schema.Types.ObjectId,
        ref: "tag",
      },
    ],

    slug: {
      type: String,
    },

    pic: {
      type: String,
      default:
        "http://res.cloudinary.com/drqphlfn6/image/upload/v1708647316/ws1meb2jitqwlqcwara3.jpg",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.virtual("category", {
  ref: "category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

productSchema.virtual("supplier", {
  ref: "supplier",
  localField: "supplierId",
  foreignField: "_id",
  justOne: true,
});

productSchema.virtual("tag", {
  ref: "tag",
  localField: "tagTd",
  foreignField: "_id",
  justOne: true,
});

productSchema.virtual("total").get(function () {
  return this.price * ((100 - this.discount) / 100);
});

productSchema.pre("save", function (next) {
  console.log("««««« this.name »»»»»", this.name);
  // Chỉ chuyển đổi name thành slug nếu name đã thay đổi
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// Pre-findOneAndUpdate hook
productSchema.pre("findOneAndUpdate", function (next) {
  if (this._update.name) {
    const update = this.getUpdate();
    update.slug = slugify(update.name, { lower: true });
  }
  // Chuyển đổi name thành slug bất kể name có được thay đổi hay không
  next();
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });
//
productSchema.plugin(mongooseLeanVirtuals);

const Product = model("product", productSchema);
module.exports = Product;
