const firebaseConfig = {
  apiKey: "AIzaSyD6G_t4_-_j6JNp0mDmMmDcM3iARJAzlfc",
  authDomain: "mamadealing-235aa.firebaseapp.com",
  projectId: "mamadealing-235aa",
  storageBucket: "mamadealing-235aa.firebasestorage.app",
  messagingSenderId: "545353898669",
  appId: "1:545353898669:web:0c4a46550b493d91990424",
  measurementId: "G-JY05Q9W1KJ"
};

let firebaseAuth = null;
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();
    } catch (e) {
        console.warn("Firebase bypassed:", e);
    }
}

// Automatically Initialize Theme on JS load to prevent flash
initTheme();

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('themeToggleIcon');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
        if (themeIcon) {
            themeIcon.className = "ph-bold ph-sun text-xs sm:text-sm text-brand-gold";
        }
    } else {
        document.documentElement.classList.remove('dark');
        if (themeIcon) {
            themeIcon.className = "ph-bold ph-moon text-xs sm:text-sm text-brand-gold";
        }
    }
}

function toggleTheme() {
    const themeIcon = document.getElementById('themeToggleIcon');
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        if (themeIcon) {
            themeIcon.className = "ph-bold ph-moon text-xs sm:text-sm text-brand-gold";
        }
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) {
            themeIcon.className = "ph-bold ph-sun text-xs sm:text-sm text-brand-gold";
        }
    }
    // Refresh items to adapt any color dynamic attributes
    render();
}

// Simple Reels Navigation handler
function scrollReels(direction) {
    const container = document.getElementById('reelScrollContainer');
    if (container) {
        const height = container.clientHeight;
        container.scrollBy({
            top: direction * height,
            behavior: 'smooth'
        });
    }
}

