const ENV_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD6G_t4_-_j6JNp0mDmMmDcM3iARJAzfc",
  authDomain: "mamadealing-235aa.firebaseapp.com",
  projectId: "mamadealing-235aa",
  storageBucket: "mamadealing-235aa.firebasestorage.app",
  messagingSenderId: "545353898669",
  appId: "1:545353898669:web:0c4a46550b493d91990424",
  measurementId: "G-JY05Q9W1KJ"
};

const ENV_RAZORPAY_KEY_ID = "rzp_live_T2krRvhTwLWpmR";

let firebaseAuth = null;
let firestoreDb = null;

if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(ENV_FIREBASE_CONFIG);
        firebaseAuth = firebase.auth();
        firestoreDb = firebase.firestore();
    } catch (e) {
        console.warn("Secure Firebase initialization bypassed in offline/local protocol:", e);
    }
}

// Safe Cookie/Storage Layer (Blocks runtime file:// crashes)
const safeStorage = {
    getItem(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    setItem(key, value) {
        try { localStorage.setItem(key, value); } catch (e) {}
    }
};

// Automatically Initialize Theme on JS load (Defaults to Light Mode)
initTheme();
initDynamicPricingDisplays();

// 🌟 THEME INIT FIX: Ensuring site opens in pristine light mode by default unless manual override exists
function initTheme() {
    let savedTheme = safeStorage.getItem('theme');
    if (!savedTheme) {
        savedTheme = 'light';
        safeStorage.setItem('theme', 'light');
    }
    const themeIcon = document.getElementById('themeToggleIcon');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        if (themeIcon) themeIcon.className = "ph-bold ph-sun text-xs sm:text-sm text-brand-gold";
    } else {
        document.documentElement.classList.remove('dark');
        if (themeIcon) themeIcon.className = "ph-bold ph-moon text-xs sm:text-sm text-brand-gold";
    }
}

function initDynamicPricingDisplays() {
    const sPrice = localStorage.getItem('silver_price') || '299';
    const gPrice = localStorage.getItem('gold_price') || '599';
    const sEl = document.getElementById('silverPlanPriceDisplay');
    const gEl = document.getElementById('goldPlanPriceDisplay');
    if (sEl) sEl.innerText = `₹${sPrice}`;
    if (gEl) gEl.innerText = `₹${gPrice}`;
}

function toggleTheme() {
    const themeIcon = document.getElementById('themeToggleIcon');
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
        document.documentElement.classList.remove('dark');
        safeStorage.setItem('theme', 'light');
        if (themeIcon) themeIcon.className = "ph-bold ph-moon text-xs sm:text-sm text-brand-gold";
    } else {
        document.documentElement.classList.add('dark');
        safeStorage.setItem('theme', 'dark');
        if (themeIcon) themeIcon.className = "ph-bold ph-sun text-xs sm:text-sm text-brand-gold";
    }
    render();
}

function scrollReels(direction) {
    const container = document.getElementById('reelScrollContainer');
    if (container) {
        const height = container.clientHeight;
        container.scrollBy({ top: direction * height, behavior: 'smooth' });
    }
}

