require('dotenv').config();
const dbURI = process.env.MONGO_URI;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const Property = require('./models/Property'); 

const app = express();

// MIDDLEWARES
app.use(cors()); 

// 👇 Base64 images aur videos ke liye data limit 50mb
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const dbURI = "mongodb://mamadealing_db_user:INiD5zyH43QPCWAB@ac-zehlulg-shard-00-00.wx4plhq.mongodb.net:27017,ac-zehlulg-shard-00-01.wx4plhq.mongodb.net:27017,ac-zehlulg-shard-00-02.wx4plhq.mongodb.net:27017/mamadealing?ssl=true&replicaSet=atlas-o3fbu3-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(dbURI)
    .then(() => console.log("🔋 MongoDB Atlas Cloud Database Se Connection Successful!"))
    .catch((err) => console.log("❌ Connection Mein Error Aaya:", err));

// 1. Test Route
app.get('/test', (req, res) => {
    res.send("🚀 Mama Dealing Ka Backend Server Ekdum Mast Chal Raha Hai!");
});

// 2. GET Properties
app.get('/api/properties', async (req, res) => {
    try {
        const allProperties = await Property.find(); 
        res.status(200).json(allProperties); 
    } catch (error) {
        res.status(500).json({ message: "❌ Data fetch karne mein dikkat aayi", error: error.message });
    }
});

// 3. POST Nayi Property
app.post('/api/properties', async (req, res) => {
    try {
        const newProperty = new Property(req.body);
        const savedProperty = await newProperty.save();
        res.status(201).json({ message: "🎉 Property Database Mein Successfully Save Ho Gayi!", data: savedProperty });
    } catch (error) {
        res.status(400).json({ message: "❌ Data Save Karne Mein Dikkat Aayi", error: error.message });
    }
});

// 4. POST Report Scam & Auto-Delete Logic
app.post('/api/properties/:id/report', async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);
        
        if (!property) {
            return res.status(404).json({ message: "❌ Property nahi mili!" });
        }

        const currentReports = (property.reportsCount || 0) + 1;

        // Agar 3 reports ho gayi toh post permanently delete ho jayegi
        if (currentReports >= 3) {
            await Property.findByIdAndDelete(propertyId); 
            return res.status(200).json({ 
                message: "🚨 System Alert: Yeh post 3 baar report ho chuki hai, isliye ise AUTOMATICALLY DELETE kar diya gaya hai!",
                action: "deleted"
            });
        } else {
            // Nahi toh sirf count badha kar save kar lo
            property.reportsCount = currentReports;
            await property.save();
            return res.status(200).json({ 
                message: `⚠️ Report registered. Current Total Reports: ${currentReports}/3`,
                action: "reported",
                currentReports: currentReports
            });
        }
    } catch (error) {
        res.status(500).json({ message: "❌ Report submit karne mein server error", error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`📡 Server Port ${PORT} par chalu ho gaya hai!`);
});