// All India State & District Matrix
const GEOGRAPHY_MATRIX = {
    "All States (Entire India)": ["All Districts"],
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari"],
    "Arunachal Pradesh": ["Changlang", "Dibang Valley", "East Kameng", "East Siang", "Itanagar", "Kurung Kumey", "Lohit", "Longding", "Lower Dibang Valley", "Lower Subansiri", "Namsai", "Papum Pare", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang", "Ziro"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan (Guwahati)", "Kamrup Rural", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur (Ara)", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanjganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar (Jagdalpur)", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg (Bhilai)", "Gariaband", "Janashgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi", "Dwarka", "Rohini"],
    "Goa": ["North Goa (Panaji)", "South Goa (Margao)", "Vasco da Gama", "Mapusa", "Ponda"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dust", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra (Dharamshala)", "Kinnaur", "Kullu (Manali)", "Lahaul and Stiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jammu & Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum (Jamshedpur)", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada (Mangaluru)", "Davangere", "Dharwad (Hubballi)", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam (Kochi)", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Navi Mumbai", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills (Shillong)", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills (Tura)", "West Jaintia Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
    "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam (Berhampur)", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Keonjhar", "Khordha (Bhubaneswar)", "Karoput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh (Rourkela)"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Sangrur", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Sikkim": ["East Sikkim (Gangtok)", "North Sikkim", "South Sikkim (Namchi)", "West Sikkim"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli (Trichy)", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
    "Tripura": ["Dhalai", "Gomati (Udaipur)", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura (Agartala)"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar (Noida/Greater Noida)", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj (Allahabad)", "Raebareli", "Rampur", "Saharanpur", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar (Rudrapur)", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
};

// Rich Local Properties database
let database = [
    {
        id: "mock-1",
        type: "Flat",
        bhk: "3 BHK",
        area: 1450,
        bathrooms: "3",
        furnishing: "Semi-Furnished",
        cat: "Buy",
        price: 4500000,
        state: "Madhya Pradesh",
        city: "Bhopal",
        locality: "Ayodhya Bypass",
        role: "Owner",
        status: "Active",
        phone: "9827011223",
        images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80"
        ],
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        saved: false,
        firmName: "Sharma Residency",
        rera: "P-BPL-22-1024",
        latitude: 23.259933,
        longitude: 77.412613,
        isSoldOut: false,
        membershipTier: "Gold Plan",
        facing: "East",
        floorNo: "2nd Floor",
        age: "1-3 Years Old"
    },
    {
        id: "mock-2",
        type: "House",
        bhk: "4 BHK",
        area: 2100,
        bathrooms: "4",
        furnishing: "Fully Furnished",
        cat: "Buy",
        price: 9500000,
        state: "Madhya Pradesh",
        city: "Bhopal",
        locality: "Kolar Road",
        role: "Builder",
        status: "Ready to Move",
        phone: "7000123456",
        images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
        video: "",
        saved: false,
        firmName: "Kolar Premium Homes",
        rera: "P-BPL-23-4056",
        latitude: 23.1945,
        longitude: 77.4201,
        isSoldOut: false,
        membershipTier: "Silver Plan",
        facing: "North",
        floorNo: "Ground Floor",
        age: "New Construction"
    },
    {
        id: "mock-3",
        type: "Plot",
        bhk: "Any BHK Configuration",
        area: 1200,
        bathrooms: "",
        furnishing: "Unfurnished",
        cat: "Buy",
        price: 2400000,
        state: "Madhya Pradesh",
        city: "Bhopal",
        locality: "Katara Hills",
        role: "Owner",
        status: "Active",
        phone: "9111223399",
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
        video: "",
        saved: false,
        firmName: "",
        rera: "",
        latitude: 23.2104,
        longitude: 77.4705,
        isSoldOut: false,
        membershipTier: "Free",
        facing: "East-Facing Corner",
        floorNo: "",
        age: ""
    }
];

let servicesDatabase = [
    { id: 1, category: "Legal", title: "Sharma & Associates Title Consultants", phone: "9827011223", specialty: "Registry, Title Clearance, RERA Expert", rating: 4.9, reviews: 24, state: "Madhya Pradesh", city: "Bhopal" },
    { id: 2, category: "Interior", title: "The Decore & Spaces Design", phone: "9829023412", specialty: "Premium 3D Modular Kitchen & Wardrobe Experts", rating: 4.8, reviews: 31, state: "Madhya Pradesh", city: "Bhopal" },
    { id: 3, category: "Construction", title: "Buildwell Infrastructure Developers", phone: "7000123456", specialty: "Turnkey Structure & Building Contractor", rating: 4.7, reviews: 14, state: "Madhya Pradesh", city: "Bhopal" },
    { id: 4, category: "Suppliers", title: "Bhopal Cement & Iron Sariya Traders", phone: "7000123999", specialty: "Cement, Aggregate, TMT Steel Sariya & Bricks", rating: 4.8, reviews: 29, state: "Madhya Pradesh", city: "Bhopal" },
    { id: 5, category: "Movers", title: "Super Safe Packers & Relocation Movers", phone: "9111223399", specialty: "Safe Home Shifting, Heavy Packaging & Logistics", rating: 4.9, reviews: 45, state: "Madhya Pradesh", city: "Bhopal" },
    { id: 6, category: "Vaastu", title: "Acharya Shastri Vedic Vaastu Consultancy", phone: "9425012345", specialty: "Residential & Commercial Map Vaastu Audit", rating: 5.0, reviews: 52, state: "Madhya Pradesh", city: "Bhopal" }
];

let sessionUser = null;
let currentActiveTab = "properties";
let activeCategoryFilter = "Buy"; 
let activeB2bCategoryFilter = "All"; 
let targetDetailItemInstance = null;
let detailPhotoActiveIndex = 0;
let currentlyTargetedShareNodeData = null;
let selectedPhotosBase64 = []; 
let selectedVideoBase64 = "";
let authSelectedRole = "Owner";

let currentPropertiesPage = 1;
const propertiesPerPageLimit = 8;

let activeChatsStorage = JSON.parse(localStorage.getItem('olx_chats_storage')) || [];
let propertyReportsTracker = JSON.parse(localStorage.getItem('property_scam_reports')) || {};

let selectedGlobalState = "All States (Entire India)";
let selectedGlobalCity = "All";
let userSubscribedPlan = "Free";
let isReelsMuted = true;

const NO_IMAGE_FALLBACK = "https://placehold.co/600x400/f1f5f9/64748b?text=Photo+Pending";
let deviceCoordinates = null;
let scanRadiusActive = false;

const BACKEND_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://localhost:5000" 
    : "https://mamadealing-backend.onrender.com";

// High Resilience Initialization Engine
function initializeApp() {
    try {
        initSimpleGeographyModal();
    } catch(e) { console.error("Geography modal error:", e); }

    try {
        initB2bGeographyMenus();
    } catch(e) { console.error("B2b menus error:", e); }

    try {
        initB2bFormStateSelector();
    } catch(e) { console.error("B2b form selector error:", e); }

    try {
        initUploadStateDropdowns();
    } catch(e) { console.error("Upload state selector error:", e); }

    try {
        switchTab('properties');
    } catch(e) { console.error("Switch tab error:", e); }

    try {
        render();
    } catch(e) { console.error("Initial render error:", e); }

    try {
        renderB2bServicesHub();
    } catch(e) { console.error("B2b render error:", e); }

    try {
        document.addEventListener('keydown', handleReelKeyboardNavigation);
    } catch(e) { console.error("Keydown binding error:", e); }

    try {
        fetchLivePropertiesFromDatabase();
    } catch(e) { console.error("Database fetch error:", e); }

    try {
        updateRecentlyViewedTray();
    } catch(e) { console.error("Tray render error:", e); }
}

// Runs setup immediately if DOM is ready, or attaches listener
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function openFeature(id) { 
    let el = document.getElementById(id);
    if(el) {
        el.classList.remove('hidden'); 
        el.classList.add('flex'); 
        el.style.setProperty('display', 'flex', 'important'); 
    }
}

function goBackToProfileDashboard() {
    let dashboardMenu = document.getElementById('profileMainDashboardState');
    let subPanelView = document.getElementById('profileSubPanelViewState');
    if (dashboardMenu) dashboardMenu.classList.remove('hidden');
    if (subPanelView) subPanelView.classList.add('hidden');
}

function closeFeature(id) { 
    let el = document.getElementById(id);
    if(el) {
        el.classList.add('hidden'); 
        el.classList.remove('flex'); 
        el.style.setProperty('display', 'none', 'important'); 
    }
}

function openGlobalLocationModal() {
    openFeature('simplifiedLocationModal');
}

function switchTab(tabId) {
    currentActiveTab = tabId;
    const views = ['properties', 'reels', 'services', 'profile'];
    views.forEach(v => {
        const el = document.getElementById(`main-${v}-view`);
        if (el) el.classList.add('hidden');
    });
    
    const targetView = document.getElementById(`main-${tabId}-view`);
    if (targetView) targetView.classList.remove('hidden');
    
    const mobileTabs = {
        properties: 'm-tab-props',
        reels: 'm-tab-reels',
        profile: 'm-tab-profile'
    };
    const desktopTabs = {
        properties: 'd-tab-props',
        reels: 'd-tab-reels',
        services: 'd-tab-services',
        profile: 'd-tab-profile'
    };
    
    Object.keys(mobileTabs).forEach(k => {
        const mEl = document.getElementById(mobileTabs[k]);
        if (mEl) {
            if (k === tabId) {
                mEl.classList.add('text-slate-900', 'dark:text-white');
                mEl.classList.remove('text-slate-400');
            } else {
                mEl.classList.remove('text-slate-900', 'dark:text-white');
                mEl.classList.add('text-slate-400');
            }
        }
    });

    Object.keys(desktopTabs).forEach(k => {
        const dEl = document.getElementById(desktopTabs[k]);
        if (dEl) {
            if (k === tabId) {
                dEl.classList.add('text-brand-gold');
                dEl.classList.remove('text-slate-400');
            } else {
                dEl.classList.remove('text-brand-gold');
                dEl.classList.add('text-slate-400');
            }
        }
    });
    
    if (tabId === 'reels') {
        renderReelsList();
    }
    
    if (tabId === 'profile') {
        renderProfileSectionWorkspace();
        goBackToProfileDashboard();
    }
}

function triggerDirectPostFlow() {
    if (!sessionUser) {
        alert("⚠️ Ads post karne ke liye pehle login karne ki aavashyakta hai.");
        openFeature('loginModal');
        return;
    }
    openFeature('postProperty');
    moveStep(1);
}

function openPropertyDetailsModal(id) {
    try {
        let item = database.find(x => String(x.id) === String(id));
        if (!item) return;
        targetDetailItemInstance = item;
        detailPhotoActiveIndex = 0;

        const detailModalBadge = document.getElementById('detailModalBadge');
        if (detailModalBadge) detailModalBadge.innerText = item.cat || "Buy";

        const detailModalTitle = document.getElementById('detailModalTitle');
        if (detailModalTitle) detailModalTitle.innerText = `${item.bhk && item.bhk !== "Any BHK Configuration" ? item.bhk : ''} ${item.type}`;

        const detailModalPrice = document.getElementById('detailModalPrice');
        if (detailModalPrice) detailModalPrice.innerText = `₹${item.price.toLocaleString('en-IN')}`;

        const detailModalLocation = document.getElementById('detailModalLocation');
        if (detailModalLocation) detailModalLocation.innerText = `${item.locality}, ${item.city}, ${item.state}`;
        
        const detailSpecBhk = document.getElementById('detailSpecBhk');
        if (detailSpecBhk) detailSpecBhk.innerText = item.bhk || "N/A";

        const detailSpecArea = document.getElementById('detailSpecArea');
        if (detailSpecArea) detailSpecArea.innerText = item.area ? `${item.area} Sq.Ft` : "N/A";

        const detailSpecBaths = document.getElementById('detailSpecBaths');
        if (detailSpecBaths) detailSpecBaths.innerText = item.bathrooms || "N/A";

        const detailSpecFurnish = document.getElementById('detailSpecFurnish');
        if (detailSpecFurnish) detailSpecFurnish.innerText = item.furnishing || "N/A";
        
        const detailDescriptionText = document.getElementById('detailDescriptionText');
        if (detailDescriptionText) detailDescriptionText.innerText = item.description || "Direct asset owner verified listing. Clean paperwork and immediate possession available.";

        const detailSellerFirm = document.getElementById('detailSellerFirm');
        if (detailSellerFirm) detailSellerFirm.innerText = item.firmName ? item.firmName : "Direct Owner Node";

        const detailSpecFacing = document.getElementById('detailSpecFacing');
        if (detailSpecFacing) detailSpecFacing.innerText = item.facing || "East";

        const detailSpecFloor = document.getElementById('detailSpecFloor');
        if (detailSpecFloor) detailSpecFloor.innerText = item.floorNo || "Ground";

        const detailSpecAge = document.getElementById('detailSpecAge');
        if (detailSpecAge) detailSpecAge.innerText = item.age || "New Build";

        updateDetailSaveBtnVisual();

        const bBox = document.getElementById('detailSpecBhkBox');
        const baBox = document.getElementById('detailSpecBathsBox');
        const fBox = document.getElementById('detailSpecFurnishBox');
        const flBox = document.getElementById('detailSpecFloorBox');
        const aBox = document.getElementById('detailSpecAgeBox');

        if (item.type === "Plot") {
            if (bBox) bBox.classList.add('hidden');
            if (baBox) baBox.classList.add('hidden');
            if (fBox) fBox.classList.add('hidden');
            if (flBox) flBox.classList.add('hidden');
            if (aBox) aBox.classList.add('hidden');
        } else {
            if (bBox) bBox.classList.remove('hidden');
            if (baBox) baBox.classList.remove('hidden');
            if (fBox) fBox.classList.remove('hidden');
            if (flBox) flBox.classList.remove('hidden');
            if (aBox) aBox.classList.remove('hidden');
        }

        let videoTab = document.getElementById('mediaTabVideo');
        let videoPlayer = document.getElementById('detailModalVideo');
        if (videoTab && videoPlayer) {
            if (item.video && item.video !== "") {
                videoTab.classList.remove('hidden');
                videoPlayer.src = item.video;
            } else {
                videoTab.classList.add('hidden');
                videoPlayer.src = "";
            }
        }

        switchDetailMediaMode('photos');
        renderDetailPhotoSlides();
        addToRecentlyViewed(item.id);
        openFeature('propertyDetailsModal');
    } catch (err) {
        console.error("Error displaying property modal: ", err);
    }
}

function openVisitingSchedulerModal() {
    if (!targetDetailItemInstance) {
        alert("⚠️ Please select a property to schedule a visit.");
        return;
    }
    openFeature('assistedSellingModal');
}

function switchDetailMediaMode(mode) {
    let photosBox = document.getElementById('detailPhotosContainer');
    let videoBox = document.getElementById('detailVideoContainer');
    let tabPhotos = document.getElementById('mediaTabPhotos');
    let tabVideo = document.getElementById('mediaTabVideo');
    let videoPlayer = document.getElementById('detailModalVideo');

    if (mode === 'photos') {
        if (photosBox) photosBox.classList.remove('hidden');
        if (videoBox) videoBox.classList.add('hidden');
        if (tabPhotos) tabPhotos.className = "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-slate-950 bg-[#f59e0b] transition-all flex items-center gap-0.5";
        if (tabVideo) tabVideo.className = "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-white hover:text-brand-gold transition-all flex items-center gap-0.5";
        if (videoPlayer) videoPlayer.pause();
    } else {
        if (photosBox) photosBox.classList.add('hidden');
        if (videoBox) videoBox.classList.remove('hidden');
        if (tabVideo) tabVideo.className = "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-slate-955 bg-[#f59e0b] transition-all flex items-center gap-0.5";
        if (tabPhotos) tabPhotos.className = "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-white hover:text-brand-gold transition-all flex items-center gap-0.5";
        if (videoPlayer) videoPlayer.play().catch(e => {});
    }
}

function renderDetailPhotoSlides() {
    let item = targetDetailItemInstance;
    if (!item) return;

    let total = item.images ? item.images.length : 1;
    const counterBadge = document.getElementById('detailPhotoCounterBadge');
    if (counterBadge) counterBadge.innerText = `${detailPhotoActiveIndex + 1}/${total}`;

    const modalImage = document.getElementById('detailModalImage');
    if (modalImage) modalImage.src = item.images && item.images.length > 0 ? item.images[detailPhotoActiveIndex] : NO_IMAGE_FALLBACK;

    let dotsTray = document.getElementById('detailPhotoDotsTray');
    let navGroup = document.getElementById('detailModalNavGroup');
    if (dotsTray) {
        dotsTray.innerHTML = "";
        if (total > 1) {
            if (navGroup) navGroup.classList.remove('hidden');
            for (let i = 0; i < total; i++) {
                let dot = document.createElement('div');
                dot.className = `w-1.5 h-1.5 rounded-full transition-all ${i === detailPhotoActiveIndex ? 'bg-slate-900 dark:bg-white scale-125' : 'bg-slate-300 dark:bg-slate-700'}`;
                dotsTray.appendChild(dot);
            }
        } else {
            if (navGroup) navGroup.classList.add('hidden');
        }
    }
}

function changeDetailPhoto(dir) {
    if (!targetDetailItemInstance || !targetDetailItemInstance.images || targetDetailItemInstance.images.length <= 1) return;
    let total = targetDetailItemInstance.images.length;
    detailPhotoActiveIndex += dir;
    if (detailPhotoActiveIndex < 0) detailPhotoActiveIndex = total - 1;
    if (detailPhotoActiveIndex >= total) detailPhotoActiveIndex = 0;
    renderDetailPhotoSlides();
}

function closePropertyDetailModalBlock() {
    let videoPlayer = document.getElementById('detailModalVideo');
    if (videoPlayer) videoPlayer.pause();
    closeFeature('propertyDetailsModal');
}

function initSimpleGeographyModal() {
    let stateSelect = document.getElementById('simpleStateDropdown');
    if (!stateSelect) return;
    
    stateSelect.innerHTML = `<option value="" class="dark:bg-slate-900 dark:text-white">-- Choose State --</option>`;
    Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
        stateSelect.innerHTML += `<option class="dark:bg-slate-900 dark:text-white" value="${st}" ${st === "All States (Entire India)" ? "selected" : ""}>${st}</option>`;
    });
    loadDistrictsForSimpleDropdown("All States (Entire India)");
}

