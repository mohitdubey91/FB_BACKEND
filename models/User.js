
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        text: true,
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        text: true,
    },
    username: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        text: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    picture: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        trim: true,
        required: [true, "Gender is required"],
    },
    bYear: {
        type: Number,
        required: true,
        trim: true,
    },
    bMonth: {
        type: Number,
        required: true,
        trim: true,
    },
    bDay: {
        type: Number,
        required: true,
        trim: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    friends: {
        type: Array,
        default: [],
    },
    followers: {
        type: Array,
        default: [],
    },
    requests: {
        type: Array,
        default: [],
    },
    search: [{
        user: {
            type: ObjectId,
            ref: "User",
        }
    }],
    details: {
        bio: {
            type: String,
        },
        otherName: {
            type: String,
        },
        job: {
            type: String,
        },
        workplace: {
            type: String,
        },
        highSchool: {
            type: String,
        },
        college: {
            type: String,
        },
        currentCity: {
            type: String,
        },
        hometown: {
            type: String,
        },
        relationShip: {
            type: String,
            enum: ['Single', 'In a relationship', 'Married', 'Divorced'],
        },
        instagram: {
            type: String,
        },
        job: {
            type: String,
        },
    },
    savePosts: {
        post: {
            type: ObjectId,
            ref: "Post"
        },
        savedAt: {
            type: Date,
            default: new Date(),
        }
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);