import mongoose from '../db/conn';

const UserSchema = new mongoose.Schema({
    username: String,
    mail: String,
    password: String
});

const User = mongoose.model('User', UserSchema);

export default User;