function loadDistrictsForSimpleDropdown(state) {
    let tray = document.getElementById('simpleDistrictListTray');
    if (!tray) return;

    if (!state) {
        tray.innerHTML = `<p class="text-slate-400 dark:text-slate-500 text-center py-6 font-semibold text-xs">Please select state above first</p>`;
        return;
    }

    selectedGlobalState = state;
    tray.innerHTML = "";

    let districtSearchInput = document.getElementById('simpleDistrictSearchInput');
    if (districtSearchInput) districtSearchInput.value = "";

    let allDistDiv = document.createElement('div');
    allDistDiv.className = "p-2.5 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-950 dark:text-slate-100 font-bold flex justify-between items-center simple-district-item text-[11px] bg-white dark:bg-[#131e3a]";
    allDistDiv.innerText = "All Districts (Entire State)";
    allDistDiv.onclick = () => selectSimpleDistrict("All");
    tray.appendChild(allDistDiv);

    if (GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(dist => {
            let div = document.createElement('div');
            div.className = "p-2.5 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300 simple-district-item text-[11px] font-semibold bg-white dark:bg-[#131e3a]";
            div.innerText = dist;
            div.onclick = () => selectSimpleDistrict(dist);
            tray.appendChild(div);
        });
    }
}

function filterSimpleDistrictsList(query) {
    let q = query.toLowerCase();
    document.querySelectorAll('.simple-district-item').forEach(el => {
        let name = el.innerText.toLowerCase();
        el.classList.toggle('hidden', !name.includes(q));
    });
}

function selectSimpleDistrict(dist) {
    selectedGlobalCity = dist;
    let label = document.getElementById('selectedGlobalCityLabel');
    if (label) {
        label.innerText = dist === "All" ? (selectedGlobalState === "All States (Entire India)" ? "All India" : selectedGlobalState) : dist;
    }
    closeFeature('simplifiedLocationModal');
    currentPropertiesPage = 1;
    render();
}

function switchProfileTab(panelId) {
    let dashboardMenu = document.getElementById('profileMainDashboardState');
    let subPanelView = document.getElementById('profileSubPanelViewState');
    
    if (dashboardMenu) dashboardMenu.classList.add('hidden');
    if (subPanelView) subPanelView.classList.remove('hidden');

    document.querySelectorAll('.profile-panel-sub').forEach(p => p.classList.add('hidden'));

    let targetPanel = document.getElementById(`profilePanel-${panelId}`);
    if (targetPanel) {
        targetPanel.classList.remove('hidden');
    }

    let titleEl = document.getElementById('profileSubViewTitle');
    if (titleEl) {
        if (panelId === 'chats') titleEl.innerText = "Chat Logs";
        if (panelId === 'listings') titleEl.innerText = "My Property Listings";
        if (panelId === 'saved') titleEl.innerText = "Saved Units";
        if (panelId === 'recent') titleEl.innerText = "Recently Viewed";
    }

    if (panelId === 'chats') renderMyChatsHistoryList();
    if (panelId === 'saved') renderSavedBookmarksDashboard();
    if (panelId === 'listings') renderMyPropertiesManagementWorkspace();
    if (panelId === 'recent') updateRecentlyViewedTray();
}

function initB2bGeographyMenus() {
    let sService = document.getElementById('filterServiceState');
    if (sService) {
        sService.innerHTML = '<option value="All" class="dark:bg-slate-900 dark:text-white">Select State (All)</option>';
        Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
            if (st !== "All States (Entire India)") {
                sService.innerHTML += `<option class="dark:bg-slate-900 dark:text-white" value="${st}">${st}</option>`;
            }
        });
    }
}

function loadB2bCitiesForFilter() {
    let state = document.getElementById('filterServiceState').value;
    let cService = document.getElementById('filterServiceCity');
    if (!cService) return;
    cService.innerHTML = '<option value="All" class="dark:bg-slate-900 dark:text-white">Select District (All)</option>';
    if (state !== "All" && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cService.innerHTML += `<option class="dark:bg-slate-900 dark:text-white" value="${ci}">${ci}</option>`;
        });
    }
    renderB2bServicesHub();
}

function initUploadStateDropdowns() {
    let sInp = document.getElementById('stateInp');
    if (sInp) {
        sInp.innerHTML = '<option value="" class="dark:bg-slate-900 dark:text-white">-- Choose State --</option>';
        Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
            if (st !== "All States (Entire India)") {
                sInp.innerHTML += `<option class="dark:bg-slate-900 dark:text-white" value="${st}">${st}</option>`;
            }
        });
    }
}

function loadCompleteCities() {
    let stateEl = document.getElementById('stateInp');
    if (!stateEl) return;
    let state = stateEl.value;
    let cInp = document.getElementById('cityInp');
    if (!cInp) return;
    cInp.innerHTML = '<option value="" class="dark:bg-slate-900 dark:text-white">-- Choose District --</option>';
    if(state && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cInp.innerHTML += `<option class="dark:bg-slate-900 dark:text-white" value="${ci}">${ci}</option>`;
        });
    }
}

function updatePriceFilter(val) {
    let pDisplay = document.getElementById('priceDisplay');
    if (pDisplay) {
        pDisplay.innerText = val == 50000000 ? "Any Price" : "₹" + parseInt(val).toLocaleString('en-IN');
    }
    currentPropertiesPage = 1;
    render();
}

function applyQuickBudgetFilter(min, max, btnElement) {
    const pFilter = document.getElementById('priceFilter');
    const bBtns = document.querySelectorAll('.quick-b-btn');
    bBtns.forEach(b => b.classList.remove('bg-slate-900', 'text-white'));
    if (pFilter) {
        pFilter.value = max;
        updatePriceFilter(max);
    }
    if (btnElement) {
        btnElement.classList.add('bg-slate-900', 'text-white');
    }
}

function applySearchPillTab(cat, btn) {
    activeCategoryFilter = cat;
    document.querySelectorAll('.custom-search-tab').forEach(b => {
        b.classList.remove('active', 'border-brand-gold', 'text-brand-gold');
        b.classList.add('border-transparent', 'text-slate-400');
    });
    if (btn) {
        btn.classList.add('active', 'border-brand-gold', 'text-brand-gold');
        btn.classList.remove('border-transparent', 'text-slate-400');
    }
    let typeEl = document.getElementById('filterType');
    if (typeEl) typeEl.value = "All";
    currentPropertiesPage = 1;
    render();
}

function applySearchPillType(type, btn) {
    document.querySelectorAll('.custom-search-tab').forEach(b => {
        b.classList.remove('active', 'border-brand-gold', 'text-brand-gold');
        b.classList.add('border-transparent', 'text-slate-400');
    });
    if (btn) {
        btn.classList.add('active', 'border-brand-gold', 'text-brand-gold');
        btn.classList.remove('border-transparent', 'text-slate-400');
    }
    let typeEl = document.getElementById('filterType');
    if (typeEl) typeEl.value = type;
    currentPropertiesPage = 1;
    render();
}

function selectB2bCategoryCard(category) {
    activeB2bCategoryFilter = category;
    let catSelView = document.getElementById('b2bCategorySelectionView');
    let resListView = document.getElementById('b2bResultsListView');
    if (catSelView) catSelView.classList.add('hidden');
    if (resListView) resListView.classList.remove('hidden');
    
    let sEl = document.getElementById('filterServiceState');
    let cEl = document.getElementById('filterServiceCity');
    if (sEl) sEl.value = "All";
    if (cEl) cEl.innerHTML = '<option value="All" class="dark:bg-slate-900 dark:text-white">Select District (All)</option>';

    renderB2bServicesHub();
}

