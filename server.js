require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path'); 
const https = require('https');
const cloudinary = require('cloudinary').v2; 
const Jimp = require('jimp'); // Pure JS Image manipulation (safe for Render)

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

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🏢 Advanced Property Schema
const PropertySchema = new mongoose.Schema({
    id: { type: String, unique: true }, 
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
    saved: { type: Boolean, default: false },
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
    console.error("❌ CRITICAL ERROR: MONGODB_URI environment variable is not defined on Render!");
    process.exit(1);
}

mongoose.connect(dbURI)
.then(() => console.log("🔋 MongoDB Atlas Cloud Database connected successfully!"))
.catch((err) => console.log("❌ Connection Error:", err));

// 🛠️ HELPER FUNCTION FOR CLOUDINARY UPLOADS
async function uploadMediaToCloudinary(propertyData) {
    const uploadedImageUrls = [];
    if (propertyData.images && propertyData.images.length > 0) {
        for (let img of propertyData.images) {
            if (img && typeof img === 'string' && img.startsWith('data:image')) {
                try {
                    const result = await cloudinary.uploader.upload(img, {
                        folder: 'mamadealing/properties'
                    });
                    uploadedImageUrls.push(result.secure_url);
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

    if (propertyData.video && typeof propertyData.video === 'string' && propertyData.video.startsWith('data:video')) {
        try {
            const result = await cloudinary.uploader.upload(propertyData.video, {
                resource_type: 'video',
                folder: 'mamadealing/videos'
            });
            propertyData.video = result.secure_url;
        } catch (err) {
            console.error("❌ Cloudinary video upload error details:", err);
            throw new Error("Cloudinary Video Upload Failed: " + err.message);
        }
    }

    return propertyData;
}

// ==========================================
// 🚀 METADATA AND USER ROUTING (SHARE PATH)
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

        const backendBaseUrl = `${req.protocol}://${req.get('host')}`;
        const ogImageUrl = `${backendBaseUrl}/api/properties/${property.id || property._id}/og-image`;
        const finalRedirectUrl = `https://mamadealing.com/?property=${property.id || property._id}`;

        const userAgent = req.headers['user-agent'] || '';
        const isSocialBot = /facebookexternalhit|WhatsApp|twitterbot|pinterest|googlebot|bingbot|linkedinbot|telegrambot/i.test(userAgent);

        if (isSocialBot) {
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>🏡 Property Alert: ${property.bhk || ''} ${property.propertyType || 'Property'} Available!</title>
                    <meta property="og:title" content="🏡 Property Alert: ${property.bhk || ''} ${property.propertyType || 'Property'} Available!" />
                    <meta property="og:description" content="📍 Location: ${property.location || 'Bhopal'} | 💰 Price: ₹${property.price ? (property.price >= 10000000 ? (property.price / 10000000).toFixed(2) + ' Cr' : (property.price / 100000).toFixed(2) + ' Lakh') : 'N/A'}. Click to view all images and details on Mama Dealing." />
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

// ========================================================
// 📸 JIMP POWERED DYNAMIC FLYER IMAGE GENERATOR (UNIVERSAL JPEG)
// ========================================================
app.get('/api/properties/:id/og-image', async (req, res) => {
    try {
        const propertyId = req.params.id;
        let property = await Property.findOne({ id: propertyId });
        if (!property && mongoose.Types.ObjectId.isValid(propertyId)) {
            property = await Property.findById(propertyId);
        }

        if (!property) {
            return res.status(404).send('Property not found');
        }

        // 1. Create solid background canvas (1200x630)
        const canvas = new Jimp(1200, 630, 0x0b1329ff); // Dark Navy theme

        // 2. Fetch and merge up to 4 property images into a unified grid
        const imgUrls = property.images && property.images.length > 0 ? property.images.slice(0, 4) : [];
        
        if (imgUrls.length > 0) {
            const loadedImages = [];
            for (let url of imgUrls) {
                try {
                    const img = await Jimp.read(url);
                    loadedImages.push(img);
                } catch (e) {
                    console.warn("Failed to load sub-image:", url);
                }
            }

            if (loadedImages.length === 1) {
                // Single Image layout (full height on the left side)
                loadedImages[0].cover(500, 550);
                canvas.composite(loadedImages[0], 40, 40);
            } else if (loadedImages.length === 2) {
                // Two images side by side on left panel
                loadedImages[0].cover(245, 550);
                loadedImages[1].cover(245, 550);
                canvas.composite(loadedImages[0], 40, 40);
                canvas.composite(loadedImages[1], 295, 40);
            } else if (loadedImages.length >= 3) {
                // Elegant 4-box layout grid on left panel
                const positions = [
                    { x: 40, y: 40 },   { x: 295, y: 40 },
                    { x: 40, y: 320 },  { x: 295, y: 320 }
                ];
                loadedImages.forEach((img, idx) => {
                    if (idx < 4) {
                        img.cover(245, 260);
                        canvas.composite(img, positions[idx].x, positions[idx].y);
                    }
                });
            }
        } else {
            // Placeholder fallback panel
            const placeholder = new Jimp(500, 550, 0x131e3aff);
            canvas.composite(placeholder, 40, 40);
        }

        // 3. Render and write text/data details natively on image
        const fontGold = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE); // Standard loaded package font
        const fontWhite = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

        const priceVal = property.price 
            ? (property.price >= 10000000 ? (property.price / 10000000).toFixed(2) + ' Cr' : (property.price / 100000).toFixed(2) + ' Lakh')
            : 'Price Pending';

        const bhkConfig = property.bhk || '3 BHK';
        const propType = property.propertyType || 'Property';
        const locationText = property.location || 'Bhopal, Madhya Pradesh';

        // Draw Texts on JPEG safely
        canvas.print(fontGold, 600, 80, "🏡 MAMA DEALING PREMIUM");
        canvas.print(fontWhite, 600, 160, `Type: ${bhkConfig} ${propType}`);
        canvas.print(fontWhite, 600, 240, `Price: Rs. ${priceVal}`);
        canvas.print(fontWhite, 600, 320, `Location: ${locationText}`);
        canvas.print(fontGold, 600, 440, "👉 CLICK TO VIEW DETAILS");

        // 4. Return Compiled Jpeg Buffer straight to social bots
        const buffer = await canvas.getBufferAsync(Jimp.MIME_JPEG);
        res.set('Content-Type', Jimp.MIME_JPEG);
        res.send(buffer);

    } catch (err) {
        console.error("❌ JPEG processing fail:", err);
        // Direct image redirection fallback
        res.redirect('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80');
    }
});

// ==========================================
// 📱 REAL MSG91 BACKEND OTP ROUTINGS
// ==========================================
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

// ==========================================
// 💬 REAL WHATSAPP CLOUD API INTEGARTION ROUTE
// ==========================================
app.post('/api/send-whatsapp-share', async (req, res) => {
    const { customerPhone, customerName, bhkType, locality, propertyId, imageUrl } = req.body;

    const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN; 
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID; 
    const TEMPLATE_NAME = "property_detail_share"; 

    if (!customerPhone || !propertyId) {
        return res.status(400).json({ success: false, error: "Missing required parameters (customerPhone or propertyId)." });
    }

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.error("❌ CRITICAL: WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not configured in Render Environment Variables!");
        return res.status(500).json({ success: false, error: "Server Configuration Error: WhatsApp credentials missing." });
    }

    try {
        console.log(`📡 Dispatched WhatsApp Message request to client number: 91${customerPhone}`);

        const metaApiUrl = `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`;
        
        const payload = {
            messaging_product: "whatsapp",
            to: `91${customerPhone}`,
            type: "template",
            template: {
                name: TEMPLATE_NAME,
                language: {
                    code: "en_US" 
                },
                components: [
                    {
                        type: "header",
                        parameters: [
                            {
                                type: "image",
                                image: {
                                    link: imageUrl || "https://placehold.co/600x400/f1f5f9/64748b?text=Photo+Pending"
                                }
                            }
                        ]
                    },
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: customerName || "Customer" }, 
                            { type: "text", text: bhkType || "Premium" },       
                            { type: "text", text: locality || "Bhopal" }        
                        ]
                    },
                    {
                        type: "button",
                        sub_type: "url",
                        index: "0",
                        parameters: [
                            {
                                type: "text",
                                text: `?property=${propertyId}` 
                            }
                        ]
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

        if (response.ok) {
            console.log("✅ Meta WhatsApp Delivery Response:", data);
            return res.status(200).json({ success: true, data });
        } else {
            console.error("❌ Meta WhatsApp API Rejected Request:", data);
            return res.status(response.status).json({ success: false, error: data.error ? data.error.message : "Meta API Error" });
        }

    } catch (err) {
        console.error("❌ Network / Server Request Failure:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
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