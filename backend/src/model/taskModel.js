import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo:{
     type:String,
    },
    status: {
      type: String,
      enum: ["panding", "complited"],
      default: "panding",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
const Task = mongoose.model("Task", taskSchema);
export default Task;
