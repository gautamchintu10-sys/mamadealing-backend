const mongoose = require('mongoose');

// Property ka nasha (Structure) tayyar karna
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
        enum: ['Plot', 'Flat', 'House', 'Commercial'], // Sirf inhi mein se select hoga
        required: true
    },
    images: [String], // Property ki photos ke links ka array
    createdAt: {
        type: Date,
        default: Date.now // Jab property post hogi, time apne aap save ho jayega
    }
});

// Model ko export karna taaki server.js isuse use kar sake
module.exports = mongoose.model('Property', PropertySchema);