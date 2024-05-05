const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const slugify = require("slugify");

const policySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    content: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// khi lưu tạo slug
policySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, locale: "vi" });
    this.link = `${process.env.BACKEND}/${this.slug}`;
  }
  next();
});

policySchema.pre("findOneAndUpdate", function (next) {
  if (this._update.name) {
    const update = this.getUpdate();
    update.slug = slugify(update.name, { lower: true, locale: "vi" });
    update.link = `${process.env.BACKEND}/${update.slug}`;
  }
  next();
});

const Policy = model("policy", policySchema);

module.exports = Policy;
