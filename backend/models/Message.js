import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        role: {type: String, enum: ["user", "assistant"], required: true},
        text: {type: String, required: true},
        intent: String,
        score: Number,
        entities: Array,
        sentiment: Object
    },
    {timestamps: true}
)

export default mongoose.model("Message", MessageSchema);