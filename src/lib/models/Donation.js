import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },
    donorId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    donorName: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    donatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

DonationSchema.index({ campaign: 1, donorId: 1 });

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);
