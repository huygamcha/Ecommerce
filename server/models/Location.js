const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const LocationSchema = new Schema(
  {
    name: {
      type: String,
    },
    time: {
      type: String,
    },
    address: {
      type: String,
    },
    map: {
      type: String,
    },
    description: {
      type: String,
    },
    album: [
      {
        type: String,
      },
    ],
    iframe: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Location = model("location", LocationSchema);
module.exports = Location;