function backToB2bCategories() {
    let resListView = document.getElementById('b2bResultsListView');
    let catSelView = document.getElementById('b2bCategorySelectionView');
    if (resListView) resListView.classList.add('hidden');
    if (catSelView) catSelView.classList.remove('hidden');
}

function handleReelSearchAndCollapse(val) {
    renderReelsList(val);
}

function toggleReelSearchHeader(visible) {
    let bar = document.getElementById('reelSearchBarWrapper');
    let doneBtn = document.getElementById('reelSearchDoneBtn');
    let trigger = document.getElementById('reelSearchTriggerBtnFloating');
    
    if (visible) {
        if (bar) bar.classList.remove('hidden');
        if (doneBtn) doneBtn.classList.remove('hidden');
        if (trigger) trigger.classList.add('hidden');
    } else {
        if (bar) bar.classList.add('hidden');
        if (doneBtn) doneBtn.classList.add('hidden');
        if (trigger) trigger.classList.remove('hidden');
    }
}

function toggleReelsMuteState() {
    isReelsMuted = !isReelsMuted;
    const videos = document.querySelectorAll('#reelScrollContainer video');
    videos.forEach(vid => { vid.muted = isReelsMuted; });
}

function renderReelsList(filterQuery = "") {
    let container = document.getElementById('reelScrollContainer');
    if (!container) return;
    
    let reelsData = database.filter(x => x.video && x.video !== "" && x.status !== "Expired");
    
    if (filterQuery.trim() !== "") {
        let q = filterQuery.toLowerCase();
        reelsData = reelsData.filter(x => x.locality.toLowerCase().includes(q) || x.city.toLowerCase().includes(q) || x.type.toLowerCase().includes(q));
    }

    container.innerHTML = "";

    if(reelsData.length === 0) {
        container.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
            <i class="ph ph-video-camera-slash text-4xl text-slate-500"></i>
            <p class="text-xs font-semibold text-slate-400">No matching property short reels found.</p>
        </div>`;
        return;
    }

    reelsData.forEach((x, index) => {
        let div = document.createElement('div');
        div.className = "single-reel-block";
        div.setAttribute('data-index', index);
        let soundIconClass = isReelsMuted ? "ph-bold ph-speaker-slash text-base text-red-400" : "ph-bold ph-speaker-high text-base text-emerald-400";

        div.innerHTML = `
            <video src="${x.video}" loop ${isReelsMuted ? 'muted' : ''} playsinline preload="auto" onclick="toggleReelPlaybackEvent(this)"></video>
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40 pointer-events-none"></div>
            
            <div class="absolute bottom-14 left-4 right-16 text-white space-y-1 z-30 pointer-events-none">
                <div class="flex items-center gap-1.5">
                    <span class="bg-[#0b1329] text-brand-gold font-bold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded shadow border border-slate-800">${x.role}</span>
                    <h4 class="font-bold text-xs uppercase truncate tracking-tight drop-shadow-md">${x.bhk} ${x.type}</h4>
                </div>
                <p class="text-[10px] font-semibold text-slate-200 truncate drop-shadow-md"><i class="ph-fill ph-map-pin text-xs text-red-500 inline mr-0.5"></i>${x.locality}, ${x.city}</p>
                <p class="text-sm font-extrabold text-brand-gold tracking-tight drop-shadow-lg">₹${x.price.toLocaleString('en-IN')}</p>
            </div>

            <div class="absolute bottom-16 right-3 flex flex-col items-center gap-3 z-40">
                <button onclick="toggleReelsMuteState(); event.stopPropagation();" class="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white active:scale-95 transition-all shadow-xl">
                    <i class="${soundIconClass} reels-mute-icon"></i>
                </button>
                <button onclick="toggleBookmarkClientState('${x.id}', this); event.stopPropagation();" class="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white active:scale-95 transition-all shadow-xl">
                    <i class="${x.saved ? 'ph-fill ph-bookmark text-amber-400 text-base' : 'ph ph-bookmark text-base'}"></i>
                </button>
                <button onclick="openOlxChatSimulation('${x.id}'); event.stopPropagation();" class="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center text-base shadow-xl active:scale-95 transition-all">
                    <i class="ph-fill ph-chats-teardrop"></i>
                </button>
                <button onclick="openShareToolkitChannel('${x.id}'); event.stopPropagation();" class="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-base shadow-xl active:scale-95 transition-all">
                    <i class="ph-bold ph-share-network"></i>
                </button>
                <button onclick="openPropertyDetailsModal('${x.id}'); event.stopPropagation();" class="w-10 h-10 bg-slate-900/80 backdrop-blur-md text-white rounded-full flex items-center justify-center text-base shadow-xl active:scale-95 transition-all">
                    <i class="ph ph-info"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });

    setTimeout(() => { manageReelsIntersectionEngine(); }, 200);
}

function openShareToolkitChannel(id) {
    let item = database.find(x => x.id === id);
    if (!item) return;
    currentlyTargetedShareNodeData = item;
    let textMessage = `*MamaDealing Premium Asset Hub*\n\n🔥 *${item.bhk} ${item.type}* available!\n📍 *Location:* ${item.locality}, ${item.city}\n💰 *Target Valuation:* ₹${item.price.toLocaleString('en-IN')}`;
    let encodedText = encodeURIComponent(textMessage);
    let sw = document.getElementById('shareWAActionChannelNode');
    if (sw) { sw.onclick = () => { window.open(`https://wa.me/?text=${encodedText}`); }; }
    let sc = document.getElementById('shareCopyLinkActionChannelNode');
    if (sc) {
        sc.onclick = () => {
            navigator.clipboard.writeText(`https://mamadealing.com/property/${item.id}`).then(() => {
                alert("📋 Link cloned to clipboard successfully!");
                closeFeature('shareToolkitModal');
            });
        };
    }
    openFeature('shareToolkitModal');
}

function openShareToolkitChannelFromDetail() {
    if (targetDetailItemInstance) {
        openShareToolkitChannel(targetDetailItemInstance.id);
    }
}

function toggleReelPlaybackEvent(vid) {
    if(vid.paused) { vid.play().catch(e => {}); } else { vid.pause(); }
}

function manageReelsIntersectionEngine() {
    let container = document.getElementById('reelScrollContainer');
    if (!container) return;
    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            let vid = entry.target.querySelector('video');
            if(!vid) return;
            if(entry.isIntersecting) {
                vid.muted = isReelsMuted;
                vid.play().catch(e => {});
            } else {
                vid.pause();
                vid.currentTime = 0;
            }
        });
    }, { root: container, threshold: 0.6 });

    container.querySelectorAll('.single-reel-block').forEach(block => { observer.observe(block); });
}

function handleReelKeyboardNavigation(e) {
    if(currentActiveTab !== "reels") return;
    let container = document.getElementById('reelScrollContainer');
    if (!container) return;
    if(e.key === "ArrowDown") {
        container.scrollBy({ top: container.clientHeight, behavior: 'smooth' });
        e.preventDefault();
    } else if(e.key === "ArrowUp") {
        container.scrollBy({ top: -container.clientHeight, behavior: 'smooth' });
        e.preventDefault();
    }
}

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))); 
}

function triggerNearMeLocationEngine() {
    const nearMeBtn = document.getElementById('nearMeTriggerBtn');
    if (!navigator.geolocation) {
        alert("⚠️ Geolocation is not supported by your browser framework.");
        return;
    }
    if (scanRadiusActive) {
        scanRadiusActive = false;
        deviceCoordinates = null;
        if (nearMeBtn) {
            nearMeBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
            nearMeBtn.classList.add('bg-brand-gold', 'hover:bg-brand-gold-hover');
            nearMeBtn.innerHTML = `<i class="ph-bold ph-crosshair text-xs animate-pulse"></i> Near Me`;
        }
        render();
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            deviceCoordinates = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            scanRadiusActive = true;
            if (nearMeBtn) {
                nearMeBtn.classList.remove('bg-brand-gold', 'hover:bg-brand-gold-hover');
                nearMeBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
                nearMeBtn.innerHTML = `<i class="ph-bold ph-check text-xs"></i> Near Active`;
            }
            render();
        },
        () => { alert("⚠️ Location access denied. Please enable location permissions."); },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
}

function resetAllFilters() {
    const searchInp = document.getElementById('searchInput');
    const typeFilter = document.getElementById('filterType');
    const priceFilter = document.getElementById('priceFilter');
    if (searchInp) searchInp.value = "";
    if (typeFilter) typeFilter.value = "All";
    if (priceFilter) priceFilter.value = 50000000;
    updatePriceFilter(50000000);
    activeCategoryFilter = "All";
    selectedGlobalState = "All States (Entire India)";
    selectedGlobalCity = "All";
    let label = document.getElementById('selectedGlobalCityLabel');
    if (label) label.innerText = "All India";
    currentPropertiesPage = 1;
    render();
}

