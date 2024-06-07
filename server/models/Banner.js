const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const bannerSchema = new Schema(
  {
    pic: {
      type: String,
    },
    link: {
      type: String,
    },
    subBanner: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bannerSchema.set("toJSON", { virtuals: true });
bannerSchema.set("toObject", { virtuals: true });
//
bannerSchema.plugin(mongooseLeanVirtuals);

const Banner = model("banner", bannerSchema);
module.exports = Banner;
