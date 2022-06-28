import { Model, Schema, model, Types } from "mongoose";

/**
 * Create an interface representing a document in MongoDB.
 */
export interface IUser {
  _id: string;
  USER_NAME: string;
  USER_EMAIL: string;
  USER_PW: string;
  USER_SEX: number;
  USER_AVATAR?: string;
  USER_POINTS?: number;
  USER_REPORT?: number;
  USER_SUSPENDED?: number;
  USER_CONCATS?:Types.ObjectId[];
  USER_INVITATION?:Types.ObjectId[];
  _doc?: any
}
/**
 * Put all user instance methods in this interface:
 */
interface IUserMethods {
  isAvatarImageSet(): boolean;
  isMale(): boolean;
  hasSuspended(): boolean;
}

/**
 * Create a new Model type that knows about IUserMethods...
 */
type UserModel = Model<IUser, {}, IUserMethods>;

/**
 * Create a Schema corresponding to the document interface, and the schema that knows about IUserMethods.
 */
const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  USER_NAME: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  USER_EMAIL: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  USER_SEX: {
    type: Number,
    required: true,
    enum: [1, 2],
  },
  USER_PW: {
    type: String,
    required: true,
    min: 8,
  },
  USER_AVATAR: {
    type: String,
    default: "",
  },
  USER_POINTS: {
    type: Number,
    default: 0,
  },
  USER_REPORT: {
    type: Number,
    default: 0,
  },
  USER_SUSPENDED: {
    type: Boolean,
    default: false,
  },
  USER_CONCATS: [
    {
      type: Schema.Types.ObjectId, 
      ref: 'USER',
      unique: true,
    }
  ],
  USER_INVITATION:[
    {
      type: Schema.Types.ObjectId, 
      ref: 'INVITE'
    }
  ]
},{
  timestamps:true,
});

userSchema.method("isAvatarImageSet", function isAvatarImageSet() {
  return this.USER_AVATAR !== "";
});

userSchema.method("isMale", function isMale() {
  return this.USER_SEX === 1;
});

userSchema.method("hasSuspended", function isMale() {
  return this.USER_SUSPENDED;
});

// module.exports = model<IUser, UserModel>("USER", userSchema);
export default module.exports = model<IUser, UserModel>("USER", userSchema);
