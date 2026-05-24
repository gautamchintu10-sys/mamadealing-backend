const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path'); 
const cloudinary = require('cloudinary').v2; 

const app = express();

app.use(cors()); 

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// ☁️ CLOUDINARY CONFIGURATION
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqojiyouq',
    api_key: process.env.CLOUDINARY_API_KEY || '218991217114917',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'drQtrpNH5lIeeRTeZIaeGmi2rS4'
});

// 📁 SERVE STATIC FILES
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🏢 Advanced Property Schema
const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    location: { type: String, required: true },
    propertyType: { type: String, required: true },
    bhk: { type: String, default: "3 BHK" },
    bathrooms: { type: String, default: "2" },
    area: { type: Number, default: null }, 
    furnishing: { type: String, default: "Unfurnished" },
    constructionStatus: { type: String, default: "Ready to Move" }, 
    propertyAge: { type: String, default: "New Construction" },
    amenities: { type: [String], default: [] }, 
    latitude: { type: Number, default: 23.259933 }, 
    longitude: { type: Number, default: 77.412613 },
    images: { type: [String], default: [] }, 
    video: { type: String, default: "" }, 
    phone: { type: String, required: true },
    firmName: String,
    rera: String,
    isSoldOut: { type: Boolean, default: false }, 
    reportsCount: { type: Number, default: 0 }
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

const dbURI = "mongodb://mamadealing_db_user:INiD5zyH43QPCWAB@ac-zehlulg-shard-00-00.wx4plhq.mongodb.net:27017,ac-zehlulg-shard-00-01.wx4plhq.mongodb.net:27017,ac-zehlulg-shard-00-02.wx4plhq.mongodb.net:27017/mamadealing?ssl=true&replicaSet=atlas-o3fbu3-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(dbURI)
    .then(() => console.log("🔋 MongoDB Atlas Cloud Database connected successfully!"))
    .catch((err) => console.log("❌ Connection Error:", err));

// 🛠️ HELPER FUNCTION FOR CLOUDINARY UPLOADS
async function uploadMediaToCloudinary(propertyData) {
    const uploadedImageUrls = [];
    
    // 1. Images Upload
    if (propertyData.images && propertyData.images.length > 0) {
        for (let img of propertyData.images) {
            if (img && typeof img === 'string' && img.startsWith('data:image')) {
                try {
                    const result = await cloudinary.uploader.upload(img, {
                        folder: 'mamadealing/properties'
                    });
                    uploadedImageUrls.push(result.secure_url);
                    console.log("📸 Image successfully uploaded to Cloudinary:", result.secure_url);
                } catch (err) {
                    console.error("❌ Cloudinary image upload error details:", err);
                    throw new Error("Cloudinary Image Upload Failed: " + err.message);
                }
            } else if (img) {
                uploadedImageUrls.push(img); // पहले से अपलोड की हुई URL को सुरक्षित रखें
            }
        }
    }
    propertyData.images = uploadedImageUrls;

    // 2. Video Upload
    if (propertyData.video && typeof propertyData.video === 'string' && propertyData.video.startsWith('data:video')) {
        try {
            const result = await cloudinary.uploader.upload(propertyData.video, {
                resource_type: 'video',
                folder: 'mamadealing/videos'
            });
            propertyData.video = result.secure_url;
            console.log("🎥 Video successfully uploaded to Cloudinary:", result.secure_url);
        } catch (err) {
            console.error("❌ Cloudinary video upload error details:", err);
            throw new Error("Cloudinary Video Upload Failed: " + err.message);
        }
    }

    return propertyData;
}

app.get('/test', (req, res) => {
    res.send("🚀 Backend is running smoothly!");
});

// GET Properties
app.get('/api/properties', async (req, res) => {
    try {
        const allProperties = await Property.find().sort({ createdAt: -1 }); 
        res.status(200).json(allProperties); 
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to fetch data", error: error.message });
    }
});

// POST New Property
app.post('/api/properties', async (req, res) => {
    try {
        let propertyData = req.body;
        
        // Media upload via helper
        propertyData = await uploadMediaToCloudinary(propertyData);

        const newProperty = new Property(propertyData);
        const savedProperty = await newProperty.save();
        res.status(201).json({ message: "🎉 Property saved successfully with Cloud Storage!", data: savedProperty });
    } catch (error) {
        console.error("❌ Database/Cloudinary POST error:", error);
        res.status(400).json({ message: "❌ Failed to save property", error: error.message });
    }
});

// UPDATE Property (PUT)
app.put('/api/properties/:id', async (req, res) => {
    try {
        let propertyData = req.body;
        
        // Media upload for PUT requests
        propertyData = await uploadMediaToCloudinary(propertyData);

        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, propertyData, { new: true });
        if (!updatedProperty) return res.status(404).json({ message: "❌ Property not found" });
        res.status(200).json({ message: "✅ Property successfully updated", data: updatedProperty });
    } catch (error) {
        console.error("❌ Database/Cloudinary PUT error:", error);
        res.status(500).json({ message: "❌ Update error", error: error.message });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`📡 Server running on Port ${PORT}`);
});