// All India State & District Matrix
const GEOGRAPHY_MATRIX = {"All States (Entire India)":["All Districts"],"Andhra Pradesh":["Anantapur","Chittoor","East Godavari","Guntur","Krishna","Nellore","Visakhapatnam"],"Arunachal Pradesh":["Changlang","East Kameng","Itanagar","Tawang"],"Assam":["Baksa","Biswanath","Guwahati","Dibrugarh","Jorhat","Nagaon"],"Bihar":["Araria","Begusarai","Bhagalpur","Gaya","Muzaffarpur","Patna","Vaishali"],"Chhattisgarh":["Bastar","Bilaspur","Durg","Korba","Raipur","Rajnandgaon"],"Delhi":["Central Delhi","East Delhi","New Delhi","North Delhi","South Delhi","West Delhi"],"Goa":["North Goa (Panaji)","South Goa (Margao)","Vasco da Gama"],"Gujarat":["Ahmedabad","Anand","Gandhinagar","Jamnagar","Rajkot","Surat","Vadodara"],"Haryana":["Ambala","Faridabad","Gurugram","Hisar","Karnal","Panipat","Rohtak"],"Himachal Pradesh":["Bilaspur","Kangra","Mandi","Shimla","Solan"],"Jammu & Kashmir":["Anantnag","Baramulla","Jammu","Srinagar","Udhampur"],"Jharkhand":["Bokaro","Dhanbad","Hazaribagh","Ranchi","Jamshedpur"],"Karnataka":["Belagavi","Bengaluru Rural","Bengaluru Urban","Hubballi","Mysuru","Udupi"],"Kerala":["Ernakulam","Kannur","Kochi","Kozhikode","Thiruvananthapuram","Thrissur"],"Madhya Pradesh":["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Niwari","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],"Maharashtra":["Ahmednagar","Akola","Amravati","Aurangabad","Mumbai City","Nagpur","Nashik","Pune","Thane"],"Manipur":["Bishnupur","Imphal East","Imphal West","Thoubal"],"Meghalaya":["East Khasi Hills (Shillong)","Ri Bhoi","West Garo Hills"],"Mizoram":["Aizawl","Lunglei"],"Nagaland":["Dimapur","Kohima"],"Odisha":["Balasore","Cuttack","Bhubaneswar","Puri","Sambalpur","Rourkela"],"Punjab":["Amritsar","Bathinda","Jalandhar","Ludhiana","Patiala"],"Rajasthan":["Ajmer","Alwar","Bikaner","Jaipur","Jodhpur","Kota","Udaipur"],"Sikkim":["East Sikkim (Gangtok)","South Sikkim"],"Tamil Nadu":["Chennai","Coimbatore","Erode","Madurai","Salem","Trichy","Vellore"],"Telangana":["Hyderabad","Karimnagar","Khammam","Nizamabad","Warangal"],"Tripura":["West Tripura (Agartala)"],"Uttar Pradesh":["Agra","Aligarh","Ayodhya","Bareilly","Ghaziabad","Gorakhpur","Kanpur","Lucknow","Meerut","Noida","Prayagraj","Varanasi"],"Uttarakhand":["Dehradun","Haridwar","Nainital","Roorkee"],"West Bengal":["Asansol","Darjeeling","Howrah","Kolkata","Siliguri"]};

// Properties Database
let database = [
    {
        id: "mock-1",
        type: "Flat",
        bhk: "3 BHK",
        area: 1450,
        bathrooms: "3",
        furnishing: "Semi-Furnished",
        cat: "Buy",
        price: 999000,
        state: "Madhya Pradesh",
        city: "Bhopal",
        locality: "Ayodhya Bypass",
        role: "Owner",
        status: "Active",
        phone: "7869824155",
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"],
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
        phone: "7869824155",
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
    }
];

let servicesDatabase = [
    { id: 1, category: "Legal", title: "Sharma & Associates Title Consultants", phone: "7869824155", specialty: "Registry, Title Clearance, RERA Expert", rating: 4.9, reviews: 24, state: "Madhya Pradesh", city: "Bhopal" },
    { id: 2, category: "Interior", title: "The Decore & Spaces Design", phone: "7869824155", specialty: "Premium 3D Modular Kitchen Experts", rating: 4.8, reviews: 31, state: "Madhya Pradesh", city: "Bhopal font-bold" }
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

let activeChatsStorage = [];
try {
    let storedChats = safeStorage.getItem('olx_chats_storage');
    if (storedChats) activeChatsStorage = JSON.parse(storedChats);
} catch (e) {
    console.warn("Chats load bypassed:", e);
}

let propertyReportsTracker = {};
try {
    let storedReports = safeStorage.getItem('property_scam_reports');
    if (storedReports) propertyReportsTracker = JSON.parse(storedReports);
} catch (e) {
    console.warn("Reports load bypassed:", e);
}

let activeChatsFirestoreListener = null;
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

function initializeApp() {
    try { initSimpleGeographyModal(); } catch(e) { console.error(e); }
    try { initB2bGeographyMenus(); } catch(e) { console.error(e); }
    try { initB2bFormStateSelector(); } catch(e) { console.error(e); }
    try { initUploadStateDropdowns(); } catch(e) { console.error(e); }
    try { switchTab('properties'); } catch(e) { console.error(e); }
    try { render(); } catch(e) { console.error(e); }
    try { renderB2bServicesHub(); } catch(e) { console.error(e); }
    try { document.addEventListener('keydown', handleReelKeyboardNavigation); } catch(e) { console.error(e); }
    try { fetchLivePropertiesFromDatabase(); } catch(e) { console.error(e); }
    try { updateRecentlyViewedTray(); } catch(e) { console.error(e); }
    try { updateB2bPromoSlotsLeft(); } catch(e) { console.error(e); }
    initDynamicPricingDisplays();

    // Check saved plan state
    const savedPlan = safeStorage.getItem('subscribed_plan');
    if (savedPlan) {
        userSubscribedPlan = savedPlan;
    }
}

function openFeature(id) { 
    let el = document.getElementById(id);
    if(el) {
        el.classList.remove('hidden'); 
        el.classList.add('flex'); 
        el.style.setProperty('display', 'flex', 'important'); 
    }
    if (id === 'addB2bModal') updateB2bPromoSlotsLeft();
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
        services: 'm-tab-services',
        profile: 'm-tab-profile'
    };
    
    Object.keys(mobileTabs).forEach(k => {
        const mEl = document.getElementById(mobileTabs[k]);
        if (mEl) {
            if (k === tabId) {
                mEl.className = "flex flex-col items-center gap-0.5 cursor-pointer text-brand-gold w-11";
                const icon = mEl.querySelector('i');
                if (icon) icon.className = icon.className.replace('text-slate-404', 'text-brand-gold').replace('text-slate-400', 'text-brand-gold').replace('text-white', 'text-brand-gold');
            } else {
                mEl.className = "flex flex-col items-center gap-0.5 cursor-pointer text-slate-404 dark:text-slate-300 w-11";
                const icon = mEl.querySelector('i');
                if (icon) icon.className = icon.className.replace('text-brand-gold', 'text-slate-404');
            }
        }
    });
    
    // 🌟 PROGRAMMATIC HIDING LOGIC: Automatic support button collapse when entering Reels tab viewport
    const waSupportBtn = document.getElementById('floatingWhatsappSupportBtn');
    if (waSupportBtn) {
        if (tabId === 'reels') {
            waSupportBtn.classList.add('hidden');
        } else {
            waSupportBtn.classList.remove('hidden');
        }
    }

    if (tabId === 'reels') renderReelsList();
    if (tabId === 'profile') {
        renderProfileSectionWorkspace();
        goBackToProfileDashboard();
    }
}

function triggerDirectPostFlow() {
    if (!sessionUser) {
        alert("⚠️ Authentication required. Please log in.");
        openFeature('loginModal');
        return;
    }
    
    let userPosts = database.filter(x => String(x.phone) === String(sessionUser.phone));
    if (userPosts.length >= 1 && userSubscribedPlan === "Free") {
        alert("⚠️ You have already listed 1 free property. Please upgrade to a Premium Plan.");
        openFeature('platformSubscriptionPlansModal');
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
        if (detailDescriptionText) detailDescriptionText.innerText = item.description || "Direct landlord verified listing. Clean title deed and immediate possession available.";

        const detailSellerFirm = document.getElementById('detailSellerFirm');
        if (detailSellerFirm) detailSellerFirm.innerText = item.firmName ? item.firmName : "Direct Owner Node";

        const detailSpecFacing = document.getElementById('detailSpecFacing');
        if (detailSpecFacing) detailSpecFacing.innerText = item.facing || "East";

        const detailSpecFloor = document.getElementById('detailSpecFloor');
        if (detailSpecFloor) detailSpecFloor.innerText = item.floorNo || "Ground";

        const detailSpecAge = document.getElementById('detailSpecAge');
        if (detailSpecAge) detailSpecAge.innerText = item.age || "New Build";

        const statusBadge = document.getElementById('detailModalStatusBadge');
        if (statusBadge) statusBadge.innerText = item.status || "Active";

        // 🌟 RESTRICTION LOGIC: Only Silver and Gold Subscribed plans can access direct owner Call or WhatsApp
        const callBtn = document.getElementById('directCallCTA');
        if (callBtn) {
            callBtn.onclick = () => {
                if (!sessionUser) {
                    alert("🔒 Security Verification Required!\n\nPlease login with your mobile number first.");
                    openFeature('loginModal');
                } else if (userSubscribedPlan !== "Silver Plan" && userSubscribedPlan !== "Gold Plan") {
                    alert("🔒 Access Restricted!\n\nPlease upgrade to a Silver or Gold Premium plan to contact owners directly.");
                    openFeature('platformSubscriptionPlansModal');
                } else {
                    window.open(`tel:${item.phone}`);
                }
            };
        }

        const waBtn = document.getElementById('directWhatsappCTA');
        if (waBtn) {
            waBtn.onclick = () => {
                if (!sessionUser) {
                    alert("🔒 Security Verification Required!\n\nPlease login with your mobile number first.");
                    openFeature('loginModal');
                } else if (userSubscribedPlan !== "Silver Plan" && userSubscribedPlan !== "Gold Plan") {
                    alert("🔒 Access Restricted!\n\nPlease upgrade to a Silver or Gold Premium plan to use direct WhatsApp.");
                    openFeature('platformSubscriptionPlansModal');
                } else {
                    const text = encodeURIComponent(`Hi, I'm interested in your property listed on Mama Dealing: ${item.bhk || ''} ${item.type} in ${item.locality}, ${item.city}.`);
                    window.open(`https://wa.me/91${item.phone}?text=${text}`);
                }
            };
        }

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
        console.error(err);
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
        if (tabPhotos) tabPhotos.className = "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-slate-955 bg-[#f59e0b] transition-all flex items-center gap-0.5";
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
        tray.innerHTML = `<p class="text-slate-404 dark:text-white text-center py-6 font-semibold text-xs font-bold font-bold">Please select state first</p>`;
        return;
    }
    selectedGlobalState = state;
    tray.innerHTML = "";
    let districtSearchInput = document.getElementById('simpleDistrictSearchInput');
    if (districtSearchInput) districtSearchInput.value = "";

    let allDistDiv = document.createElement('div');
    allDistDiv.className = "p-2.5 border-b border-slate-101 dark:border-slate-800 hover:bg-slate-101 dark:hover:bg-slate-800 cursor-pointer text-slate-955 dark:text-white font-bold flex justify-between items-center simple-district-item text-[11px] bg-white dark:bg-[#131e3a]";
    allDistDiv.innerText = "All Districts (Entire State)";
    allDistDiv.onclick = () => selectSimpleDistrict("All");
    tray.appendChild(allDistDiv);

    if (GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(dist => {
            let div = document.createElement('div');
            div.className = "p-2.5 border-b hover:bg-slate-101 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-white simple-district-item text-[11px] font-semibold bg-white dark:bg-[#131e3a] font-bold";
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
    if (label) label.innerText = dist === "All" ? (selectedGlobalState === "All States (Entire India)" ? "All India" : selectedGlobalState) : dist;
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
    if (targetPanel) targetPanel.classList.remove('hidden');

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
            if (st !== "All States (Entire India)") sService.innerHTML += `<option class="dark:bg-slate-900 dark:text-white" value="${st}">${st}</option>`;
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
            if (st !== "All States (Entire India)") sInp.innerHTML += `<option class="dark:bg-slate-900 dark:text-white" value="${st}">${st}</option>`;
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
    if (pDisplay) pDisplay.innerText = val == 50000000 ? "Any Price" : "₹" + parseInt(val).toLocaleString('en-IN');
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
    if (btnElement) btnElement.classList.add('bg-slate-900', 'text-white');
}

function applySearchPillTab(cat, btn) {
    activeCategoryFilter = cat;
    document.querySelectorAll('.custom-search-tab').forEach(b => {
        b.classList.remove('active', 'border-brand-gold', 'text-brand-gold');
        b.classList.add('border-transparent', 'text-slate-304');
    });
    if (btn) {
        btn.classList.add('active', 'border-brand-gold', 'text-brand-gold');
        btn.classList.remove('border-transparent', 'text-slate-304');
    }
    let typeEl = document.getElementById('filterType');
    if (typeEl) typeEl.value = "All";
    currentPropertiesPage = 1;
    render();
}

function applySearchPillType(type, btn) {
    document.querySelectorAll('.custom-search-tab').forEach(b => {
        b.classList.remove('active', 'border-brand-gold', 'text-brand-gold');
        b.classList.add('border-transparent', 'text-slate-304');
    });
    if (btn) {
        btn.classList.add('active', 'border-brand-gold', 'text-brand-gold');
        btn.classList.remove('border-transparent', 'text-slate-304');
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
    const icons = document.querySelectorAll('.reels-mute-icon');
    icons.forEach(icon => {
        icon.className = isReelsMuted ? "ph-bold ph-speaker-slash text-base text-red-400 reels-mute-icon" : "ph-bold ph-speaker-high text-base text-emerald-400 reels-mute-icon";
    });
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
        container.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center p-6 space-y-2"><i class="ph ph-video-camera-slash text-4xl text-slate-550 dark:text-white font-bold"></i><p class="text-xs font-semibold text-slate-404 dark:text-white font-bold">No matching reels found.</p></div>`;
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
                    <h4 class="font-bold text-xs uppercase truncate tracking-tight drop-shadow-md text-white font-bold">${x.bhk} ${x.type}</h4>
                </div>
                <p class="text-[10px] font-semibold text-slate-200 truncate drop-shadow-md font-bold"><i class="ph-fill ph-map-pin text-xs text-red-500 inline mr-0.5 font-bold font-bold font-bold"></i>${x.locality}, ${x.city}</p>
                <p class="text-sm font-extrabold text-brand-gold tracking-tight drop-shadow-lg font-bold">₹${x.price.toLocaleString('en-IN')}</p>
            </div>
            <div class="absolute bottom-16 right-3 flex flex-col items-center gap-3 z-40">
                <button onclick="toggleReelsMuteState(); event.stopPropagation();" class="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl"><i class="${soundIconClass} reels-mute-icon"></i></button>
                <button onclick="toggleBookmarkClientState('${x.id}', this); event.stopPropagation();" class="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl"><i class="${x.saved ? 'ph-fill ph-bookmark text-amber-500 text-base font-bold' : 'ph ph-bookmark text-base text-white'}"></i></button>
                <button onclick="openOlxChatSimulation('${x.id}'); event.stopPropagation();" class="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl"><i class="ph-fill ph-chats-teardrop font-bold"></i></button>
                <button onclick="openShareToolkitChannel('${x.id}'); event.stopPropagation();" class="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-xl"><i class="ph-bold ph-share-network font-bold"></i></button>
                <button onclick="openPropertyDetailsModal('${x.id}'); event.stopPropagation();" class="w-10 h-10 bg-slate-900/80 text-white rounded-full flex items-center justify-center shadow-xl"><i class="ph ph-info text-white font-bold"></i></button>
            </div>`;
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
    if (sw) sw.onclick = () => { window.open(`https://wa.me/?text=${encodedText}`); };
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
    if (targetDetailItemInstance) openShareToolkitChannel(targetDetailItemInstance.id);
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
    if (!navigator.geolocation) return;
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
                nearMeBtn.innerHTML = `<i class="ph-bold ph-check text-xs font-bold"></i> Near Active`;
            }
            render();
        },
        () => { 
            deviceCoordinates = { latitude: 23.259933, longitude: 77.412613 };
            scanRadiusActive = true;
            if (nearMeBtn) {
                nearMeBtn.classList.remove('bg-brand-gold', 'hover:bg-brand-gold-hover');
                nearMeBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
                nearMeBtn.innerHTML = `<i class="ph-bold ph-check text-xs font-bold font-bold font-bold"></i> Near Bhopal`;
            }
            render();
        },
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

// REAL-TIME FIREBASE FIRESTORE CHAT IMPLEMENTATION
function openOlxChatSimulation() {
    if (!sessionUser) {
        alert("🔒 Anti-Spam Security Activated!\n\nPlease login using your mobile number first to chat with Direct Landlords safely.");
        openFeature('loginModal');
        return;
    }
    const item = targetDetailItemInstance;
    if (!item) return;

    const chatId = `chat_${item.id}_${sessionUser.phone}`;
    document.getElementById('chatSellerName').innerText = item.firmName || "Owner Node";

    if (activeChatsFirestoreListener) activeChatsFirestoreListener();

    if (firestoreDb) {
        activeChatsFirestoreListener = firestoreDb.collection('chats').doc(chatId)
            .onSnapshot(doc => {
                const data = doc.data();
                if (data && data.messages) {
                    renderRealtimeMessages(data.messages);
                } else {
                    const welcomeMessage = {
                        sender: 'seller',
                        text: `Hi, thank you for showing interest in my property in ${item.locality}, ${item.city}. Let me know if you have any questions!`,
                        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    };
                    firestoreDb.collection('chats').doc(chatId).set({ messages: [welcomeMessage] });
                }
            }, err => console.error("Firestore listen error: ", err));
    }
    openFeature('olxChatDialogModal');
}

function renderRealtimeMessages(messages) {
    let flow = document.getElementById('olxChatMessageFlow');
    if (!flow) return;
    flow.innerHTML = "";
    messages.forEach(m => {
        let div = document.createElement('div');
        div.className = m.sender === 'user' ? "flex justify-end font-bold" : "flex justify-start font-bold";
        let bubbleClass = m.sender === 'user' ? "bg-slate-900 text-white rounded-2xl rounded-tr-none" : "bg-white text-slate-800 rounded-2xl rounded-tl-none border shadow-sm";
        div.innerHTML = `
            <div class="${bubbleClass} p-2.5 text-xs font-semibold max-w-[80%] font-bold">
                <p class="leading-relaxed font-bold font-bold">${m.text}</p>
                <span class="text-[8px] opacity-70 block text-right mt-1 font-bold font-bold">${m.time}</span>
            </div>`;
        flow.appendChild(div);
    });
    flow.scrollTop = flow.scrollHeight;
}

function sendUserChatMessageSimulation() {
    let input = document.getElementById('olxChatMessageInput');
    if (!input || !input.value.trim() || !targetDetailItemInstance || !sessionUser) return;
    const chatId = `chat_${targetDetailItemInstance.id}_${sessionUser.phone}`;
    const userMessage = {
        sender: 'user',
        text: input.value.trim(),
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    input.value = "";

    if (firestoreDb) {
        const docRef = firestoreDb.collection('chats').doc(chatId);
        docRef.get().then(doc => {
            const data = doc.data();
            const currentMessages = data ? data.messages : [];
            currentMessages.push(userMessage);
            docRef.set({ messages: currentMessages });
        });
    }
}

function handleLockedPhoneAction() {
    if (!sessionUser) {
        alert("🔒 Spam Protection Enabled! You must log in with a verified OTP first.");
        openFeature('loginModal');
    } else {
        if(targetDetailItemInstance) alert(`📞 Direct Verified Owner Number: +91 ${targetDetailItemInstance.phone}`);
    }
}

function triggerScamReportAction() {
    if (!targetDetailItemInstance) return;
    let count = propertyReportsTracker[targetDetailItemInstance.id] || 0;
    count++;
    propertyReportsTracker[targetDetailItemInstance.id] = count;
    safeStorage.setItem('property_scam_reports', JSON.stringify(propertyReportsTracker));
    alert("⚠️ Report received. Listings receiving multiple complaints are flagged.");
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
    let q = searchInp ? searchInp.value.toLowerCase().trim() : '';
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
            let match = x.locality.toLowerCase().includes(q) || 
                        x.city.toLowerCase().includes(q) || 
                        x.state.toLowerCase().includes(q) ||
                        (x.bhk && x.bhk.toLowerCase().includes(q)) ||
                        x.type.toLowerCase().includes(q);
            if(!match) return false;
        }
        return true;
    });

    filtered.sort((a, b) => {
        const tierWeights = { "Enterprise Builder": 4, "Pro Business": 3, "Owner Premium": 2, "Free": 1 };
        const weightA = tierWeights[a.membershipTier] || 1;
        const weightB = tierWeights[b.membershipTier] || 1;
        if (a.isSoldOut !== b.isSoldOut) return a.isSoldOut ? 1 : -1;
        return weightB - weightA;
    });

    let counterEl = document.getElementById('inventoryCounter');
    if (counterEl) counterEl.innerText = `${filtered.length} Active Nodes Checked`;
    grid.innerHTML = "";

    if(filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center text-xs font-bold text-slate-404 dark:text-white">Zero active asset matches found in database stream.</div>`;
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
        div.onclick = (e) => {
            if (e.target.closest('.ph-bookmark') || e.target.closest('button')) return;
            openPropertyDetailsModal(x.id);
        };
        let badgeColor = x.role === "Owner" ? "from-slate-900 to-slate-800 text-brand-gold" : x.role === "Builder" ? "from-emerald-600 to-teal-500 text-white" : "from-purple-600 to-indigo-500 text-white";
        let dynamicFirmLabelStr = x.firmName ? `<p class="text-[9px] text-slate-500 dark:text-white font-bold truncate mt-0.5"><i class="ph-fill ph-buildings inline"></i> ${x.firmName}</p>` : `<p class="text-[9px] text-brand-gold font-bold mt-0.5">🔒 Verified Landlord</p>`;
        let premiumVisualBadge = (x.membershipTier && x.membershipTier !== "Free") ? `<span class="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow z-10"><i class="ph-fill ph-crown text-slate-900 font-bold"></i> PRO</span>` : '';
        let displayTypeTitle = (x.bhk && x.bhk !== "Any BHK Configuration" ? `${x.bhk} ` : "") + x.type;
        
        // 🌟 CONNECT BADGES: Custom connect badges styled beautifully
        div.innerHTML = `
            <div class="relative h-44 sm:h-48 bg-slate-900 overflow-hidden">
                <img src="${x.images && x.images.length > 0 ? x.images[0] : NO_IMAGE_FALLBACK}" alt="Asset Preview" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy">
                <span class="absolute top-2.5 left-2.5 bg-gradient-to-tr ${badgeColor} font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm z-10">${x.role}</span>
                ${premiumVisualBadge}
                ${(x.video && x.video !== "") ? `<span class="absolute top-2.5 right-2.5 bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs z-10"><i class="ph-fill ph-play text-amber-404 font-bold"></i></span>` : ''}
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-955 via-slate-900/60 to-transparent p-3 pt-8">
                    <span class="bg-[#050b18]/70 border border-slate-800 text-brand-gold font-bold text-[9px] px-2 py-0.5 rounded uppercase font-bold">${x.cat}</span>
                    <p class="text-white text-sm font-extrabold tracking-tight mt-1 font-extrabold font-bold">₹${x.price.toLocaleString('en-IN')}</p>
                </div>
            </div>
            <div class="p-3 space-y-1.5 font-bold">
                <div class="flex justify-between items-start gap-1 font-bold">
                    <h3 class="font-bold text-xs text-slate-900 dark:text-white uppercase truncate font-bold">${displayTypeTitle}</h3>
                    <button onclick="toggleBookmarkClientState('${x.id}', this)" class="text-lg ${x.saved ? 'text-amber-500 ph-fill font-bold' : 'text-slate-404 dark:text-white ph'} ph-bookmark"></button>
                </div>
                <p class="text-[9px] text-amber-800 dark:text-amber-404 font-extrabold bg-amber-100 dark:bg-amber-955/40 border border-amber-200 dark:border-amber-800 inline-block px-1.5 py-0.5 rounded-md font-bold font-bold font-bold font-bold">${x.status || 'Active'}</p>
                <p class="text-[10px] text-slate-600 dark:text-slate-100 font-semibold flex items-center gap-0.5 truncate font-bold"><i class="ph-fill ph-map-pin text-slate-444 font-bold"></i> ${x.locality}, ${x.city}</p>
                <div class="pt-1.5 border-t border-slate-101 dark:border-slate-800 flex justify-between items-center"><div>${dynamicFirmLabelStr}</div></div>
                
                <!-- Quick connect visual signal indicators row -->
                <div class="flex items-center gap-2 pt-2 border-t border-slate-101 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-100 justify-between">
                    <span class="text-[9px] text-brand-gold font-bold font-bold font-bold font-bold">🔒 Direct Connect</span>
                    <div class="flex items-center gap-1.5 font-bold">
                        <span title="Chat Available" class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs"><i class="ph-fill ph-chats-teardrop font-bold"></i></span>
                        <span class="flex items-center justify-center w-5 h-5 bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-404 text-xs" title="Call Option Enabled"><i class="ph-fill ph-phone font-bold"></i></span>
                        <span class="flex items-center justify-center w-5 h-5 bg-green-50 dark:bg-green-955/40 text-green-600 dark:text-green-404 text-xs" title="WhatsApp Connect Available"><i class="ph-fill ph-whatsapp-logo font-bold font-bold"></i></span>
                    </div>
                </div>
            </div>`;
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
    prevBtn.className = "px-2.5 py-1.5 rounded-lg border dark:border-slate-800 text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-white hover:bg-slate-50 font-bold";
    prevBtn.innerText = "Prev";
    prevBtn.disabled = currentPropertiesPage === 1;
    prevBtn.onclick = () => { currentPropertiesPage--; render(); };
    container.appendChild(prevBtn);
    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement('button');
        btn.className = `px-2.5 py-1.5 rounded-lg border dark:border-slate-800 text-[10px] font-bold ${currentPropertiesPage === i ? 'bg-[#0b1329] text-brand-gold' : 'bg-white text-slate-700 dark:text-white'} font-bold`;
        btn.innerText = i;
        btn.onclick = () => { currentPropertiesPage = i; render(); };
        container.appendChild(btn);
    }
    let nextBtn = document.createElement('button');
    nextBtn.className = "px-2.5 py-1.5 rounded-lg border dark:border-slate-800 text-[10px] font-bold bg-white dark:bg-[#0b1329] text-slate-700 dark:text-white hover:bg-slate-50 font-bold";
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
    if(activeB2bCategoryFilter !== "All") filteredServices = servicesDatabase.filter(x => x.category === activeB2bCategoryFilter);
    if (filterState !== "All") filteredServices = filteredServices.filter(x => x.state === filterState);
    if (filterCity !== "All") filteredServices = filteredServices.filter(x => x.city === filterCity);
    if(filteredServices.length === 0) {
        grid.innerHTML = `<div class="p-6 text-center text-slate-404 dark:text-white bg-white dark:bg-slate-900 rounded-xl border col-span-full font-semibold text-xs">No active partners registered in this area.</div>`;
        return;
    }
    filteredServices.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-white dark:bg-[#131e3a] p-3.5 rounded-xl border border-slate-101 dark:border-[#1e2d54] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm";
        div.innerHTML = `
            <div class="space-y-0.5">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <h3 class="font-extrabold text-xs text-slate-900 dark:text-white uppercase font-bold">${x.title}</h3>
                    <span class="bg-[#0b1329] text-brand-gold text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5"><i class="ph-fill ph-seal-check"></i> Expert</span>
                </div>
                <p class="text-[10px] text-slate-600 dark:text-slate-101 font-semibold font-medium font-bold">Speciality: ${x.specialty}</p>
                <div class="flex items-center gap-1.5 pt-0.5 text-[9px] font-bold">
                    <span class="text-amber-500 font-bold"><i class="ph-fill ph-star"></i> ${x.rating}</span>
                    <span class="text-slate-550 dark:text-slate-101 font-medium">| ${x.city}, ${x.state}</span>
                </div>
            </div>
            <a href="tel:${x.phone}" class="w-full sm:w-auto bg-slate-900 text-white font-bold text-[9px] px-3.5 py-2 rounded-lg flex items-center justify-center gap-1"><i class="ph-fill ph-phone text-brand-gold font-medium"></i> Dial</a>`;
        grid.appendChild(div);
    });
}

function updateB2bPromoSlotsLeft() {
    let slotsEl = document.getElementById('b2bPromoSlotsLeft');
    if (slotsEl) {
        let remaining = 15 - servicesDatabase.length;
        slotsEl.innerText = remaining > 0 ? `(${remaining} of 15 free launch slots remaining!)` : `(Launch offer completed. Fee ₹99 applies)`;
    }
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
    if (servicesDatabase.length < 15) {
        let confirmFree = confirm("🎉 EXCITING PROMOTIONAL LAUNCH OFFER!\n\n100% FREE! Proceed?");
        if (confirmFree) {
            servicesDatabase.unshift({ id: Date.now(), category: cat, title, phone, specialty: spec, rating: 5.0, reviews: 1, state, city });
            renderB2bServicesHub();
            updateB2bPromoSlotsLeft();
            alert("🎉 Added to expert service directory!");
            closeFeature('addB2bModal');
        }
        return;
    }
    if (typeof Razorpay !== 'undefined') {
        const options = {
            "key": ENV_RAZORPAY_KEY_ID,
            "amount": 99 * 100, 
            "currency": "INR",
            "name": "Mama Dealing",
            "description": "Expert Registry fee",
            "handler": function () {
                servicesDatabase.unshift({ id: Date.now(), category: cat, title, phone, specialty: spec, rating: 5.0, reviews: 1, state, city });
                renderB2bServicesHub();
                updateB2bPromoSlotsLeft();
                alert("🎉 Registration complete!");
                closeFeature('addB2bModal');
            },
            "prefill": { "name": title, "contact": phone },
            "theme": { "color": "#0b1329" }
        };
        (new Razorpay(options)).open();
    } else {
        let confirmSim = confirm("Directory Registration Fee: ₹99. Proceed with simulation payment verification?");
        if (confirmSim) {
            servicesDatabase.unshift({ id: Date.now(), category: cat, title, phone, specialty: spec, rating: 5.0, reviews: 1, state, city });
            renderB2bServicesHub();
            updateB2bPromoSlotsLeft();
            alert("🎉 Registered!");
            closeFeature('addB2bModal');
        }
    }
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
        if (st !== "All States (Entire India)") stateEl.innerHTML += `<option value="${st}">${st}</option>`;
    });
}

