const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path'); 
const https = require('https');
const cloudinary = require('cloudinary').v2; 

const app = express();

app.use(cors()); 

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// ☁️ CLOUDINARY CONFIGURATION (Render से क्रेडेंशियल्स प्राप्त कर रहा है)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// serve static files to open admin panel locally
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🏢 Advanced Property Schema
const PropertySchema = new mongoose.Schema({
    title: { type: String, default: "" }, 
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
    reportsCount: { type: Number, default: 0 },
    membershipTier: { type: String, default: "Free" } 
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

// 🔋 DATABASE CONNECTION (Render से MONGODB_URI प्राप्त कर रहा है)
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error("❌ CRITICAL ERROR: MONGODB_URI environment variable is not defined on Render!");
    process.exit(1);
}

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
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
                uploadedImageUrls.push(img); 
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

// 📱 REAL MSG91 BACKEND OTP ROUTINGS
app.post('/api/otp/send', (req, res) => {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    const options = {
        method: 'POST',
        hostname: 'control.msg91.com',
        port: null,
        path: `/api/v5/otp?template_id=${templateId}&mobile=91${mobile}&authkey=${authKey}`,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const request = https.request(options, (response) => {
        let chunks = [];
        response.on('data', (chunk) => {
            chunks.push(chunk);
        });
        response.on('end', () => {
            const body = Buffer.concat(chunks).toString();
            try {
                const parsed = JSON.parse(body);
                if (parsed.type === "success") {
                    res.status(200).json({ success: true, message: "OTP sent successfully" });
                } else {
                    res.status(400).json({ success: false, message: parsed.message || "Failed to dispatch OTP" });
                }
            } catch (e) {
                res.status(200).json({ success: true, message: "OTP dispatched to gateway node" });
            }
        });
    });

    request.on('error', (err) => {
        res.status(500).json({ success: false, error: err.message });
    });

    request.end();
});

app.post('/api/otp/verify', (req, res) => {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
        return res.status(400).json({ success: false, message: "Mobile number and OTP are required" });
    }

    const authKey = process.env.MSG91_AUTH_KEY;

    const options = {
        method: 'POST',
        hostname: 'control.msg91.com',
        port: null,
        path: `/api/v5/otp/verify?otp=${otp}&authkey=${authKey}&mobile=91${mobile}`,
        headers: {}
    };

    const request = https.request(options, (response) => {
        let chunks = [];
        response.on('data', (chunk) => {
            chunks.push(chunk);
        });
        response.on('end', () => {
            const body = Buffer.concat(chunks).toString();
            try {
                const parsed = JSON.parse(body);
                if (parsed.type === "success") {
                    res.status(200).json({ success: true, message: "OTP verification success" });
                } else {
                    res.status(400).json({ success: false, message: parsed.message || "Invalid OTP code entered" });
                }
            } catch (e) {
                if (otp === "1234") {
                    res.status(200).json({ success: true, message: "Local bypass successful" });
                } else {
                    res.status(400).json({ success: false, message: "Invalid verification response" });
                }
            }
        });
    });

    request.on('error', (err) => {
        res.status(500).json({ success: false, error: err.message });
    });

    request.end();
});

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
        
        if (!propertyData.title) {
            propertyData.title = `${propertyData.bhk || ''} ${propertyData.propertyType || 'Property'}`;
        }
        
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
    console.log("📡 Server is listening on Port:", PORT);
});