import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    content: String,
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: Number
});


const Message = mongoose.model("Message", MessageSchema);

export default Message;