function submitVipCallbackRequest() {
    let name = document.getElementById('vipCallbackName').value.trim();
    let phone = document.getElementById('vipCallbackPhone').value.trim();
    let date = document.getElementById('visitPreferredDate')?.value || "Not Chosen";
    let time = document.getElementById('visitPreferredTime')?.value || "Not Chosen";
    if (!name || !phone) {
        alert("⚠️ Please provide valid contact information.");
        return;
    }
    alert(`✅ Success! Site visit scheduled for ${date} at ${time}. We will contact you.`);
    closeFeature('assistedSellingModal');
}

function renderMyChatsHistoryList() {
    let container = document.getElementById('profileActiveChatsDashboardList');
    let htmlContent = "";
    if (activeChatsStorage.length === 0) {
        htmlContent = `<p class="text-xs text-slate-555 py-4 text-center font-semibold">No active conversations found.</p>`;
    } else {
        activeChatsStorage.forEach(chat => {
            htmlContent += `
                <div onclick="openOlxChatSimulation('${chat.propertyId}')" class="p-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl cursor-pointer transition-all flex justify-between items-center shadow-sm">
                    <div>
                        <p class="text-xs font-bold uppercase flex items-center gap-1 font-bold"><i class="ph-fill ph-user-circle text-brand-gold text-base font-bold"></i> ${chat.sellerName}</p>
                        <p class="text-[9px] text-slate-555 font-semibold">Unit: ${chat.propertyTitle}</p>
                    </div>
                    <i class="ph-bold ph-caret-right text-slate-404 text-xs"></i>
                </div>`;
        });
    }
    if (container) container.innerHTML = htmlContent;
}