function openOlxChatSimulation(id = null) {
    let item = (id && id !== 'null') ? database.find(x => String(x.id) === String(id)) : targetDetailItemInstance;
    if (!item) {
        alert("⚠️ No active property selected.");
        return;
    }

    targetDetailItemInstance = item;
    
    let sellerName = item.firmName ? item.firmName : "Owner";
    document.getElementById('chatSellerName').innerText = sellerName;
    document.getElementById('chatSellerAvatar').innerText = sellerName.charAt(0).toUpperCase();

    let chatData = activeChatsStorage.find(c => String(c.propertyId) === String(item.id));
    if (!chatData) {
        chatData = {
            propertyId: item.id,
            sellerName: sellerName,
            propertyTitle: `${item.bhk} ${item.type}`,
            messages: [
                { sender: 'seller', text: `Hi, thank you for showing interest in my property in ${item.locality}, ${item.city}. Let me know if you have any questions!`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), read: true }
            ]
        };
        activeChatsStorage.push(chatData);
        localStorage.setItem('olx_chats_storage', JSON.stringify(activeChatsStorage));
    }

    renderOlxChatMessages(chatData);
    openFeature('olxChatDialogModal');
    renderMyChatsHistoryList();
}

function renderOlxChatMessages(chatData) {
    let flow = document.getElementById('olxChatMessageFlow');
    if (!flow) return;
    flow.innerHTML = "";
    
    chatData.messages.forEach(m => {
        let div = document.createElement('div');
        div.className = m.sender === 'user' ? "flex justify-end" : "flex justify-start";
        
        let bubbleClass = m.sender === 'user' ? "bg-slate-900 dark:bg-slate-800 text-white rounded-2xl rounded-tr-none" : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border dark:border-slate-800 rounded-2xl rounded-tl-none shadow-sm";
        let ticks = m.sender === 'user' ? (m.read ? `<i class="ph-fill ph-checks text-brand-gold ml-1"></i>` : `<i class="ph ph-check text-slate-300 ml-1"></i>`) : "";

        div.innerHTML = `
            <div class="${bubbleClass} p-2.5 text-xs font-semibold max-w-[80%] space-y-1 animate-slide-up">
                <p class="leading-relaxed">${m.text}</p>
                <div class="text-[8px] flex items-center justify-end text-white/70 ${m.sender === 'user' ? '' : 'text-slate-400'}">
                    <span>${m.time}</span> ${ticks}
                </div>
            </div>
        `;
        flow.appendChild(div);
    });
    flow.scrollTop = flow.scrollHeight;
}

function sendUserChatMessageSimulation() {
    let input = document.getElementById('olxChatMessageInput');
    if (!input || !input.value.trim() || !targetDetailItemInstance) return;
    
    let chatData = activeChatsStorage.find(c => String(c.propertyId) === String(targetDetailItemInstance.id));
    if (!chatData) return;

    let userText = input.value.trim();
    let msgObj = {
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        read: false
    };
    
    chatData.messages.push(msgObj);
    localStorage.setItem('olx_chats_storage', JSON.stringify(activeChatsStorage));
    renderOlxChatMessages(chatData);
    input.value = "";

    setTimeout(() => {
        msgObj.read = true;
        localStorage.setItem('olx_chats_storage', JSON.stringify(activeChatsStorage));
        renderOlxChatMessages(chatData);

        let typingInd = document.getElementById('olxChatTypingIndicator');
        if (typingInd) typingInd.classList.remove('hidden');

        setTimeout(() => {
            if (typingInd) typingInd.classList.add('hidden');
            let replies = [
                "Sure, we can schedule a call tomorrow. What time fits you?",
                "Yes, the price is negotiable on table discussions.",
                "Yes, it is completely cleared title and RERA certified.",
                "Thank you, let me check the slot availability for site visit."
            ];
            let randomReply = replies[Math.floor(Math.random() * replies.length)];
            chatData.messages.push({
                sender: 'seller',
                text: randomReply,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                read: true
            });
            localStorage.setItem('olx_chats_storage', JSON.stringify(activeChatsStorage));
            renderOlxChatMessages(chatData);
        }, 2000);
    }, 1500);
}

function handleLockedPhoneAction() {
    if (userSubscribedPlan === "Free") {
        alert("🔒 Landlord Direct Number is protected! Purchase Premium Plans to unlock direct contact numbers.");
        openFeature('platformSubscriptionPlansModal');
    } else {
        if(targetDetailItemInstance) {
            alert(`📞 Landlord Phone Number: +91 ${targetDetailItemInstance.phone}`);
        }
    }
}

function triggerScamReportAction() {
    if (!targetDetailItemInstance) return;
    
    let count = propertyReportsTracker[targetDetailItemInstance.id] || 0;
    count++;
    propertyReportsTracker[targetDetailItemInstance.id] = count;
    localStorage.setItem('property_scam_reports', JSON.stringify(propertyReportsTracker));
    
    alert("⚠️ Property reported! Once reports count reaches 3, listing details will be auto-purged.");
    
    if (count >= 3) {
        database = database.filter(x => String(x.id) !== String(targetDetailItemInstance.id));
        closePropertyDetailModalBlock();
        render();
    }
}

function render() {
    let grid = document.getElementById('propertyGrid');
    if (!grid) return;
    
    let searchInp = document.getElementById('searchInput');
    let q = searchInp ? searchInp.value.toLowerCase() : '';
    let typeEl = document.getElementById('filterType');
    let type = typeEl ? typeEl.value : 'All';
    let priceEl = document.getElementById('priceFilter');
    let maxPrice = priceEl ? parseInt(priceEl.value) : 50000000;

    let filtered = database.filter(x => {
        if(x.status === "Expired") return false;
        if(activeCategoryFilter !== "All" && x.cat !== activeCategoryFilter) return false;
        if(type !== "All" && x.type !== type) return false;
        if(x.price > maxPrice) return false;

        if (selectedGlobalState && selectedGlobalState !== "All States (Entire India)") {
            if (x.state !== selectedGlobalState) return false;
        }
        if (selectedGlobalCity && selectedGlobalCity !== "All") {
            if (x.city !== selectedGlobalCity) return false;
        }

        if (scanRadiusActive && deviceCoordinates) {
            let radEl = document.getElementById('nearMeRadius');
            let selectedRadiusLimit = radEl ? parseFloat(radEl.value) : 10;
            let distanceInKm = calculateHaversineDistance(deviceCoordinates.latitude, deviceCoordinates.longitude, x.latitude || 23.259933, x.longitude || 77.412613);
            if (distanceInKm > selectedRadiusLimit) return false;
        }

        if(q) {
            let match = x.locality.toLowerCase().includes(q) || x.city.toLowerCase().includes(q) || x.state.toLowerCase().includes(q);
            if(!match) return false;
        }
        return true;
    });

    filtered.sort((a, b) => {
        const tierWeights = { "Enterprise Builder": 4, "Pro Business": 3, "Owner Premium": 2, "Free": 1 };
        const weightA = tierWeights[a.membershipTier] || 1;
        const weightB = tierWeights[b.membershipTier] || 1;
        if (a.isSoldOut !== b.isSoldOut) { return a.isSoldOut ? 1 : -1; }
        return weightB - weightA;
    });

    let counterEl = document.getElementById('inventoryCounter');
    if (counterEl) counterEl.innerText = `${filtered.length} Active Nodes Checked`;
    grid.innerHTML = "";

    if(filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center space-y-1.5">
            <i class="ph ph-database text-3xl text-slate-300"></i>
            <p class="text-[11px] font-semibold text-slate-400">Zero active asset matches found in database stream.</p>
        </div>`;
        renderPaginationControls(0);
        return;
    }

    let totalItems = filtered.length;
    let totalPages = Math.ceil(totalItems / propertiesPerPageLimit);
    let startIndex = (currentPropertiesPage - 1) * propertiesPerPageLimit;
    let endIndex = startIndex + propertiesPerPageLimit;
    let pageItems = filtered.slice(startIndex, endIndex);

    pageItems.forEach(x => {
        let div = document.createElement('div');
        div.className = "p-card relative overflow-hidden shadow-sm hover:shadow-md dark:bg-[#131e3a] dark:border-slate-800 transition-all duration-200 animate-slide-up cursor-pointer";
        
        // Dynamic onclick binder to allow full card click, preventing trigger on bookmark button
        div.onclick = (e) => {
            if (e.target.closest('.ph-bookmark') || e.target.closest('button')) {
                return;
            }
            openPropertyDetailsModal(x.id);
        };

        let badgeColor = x.role === "Owner" ? "from-slate-900 to-slate-850 text-brand-gold" : x.role === "Builder" ? "from-emerald-600 to-teal-500 text-white" : "from-purple-600 to-indigo-500 text-white";
        let dynamicFirmLabelStr = x.firmName ? `<p class="text-[9px] text-slate-500 dark:text-slate-400 font-bold truncate mt-0.5"><i class="ph-fill ph-buildings inline"></i> ${x.firmName}</p>` : `<p class="text-[9px] text-brand-gold font-bold mt-0.5">🔒 Verified Landlord</p>`;
        let premiumVisualBadge = (x.membershipTier && x.membershipTier !== "Free") ? `<span class="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow z-10"><i class="ph-fill ph-crown text-slate-900"></i> PRO</span>` : '';
        let displayTypeTitle = (x.bhk && x.bhk !== "Any BHK Configuration" ? `${x.bhk} ` : "") + x.type;

        div.innerHTML = `
            <div class="relative h-44 sm:h-48 bg-slate-900 overflow-hidden">
                <img src="${x.images && x.images.length > 0 ? x.images[0] : NO_IMAGE_FALLBACK}" alt="Asset Preview" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                <span class="absolute top-2.5 left-2.5 bg-gradient-to-tr ${badgeColor} font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm z-10">${x.role}</span>
                ${premiumVisualBadge}
                ${(x.video && x.video !== "") ? `<span class="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md text-white w-6 h-6 rounded-full flex items-center justify-center text-xs z-10"><i class="ph-fill ph-play text-amber-400"></i></span>` : ''}
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-955 to-transparent p-3 pt-8">
                    <span class="bg-[#050b18]/70 border border-slate-800 text-brand-gold font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">${x.cat}</span>
                    <p class="text-white text-sm font-extrabold tracking-tight mt-1">₹${x.price.toLocaleString('en-IN')}</p>
                </div>
            </div>
            <div class="p-3 space-y-1.5">
                <div class="flex justify-between items-start gap-1">
                    <h3 class="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-tight truncate cursor-pointer">${displayTypeTitle}</h3>
                    <button onclick="toggleBookmarkClientState('${x.id}', this)" class="text-lg ${x.saved ? 'text-amber-500 ph-fill' : 'text-slate-400 ph'} ph-bookmark"></button>
                </div>
                <p class="text-[9px] text-amber-700 dark:text-amber-400 font-extrabold bg-amber-50 dark:bg-amber-955/60 border border-amber-200 dark:border-amber-900/50 inline-block px-1.5 py-0.5 rounded">${x.status || 'Ready to Move'}</p>
                <p class="text-[10px] text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-0.5 truncate mt-0.5"><i class="ph-fill ph-map-pin text-slate-400"></i> ${x.locality}, ${x.city}</p>
                <div class="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>${dynamicFirmLabelStr}</div>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });

    renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
    let container = document.getElementById('propertyPagination');
    if (!container) return;
    container.innerHTML = "";
    if (totalPages <= 1) return;

    let prevBtn = document.createElement('button');
    prevBtn.className = "px-2.5 py-1.5 rounded-lg border dark:border-slate-800 text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all";
    prevBtn.innerText = "Prev";
    prevBtn.disabled = currentPropertiesPage === 1;
    prevBtn.onclick = () => { currentPropertiesPage--; render(); };
    container.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement('button');
        btn.className = `px-2.5 py-1.5 rounded-lg border dark:border-slate-800 text-[10px] font-bold transition-all ${currentPropertiesPage === i ? 'bg-[#0b1329] dark:bg-slate-800 text-brand-gold border-slate-900' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`;
        btn.innerText = i;
        btn.onclick = () => { currentPropertiesPage = i; render(); };
        container.appendChild(btn);
    }

    let nextBtn = document.createElement('button');
    nextBtn.className = "px-2.5 py-1.5 rounded-lg border dark:border-slate-800 text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all";
    nextBtn.innerText = "Next";
    nextBtn.disabled = currentPropertiesPage === totalPages;
    nextBtn.onclick = () => { currentPropertiesPage++; render(); };
    container.appendChild(nextBtn);
}

