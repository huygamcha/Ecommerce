const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const brandSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Tên thương hiệu không được bỏ trống"],
    },
    name: {
      type: String,
      required: [true, "Tên thương hiệu không được bỏ trống"],
      maxLength: [50, "Tên thương hiệu không được vượt quá 50 kí tự"],
      unique: [true, "Tên thương hiệu không được trùng"],
    },
    pic: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

brandSchema.virtual("category", {
  ref: "category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

brandSchema.set("toJSON", { virtuals: true });
brandSchema.set("toObject", { virtuals: true });
//
brandSchema.plugin(mongooseLeanVirtuals);

const Brand = model("brand", brandSchema);
module.exports = Brand;