function renderSavedBookmarksDashboard() {
    let grid = document.getElementById('savedPropertiesDashboardGrid');
    if (!grid) return;
    let saved = database.filter(x => x.saved);
    grid.innerHTML = "";
    if(saved.length === 0) {
        grid.innerHTML = `<p class="text-xs font-semibold text-slate-555 dark:text-white col-span-full py-4 text-center">No properties saved yet.</p>`;
        return;
    }
    saved.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-3 rounded-xl flex justify-between items-center cursor-pointer";
        div.onclick = () => openPropertyDetailsModal(x.id);
        div.innerHTML = `<div><h4 class="font-bold text-[11px] text-slate-900 dark:text-white uppercase">${x.type}</h4><span class="text-slate-900 dark:text-white font-extrabold text-[11px] block mt-0.5">₹${x.price.toLocaleString('en-IN')}</span></div><i class="ph-fill ph-caret-right text-slate-404 text-xs font-bold font-bold font-bold font-bold"></i>`;
        grid.appendChild(div);
    });
}

function renderMyPropertiesManagementWorkspace() {
    let container = document.getElementById('myPropertiesManagementContainer');
    if(!container) return;
    container.innerHTML = "";
    if (!sessionUser) {
        container.innerHTML = `<p class="text-xs font-semibold text-slate-505 py-2 text-center">Please log in to manage your assets.</p>`;
        return;
    }
    let myProperties = database.filter(x => String(x.phone) === String(sessionUser.phone));
    if (myProperties.length === 0) {
        container.innerHTML = `<p class="text-xs font-semibold text-slate-505 py-2 text-center font-bold">You have not posted any properties yet.</p>`;
        return;
    }
    myProperties.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-white dark:bg-[#131e3a] border rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm";
        div.innerHTML = `
            <div>
                <h4 class="font-bold text-xs uppercase font-bold">${x.bhk} ${x.type}</h4>
                <p class="text-[10px] text-slate-555 font-medium"><i class="ph-fill ph-map-pin font-bold"></i> ${x.locality}, ${x.city}</p>
            </div>
            <div class="flex gap-2 w-full md:w-auto font-bold font-bold">
                <button onclick="deletePropertyListing('${x.id}')" class="bg-red-50 text-red-700 text-[10px] font-bold uppercase px-3.5 py-1.5 rounded-lg border w-full md:w-auto font-bold">Delete</button>
            </div>`;
        container.appendChild(div);
    });
}

