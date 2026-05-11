import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is required'],
    },
    username: {
      type: String,
      unique: [true, 'Username already exists'],
      required: [true, 'Username is required'],
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dpcrhvlzq/image/upload/v1622012637/default_user_q90g5g.png',
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
  },
  {
    timestamps: true, // creates updatedAt, createdAt
  }
);

const User = models.User || model('User', UserSchema); // this line ensures that the model is a singleton

export default User;
