import * as mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: false,
  },
  subscriptionType: String,
  description: String,
  amount: Number,
  subscribedOn: Date,
  expiringOn: Date,
});

const userProfileSchema = new mongoose.Schema({
  cancerType: String,
  dateOfDiagnose: {
    type: Date,
    default: new Date(),
  },
  doctors: [{ name: String, hospital: String }],
  symptoms: [String],
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: String,
  email: String,
  picture: {
    type: String,
    default:
      "https://codemarket-common-bucket.s3.amazonaws.com/public/defaults/pictures/default.jpg",
  },
  active: {
    type: Boolean,
    default: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: String, default: "PreSignUp_SignUp" },
  updatedBy: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  stripeCustomer: String,
  stripeAccount: String,
  subscription: { type: subscriptionSchema },
  userProfile: { type: userProfileSchema },
  about: String,
});

userSchema.index({ userId: 1 });

export const User = mongoose.model("User", userSchema);

// export User
// const User = mongoose.model('user', userSchema);

// export default User;