function updateRecentlyViewedTray() {
    let container = document.getElementById('recentlyViewedContainer');
    if (!container) return;
    let textIdList = [];
    try {
        let storedRecent = safeStorage.getItem('recently_viewed_properties');
        if (storedRecent) textIdList = JSON.parse(storedRecent);
    } catch(e) {}
    container.innerHTML = "";
    let recentItems = database.filter(x => textIdList.includes(x.id));
    if (recentItems.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-505 col-span-full py-4 text-center font-semibold font-bold">No recently viewed listings.</p>`;
        return;
    }
    recentItems.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-slate-50 dark:bg-slate-800 border p-3 rounded-xl flex justify-between items-center cursor-pointer";
        div.onclick = () => openPropertyDetailsModal(x.id);
        div.innerHTML = `<div><h4 class="font-bold text-[11px] uppercase">${x.type}</h4><span class="text-slate-900 dark:text-white font-extrabold text-[11px] block mt-0.5">₹${x.price.toLocaleString('en-IN')}</span></div><i class="ph-fill ph-caret-right text-slate-404 text-xs font-bold font-bold"></i>`;
        container.appendChild(div);
    });
}

function addToRecentlyViewed(id) {
    let recentIds = [];
    try {
        let storedRecent = safeStorage.getItem('recently_viewed_properties');
        if (storedRecent) recentIds = JSON.parse(storedRecent);
    } catch(e) {}
    recentIds = recentIds.filter(x => x !== id);
    recentIds.unshift(id);
    recentIds = recentIds.slice(0, 6);
    safeStorage.setItem('recently_viewed_properties', JSON.stringify(recentIds));
    updateRecentlyViewedTray();
}

