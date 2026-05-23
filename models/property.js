const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Property ka title zaroori hai']
    },
    status: {
        type: String,
        default: "Ready to Move" // 🔥 NAYA OPTION: Property Status
    },
    description: {
        type: String,
        required: [true, 'Property ka description zaroori hai']
    },
    price: {
        type: Number,
        required: [true, 'Property ki qeemat zaroori hai']
    },
    location: {
        type: String,
        required: [true, 'Location batana zaroori hai']
    },
    propertyType: {
        type: String,
        enum: ['Plot', 'Flat', 'House', 'Commercial', 'Upcoming Project'], // 🔥 NAYA OPTION: Commercial & Upcoming Project
        required: true
    },
    images: [String], 
    video: {
        type: String,
        default: "" 
    },
    phone: {
        type: String,
        default: "" 
    },
    firmName: {
        type: String,
        default: "" 
    },
    rera: {
        type: String,
        default: "" 
    },
    reportsCount: {
        type: Number,
        default: 0 
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('Property', PropertySchema);