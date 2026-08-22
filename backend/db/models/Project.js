const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tech: { type: [String], required: true },
    type: {
      type: String,
      required: true,
      enum: ["Personal", "Freelance", "Paid Freelance"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Completed", "Ongoing", "Awaiting Deployment"],
    },
    github: { type: String, default: null },
    live: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.desc = ret.description; // match frontend 'desc' field
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("Project", projectSchema);
