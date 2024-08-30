import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
    email:{type: String, required: true, unique: true},
	password: { type: String, required: true },
    role:{type: String},
    createdAt:{type: Date, required: true},
    updatedAt:{type: Date, required: true},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
