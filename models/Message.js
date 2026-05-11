import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema(
  {
    // logged in user
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // property owner
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
    },
    phone: {
      type: String,
    },
    body: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// If model already exist first part, if not second part
const Message = models.Message || model('Message', MessageSchema);

export default Message;