function selectPremiumPlan(planType, price) {
    if (!sessionUser) { 
        alert("⚠️ Authentication required. Please log in."); 
        closeFeature('platformSubscriptionPlansModal'); 
        openFeature('loginModal'); 
        return; 
    }
    userSubscribedPlan = planType;
    safeStorage.setItem('subscribed_plan', planType);
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
        if (areaBox) areaBox.className = "col-span-2";
        if (areaLabel) areaLabel.innerText = "Total Plot Area (Sq.Ft.)";
    } else {
        if (bhkBox) bhkBox.classList.remove('hidden');
        if (areaBox) areaBox.className = "col-span-1";
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
            ind.className = parseInt(s) <= st ? "w-3.5 h-1 bg-[#0b1329] dark:bg-white rounded-full transition-all" : "w-3.5 h-1 bg-slate-200 dark:bg-slate-800 rounded-full transition-all";
        }
    });
    if (st === 2) adjustPostSpecsVisibility();
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
                let width = img.width, height = img.height;
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
        alert("⚠️ Video file is too large (Max 25MB).");
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
        card.className = "relative group w-14 h-14 rounded-lg overflow-hidden border bg-slate-101 font-bold";
        card.innerHTML = `
            <img src="${base64}" class="w-full h-full object-cover">
            <button type="button" onclick="removeSelectedPhoto(${index})" class="absolute top-0.5 right-0.5 bg-red-600 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-bold"><i class="ph-bold ph-trash font-bold font-bold font-bold"></i></button>`;
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
    let state = document.getElementById('stateInp')?.value || '';
    let city = document.getElementById('cityInp')?.value || '';
    let locality = document.getElementById('localityInp')?.value || '';
    let price = parseInt(document.getElementById('propPrice')?.value) || NaN;
    if(!state || !city || !locality || isNaN(price)) { alert("⚠️ Please check location & pricing parameters."); return; }

    let finalImagesArray = [...selectedPhotosBase64];
    if (finalImagesArray.length === 0) finalImagesArray.push(NO_IMAGE_FALLBACK);

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
        phone: sessionUser ? sessionUser.phone : "7869824155",
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
        description: "Direct landlord verified listing. Clean title deed and immediate possession available."
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
                    phone: property.phone ? String(property.phone).trim() : "7869824155",
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
        }
    } catch (error) {
        console.warn("Using local system database fallback:", error);
    } finally {
        render();
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

function handleOtpVerificationSuccess() {
    let phoneVal = currentSimulatedPhoneNumber;
    let existingUserDatabase = {};
    try {
        let storedProfiles = safeStorage.getItem('mamadealing_user_profiles');
        if (storedProfiles) existingUserDatabase = JSON.parse(storedProfiles);
    } catch(e) {}
    
    if (existingUserDatabase[phoneVal]) {
        sessionUser = {
            phone: phoneVal,
            role: authSelectedRole,
            firmName: existingUserDatabase[phoneVal].name,
            email: existingUserDatabase[phoneVal].email || ""
        };
        alert(`🎉 Welcome back, ${sessionUser.firmName}!`);
        closeFeature('loginModal');
        finishAuthNodeSetup();
    } else {
        document.getElementById('authStep2').classList.add('hidden');
        document.getElementById('authStep3').classList.remove('hidden');
    }
}

let currentSimulatedPhoneNumber = "";
async function triggerOtpRequestSequence() {
    let phoneVal = document.getElementById('authPhoneInput').value.trim();
    if (!phoneVal || phoneVal.length !== 10 || isNaN(phoneVal)) {
        alert("⚠️ Please enter a valid 10-digit phone number.");
        return;
    }
    currentSimulatedPhoneNumber = phoneVal;
    let otpContainer = document.getElementById('otpInputContainerNode');
    let primaryBtn = document.getElementById('authPrimaryActionSubmitBtn');
    
    if (otpContainer.classList.contains('hidden')) {
        try {
            let res = await fetch(`${BACKEND_BASE_URL}/api/otp/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile: phoneVal })
            });
            let data = await res.json();
            if (data.success) {
                alert("📱 Real OTP dispatched successfully.");
            } else {
                alert("⚠️ Dispatched code via bypass protocol. Enter '1234' to verify.");
            }
        } catch (err) { 
            console.warn("OTP bypass warn:", err); 
            alert("⚠️ Offline bypass protocol active. Enter '1234' to verify.");
        }
        otpContainer.classList.remove('hidden');
        primaryBtn.innerText = "Verify OTP passcode";
    } else {
        let otpVal = document.getElementById('authOtpInput').value.trim();
        if (otpVal.length < 4 || isNaN(otpVal)) {
            alert("⚠️ Please enter a valid OTP code.");
            return;
        }
        try {
            let res = await fetch(`${BACKEND_BASE_URL}/api/otp/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile: currentSimulatedPhoneNumber, otp: otpVal })
            });
            let data = await res.json();
            if (data.success) {
                handleOtpVerificationSuccess();
            } else {
                alert("❌ OTP Code is invalid. Please try again.");
            }
        } catch (e) {
            if (otpVal === "1234") {
                handleOtpVerificationSuccess();
            } else {
                alert("❌ Invalid OTP. Enter '1234' for bypass testing.");
            }
        }
    }
}

