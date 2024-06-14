import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    name: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;