import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },
    campaignBlockchainId: {
      type: String,
      required: true,
      index: true,
    },
    donorWallet: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    amountEth: {
      type: Number,
      required: true,
      min: 0,
    },
    txHash: {
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    network: {
      type: String,
      default: process.env.NEXT_PUBLIC_NETWORK_MODE || "local",
    },
    status: {
      type: String,
      enum: ["confirmed", "pending", "failed"],
      default: "confirmed",
    },
    donatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

DonationSchema.index({ campaignBlockchainId: 1, donorWallet: 1 });

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);