function renderB2bServicesHub() {
    let grid = document.getElementById('b2bServicesGrid');
    if(!grid) return;
    grid.innerHTML = "";

    let filterState = document.getElementById('filterServiceState')?.value || "All";
    let filterCity = document.getElementById('filterServiceCity')?.value || "All";

    let filteredServices = servicesDatabase;
    if(activeB2bCategoryFilter !== "All") { 
        filteredServices = servicesDatabase.filter(x => x.category === activeB2bCategoryFilter); 
    }

    if (filterState !== "All") {
        filteredServices = filteredServices.filter(x => x.state === filterState);
    }
    if (filterCity !== "All") {
        filteredServices = filteredServices.filter(x => x.city === filterCity);
    }

    if(filteredServices.length === 0) {
        grid.innerHTML = `<div class="p-6 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 col-span-full font-semibold text-xs animate-slide-up">No active professional partners registered in this area yet.</div>`;
        return;
    }

    filteredServices.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-white dark:bg-[#131e3a] p-3.5 rounded-xl border border-slate-100 dark:border-[#1e2d54] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-slide-up shadow-sm transition-colors";
        div.innerHTML = `
            <div class="space-y-0.5">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <h3 class="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-tight">${x.title}</h3>
                    <span class="bg-[#0b1329] dark:bg-slate-800 text-brand-gold border border-slate-850 dark:border-slate-700 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5"><i class="ph-fill ph-seal-check"></i> Expert</span>
                </div>
                <p class="text-[10px] text-slate-600 dark:text-slate-300 font-semibold"><span class="text-slate-900 dark:text-slate-200 font-bold">Speciality:</span> ${x.specialty}</p>
                <div class="flex items-center gap-1.5 pt-0.5 text-[9px] font-medium">
                    <span class="text-amber-500 font-bold"><i class="ph-fill ph-star"></i> ${x.rating}</span>
                    <span class="text-slate-500 dark:text-slate-400">| ${x.city}, ${x.state}</span>
                </div>
            </div>
            <a href="tel:${x.phone}" class="w-full sm:w-auto bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 text-center font-bold text-[9px] uppercase px-3.5 py-2 rounded-lg flex items-center justify-center gap-1 transition-all"><i class="ph-fill ph-phone text-brand-gold"></i> Dial</a>
        `;
        grid.appendChild(div);
    });
}

function submitNewB2bDirectoryProvider() {
    let title = document.getElementById('b2bFormTitle').value.trim();
    let cat = document.getElementById('b2bFormCategory').value;
    let spec = document.getElementById('b2bFormSpecialty').value.trim();
    let phone = document.getElementById('b2bFormPhone').value.trim();
    let state = document.getElementById('b2bFormState').value;
    let city = document.getElementById('b2bFormCity').value;

    if (!title || !spec || !phone || !state || !city) {
        alert("⚠️ Complete all required parameters first.");
        return;
    }

    let newService = {
        id: Date.now(),
        category: cat,
        title: title,
        phone: phone,
        specialty: spec,
        rating: 5.0,
        reviews: 1,
        state: state,
        city: city
    };

    servicesDatabase.unshift(newService);
    renderB2bServicesHub();
    alert("🎉 Successfully added to service network!");
    closeFeature('addB2bModal');
}

function loadB2bFormCities() {
    let state = document.getElementById('b2bFormState').value;
    let cityEl = document.getElementById('b2bFormCity');
    if (!cityEl) return;
    cityEl.innerHTML = '<option value="">-- Choose District --</option>';
    if (state && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cityEl.innerHTML += `<option value="${ci}">${ci}</option>`;
        });
    }
}

function initB2bFormStateSelector() {
    let stateEl = document.getElementById('b2bFormState');
    if (!stateEl) return;
    stateEl.innerHTML = '<option value="">-- Choose State --</option>';
    Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
        if (st !== "All States (Entire India)") {
            stateEl.innerHTML += `<option value="${st}">${st}</option>`;
        }
    });
}

function submitVipCallbackRequest() {
    let name = document.getElementById('vipCallbackName').value.trim();
    let phone = document.getElementById('vipCallbackPhone').value.trim();
    let date = document.getElementById('visitPreferredDate')?.value || "Not Chosen";
    let time = document.getElementById('visitPreferredTime')?.value || "Not Chosen";

    if (!name || !phone) {
        alert("⚠️ Please provide standard contact details.");
        return;
    }
    alert(`✅ Success! Site visit scheduled for Date: ${date} Time: ${time}. Our agent will contact you soon.`);
    closeFeature('assistedSellingModal');
}

function renderMyChatsHistoryList() {
    let profileDashboardContainer = document.getElementById('profileActiveChatsDashboardList');
    
    let htmlContent = "";
    if (activeChatsStorage.length === 0) {
        htmlContent = `<p class="text-xs text-slate-500 dark:text-slate-400 py-4 text-center font-semibold">No active conversations found yet.</p>`;
    } else {
        activeChatsStorage.forEach(chat => {
            htmlContent += `
                <div onclick="openOlxChatSimulation('${chat.propertyId}')" class="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-[#1e2d54] border dark:border-slate-700 rounded-xl cursor-pointer transition-all flex justify-between items-center animate-slide-up">
                    <div class="space-y-0.5">
                        <p class="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase flex items-center gap-1"><i class="ph-fill ph-user-circle text-brand-gold text-base"></i> ${chat.sellerName}</p>
                        <p class="text-[9px] text-slate-500 dark:text-slate-400 font-semibold"><span class="text-slate-400">Unit:</span> ${chat.propertyTitle}</p>
                    </div>
                    <i class="ph-bold ph-caret-right text-slate-400 text-xs"></i>
                </div>
            `;
        });
    }

    if (profileDashboardContainer) profileDashboardContainer.innerHTML = htmlContent;
}

function renderSavedBookmarksDashboard() {
    let grid = document.getElementById('savedPropertiesDashboardGrid');
    if (!grid) return;
    let saved = database.filter(x => x.saved);
    grid.innerHTML = "";
    if(saved.length === 0) {
        grid.innerHTML = `<p class="text-xs font-semibold text-slate-500 dark:text-slate-400 col-span-full py-4 text-center">No properties saved yet.</p>`;
        return;
    }
    saved.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1e2d54] transition-all";
        div.onclick = () => openPropertyDetailsModal(x.id);
        div.innerHTML = `<div><h4 class="font-bold text-[11px] text-slate-900 dark:text-white uppercase">${x.type}</h4><span class="text-slate-900 dark:text-slate-200 font-extrabold text-[11px] block mt-0.5">₹${x.price.toLocaleString('en-IN')}</span></div><i class="ph-fill ph-caret-right text-slate-400 text-xs"></i>`;
        grid.appendChild(div);
    });
}

