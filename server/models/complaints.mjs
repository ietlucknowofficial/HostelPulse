import mongoose from "mongoose";

const updateSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  complaintName: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  photos: [
    {
      type: String
    }
  ],

  location: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved", "rejected"],
    default: "pending"
  },

  adminRemarks: {
    type: String
  },

  resolvedAt: {
    type: Date
  },

  reopenCount: {
    type: Number,
    default: 0
  },

  reopenAt: {
    type: Date
  },

  updates: [updateSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Complaint", complaintSchema);