import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true, maxlength: 100 },
  timeBlock: { type: String, required: true, maxlength: 1 },
  date: { type: Date, required: true },
});

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;