function renderMyPropertiesManagementWorkspace() {
    let container = document.getElementById('myPropertiesManagementContainer');
    if(!container) return;
    container.innerHTML = "";
    if (!sessionUser) {
        container.innerHTML = `<p class="text-xs font-semibold text-slate-500 dark:text-slate-400 py-2 text-center">Please log in to manage your listed assets.</p>`;
        return;
    }
    let myProperties = database.filter(x => String(x.phone) === String(sessionUser.phone));
    if (myProperties.length === 0) {
        container.innerHTML = `<p class="text-xs font-semibold text-slate-500 dark:text-slate-400 py-2 text-center">You have not posted any properties yet.</p>`;
        return;
    }
    myProperties.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-white dark:bg-[#131e3a] border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up shadow-sm transition-colors";
        div.innerHTML = `
            <div class="space-y-0.5">
                <h4 class="font-bold text-xs text-slate-900 dark:text-white uppercase">${x.bhk} ${x.type}</h4>
                <p class="text-[10px] text-slate-500 font-medium"><i class="ph-fill ph-map-pin"></i> ${x.locality}, ${x.city}</p>
            </div>
            <div class="flex gap-2 w-full md:w-auto">
                <button onclick="deletePropertyListing('${x.id}')" class="bg-red-50 dark:bg-red-955/20 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase px-3.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/40 w-full md:w-auto">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateRecentlyViewedTray() {
    let container = document.getElementById('recentlyViewedContainer');
    if (!container) return;
    let textIdList = JSON.parse(localStorage.getItem('recently_viewed_properties')) || [];
    container.innerHTML = "";
    let recentItems = database.filter(x => textIdList.includes(x.id));
    if (recentItems.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-500 dark:text-slate-400 col-span-full py-4 text-center font-semibold animate-slide-up">No recently viewed listings.</p>`;
        return;
    }
    recentItems.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1e2d54] transition-all";
        div.onclick = () => openPropertyDetailsModal(x.id);
        div.innerHTML = `<div><h4 class="font-bold text-[11px] text-slate-900 dark:text-white uppercase">${x.type}</h4><span class="text-slate-900 dark:text-slate-200 font-extrabold text-[11px] block mt-0.5">₹${x.price.toLocaleString('en-IN')}</span></div><i class="ph-fill ph-caret-right text-slate-400 text-xs"></i>`;
        container.appendChild(div);
    });
}

function addToRecentlyViewed(id) {
    let recentIds = JSON.parse(localStorage.getItem('recently_viewed_properties')) || [];
    recentIds = recentIds.filter(x => x !== id);
    recentIds.unshift(id);
    recentIds = recentIds.slice(0, 6);
    localStorage.setItem('recently_viewed_properties', JSON.stringify(recentIds));
    updateRecentlyViewedTray();
}

function selectPremiumPlan(planType, price) {
    if (!sessionUser) { alert("⚠️ Pehle profile login karein."); openFeature('loginModal'); return; }
    if (price === 0) {
        userSubscribedPlan = "Free";
        alert("✅ Free tier selected.");
        closeFeature('platformSubscriptionPlansModal');
        renderProfileSectionWorkspace();
        return;
    }
    userSubscribedPlan = planType;
    alert(`🎉 Success! Upgraded to ${planType} Plan.`);
    closeFeature('platformSubscriptionPlansModal');
    renderProfileSectionWorkspace();
}

function adjustPostSpecsVisibility() {
    let typeEl = document.querySelector('input[name="form_type"]:checked');
    let selectedType = typeEl ? typeEl.value : 'Flat';
    
    let bhkBox = document.getElementById('bhkSpecContainer');
    let areaBox = document.getElementById('areaSpecContainer');
    let areaLabel = document.getElementById('areaLabelNode');
    
    if (selectedType === "Plot") {
        if (bhkBox) bhkBox.classList.add('hidden');
        if (areaBox) { areaBox.className = "col-span-2"; }
        if (areaLabel) areaLabel.innerText = "Total Plot Area (Sq.Ft.)";
    } else {
        if (bhkBox) bhkBox.classList.remove('hidden');
        if (areaBox) { areaBox.className = "col-span-1"; }
        if (areaLabel) areaLabel.innerText = "Built-up Area (Sq.Ft.)";
    }
}

function moveStep(st) {
    document.querySelectorAll('.step-div').forEach(x => x.classList.add('hidden'));
    
    let stepDiv = document.getElementById(`step-v${st}`);
    if (stepDiv) stepDiv.classList.remove('hidden');

    const stages = ['1', '2', '3'];
    stages.forEach(s => {
        let ind = document.getElementById(`postStepIndicator${s}`);
        if (ind) {
            if (parseInt(s) <= st) {
                ind.className = "w-3.5 h-1 bg-[#0b1329] dark:bg-slate-100 rounded-full transition-all";
            } else {
                ind.className = "w-3.5 h-1 bg-slate-200 dark:bg-slate-800 rounded-full transition-all";
            }
        }
    });

    if (st === 2) { adjustPostSpecsVisibility(); }
}

function compressImage(file, maxWidth = 1024, quality = 0.7) {
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            let img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
                canvas.width = width; canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
        };
    });
}

async function handlePhotoSelection(event) {
    let files = Array.from(event.target.files);
    if (selectedPhotosBase64.length + files.length > 10) {
        alert("⚠️ Maximum 10 photos limit reached.");
        files = files.slice(0, 10 - selectedPhotosBase64.length);
    }
    for (let file of files) {
        try {
            let base64Data = await compressImage(file, 1024, 0.7);
            selectedPhotosBase64.push(base64Data);
        } catch (e) { console.error(e); }
    }
    renderPhotoPreviews();
}

function handleVideoSelection(event) {
    let file = event.target.files[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) { 
        alert("⚠️ Selected video file is too large (Maximum allowed size: 25MB).");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(e) {
        selectedVideoBase64 = e.target.result;
        let preview = document.getElementById('formVideoPreview');
        let container = document.getElementById('videoPreviewContainer');
        if (preview && container) {
            preview.src = selectedVideoBase64;
            container.classList.remove('hidden');
        }
    };
    reader.readAsDataURL(file);
}

function removeSelectedVideo() {
    selectedVideoBase64 = "";
    let preview = document.getElementById('formVideoPreview');
    let container = document.getElementById('videoPreviewContainer');
    let input = document.getElementById('realVideoInputNode');
    if (preview) preview.src = "";
    if (container) container.classList.add('hidden');
    if (input) input.value = "";
}

function renderPhotoPreviews() {
    let container = document.getElementById('imagePreviewContainer');
    if (!container) return;
    container.innerHTML = "";
    selectedPhotosBase64.forEach((base64, index) => {
        let card = document.createElement('div');
        card.className = "relative group w-14 h-14 rounded-lg overflow-hidden border dark:border-slate-800 bg-slate-100 dark:bg-slate-800 animate-scale-in";
        card.innerHTML = `
            <img src="${base64}" class="w-full h-full object-cover">
            <button type="button" onclick="removeSelectedPhoto(${index})" class="absolute top-0.5 right-0.5 bg-red-600 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px]"><i class="ph-bold ph-trash font-bold"></i></button>
        `;
        container.appendChild(card);
    });
}

function removeSelectedPhoto(idx) {
    selectedPhotosBase64.splice(idx, 1);
    renderPhotoPreviews();
}

async function publishFinal() {
    let typeEl = document.querySelector('input[name="form_type"]:checked');
    let type = typeEl ? typeEl.value : 'Flat';
    let catEl = document.querySelector('input[name="form_cat"]:checked');
    let cat = catEl ? catEl.value : 'Buy';
    
    let stateEl = document.getElementById('stateInp');
    let state = stateEl ? stateEl.value : '';
    let cityEl = document.getElementById('cityInp');
    let city = cityEl ? cityEl.value : '';
    let localityEl = document.getElementById('localityInp');
    let locality = localityEl ? localityEl.value : '';
    let priceEl = document.getElementById('propPrice');
    let price = priceEl ? parseInt(priceEl.value) : NaN;

    if(!state || !city || !locality || isNaN(price)) { alert("⚠️ Please check location & pricing parameters."); return; }

    let finalImagesArray = [...selectedPhotosBase64];
    if (finalImagesArray.length === 0) {
        finalImagesArray.push(NO_IMAGE_FALLBACK);
    }

    let generatedId = "user-" + Date.now();
    
    let bhkEl = document.getElementById('formBhkInp');
    let areaEl = document.getElementById('formAreaInp');

    let propertyPayload = {
        id: generatedId,
        type: type,
        bhk: type === "Plot" ? "Plot" : (bhkEl ? bhkEl.value : "3 BHK"),
        area: areaEl ? (parseInt(areaEl.value) || 1000) : 1000,
        bathrooms: type === "Plot" ? "" : "2",
        furnishing: type === "Plot" ? "Unfurnished" : "Semi-Furnished",
        cat: cat,
        price: price,
        state: state,
        city: city,
        locality: locality,
        role: sessionUser ? sessionUser.role : "Owner",
        status: "Active",
        phone: sessionUser ? sessionUser.phone : "9000000000",
        images: finalImagesArray, 
        video: selectedVideoBase64,  
        saved: false,
        firmName: sessionUser ? sessionUser.firmName : "",
        rera: "",
        latitude: 23.259933 + (Math.random() - 0.5) * 0.1,
        longitude: 77.412613 + (Math.random() - 0.5) * 0.1,
        membershipTier: userSubscribedPlan,
        facing: "East",
        floorNo: type === "Plot" ? "" : "Ground",
        age: type === "Plot" ? "" : "New Build",
        description: "Direct asset owner verified listing. Clean paperwork and immediate possession."
    };

    database.unshift(propertyPayload);
    render();

    alert("🎉 Asset successfully listed on the platform!");
    closeFeature('postProperty');
    
    removeSelectedVideo();
    selectedPhotosBase64 = [];
    
    try {
        await fetch(`${BACKEND_BASE_URL}/api/properties`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(propertyPayload)
        });
    } catch (err) {
        console.warn("API sync skipped.");
    }
}

