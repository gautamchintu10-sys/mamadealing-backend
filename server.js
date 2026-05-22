const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();

app.use(cors()); 

// 10 photos और base64 video को बिना क्रैश सपोर्ट करने के लिए 100mb डेटा लिमिट सेट की गई है
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// 🏢 Advanced Property Schema
const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    location: { type: String, required: true },
    propertyType: { type: String, required: true },
    bhk: { type: String, default: "3 BHK" },
    bathrooms: { type: String, default: "2" },
    area: { type: Number, default: null }, // Built-up Area in Sq.Ft
    furnishing: { type: String, default: "Unfurnished" },
    constructionStatus: { type: String, default: "Ready to Move" }, // "Ready to Move" or "Under Construction"
    propertyAge: { type: String, default: "New Construction" },
    amenities: { type: [String], default: [] }, 
    latitude: { type: Number, default: 23.259933 }, 
    longitude: { type: Number, default: 77.412613 },
    images: { type: [String], default: [] }, // Supports up to 10 photos
    video: { type: String, default: "" }, // Supports 1 base64 video file
    phone: { type: String, required: true },
    firmName: String,
    rera: String,
    reportsCount: { type: Number, default: 0 }
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

// MongoDB Atlas Connection
const dbURI = "mongodb://mamadealing_db_user:INiD5zyH43QPCWAB@ac-zehlulg-shard-00-00.wx4plhq.mongodb.net:27017,ac-zehlulg-shard-00-01.wx4plhq.mongodb.net:27017,ac-zehlulg-shard-00-02.wx4plhq.mongodb.net:27017/mamadealing?ssl=true&replicaSet=atlas-o3fbu3-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(dbURI)
    .then(() => console.log("🔋 MongoDB Atlas Cloud Database connected successfully!"))
    .catch((err) => console.log("❌ Connection Error:", err));

app.get('/test', (req, res) => {
    res.send("🚀 Backend is running smoothly!");
});

// GET Properties
app.get('/api/properties', async (req, res) => {
    try {
        const allProperties = await Property.find(); 
        res.status(200).json(allProperties); 
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to fetch data", error: error.message });
    }
});

// POST New Property
app.post('/api/properties', async (req, res) => {
    try {
        const newProperty = new Property(req.body);
        const savedProperty = await newProperty.save();
        res.status(201).json({ message: "🎉 Property saved successfully!", data: savedProperty });
    } catch (error) {
        res.status(400).json({ message: "❌ Failed to save property", error: error.message });
    }
});

// DELETE Property
app.delete('/api/properties/:id', async (req, res) => {
    try {
        const deletedProperty = await Property.findByIdAndDelete(req.params.id);
        if (!deletedProperty) return res.status(404).json({ message: "❌ Property not found" });
        res.status(200).json({ message: "✅ Property successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "❌ Deletion error", error: error.message });
    }
});

// REPORT Auto-Delete logic
app.post('/api/properties/:id/report', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "❌ Property not found" });

        const currentReports = (property.reportsCount || 0) + 1;
        if (currentReports >= 3) {
            await Property.findByIdAndDelete(req.params.id); 
            return res.status(200).json({ message: "🚨 Removed due to multiple reports.", action: "deleted" });
        } else {
            property.reportsCount = currentReports;
            await property.save();
            return res.status(200).json({ message: `⚠️ Reported successfully (${currentReports}/3)`, action: "reported" });
        }
    } catch (error) {
        res.status(500).json({ message: "❌ Report failed", error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`📡 Server running on Port ${PORT}`);
});