import mongoose from '../db/conn';

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const UserMongo = mongoose.model('User', UserSchema);

export default UserMongo;
