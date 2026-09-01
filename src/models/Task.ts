import mongoose, { Schema, Document, Model } from 'mongoose';

export type TaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ITaskChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITaskComment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface ITask extends Document {
  businessId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  assignedToEmail?: string;
  assignedToAvatar?: string;
  dueDate?: string;
  category: string;
  customerName?: string;
  projectName?: string;
  checklist: ITaskChecklistItem[];
  comments: ITaskComment[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Completed', 'Overdue', 'Cancelled'],
      default: 'To Do',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    assignedTo: {
      type: String,
      default: '',
      trim: true,
    },
    assignedToEmail: {
      type: String,
      default: '',
      trim: true,
    },
    assignedToAvatar: {
      type: String,
      default: '',
    },
    dueDate: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Operations',
      trim: true,
    },
    customerName: {
      type: String,
      default: '',
      trim: true,
    },
    projectName: {
      type: String,
      default: '',
      trim: true,
    },
    checklist: [
      {
        id: { type: String },
        title: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
    comments: [
      {
        id: { type: String },
        author: { type: String },
        avatar: { type: String },
        content: { type: String },
        createdAt: { type: String },
      },
    ],
    createdBy: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ businessId: 1, status: 1 });
TaskSchema.index({ businessId: 1, priority: 1 });

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
