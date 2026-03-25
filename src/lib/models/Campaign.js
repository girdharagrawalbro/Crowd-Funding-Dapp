import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2500,
    },
    goal: {
      type: Number,
      required: true,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    amountCollected: {
      type: Number,
      default: 0,
      min: 0,
    },
    donationCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    ownerWallet: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    ownerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    blockchainId: {
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    createTxHash: {
      type: String,
      default: null,
    },
    network: {
      type: String,
      default: process.env.NEXT_PUBLIC_NETWORK_MODE || "local",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
      index: true,
    },
    approval: {
      reviewedBy: { type: String, default: null },
      note: { type: String, default: null, maxlength: 500 },
      reviewedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

CampaignSchema.index({ ownerWallet: 1, status: 1, createdAt: -1 });

export default mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);
