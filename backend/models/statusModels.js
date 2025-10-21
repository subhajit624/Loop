import mongoose from "mongoose";

const statusModels = new mongoose.Schema({

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String
    },
    media: {
        url: { type: String},
        type: {
          type: String,
          enum: ["image", "video"],
          default: "image"
        },
      },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // expires in 24 hours
      index: { expires: "0s" }, // TTL index: auto delete after expiresAt
    },
  },
  { timestamps: true }
);

export const Status = mongoose.model("Status", statusModels);
