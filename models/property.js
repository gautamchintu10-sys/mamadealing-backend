const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Property ka title zaroori hai']
    },
    description: {
        type: String,
        required: [true, 'Property ka description zaroori hai']
    },
    price: {
        type: Number,
        required: [true, 'Property ki qeemat (Price) zaroori hai']
    },
    location: {
        type: String,
        required: [true, 'Location batana zaroori hai']
    },
    propertyType: {
        type: String,
        enum: ['Plot', 'Flat', 'House', 'Commercial'], 
        required: true
    },
    images: [String], // Property ki photos ke links ka array
    video: {
        type: String,
        default: "" // 🔥 REEL VIDEO KE LIYE NAYA FIELD
    },
    phone: {
        type: String,
        default: "" // Phone number ke liye
    },
    firmName: {
        type: String,
        default: "" // Firm name ke liye
    },
    rera: {
        type: String,
        default: "" // RERA code ke liye
    },
    reportsCount: {
        type: Number,
        default: 0 // Scam report counter ke liye
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('Property', PropertySchema);