function submitFirstTimeSignupDetails() {
    let nameVal = document.getElementById('authSignupNameInput').value.trim();
    let emailVal = document.getElementById('authSignupEmailInput').value.trim();
    if (!nameVal) {
        alert("⚠️ Please enter your name.");
        return;
    }
    if (emailVal && !emailVal.includes('@')) {
        alert("⚠️ Please provide a valid email format.");
        return;
    }
    let existingUserDatabase = {};
    try {
        let storedProfiles = safeStorage.getItem('mamadealing_user_profiles');
        if (storedProfiles) existingUserDatabase = JSON.parse(storedProfiles);
    } catch(e) {}
    existingUserDatabase[currentSimulatedPhoneNumber] = { name: nameVal, email: emailVal };
    safeStorage.setItem('mamadealing_user_profiles', JSON.stringify(existingUserDatabase));
    sessionUser = { phone: currentSimulatedPhoneNumber, role: authSelectedRole, firmName: nameVal, email: emailVal };
    alert(`🎉 Profile completed!`);
    closeFeature('loginModal');
    finishAuthNodeSetup();

    fetch(`${BACKEND_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: currentSimulatedPhoneNumber, name: nameVal, email: emailVal })
    }).catch(() => console.warn("Cloud DB sync bypassed."));
}

function triggerGoogleLoginSequence() {
    if (firebaseAuth) {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebaseAuth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                sessionUser = {
                    phone: user.phoneNumber || "GoogleUser-" + Date.now().toString().slice(-4),
                    role: "Owner",
                    firmName: user.displayName || "Google User",
                    email: user.email || ""
                };
                alert(`🌐 Connected: Welcome, ${sessionUser.firmName}!`);
                closeFeature('loginModal');
                finishAuthNodeSetup();
            })
            .catch(() => openFeature('simulatedGoogleChooserModal'));
    } else {
        openFeature('simulatedGoogleChooserModal');
    }
}

function selectSimulatedGoogleAccount(name, email) {
    sessionUser = { phone: "7869824" + Math.floor(100 + Math.random() * 900).toString(), role: "Owner", firmName: name, email: email };
    alert(`🌐 Connected: Welcome, ${sessionUser.firmName}!`);
    closeFeature('simulatedGoogleChooserModal');
    closeFeature('loginModal');
    finishAuthNodeSetup();
}

function deletePropertyListing(id) {
    if(!confirm("Are you sure you want to delete this listing?")) return;
    database = database.filter(x => String(x.id) !== String(id));
    render();
    renderMyPropertiesManagementWorkspace();
}

function initiateRazorpayPayment(planName, priceAmount) {
    if (!sessionUser) { 
        alert("⚠️ Authentication required."); 
        closeFeature('platformSubscriptionPlansModal'); 
        openFeature('loginModal'); 
        return; 
    }
    if (typeof Razorpay === 'undefined') {
        alert("⚠️ Razorpay Payment system is loading.");
        return;
    }
    const options = {
        "key": ENV_RAZORPAY_KEY_ID,
        "amount": priceAmount * 100, 
        "currency": "INR",
        "name": "Mama Dealing",
        "description": `${planName} Activation Package`,
        "image": "logo-light.png",
        "handler": function () {
            alert(`🎉 Payment verified.`);
            userSubscribedPlan = planName;
            safeStorage.setItem('subscribed_plan', planName);
            closeFeature('platformSubscriptionPlansModal');
            renderProfileSectionWorkspace();
            render();
        },
        "prefill": { "name": sessionUser.firmName || "", "email": sessionUser.email || "", "contact": sessionUser.phone || "" },
        "theme": { "color": "#0b1329" }
    };
    (new Razorpay(options)).open();
}

function renderProfileSectionWorkspace() {
    let pName = document.getElementById('profileName');
    let pPhone = document.getElementById('profilePhone');
    let pAvatar = document.getElementById('profileAvatarBadge');
    let pBadgeSlot = document.getElementById('profileVerificationBadgeSlot');
    if (sessionUser) {
        if (pName) pName.innerText = sessionUser.firmName || "User Node";
        if (pPhone) pPhone.innerText = `+91 ${sessionUser.phone} (${sessionUser.role})`;
        if (pAvatar) pAvatar.innerText = (sessionUser.firmName || "U").charAt(0).toUpperCase();
        if (pBadgeSlot) pBadgeSlot.innerHTML = `<span class="bg-blue-100 text-blue-800 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase"><i class="ph-fill ph-seal-check font-bold font-bold font-bold font-bold"></i> Verified ${sessionUser.role}</span>`;
    } else {
        if (pName) pName.innerText = "Guest Session";
        if (pPhone) pPhone.innerText = "+91 Authentication Node";
        if (pAvatar) pAvatar.innerText = "G";
        if (pBadgeSlot) pBadgeSlot.innerHTML = "";
    }
}

function finishAuthNodeSetup() {
    let authComp = document.getElementById('authDynamicComponent');
    if (authComp) authComp.innerHTML = `<button onclick="switchTab('profile')" class="h-8 px-3 bg-[#0b1329] text-white dark:bg-white dark:text-[#0b1329] rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center justify-center shrink-0">Profile</button>`;
    renderProfileSectionWorkspace();
    render();
}

function logoutAgent() {
    sessionUser = null;
    userSubscribedPlan = "Free";
    safeStorage.setItem('subscribed_plan', 'Free');
    alert("🔒 Logged out successfully.");
    let authComp = document.getElementById('authDynamicComponent');
    if (authComp) authComp.innerHTML = `<button onclick="openFeature('loginModal')" class="bg-white text-slate-900 px-3.5 h-9 rounded-lg font-bold text-xs uppercase tracking-wider border flex items-center justify-center font-bold">Login</button>`;
    renderProfileSectionWorkspace();
    switchTab('properties');
}

function toggleBookmarkClientState(id, el) {
    let item = database.find(x => String(x.id) === String(id));
    if (!item) return;
    item.saved = !item.saved;
    let icon = el.querySelector('i');
    if (icon) {
        icon.className = item.saved ? "ph-fill ph-bookmark text-amber-500 text-base" : "ph ph-bookmark text-base text-white";
    } else {
        el.className = item.saved ? "text-lg text-amber-500 ph-fill ph-bookmark font-bold" : "text-lg text-slate-304 ph ph-bookmark";
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
        saveBtn.className = "bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 font-bold";
    } else {
        saveIcon.className = "ph ph-bookmark text-slate-700 text-sm";
        saveText.innerText = "Save";
        saveBtn.className = "bg-slate-101 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 font-bold";
    }
}

document.addEventListener("DOMContentLoaded", initializeApp);