async function fetchLivePropertiesFromDatabase() {
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/properties`);
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        const liveProperties = await response.json();
        if (Array.isArray(liveProperties) && liveProperties.length > 0) {
            liveProperties.forEach(property => {
                let localityName = property.location || "Ayodhya Bypass";
                let cityName = "Bhopal";
                let stateName = "Madhya Pradesh";
                
                if (property.location && property.location.includes(',')) {
                    let parts = property.location.split(',');
                    localityName = parts[0].trim();
                    cityName = parts[1].trim();
                    if (parts[2]) stateName = parts[2].trim();
                }

                let imgArray = Array.isArray(property.images) ? property.images : (property.images ? [property.images] : [NO_IMAGE_FALLBACK]);

                let mappedDataNode = {
                    id: property._id || (Date.now() + Math.random()), 
                    type: property.propertyType || "Plot",
                    bhk: property.bhk || "3 BHK",
                    area: property.area || null,
                    bathrooms: property.bathrooms || "2",
                    furnishing: property.furnishing || "Unfurnished",
                    cat: "Buy",
                    price: Number(property.price) || 0,
                    state: stateName,
                    city: cityName,
                    locality: localityName,
                    role: "Owner", 
                    status: property.status || "Active",
                    lastRenewedAt: property.lastRenewedAt || property.createdAt || new Date().toISOString(),
                    phone: property.phone ? String(property.phone).trim() : "9000000000",
                    images: imgArray,
                    video: property.video || "", 
                    saved: false,
                    firmName: property.firmName || "",
                    rera: property.rera || "",
                    latitude: property.latitude || 23.259933,
                    longitude: property.longitude || 77.412613,
                    isSoldOut: property.isSoldOut || false,
                    membershipTier: property.membershipTier || "Free",
                    facing: property.facing || "East",
                    floorNo: property.floorNo || "Ground",
                    age: property.age || "New Build"
                };

                if (!database.some(existingNode => String(existingNode.id) === String(mappedDataNode.id))) {
                    database.unshift(mappedDataNode); 
                }
            });
            render(); 
        }
    } catch (error) {
        console.warn("Using local system database fallback:", error);
    }
}

function selectRole(role) {
    authSelectedRole = role;
    document.getElementById('authStep1').classList.add('hidden');
    document.getElementById('authStep2').classList.remove('hidden');
    let extraInput = document.getElementById('authSpecialOnboardingFormBlock');
    let labelNode = document.getElementById('specialLabelNodeInput');
    if (extraInput) {
        if (role === "Broker" || role === "Builder") {
            extraInput.classList.remove('hidden');
            if (labelNode) labelNode.innerText = role === "Broker" ? "Broker / Agency Firm Name" : "Infrastructure Builder Title";
        } else {
            extraInput.classList.add('hidden');
        }
    }
}

function triggerOtpRequestSequence() {
    let phoneVal = document.getElementById('authPhoneInput').value.trim();
    if (!phoneVal || phoneVal.length !== 10 || isNaN(phoneVal)) {
        alert("⚠️ Please enter a valid 10-digit phone number.");
        return;
    }
    
    let otpContainer = document.getElementById('otpInputContainerNode');
    let primaryBtn = document.getElementById('authPrimaryActionSubmitBtn');
    
    if (otpContainer.classList.contains('hidden')) {
        alert("📱 Simulated 6-digit OTP passcode generated & sent successfully via test channel.");
        otpContainer.classList.remove('hidden');
        primaryBtn.innerText = "Verify OTP passcode";
    } else {
        let otpVal = document.getElementById('authOtpInput').value.trim();
        if (otpVal.length !== 6 || isNaN(otpVal)) {
            alert("⚠️ Please enter a 6-digit OTP code.");
            return;
        }
        
        let firmNameVal = document.getElementById('authOnboardingFirmName').value.trim() || (authSelectedRole === "Owner" ? "Direct Landlord" : authSelectedRole + " User");
        
        sessionUser = {
            phone: phoneVal,
            role: authSelectedRole,
            firmName: firmNameVal
        };
        
        alert(`🎉 Success! Logged in as ${sessionUser.firmName}`);
        closeFeature('loginModal');
        
        let authComp = document.getElementById('authDynamicComponent');
        if (authComp) {
            authComp.innerHTML = `<button onclick="switchTab('profile')" class="h-8 px-3 bg-[#0b1329] text-white dark:bg-white dark:text-[#0b1329] rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center justify-center shrink-0">Profile</button>`;
        }
        
        renderProfileSectionWorkspace();
        render();
    }
}

function renderProfileSectionWorkspace() {
    let nameEl = document.getElementById('profileName');
    let phoneEl = document.getElementById('profilePhone');
    let avatarEl = document.getElementById('profileAvatarBadge');
    let badgeSlot = document.getElementById('profileVerificationBadgeSlot');
    
    if (sessionUser) {
        if (nameEl) nameEl.innerText = sessionUser.firmName;
        if (phoneEl) phoneEl.innerText = `+91 ${sessionUser.phone} (${sessionUser.role})`;
        if (avatarEl) avatarEl.innerText = sessionUser.firmName.charAt(0).toUpperCase();
        if (badgeSlot) {
            badgeSlot.innerHTML = `<span class="bg-[#f59e0b] text-[#0b1329] font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow flex items-center gap-0.5"><i class="ph-fill ph-seal-check"></i> VERIFIED</span>`;
        }
    } else {
        if (nameEl) nameEl.innerText = "Guest Session";
        if (phoneEl) phoneEl.innerText = "+91 Authentication Node";
        if (avatarEl) avatarEl.innerText = "G";
        if (badgeSlot) badgeSlot.innerHTML = "";
    }
    
    renderMyChatsHistoryList();
}

function logoutAgent() {
    sessionUser = null;
    alert("🔒 Logged out from active authentication node session.");
    let authComp = document.getElementById('authDynamicComponent');
    if (authComp) {
        authComp.innerHTML = `<button onclick="openFeature('loginModal')" class="bg-white hover:bg-slate-100 text-slate-950 dark:bg-white dark:text-slate-950 px-3.5 h-9 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center border border-slate-200 dark:border-transparent shadow-sm">Login</button>`;
    }
    renderProfileSectionWorkspace();
    switchTab('properties');
}

// Updated toggle bookmark function to support both button styles (preserves button containers cleanly)
function toggleBookmarkClientState(id, el) {
    let item = database.find(x => String(x.id) === String(id));
    if (!item) return;
    item.saved = !item.saved;
    
    let icon = el.querySelector('i');
    if (icon) {
        if (item.saved) {
            icon.className = "ph-fill ph-bookmark text-amber-400 text-base animate-scale-in";
        } else {
            icon.className = "ph ph-bookmark text-base text-white";
        }
    } else {
        if (item.saved) {
            el.className = "text-lg text-amber-500 ph-fill ph-bookmark";
        } else {
            el.className = "text-lg text-slate-400 ph ph-bookmark";
        }
    }
    renderSavedBookmarksDashboard();
    render();
}

function toggleDetailBookmarkState() {
    if (!targetDetailItemInstance) return;
    targetDetailItemInstance.saved = !targetDetailItemInstance.saved;
    updateDetailSaveBtnVisual();
    renderSavedBookmarksDashboard();
    render();
}

function updateDetailSaveBtnVisual() {
    let saveIcon = document.getElementById('detailSaveIcon');
    let saveText = document.getElementById('detailSaveText');
    let saveBtn = document.getElementById('detailModalSaveBtn');
    if (!targetDetailItemInstance || !saveIcon || !saveText || !saveBtn) return;

    if (targetDetailItemInstance.saved) {
        saveIcon.className = "ph-fill ph-bookmark text-amber-500 text-sm";
        saveText.innerText = "Saved";
        saveBtn.className = "bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all";
    } else {
        saveIcon.className = "ph ph-bookmark text-slate-700 dark:text-slate-300 text-sm";
        saveText.innerText = "Save";
        saveBtn.className = "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all";
    }
}

async function deletePropertyListing(id) {
    if(!confirm("Are you sure you want to delete this listing?")) return;
    try {
        let response = await fetch(`${BACKEND_BASE_URL}/api/properties/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert("🗑️ Property deleted successfully.");
        } else {
            alert("🗑️ Listing cleared locally from display buffer.");
        }
    } catch (e) {
        alert("🗑️ Listing cleared locally from display buffer.");
    }
    database = database.filter(x => String(x.id) !== String(id));
    render();
    renderMyPropertiesManagementWorkspace();
}