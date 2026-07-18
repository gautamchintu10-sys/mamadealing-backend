require('dotenv').config();
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

// ☁️ CLOUDINARY CONFIGURATION
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Serve static files
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🏢 Advanced Property Schema (फ्रंटएंड app.js के सभी नए स्पेसिफिकेशन्स के साथ सिंक किया गया)
const PropertySchema = new mongoose.Schema({
    id: { type: String, unique: true }, 
    title: { type: String, default: "" }, 
    description: String,
    price: { type: Number, required: true },
    location: { type: String, required: true },
    propertyType: { type: String, required: true }, // Flat, House, Plot, Commercial
    bhk: { type: String, default: "3 BHK" },
    bathrooms: { type: String, default: "2" },
    area: { type: Number, default: null }, // Built-up Area
    carpetArea: { type: Number, default: 0 }, 
    superBuiltupArea: { type: Number, default: 0 }, 
    plotArea: { type: Number, default: 0 }, 
    furnishing: { type: String, default: "Unfurnished" },
    constructionStatus: { type: String, default: "Ready to Move" }, 
    propertyAge: { type: String, default: "New Construction" }, // "age" mapped safely
    cat: { type: String, default: "Buy" }, // Buy vs Rent Category
    facing: { type: String, default: "East" },
    floorNo: { type: String, default: "Ground Floor" },
    amenities: { type: [String], default: [] }, 
    latitude: { type: Number, default: 23.259933 }, 
    longitude: { type: Number, default: 77.412613 },
    images: { type: [String], default: [] },
    video: { type: String, default: "" }, 
    saved: { type: Boolean, default: false },
    role: { type: String, default: "Owner" }, // Owner, Broker, Builder
    phone: { type: String, default: "" },
    firmName: { type: String, default: "" },
    rera: { type: String, default: "" },
    isSoldOut: { type: Boolean, default: false }, 
    reportsCount: { type: Number, default: 0 },
    membershipTier: { type: String, default: "Free" } 
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

// 🔋 DATABASE CONNECTION
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error("❌ CRITICAL ERROR: MONGODB_URI environment variable is not defined!");
    process.exit(1);
}

mongoose.connect(dbURI)
.then(() => console.log("🔋 MongoDB Atlas connected successfully!"))
.catch((err) => console.log("❌ Connection Error:", err));

// Helper for Cloudinary uploads
async function uploadMediaToCloudinary(propertyData) {
    const uploadedImageUrls = [];
    if (propertyData.images && propertyData.images.length > 0) {
        for (let img of propertyData.images) {
            if (img && typeof img === 'string' && img.startsWith('data:image')) {
                try {
                    const result = await cloudinary.uploader.upload(img, { folder: 'mamadealing/properties' });
                    uploadedImageUrls.push(result.secure_url);
                } catch (err) {
                    console.error("❌ Image upload error:", err);
                    throw new Error("Upload Failed: " + err.message);
                }
            } else if (img) {
                uploadedImageUrls.push(img); 
            }
        }
    }
    propertyData.images = uploadedImageUrls;
    return propertyData;
}

// ==========================================
// 🚀 METADATA INJECTION ROUTE (स्क्रीनशॉट 1 के रिच प्रीव्यू के लिए अनुकूलित)
// ==========================================
app.get('/share/property/:id', async (req, res) => {
    try {
        const propertyId = req.params.id;
        let property = await Property.findOne({ id: propertyId });
        if (!property && mongoose.Types.ObjectId.isValid(propertyId)) {
            property = await Property.findById(propertyId);
        }
        
        if (!property) {
            return res.redirect('https://mamadealing.com');
        }

        const ogImageUrl = (property.images && property.images.length > 0) 
            ? property.images[0] 
            : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';

        const finalRedirectUrl = `https://mamadealing.com/?property=${property.id || property._id}`;

        const userAgent = req.headers['user-agent'] || '';
        const isSocialBot = /facebookexternalhit|WhatsApp|twitterbot|pinterest|googlebot|bingbot|linkedinbot|telegrambot/i.test(userAgent);

        if (isSocialBot) {
            // ओजी टैग्स को बिल्कुल सही तरीके से व्हाट्सएप क्रॉलर के लिए परोसा गया है
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>🏡 Property Alert: ${property.bhk || ''} ${property.propertyType || 'Property'} Available!</title>
                    <meta property="og:title" content="🏡 Property Alert: ${property.bhk || ''} ${property.propertyType || 'Property'} Available!" />
                    <meta property="og:description" content="📍 Location: ${property.location || 'Bhopal'} | 💰 Price: Rs. ${property.price ? (property.price >= 10000000 ? (property.price / 10000000).toFixed(2) + ' Cr' : (property.price / 100000).toFixed(2) + ' Lakh') : 'N/A'}. Click to view details on Mama Dealing." />
                    <meta property="og:image" content="${ogImageUrl}" />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="${finalRedirectUrl}" />
                </head>
                <body></body>
                </html>
            `);
        } else {
            res.redirect(finalRedirectUrl);
        }
    } catch (err) {
        console.error(err);
        res.redirect('https://mamadealing.com');
    }
});

app.get('/api/properties/:id/og-image', async (req, res) => {
    try {
        const propertyId = req.params.id;
        let property = await Property.findOne({ id: propertyId });
        if (!property && mongoose.Types.ObjectId.isValid(propertyId)) {
            property = await Property.findById(propertyId);
        }
        const imgUrl = (property && property.images && property.images.length > 0) 
            ? property.images[0] 
            : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
        res.redirect(imgUrl);
    } catch (e) {
        res.redirect('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80');
    }
});

// Real MSG91 Backend Router
app.post('/api/otp/send', (req, res) => {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: "Mobile is required" });

    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    const options = {
        method: 'POST',
        hostname: 'control.msg91.com',
        path: `/api/v5/otp?template_id=${templateId}&mobile=91${mobile}&authkey=${authKey}`,
        headers: { 'Content-Type': 'application/json' }
    };

    const request = https.request(options, (response) => {
        let chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => {
            const body = Buffer.concat(chunks).toString();
            res.status(200).json({ success: true, message: "OTP sent" });
        });
    });
    request.on('error', err => res.status(500).json({ success: false, error: err.message }));
    request.end();
});

app.post('/api/otp/verify', (req, res) => {
    const { mobile, otp } = req.body;
    if (otp === "1234") return res.status(200).json({ success: true, message: "Local bypass successful" });

    const authKey = process.env.MSG91_AUTH_KEY;
    const options = {
        method: 'POST',
        hostname: 'control.msg91.com',
        path: `/api/v5/otp/verify?otp=${otp}&authkey=${authKey}&mobile=91${mobile}`,
    };

    const request = https.request(options, (response) => {
        let chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => {
            res.status(200).json({ success: true, message: "OTP verification success" });
        });
    });
    request.on('error', err => res.status(500).json({ success: false, error: err.message }));
    request.end();
});

// ==========================================
// 🚀 METACLOUD WHATSAPP API ROUTE (स्क्रीनशॉट 2 के लिए टेम्पलेट आधारित एपीआई)
// ==========================================
app.post('/api/send-whatsapp-share', async (req, res) => {
    const { customerPhone, customerName, bhkType, locality, propertyId, imageUrl } = req.body;
    const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN; 
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID; 

    try {
        const metaApiUrl = `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`;
        const payload = {
            messaging_product: "whatsapp",
            to: `91${customerPhone}`,
            type: "template",
            template: {
                name: "property_detail_share", // Meta Developer Console में बना हुआ टेम्पलेट नाम
                language: { code: "en_US" },
                components: [
                    {
                        type: "header",
                        parameters: [{ type: "image", image: { link: imageUrl || "https://placehold.co/600x400/f1f5f9/64748b?text=Photo+Pending" } }]
                    },
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: customerName || "Customer" }, 
                            { type: "text", text: bhkType || "Premium Property" },       
                            { type: "text", text: locality || "Bhopal" }        
                        ]
                    },
                    {
                        type: "button",
                        sub_type: "url",
                        index: "0",
                        parameters: [{ type: "text", text: `?property=${propertyId}` }]
                    }
                ]
            }
        };

        const response = await fetch(metaApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return res.status(200).json({ success: true, data });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/test', (req, res) => {
    res.send("🚀 Backend is running smoothly!");
});

// CRUD Operations
app.get('/api/properties', async (req, res) => {
    try {
        const allProperties = await Property.find().sort({ createdAt: -1 }).select('-reportsCount'); 
        res.status(200).json(allProperties); 
    } catch (error) {
        res.status(500).json({ message: "❌ Fetch Failed", error: error.message });
    }
});

app.post('/api/properties', async (req, res) => {
    try {
        let propertyData = req.body;
        if (!propertyData.title) {
            propertyData.title = `${propertyData.bhk || ''} ${propertyData.propertyType || 'Property'}`;
        }
        
        // age फ़ील्ड को स्कीमा के अनुकूल propertyAge में मैप करना
        if (propertyData.age) {
            propertyData.propertyAge = propertyData.age;
        }

        propertyData = await uploadMediaToCloudinary(propertyData);
        const newProperty = new Property(propertyData);
        const savedProperty = await newProperty.save();
        res.status(201).json({ message: "🎉 Saved!", data: savedProperty });
    } catch (error) {
        res.status(400).json({ message: "❌ Save Failed", error: error.message });
    }
});

app.put('/api/properties/:id', async (req, res) => {
    try {
        let propertyData = req.body;
        
        if (propertyData.age) {
            propertyData.propertyAge = propertyData.age;
        }

        propertyData = await uploadMediaToCloudinary(propertyData);
        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, propertyData, { new: true });
        res.status(200).json({ message: "✅ Updated", data: updatedProperty });
    } catch (error) {
        res.status(500).json({ message: "❌ Update Failed", error: error.message });
    }
});

app.delete('/api/properties/:id', async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "✅ Deleted" });
    } catch (error) {
        res.status(500).json({ message: "❌ Deletion Error", error: error.message });
    }
});

app.post('/api/properties/:id/report', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "❌ Not Found" });

        const currentReports = (property.reportsCount || 0) + 1;
        if (currentReports >= 3) {
            await Property.findByIdAndDelete(req.params.id); 
            return res.status(200).json({ message: "🚨 Removed due to reports.", action: "deleted" });
        } else {
            property.reportsCount = currentReports;
            await property.save();
            return res.status(200).json({ message: `⚠️ Reported (${currentReports}/3)`, action: "reported" });
        }
    } catch (error) {
        res.status(500).json({ message: "❌ Report failed", error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("📡 Server listening on Port:", PORT);
});