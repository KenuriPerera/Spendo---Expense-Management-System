const mongoose = require("mongoose");

const SpendoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["expense", "savings"], required: true, default: "expense" },
    date: { type: Date, required: true, default: Date.now },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: [0, "Amount must be positive"] },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Spendo", SpendoSchema);
