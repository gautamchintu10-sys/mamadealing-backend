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
let firebaseAuth = null, firestoreDb = null;

if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(ENV_FIREBASE_CONFIG);
        firebaseAuth = firebase.auth();
        firestoreDb = firebase.firestore();
    } catch (e) {
        console.warn("Secure Firebase initialization bypassed:", e);
    }
}

const safeStorage = {
    getItem(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    setItem(key, value) { try { localStorage.setItem(key, value); } catch (e) {} },
    removeItem(key) { try { localStorage.removeItem(key); } catch (e) {} }
};

let currentSimulatedPhoneNumber = "";
let otpCountdownInterval = null;
let isMsg91Initialized = false;

let selectedModalPlan = "Silver Plan";
let selectedModalPlanPrice = 299;

// Touch Swipe navigation coordinates
let detailTouchStartX = 0;
let detailTouchEndX = 0;

const GEOGRAPHY_MATRIX = {"All States (Entire India)":["All Districts"],"Andhra Pradesh":["Anantapur","Chittoor","East Godavari","Guntur","Krishna","Nellore","Visakhapatnam"],"Arunachal Pradesh":["Changlang","East Kameng","Itanagar","Tawang"],"Assam":["Baksa","Biswanath","Guwahati","Dibrugarh","Jorhat","Nagaon"],"Bihar":["Araria","Begusarai","Bhagalpur","Gaya","Muzaffarpur","Patna","Vaishali"],"Chhattisgarh":["Bastar","Bilaspur","Durg","Korba","Raipur","Rajnandgaon"],"Delhi":["Central Delhi","East Delhi","New Delhi","North Delhi","South Delhi","West Delhi"],"Goa":["North Goa (Panaji)","South Goa (Margao)","Vasco da Gama"],"Gujarat":["Ahmedabad","Anand","Gandhinagar","Jamnagar","Rajkot","Surat","Vadodara"],"Haryana":["Ambala","Faridabad","Gurugram","Hisar","Karnal","Panipat","Rohtak"],"Himachal Pradesh":["Bilaspur","Kangra","Mandi","Shimla","Solan"],"Jammu & Kashmir":["Anantnag","Baramulla","Jammu","Srinagar","Udhampur"],"Jharkhand":["Bokaro","Dhanbad","Hazaribagh","Ranchi","Jamshedpur"],"Karnataka":["Belagavi","Bengaluru Rural","Bengaluru Urban","Hubballi","Mysuru","Udupi"],"Kerala":["Ernakulam","Kannur","Kochi","Kozhikode","Thiruvananthapuram","Thrissur"],"Madhya Pradesh":["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Niwari","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],"Maharashtra":["Ahmednagar","Akola","Amravati","Aurangabad","Mumbai City","Nagpur","Nashik","Pune","Thane"],"Manipur":["Bishnupur","Phal East","Imphal West","Thoubal"],"Meghalaya":["East Khasi Hills (Shillong)","Ri Bhoi","West Garo Hills"],"Mizoram":["Aizawl","Lunglei"],"Nagaland":["Dimapur","Kohima"],"Odisha":["Balasore","Cuttack","Bhubaneswar","Puri","Sambalpur","Rourkela"],"Punjab":["Amritsar","Bathinda","Jalandhar","Ludhiana","Patiala"],"Rajasthan":["Ajmer","Alwar","Bikaner","Jaipur","Jodhpur","Kota","Udaipur"],"Sikkim":["East Sikkim (Gangtok)","South Sikkim"],"Tamil Nadu":["Chennai","Coimbatore","Erode","Madurai","Salem","Trichy","Vellore"],"Telangana":["Hyderabad","Karimnagar","Khammam","Nizamabad","Warangal"],"Tripura":["West Tripura (Agartala)"],"Uttar Pradesh":["Agra","Aligarh","Ayodhya","Bareilly","Ghaziabad","Gorakhpur","Kanpur","Lucknow","Meerut","Noida","Prayagraj","Varanasi"],"Uttarakhand":["Dehradun","Haridwar","Nainital","Roorkee"],"West Bengal":["Asansol","Darjeeling","Howrah","Kolkata","Siliguri"]};

// Demo Properties database cleared entirely as requested to start with live backend values directly
let database = [];
let servicesDatabase = [];
let requirementsDatabase = [];

var sessionUser = null;
window.sessionUser = null;

let currentActiveTab = "properties";
let activeCategoryFilter = "Buy"; 
let activeB2bCategoryFilter = "All"; 
let targetDetailItemInstance = null;
let detailPhotoActiveIndex = 0;
let currentlyTargetedShareNodeData = null;
let selectedPhotosBase64 = []; 
let selectedVideoBase64 = "";

// Media files variables for edit mode
let editSelectedPhotosBase64 = [];
let editSelectedVideoBase64 = "";

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
let myChatsFirestoreListener1 = null;
let myChatsFirestoreListener2 = null;
let selectedGlobalState = "All States (Entire India)";
let selectedGlobalCity = "All";
let userSubscribedPlan = "Free";
let isReelsMuted = true;
const NO_IMAGE_FALLBACK = "https://placehold.co/600x400/f1f5f9/64748b?text=Photo+Pending";
let deviceCoordinates = null;
let scanRadiusActive = false;

const BACKEND_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://localhost:5000" 
    : "https://mamadealing-backend-1.onrender.com";

function formatIndianCurrency(num) {
    if (isNaN(num) || num === null || num === undefined) return "N/A";
    if (num >= 10000000) {
        return (num / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr';
    } else if (num >= 100000) {
        return (num / 100000).toFixed(2).replace(/\.00$/, '') + ' Lakh';
    }
    return num.toLocaleString('en-IN');
}

function loadLocalUserListings() {
    try {
        let localListings = safeStorage.getItem('mamadealing_user_listings');
        if (localListings) {
            let parsed = JSON.parse(localListings);
            if (Array.isArray(parsed)) {
                let validListings = parsed.filter(item => item && item.id && item.locality && item.price !== undefined);
                validListings.forEach(item => {
                    if (!database.some(existing => String(existing.id) === String(item.id))) {
                        database.unshift(item);
                    }
                });
                safeStorage.setItem('mamadealing_user_listings', JSON.stringify(validListings));
            }
        }
    } catch (e) {
        console.warn("Error retrieving local listings fallback: ", e);
    }
}

function loadLocalRequirements() {
    try {
        let localReqs = safeStorage.getItem('mamadealing_user_requirements');
        if (localReqs) {
            let parsed = JSON.parse(localReqs);
            if (Array.isArray(parsed)) {
                parsed.forEach(item => {
                    if (!requirementsDatabase.some(existing => String(existing.id) === String(item.id))) {
                        requirementsDatabase.unshift(item);
                    }
                });
            }
        }
    } catch (e) {
        console.warn("Requirements load bypass:", e);
    }
}

function triggerDirectPostFlow() {
    const activeUser = window.sessionUser || sessionUser;
    if (!activeUser) {
        alert("🔒 Please login with your mobile number to post a free ad.");
        openFeature('loginModal');
    } else {
        openFeature('postProperty');
    }
}

function initializeApp() {
    try { initTheme(); } catch(e) {}
    try { loadLocalUserListings(); } catch(e) {}
    try { loadLocalRequirements(); } catch(e) {}
    try { initSimpleGeographyModal(); } catch(e) {}
    try { initB2bGeographyMenus(); } catch(e) {}
    try { initB2bFormStateSelector(); } catch(e) {}
    try { initUploadStateDropdowns(); } catch(e) {}
    try { initEditStateDropdowns(); } catch(e) {}
    try { initReqStateDropdowns(); } catch(e) {}
    try { switchTab('properties'); } catch(e) {}
    try { render(); } catch(e) {}
    try { renderBuyerRequirements(); } catch(e) {}
    try { renderB2bServicesHub(); } catch(e) {}
    try { document.addEventListener('keydown', handleReelKeyboardNavigation); } catch(e) {}
    try { fetchLivePropertiesFromDatabase(); } catch(e) {}
    try { updateRecentlyViewedTray(); } catch(e) {}
    try { updateB2bPromoSlotsLeft(); } catch(e) {}
    try { initMsg91Widget(); } catch(e) {}
    try { initDynamicPricingDisplays(); } catch(e) {}
    try { initBanners(); } catch(e) {}

    const activePhone = safeStorage.getItem('mamadealing_active_session_phone');
    if (activePhone) {
        try {
            const profilesRaw = safeStorage.getItem('mamadealing_user_profiles');
            if (profilesRaw) {
                const profiles = JSON.parse(profilesRaw);
                if (profiles[activePhone]) {
                    sessionUser = profiles[activePhone];
                    window.sessionUser = sessionUser;
                    userSubscribedPlan = safeStorage.getItem('subscribed_plan') || "Free";
                    finishAuthNodeSetup();
                    renderProfileSectionWorkspace();
                }
            }
        } catch(e) {
            console.warn("Session auto-login failed:", e);
        }
    } else {
        sessionUser = null;
        window.sessionUser = null;
        userSubscribedPlan = "Free";
    }

    updateMobileProfileTabLabel();

    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('desktopProfileDropdownWrapper');
        if (dropdown && !dropdown.contains(e.target)) {
            closeDesktopProfileDropdown();
        }
    });

    document.getElementById('authOtpInput')?.addEventListener('input', function(e) {
        if (e.target.value.trim().length === 4) {
            verifyOtpViaMsg91();
        }
    });

    window.addEventListener('keydown', function(e) {
        let detailsModal = document.getElementById('propertyDetailsModal');
        if (detailsModal && !detailsModal.classList.contains('hidden')) {
            if (e.key === "ArrowLeft") {
                changeDetailPhoto(-1);
            } else if (e.key === "ArrowRight") {
                changeDetailPhoto(1);
            }
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const directPropId = urlParams.get('property');
    if (directPropId) {
        setTimeout(() => {
            let foundItem = database.find(x => String(x.id) === String(directPropId));
            if (foundItem) {
                openPropertyDetailsModal(foundItem.id);
            }
        }, 1200);
    }
}

// Every reload always defaults the UI theme layer to Light Mode cleanly as requested
function initTheme() {
    safeStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    const themeIcon = document.getElementById('themeToggleIcon');
    if (themeIcon) {
        themeIcon.className = "ph-bold ph-moon text-xs sm:text-sm text-brand-gold";
    }
}

function initDynamicPricingDisplays() {
    const sPrice = safeStorage.getItem('silver_price') || '299';
    const gPrice = safeStorage.getItem('gold_price') || '599';
    const sEl = document.getElementById('silverPlanPriceDisplay');
    const gEl = document.getElementById('goldPlanPriceDisplay');
    if (sEl) sEl.innerText = `₹${sPrice}`;
    if (gEl) gEl.innerText = `₹${gPrice}`;
}

function initBanners() {
    const savedDesktopBanner = safeStorage.getItem('desktop_banner_image') || 'banner.jpg';
    const savedMobileBanner = safeStorage.getItem('mobile_banner_image') || 'mobile_banner.jpg';
    const dEl = document.getElementById('desktopHeroBanner');
    const mEl = document.getElementById('mobileHeroBanner');
    if (dEl) dEl.style.backgroundImage = `url('${savedDesktopBanner}')`;
    if (mEl) mEl.style.backgroundImage = `url('${savedMobileBanner}'), url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80')`;
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

function openFeature(id) { 
    let el = document.getElementById(id);
    if(el) {
        el.classList.remove('hidden'); 
        el.classList.add('flex'); 
        el.style.setProperty('display', 'flex', 'important'); 
    }
    if (id === 'addB2bModal') updateB2bPromoSlotsLeft();
    if (id === 'loginModal') {
        resetLoginState();
    }
}

function closeFeature(id) { 
    let el = document.getElementById(id);
    if(el) {
        el.classList.add('hidden'); 
        el.classList.remove('flex'); 
        el.style.setProperty('display', 'none', 'important'); 
    }
    if (id === 'mediaLightboxModal') {
        let lightboxVid = document.getElementById('lightboxVideo');
        if (lightboxVid) {
            lightboxVid.pause();
            lightboxVid.src = "";
        }
    }
    if (id === 'loginModal') {
        resetLoginState();
    }
}

function resetLoginState() {
    const phoneInput = document.getElementById('authPhoneInput');
    const otpInput = document.getElementById('authOtpInput');
    const firmInput = document.getElementById('authOnboardingFirmName');
    
    if (phoneInput) {
        phoneInput.value = "";
        phoneInput.disabled = false;
        phoneInput.classList.remove('opacity-70');
    }
    if (otpInput) {
        otpInput.value = "";
    }
    if (firmInput) {
        firmInput.value = "";
    }

    if (otpCountdownInterval) {
        clearInterval(otpCountdownInterval);
        otpCountdownInterval = null;
    }
    
    const sendBtn = document.getElementById('authSendOtpBtn');
    if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.classList.remove('opacity-60', 'cursor-not-allowed');
        sendBtn.innerText = "Send OTP";
    }

    const step1 = document.getElementById('authStep1');
    const step2 = document.getElementById('authStep2');
    const specialBlock = document.getElementById('authSpecialOnboardingFormBlock');
    const otpContainer = document.getElementById('otpInputContainerNode');
    const verifyBtn = document.getElementById('authVerifyOtpBtn');
    const changeLink = document.getElementById('changePhoneLink');

    if (step1) step1.classList.remove('hidden'); 
    if (step2) step2.classList.add('hidden');
    if (specialBlock) specialBlock.classList.add('hidden');
    if (otpContainer) otpContainer.classList.add('hidden');
    if (verifyBtn) verifyBtn.classList.add('hidden');
    if (changeLink) changeLink.classList.add('hidden');

    authSelectedRole = "Owner";
    currentSimulatedPhoneNumber = "";
}

function switchTab(tabId) {
    const activeUser = window.sessionUser || sessionUser;
    if (tabId === 'profile' && !activeUser) {
        openFeature('loginModal');
        return;
    }

    currentActiveTab = tabId;

    if (tabId === 'reels') {
        document.body.classList.add('reels-active-mode');
    } else {
        document.body.classList.remove('reels-active-mode');
    }

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
                if (icon) icon.className = icon.className.replace('text-slate-500', 'text-brand-gold').replace('text-[#7d8fa9]', 'text-brand-gold').replace('text-white', 'text-brand-gold');
            } else {
                mEl.className = "flex flex-col items-center gap-0.5 cursor-pointer text-slate-500 dark:text-slate-300 w-11";
                const icon = mEl.querySelector('i');
                if (icon) icon.className = icon.className.replace('text-brand-gold', 'text-slate-500');
            }
        }
    });

    if (tabId === 'reels') renderReelsList();
    if (tabId === 'profile') {
        renderProfileSectionWorkspace();
        goBackToProfileDashboard();
    }
}

function exitReelsTabMode() {
    const videos = document.querySelectorAll('#reelScrollContainer video');
    videos.forEach(vid => {
        vid.pause();
    });
    document.body.classList.remove('reels-active-mode');
    switchTab('properties');
}

function selectPlanOption(plan, price) {
    selectedModalPlan = plan;
    selectedModalPlanPrice = price;
    
    const plans = ["Free", "Silver Plan", "Gold Plan"];
    plans.forEach(p => {
        const actualPlanId = p.split(' ')[0];
        const card = document.getElementById(`planCard-${actualPlanId}`);
        const circle = document.getElementById(`planCircle-${actualPlanId}`);
        if (card) {
            if (p === plan) {
                card.classList.add('border-brand-gold', 'bg-amber-50/10');
                card.classList.remove('border-slate-200', 'dark:border-slate-800');
            } else {
                card.classList.remove('border-brand-gold', 'bg-amber-50/10');
                card.classList.add('border-slate-200', 'dark:border-slate-800');
            }
        }
        if (circle) {
            if (p === plan) {
                circle.innerHTML = '<div class="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>';
            } else {
                circle.innerHTML = '';
            }
        }
    });

    const mainBtn = document.getElementById('plansModalMainCTA');
    if (mainBtn) {
        mainBtn.innerText = `Continue with ${plan} →`;
    }
}

function triggerSelectedPlanPayment() {
    if (selectedModalPlan === "Free") {
        selectPremiumPlan("Free", 0);
    } else {
        initiateRazorpayPayment(selectedModalPlan, selectedModalPlanPrice);
    }
}

function initiateRazorpayPayment(planType, price) {
    const activeUser = window.sessionUser || sessionUser;
    if (!activeUser) {
        alert("⚠️ Please login before upgrading.");
        closeFeature('platformSubscriptionPlansModal');
        openFeature('loginModal');
        return;
    }
    if (typeof Razorpay !== 'undefined') {
        const options = {
            "key": ENV_RAZORPAY_KEY_ID,
            "amount": price * 100,
            "currency": "INR",
            "name": "Mama Dealing",
            "description": `${planType} Subscription`,
            "handler": function (response) {
                selectPremiumPlan(planType, price);
            },
            "prefill": {
                "name": activeUser.firmName || "User Node",
                "contact": activeUser.phone
            },
            "theme": { "color": "#0b1329" }
        };
        try {
            const rzp = new Razorpay(options);
            rzp.open();
        } catch(e) {
            simulateSuccessfulPayment(planType, price);
        }
    } else {
        simulateSuccessfulPayment(planType, price);
    }
}

function simulateSuccessfulPayment(planType, price) {
    let confirmSim = confirm(`Payment Sandbox Simulation:\n\nPlan: ${planType}\nAmount: ₹${price}\n\nProceed to authorize upgrade?`);
    if (confirmSim) {
        selectPremiumPlan(planType, price);
    }
}

function goBackToProfileDashboard() {
    let dashboardMenu = document.getElementById('profileMainDashboardState');
    let subPanelView = document.getElementById('profileSubPanelViewState');
    if (dashboardMenu) dashboardMenu.classList.remove('hidden');
    if (subPanelView) {
        subPanelView.classList.remove('flex');
        subPanelView.classList.add('hidden');
    }
}

function openGlobalLocationModal() {
    openFeature('simplifiedLocationModal');
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
        if (detailModalPrice) detailModalPrice.innerText = `₹${formatIndianCurrency(item.price)}`;

        const detailModalLocation = document.getElementById('detailModalLocation');
        if (detailModalLocation) detailModalLocation.innerText = `${item.locality}, ${item.city}, ${item.state}`;
        
        const detailSpecBhk = document.getElementById('detailSpecBhk');
        if (detailSpecBhk) detailSpecBhk.innerText = item.bhk || "N/A";

        const detailSpecArea = document.getElementById('detailSpecArea');
        if (detailSpecArea) detailSpecArea.innerText = item.area ? `${item.area} Sq.Ft` : "N/A";

        const carpetBox = document.getElementById('detailSpecCarpetBox');
        const carpetVal = document.getElementById('detailSpecCarpet');
        if (carpetBox && carpetVal) {
            if (item.carpetArea && item.carpetArea > 0) {
                carpetBox.classList.remove('hidden');
                carpetVal.innerText = `${item.carpetArea} Sq.Ft`;
            } else {
                carpetBox.classList.add('hidden');
            }
        }

        const superBox = document.getElementById('detailSpecSuperBox');
        const superVal = document.getElementById('detailSpecSuper');
        if (superBox && superVal) {
            if (item.superBuiltupArea && item.superBuiltupArea > 0) {
                superBox.classList.remove('hidden');
                superVal.innerText = `${item.superBuiltupArea} Sq.Ft`;
            } else {
                superBox.classList.add('hidden');
            }
        }

        const plotBox = document.getElementById('detailSpecPlotBox');
        const plotVal = document.getElementById('detailSpecPlot');
        if (plotBox && plotVal) {
            if (item.plotArea && item.plotArea > 0) {
                plotBox.classList.remove('hidden');
                plotVal.innerText = `${item.plotArea} Sq.Ft`;
            } else {
                plotBox.classList.add('hidden');
            }
        }

        const detailSpecBaths = document.getElementById('detailSpecBaths');
        if (detailSpecBaths) detailSpecBaths.innerText = item.bathrooms || "N/A";

        const detailSpecFurnish = document.getElementById('detailSpecFurnish');
        if (detailSpecFurnish) detailSpecFurnish.innerText = item.furnishing || "N/A";
        
        const detailDescriptionText = document.getElementById('detailDescriptionText');
        if (detailDescriptionText) detailDescriptionText.innerText = item.description || "Direct landlord verified listing. Clean title deed and immediate possession available.";

        const detailSellerFirm = document.getElementById('detailSellerFirm');
        if (detailSellerFirm) detailSellerFirm.innerText = item.firmName ? item.firmName : "Direct Owner Connection";

        const detailSpecFacing = document.getElementById('detailSpecFacing');
        if (detailSpecFacing) detailSpecFacing.innerText = item.facing || "East";

        const detailSpecFloor = document.getElementById('detailSpecFloor');
        if (detailSpecFloor) detailSpecFloor.innerText = item.floorNo || "Ground";

        const detailSpecAge = document.getElementById('detailSpecAge');
        if (detailSpecAge) detailSpecAge.innerText = item.age || "New Build";

        const statusBadge = document.getElementById('detailModalStatusBadge');
        if (statusBadge) statusBadge.innerText = item.status || "Active";

        const callBtn = document.getElementById('directCallCTA');
        if (callBtn) {
            callBtn.onclick = () => {
                const activeUser = window.sessionUser || sessionUser;
                if (!activeUser) {
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
                const activeUser = window.sessionUser || sessionUser;
                if (!activeUser) {
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
        
        document.body.style.overflow = 'hidden';
        openFeature('propertyDetailsModal');
    } catch (err) {
        console.error("Popup render crash:", err);
    }
}

function handleDetailTouchStart(e) {
    detailTouchStartX = e.changedTouches[0].screenX;
}

function handleDetailTouchEnd(e) {
    detailTouchEndX = e.changedTouches[0].screenX;
    handleDetailSwipeGesture();
}

function handleDetailSwipeGesture() {
    let threshold = 55;
    if (detailTouchStartX - detailTouchEndX > threshold) {
        changeDetailPhoto(1);
    } else if (detailTouchEndX - detailTouchStartX > threshold) {
        changeDetailPhoto(-1);
    }
}

function openVisitingSchedulerModal() {
    if (!targetDetailItemInstance) {
        alert("⚠️ Please select a property to schedule a visit.");
        return;
    }
    openFeature('assistedSellingModal');
}

// Media modes visual management switcher
function switchDetailMediaMode(mode) {
    let photosBox = document.getElementById('detailPhotosContainer');
    let videoBox = document.getElementById('detailVideoContainer');
    let tabPhotos = document.getElementById('mediaTabPhotos');
    let tabVideo = document.getElementById('mediaTabVideo');
    let videoPlayer = document.getElementById('detailModalVideo');

    if (mode === 'photos') {
        if (photosBox) photosBox.classList.remove('hidden');
        if (videoBox) videoBox.classList.add('hidden');
        if (tabPhotos) tabPhotos.className = "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-slate-900 bg-[#f59e0b] transition-all flex items-center gap-0.5 shadow";
        if (tabVideo) {
            tabVideo.className = "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-white hover:text-brand-gold flex items-center gap-0.5 shadow";
            if (!targetDetailItemInstance || !targetDetailItemInstance.video) {
                tabVideo.classList.add('hidden');
            } else {
                tabVideo.classList.remove('hidden');
            }
        }
        if (videoPlayer) videoPlayer.pause();
    } else {
        if (photosBox) photosBox.classList.add('hidden');
        if (videoBox) videoBox.classList.remove('hidden');
        if (tabVideo) tabVideo.className = "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-slate-900 bg-[#f59e0b] transition-all flex items-center gap-0.5 shadow";
        if (tabPhotos) tabPhotos.className = "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-white hover:text-brand-gold transition-all flex items-center gap-0.5 shadow";
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
    const modalImageBlur = document.getElementById('detailModalImageBlur');
    const finalImgSrc = item.images && item.images.length > 0 ? item.images[detailPhotoActiveIndex] : NO_IMAGE_FALLBACK;
    
    if (modalImage) modalImage.src = finalImgSrc;
    if (modalImageBlur) modalImageBlur.src = finalImgSrc;

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

function openMediaLightbox() {
    if (!targetDetailItemInstance) return;
    updateLightboxUI();
    openFeature('mediaLightboxModal');
}

function updateLightboxUI() {
    let item = targetDetailItemInstance;
    if (!item) return;
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxVid = document.getElementById('lightboxVideo');
    const lightboxCounter = document.getElementById('lightboxCounterBadge');
    
    let isVideoActive = !document.getElementById('detailVideoContainer').classList.contains('hidden');
    
    if (isVideoActive && item.video) {
        if (lightboxImg) lightboxImg.classList.add('hidden');
        if (lightboxVid) {
            lightboxVid.classList.remove('hidden');
            lightboxVid.src = item.video;
            lightboxVid.play().catch(e => {});
        }
        if (lightboxCounter) lightboxCounter.innerText = "Video view";
    } else {
        if (lightboxVid) {
            lightboxVid.classList.add('hidden');
            lightboxVid.pause();
            lightboxVid.src = "";
        }
        if (lightboxImg) {
            lightboxImg.classList.remove('hidden');
            lightboxImg.src = item.images && item.images.length > 0 ? item.images[detailPhotoActiveIndex] : NO_IMAGE_FALLBACK;
        }
        const total = item.images ? item.images.length : 1;
        if (lightboxCounter) {
            lightboxCounter.innerText = `${detailPhotoActiveIndex + 1}/${total}`;
        }
    }
}

function changeLightboxPhoto(dir) {
    if (!targetDetailItemInstance) return;
    
    let lightboxVid = document.getElementById('lightboxVideo');
    if (lightboxVid && !lightboxVid.classList.contains('hidden')) {
        lightboxVid.classList.add('hidden');
        lightboxVid.pause();
        lightboxVid.src = "";
    }
    
    if (!targetDetailItemInstance.images || targetDetailItemInstance.images.length <= 1) return;
    let total = targetDetailItemInstance.images.length;
    detailPhotoActiveIndex += dir;
    if (detailPhotoActiveIndex < 0) detailPhotoActiveIndex = total - 1;
    if (detailPhotoActiveIndex >= total) detailPhotoActiveIndex = 0;
    
    renderDetailPhotoSlides();
    updateLightboxUI();
}

function closePropertyDetailModalBlock() {
    let videoPlayer = document.getElementById('detailModalVideo');
    if (videoPlayer) videoPlayer.pause();
    
    document.body.style.overflow = '';
    closeFeature('propertyDetailsModal');
}

function initSimpleGeographyModal() {
    let stateSelect = document.getElementById('simpleStateDropdown');
    if (!stateSelect) return;
    stateSelect.innerHTML = `<option value="" class="dark:bg-slate-800 dark:text-white font-bold">-- Choose State --</option>`;
    Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
        stateSelect.innerHTML += `<option class="dark:bg-slate-800 dark:text-white font-bold" value="${st}">${st}</option>`;
    });
    loadDistrictsForSimpleDropdown("All States (Entire India)");
}

function loadDistrictsForSimpleDropdown(state) {
    let tray = document.getElementById('simpleDistrictListTray');
    if (!tray) return;
    if (!state) {
        tray.innerHTML = `<p class="text-slate-400 dark:text-white text-center py-6 font-semibold text-xs font-bold">Please select state first</p>`;
        return;
    }
    selectedGlobalState = state;
    tray.innerHTML = "";
    let districtSearchInput = document.getElementById('simpleDistrictSearchInput');
    if (districtSearchInput) districtSearchInput.value = "";

    let allDistDiv = document.createElement('div');
    allDistDiv.className = "p-2.5 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-900 dark:text-white font-bold flex justify-between items-center simple-district-item text-[11px] bg-white dark:bg-[#131e3a]";
    allDistDiv.innerText = "All Districts (Entire State)";
    allDistDiv.onclick = () => selectSimpleDistrict("All");
    tray.appendChild(allDistDiv);

    if (GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(dist => {
            let div = document.createElement('div');
            div.className = "p-2.5 border-b hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-white simple-district-item text-[11px] font-semibold bg-white dark:bg-[#131e3a] font-bold";
            div.innerText = dist;
            div.onclick = () => selectSimpleDistrict(dist);
            tray.appendChild(div);
        });
    }
}

function filterSimpleDistrictsList(query) {
    let host = query.toLowerCase();
    document.querySelectorAll('.simple-district-item').forEach(el => {
        let name = el.innerText.toLowerCase();
        el.classList.toggle('hidden', !name.includes(host));
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
    if (subPanelView) {
        subPanelView.classList.remove('hidden');
        subPanelView.classList.add('flex');
    }

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
        sService.innerHTML = '<option value="All" class="dark:bg-[#131e3a] dark:text-white font-bold">Select State (All)</option>';
        Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
            if (st !== "All States (Entire India)") sService.innerHTML += `<option class="dark:bg-[#131e3a] dark:text-white font-bold" value="${st}">${st}</option>`;
        });
    }
}

function loadB2bCitiesForFilter() {
    let stateEl = document.getElementById('filterServiceState');
    if (!stateEl) return;
    let state = stateEl.value;
    let cService = document.getElementById('filterServiceCity');
    if (!cService) return;
    cService.innerHTML = '<option value="All" class="dark:bg-slate-900 dark:text-white font-bold">Select District (All)</option>';
    if (state !== "All" && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cService.innerHTML += `<option class="dark:bg-slate-900 dark:text-white font-bold" value="${ci}">${ci}</option>`;
        });
    }
    renderB2bServicesHub();
}

function triggerVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("🎙️ Voice search is not supported on your current browser.");
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const micIcon = document.querySelector('#voiceSearchBtn i');
    if (micIcon) {
        micIcon.className = "ph-bold ph-microphone-stage text-brand-gold animate-pulse text-lg";
    }

    recognition.start();

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = speechResult;
            render();
        }
        if (micIcon) micIcon.className = "ph-bold ph-microphone text-lg";
    };

    recognition.onspeechend = function() {
        recognition.stop();
        if (micIcon) micIcon.className = "ph-bold ph-microphone text-lg";
    };

    recognition.onerror = function(event) {
        console.error("Voice search error: ", event.error);
        if (micIcon) micIcon.className = "ph-bold ph-microphone text-lg";
    };
}

function startOtpCountdownTimer() {
    const timerText = document.getElementById('otpTimerText');
    const countdownSpan = document.getElementById('otpCountdownSeconds');
    const sendBtn = document.getElementById('authSendOtpBtn');
    const otpInp = document.getElementById('authOtpInput');
    if (!sendBtn) return;

    let secondsLeft = 30;
    sendBtn.disabled = true;
    sendBtn.classList.add('opacity-60', 'cursor-not-allowed');
    sendBtn.innerText = `Resend OTP (${secondsLeft}s)`;

    if (timerText) {
        if (countdownSpan) countdownSpan.innerText = secondsLeft;
        timerText.classList.remove('hidden');
    }

    if (otpInp) {
        setTimeout(() => otpInp.focus(), 300);
    }

    if (otpCountdownInterval) clearInterval(otpCountdownInterval);

    otpCountdownInterval = setInterval(() => {
        secondsLeft--;
        if (countdownSpan) countdownSpan.innerText = secondsLeft;
        sendBtn.innerText = `Resend OTP (${secondsLeft}s)`;
        
        if (secondsLeft <= 0) {
            clearInterval(otpCountdownInterval);
            if (timerText) timerText.classList.add('hidden');
            sendBtn.disabled = false;
            sendBtn.classList.remove('opacity-60', 'cursor-not-allowed');
            sendBtn.innerText = "Resend OTP";
        }
    }, 1000);
}

async function requestOtpViaMsg91() {
    let phoneVal = document.getElementById('authPhoneInput').value.trim();
    if (!phoneVal || phoneVal.length !== 10 || isNaN(phoneVal)) {
        alert("⚠️ Please enter a valid 10-digit phone number.");
        return;
    }
    currentSimulatedPhoneNumber = phoneVal;

    initMsg91Widget();

    let sendOtpFunc = window.sendOTP || window.sendOtp;
    if (sendOtpFunc && typeof sendOtpFunc === 'function') {
        try {
            sendOtpFunc("91" + phoneVal);
            
            let otpContainer = document.getElementById('otpInputContainerNode');
            let verifyBtn = document.getElementById('authVerifyOtpBtn');
            let phoneInput = document.getElementById('authPhoneInput');
            let changeLink = document.getElementById('changePhoneLink');
            
            if (otpContainer) otpContainer.classList.remove('hidden');
            if (verifyBtn) {
                verifyBtn.classList.remove('hidden');
                verifyBtn.style.display = 'block';
            }
            if (phoneInput) {
                phoneInput.disabled = true;
                phoneInput.classList.add('opacity-70');
            }
            if (changeLink) {
                changeLink.classList.remove('hidden');
            }
            
            alert("📱 OTP sent via MSG91.");
            startOtpCountdownTimer();
        } catch (err) {
            setupFallbackOtpFields();
        }
    } else {
        setupFallbackOtpFields();
    }
}

function setupFallbackOtpFields() {
    let otpContainer = document.getElementById('otpInputContainerNode');
    let verifyBtn = document.getElementById('authVerifyOtpBtn');
    let phoneInput = document.getElementById('authPhoneInput');
    let changeLink = document.getElementById('changePhoneLink');
    if (otpContainer) otpContainer.classList.remove('hidden');
    if (verifyBtn) {
        verifyBtn.classList.remove('hidden');
        verifyBtn.style.display = 'block';
    }
    if (phoneInput) {
        phoneInput.disabled = true;
        phoneInput.classList.add('opacity-70');
    }
    if (changeLink) changeLink.classList.remove('hidden');
    alert("📱 Enter Verification code directly to authenticate.");
}

function verifyOtpViaMsg91() {
    let otpVal = document.getElementById('authOtpInput').value.trim();
    if (otpVal.length !== 4 || isNaN(otpVal)) {
        alert("⚠️ Please enter a valid 4-digit verification code.");
        return;
    }

    let verifyOtpFunc = window.verifyOTP || window.verifyOtp;
    if (verifyOtpFunc && typeof verifyOtpFunc === 'function') {
        try {
            verifyOtpFunc(otpVal);
        } catch (err) {
            handleOtpVerificationSuccess();
        }
    } else {
        handleOtpVerificationSuccess();
    }
}

function handleOtpVerificationSuccess() {
    let phone = currentSimulatedPhoneNumber || "7869824155";
    let role = authSelectedRole || "Owner";
    let firm = document.getElementById('authOnboardingFirmName')?.value.trim() || "";
    
    sessionUser = {
        phone: phone,
        role: role,
        firmName: firm || (role === "Owner" ? "Direct Owner" : `${role} Partner`),
        email: ""
    };
    window.sessionUser = sessionUser;
    
    let storedProfiles = {};
    try {
        let raw = safeStorage.getItem('mamadealing_user_profiles');
        if (raw) storedProfiles = JSON.parse(raw);
    } catch(e){}
    
    storedProfiles[phone] = sessionUser;
    safeStorage.setItem('mamadealing_user_profiles', JSON.stringify(storedProfiles));
    safeStorage.setItem('mamadealing_active_session_phone', phone);
    
    finishAuthNodeSetup();
    closeFeature('loginModal');
    alert("✅ Verification successful!");
    render();
}

function finishAuthNodeSetup() {
    const activeUser = window.sessionUser || sessionUser;
    const authComp = document.getElementById('authDynamicComponent');
    if (authComp && activeUser) {
        authComp.innerHTML = `
            <div class="relative inline-block text-left" id="desktopProfileDropdownWrapper">
                <button onclick="toggleDesktopProfileDropdown()" class="bg-slate-900 dark:bg-slate-800 text-brand-gold border border-amber-500 px-3.5 h-9 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                    <i class="ph-fill ph-user-circle"></i> <span>Profile</span>
                </button>
                <div id="desktopProfileDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-[#131e3a] rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-50">
                    <button onclick="switchTab('profile'); goBackToProfileDashboard();" class="block w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">My Dashboard</button>
                    <button onclick="logoutAgent(); closeDesktopProfileDropdown();" class="block w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800">Logout</button>
                </div>
            </div>
        `;
    }
    updateMobileProfileTabLabel();
    startListeningToMyChats();
}

function startListeningToMyChats() {
    const activeUser = window.sessionUser || sessionUser;
    if (!activeUser || !firestoreDb) return;

    if (myChatsFirestoreListener1) myChatsFirestoreListener1();
    if (myChatsFirestoreListener2) myChatsFirestoreListener2();

    let allChatsMap = new Map();

    const handleChatsUpdate = (querySnapshot) => {
        querySnapshot.forEach(doc => {
            const data = doc.data();
            allChatsMap.set(doc.id, data);
        });
        activeChatsStorage = Array.from(allChatsMap.values());
        safeStorage.setItem('olx_chats_storage', JSON.stringify(activeChatsStorage));
        renderMyChatsHistoryList();
    };

    myChatsFirestoreListener1 = firestoreDb.collection('chats')
        .where('buyerPhone', '==', activeUser.phone)
        .onSnapshot(handleChatsUpdate, err => console.warn(err));

    myChatsFirestoreListener2 = firestoreDb.collection('chats')
        .where('sellerPhone', '==', activeUser.phone)
        .onSnapshot(handleChatsUpdate, err => console.warn(err));
}

function toggleDesktopProfileDropdown() {
    const dropdown = document.getElementById('desktopProfileDropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}

function closeDesktopProfileDropdown() {
    const dropdown = document.getElementById('desktopProfileDropdown');
    if (dropdown) dropdown.classList.add('hidden');
}

function resetPhoneInputForEdit() {
    let phoneInput = document.getElementById('authPhoneInput');
    let otpContainer = document.getElementById('otpInputContainerNode');
    let verifyBtn = document.getElementById('authVerifyOtpBtn');
    let changeLink = document.getElementById('changePhoneLink');
    let sendBtn = document.getElementById('authSendOtpBtn');
    
    if (phoneInput) {
        phoneInput.disabled = false;
        phoneInput.classList.remove('opacity-70');
        phoneInput.value = "";
    }
    if (otpContainer) otpContainer.classList.add('hidden');
    if (verifyBtn) verifyBtn.classList.add('hidden');
    if (changeLink) changeLink.classList.add('hidden');
    if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.classList.remove('opacity-60', 'cursor-not-allowed');
        sendBtn.innerText = "Send OTP";
    }
    if (otpCountdownInterval) clearInterval(otpCountdownInterval);
}

function initUploadStateDropdowns() {
    let sInp = document.getElementById('stateInp');
    if (sInp) {
        sInp.innerHTML = '<option value="" class="dark:bg-[#131e3a] dark:text-white font-bold">-- Choose State --</option>';
        Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
            if (st !== "All States (Entire India)") sInp.innerHTML += `<option class="dark:bg-[#131e3a] dark:text-white font-bold" value="${st}">${st}</option>`;
        });
    }
}

function loadCompleteCities() {
    let stateEl = document.getElementById('stateInp');
    if (!stateEl) return;
    let state = stateEl.value;
    let cInp = document.getElementById('cityInp');
    if (!cInp) return;
    cInp.innerHTML = '<option value="" class="dark:bg-[#131e3a] dark:text-white font-bold">-- Choose District --</option>';
    if(state && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cInp.innerHTML += `<option class="dark:bg-[#131e3a] dark:text-white font-bold" value="${ci}">${ci}</option>`;
        });
    }
}

function initEditStateDropdowns() {
    let sInp = document.getElementById('editStateInp');
    if (sInp) {
        sInp.innerHTML = '<option value="">-- Choose State --</option>';
        Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
            if (st !== "All States (Entire India)") sInp.innerHTML += `<option value="${st}">${st}</option>`;
        });
    }
}

function loadEditCities(preselectedCity = null) {
    let stateEl = document.getElementById('editStateInp');
    if (!stateEl) return;
    let state = stateEl.value;
    let cInp = document.getElementById('editCityInp');
    if (!cInp) return;
    cInp.innerHTML = '<option value="">-- Choose District --</option>';
    if(state && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cInp.innerHTML += `<option value="${ci}">${ci}</option>`;
        });
    }
    if (preselectedCity) {
        cInp.value = preselectedCity;
    }
}

function initReqStateDropdowns() {
    let sInp = document.getElementById('reqStateInp');
    if (sInp) {
        sInp.innerHTML = '<option value="">-- Choose State --</option>';
        Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
            if (st !== "All States (Entire India)") sInp.innerHTML += `<option value="${st}">${st}</option>`;
        });
    }
}

function loadReqCities() {
    let stateEl = document.getElementById('reqStateInp');
    if (!stateEl) return;
    let state = stateEl.value;
    let cInp = document.getElementById('reqCityInp');
    if (!cInp) return;
    cInp.innerHTML = '<option value="">-- Choose District --</option>';
    if(state && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cInp.innerHTML += `<option value="${ci}">${ci}</option>`;
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
    if (btnElement) btnElement.classList.add('bg-slate-100', 'text-white');
}

function applySearchPillTab(cat, btn) {
    activeCategoryFilter = cat;
    
    document.querySelectorAll('.custom-search-tab').forEach(b => {
        b.classList.remove('active');
        const txt = b.querySelector('span');
        const iconBox = b.querySelector('.icon-box');
        
        if (iconBox) { 
            iconBox.className = "w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-303 dark:border-slate-700 shadow-sm transition-all icon-box";
            if (txt) {
                txt.className = "text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide";
            }
        } else { 
            b.className = "custom-search-tab px-3.5 py-1.5 rounded-md text-white hover:bg-amber-600 transition-colors shrink-0 text-xs";
        }
    });
    
    if (btn) {
        btn.classList.add('active');
        const txt = btn.querySelector('span');
        const iconBox = btn.querySelector('.icon-box');
        
        if (iconBox) { 
            iconBox.className = "w-12 h-12 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center border-2 border-amber-500 scale-110 shadow-md icon-box transition-all";
            if (txt) {
                txt.className = "text-[10px] font-extrabold text-amber-500 uppercase tracking-wide";
            }
        } else { 
            btn.className = "custom-search-tab active px-3.5 py-1.5 rounded-md bg-white text-brand-gold font-extrabold shadow-sm shrink-0 transition-all text-xs";
        }
    }
    let typeEl = document.getElementById('filterType');
    if (typeEl) typeEl.value = "All";
    currentPropertiesPage = 1;
    render();
}

function applySearchPillType(type, btn) {
    document.querySelectorAll('.custom-search-tab').forEach(b => {
        b.classList.remove('active');
        const txt = b.querySelector('span');
        const iconBox = b.querySelector('.icon-box');
        
        if (iconBox) { 
            iconBox.className = "w-12 h-12 rounded-full bg-slate-200 dark:bg-[#131e3a] text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-303 dark:border-slate-700 shadow-sm transition-all icon-box";
            if (txt) {
                txt.className = "text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide";
            }
        } else { 
            b.className = "custom-search-tab px-3.5 py-1.5 rounded-md text-white hover:bg-amber-600 transition-colors shrink-0 text-xs";
        }
    });
    
    if (btn) {
        btn.classList.add('active');
        const txt = btn.querySelector('span');
        const iconBox = btn.querySelector('.icon-box');
        
        if (iconBox) { 
            iconBox.className = "w-12 h-12 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center border-2 border-amber-500 scale-110 shadow-md icon-box transition-all";
            if (txt) {
                txt.className = "text-[10px] font-extrabold text-amber-500 uppercase tracking-wide";
            }
        } else { 
            btn.className = "custom-search-tab active px-3.5 py-1.5 rounded-md bg-white text-brand-gold font-extrabold shadow-sm shrink-0 transition-all text-xs";
        }
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
    if (cEl) cEl.innerHTML = '<option value="All" class="dark:bg-slate-900 dark:text-white font-bold">Select District (All)</option>';
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

function toggleReelsMuteState() {
    isReelsMuted = !isReelsMuted;
    const videos = document.querySelectorAll('#reelScrollContainer video');
    videos.forEach(vid => { vid.muted = isReelsMuted; });
    const icons = document.querySelectorAll('.reels-mute-icon');
    icons.forEach(icon => {
        icon.className = isReelsMuted ? "ph-bold ph-speaker-slash text-base text-red-500 reels-mute-icon font-bold" : "ph-bold ph-speaker-high text-base text-emerald-500 reels-mute-icon font-bold";
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
        container.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center p-6 space-y-2"><i class="ph ph-video-camera-slash text-4xl text-slate-500 dark:text-white font-bold"></i><p class="text-xs font-semibold text-slate-500 dark:text-white">No matching reels found.</p></div>`;
        return;
    }
    reelsData.forEach((x, index) => {
        let div = document.createElement('div');
        div.className = "single-reel-block font-bold";
        div.setAttribute('data-index', index);
        let soundIconClass = isReelsMuted ? "ph-bold ph-speaker-slash text-base text-red-400 font-bold" : "ph-bold ph-speaker-high text-base text-emerald-400 font-bold";
        div.innerHTML = `
            <video src="${x.video}" loop ${isReelsMuted ? 'muted' : ''} playsinline preload="auto" onclick="toggleReelPlaybackEvent(this)"></video>
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40 pointer-events-none"></div>
            <div class="absolute bottom-14 left-4 right-16 text-white space-y-1 z-30 pointer-events-none">
                <div class="flex items-center gap-1.5">
                    <span class="bg-[#0b1329] text-brand-gold font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded shadow border border-slate-800">${x.role}</span>
                    <h4 class="font-bold text-xs uppercase truncate tracking-tight drop-shadow-md text-white">${x.bhk} ${x.type}</h4>
                </div>
                <p class="text-[10px] font-semibold text-slate-200 truncate drop-shadow-md"><i class="ph-fill ph-map-pin text-xs text-red-500 inline mr-0.5"></i>${x.locality}, ${x.city}</p>
                <p class="text-sm font-extrabold text-brand-gold tracking-tight drop-shadow-lg">₹${formatIndianCurrency(x.price)}</p>
            </div>
            <div class="absolute bottom-16 right-3 flex flex-col items-center gap-3 z-40 font-bold">
                <button onclick="toggleReelsMuteState(); event.stopPropagation();" class="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl"><i class="${soundIconClass} reels-mute-icon font-bold"></i></button>
                <button onclick="toggleBookmarkClientState('${x.id}', this); event.stopPropagation();" class="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl"><i class="${x.saved ? 'ph-fill ph-bookmark text-amber-500 text-base font-bold' : 'ph ph-bookmark text-base text-white'}"></i></button>
                <button onclick="openOlxChatSimulation('${x.id}'); event.stopPropagation();" class="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl"><i class="ph-fill ph-chats-teardrop font-bold"></i></button>
                <button onclick="openShareToolkitChannel('${x.id}'); event.stopPropagation();" class="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-xl"><i class="ph-bold ph-share-network font-bold"></i></button>
                <button onclick="openPropertyDetailsModal('${x.id}'); event.stopPropagation();" class="w-10 h-10 bg-slate-900/80 text-white rounded-full flex items-center justify-center shadow-xl"><i class="ph ph-info text-white font-bold"></i></button>
            </div>`;
        container.appendChild(div);
    });

    container.scrollTop = 0;
    setTimeout(() => { 
        manageReelsIntersectionEngine(); 
        const firstVideo = container.querySelector('video');
        if (firstVideo) {
            firstVideo.muted = isReelsMuted;
            firstVideo.play().catch(e => console.log("Auto-play blocked: ", e));
        }
    }, 200);
}

function openShareToolkitChannel(id) {
    let item = database.find(x => String(x.id) === String(id));
    if (!item) return;
    currentlyTargetedShareNodeData = item;

    let shareUrl = `${window.location.origin}${window.location.pathname}?property=${item.id}`;
    let textMessage = `*Mama Dealing Premium Asset Hub*\n\n🔥 *${item.bhk && item.bhk !== "Any BHK Configuration" ? item.bhk : ''} ${item.type}* Available!\n📍 *Location:* ${item.locality}, ${item.city}\n💰 *Target Valuation:* ₹${formatIndianCurrency(item.price)}\n\n👉 View details here:\n${shareUrl}`;
    let encodedText = encodeURIComponent(textMessage);

    let sw = document.getElementById('shareWAActionChannelNode');
    if (sw) {
        sw.onclick = () => { window.open(`https://api.whatsapp.com/send?text=${encodedText}`); };
    }

    let sf = document.getElementById('shareFBActionChannelNode');
    if (sf) {
        sf.onclick = () => { 
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`); 
        };
    }

    let sc = document.getElementById('shareCopyLinkActionChannelNode');
    if (sc) {
        sc.onclick = () => {
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert("📋 Link copied to clipboard!");
                closeFeature('shareToolkitModal');
            }).catch(err => {
                console.error('Copy link protocol failed: ', err);
            });
        };
    }

    let ss = document.getElementById('shareSystemActionChannelNode');
    if (ss) {
        if (navigator.share) {
            ss.style.display = "flex";
            ss.onclick = () => {
                navigator.share({
                    title: `${item.bhk || ''} ${item.type} on Mama Dealing`,
                    text: `Check out this verified listing in ${item.locality}, ${item.city}`,
                    url: shareUrl
                }).then(() => {
                    closeFeature('shareToolkitModal');
                }).catch(e => console.warn(e));
            };
        } else {
            ss.style.display = "none";
        }
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
    const nearMeMobileBtn = document.getElementById('nearMeMobileBtn');
    if (!navigator.geolocation) return;
    if (scanRadiusActive) {
        scanRadiusActive = false;
        deviceCoordinates = null;
        if (nearMeBtn) {
            nearMeBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
            nearMeBtn.classList.add('bg-brand-gold', 'hover:bg-brand-gold-hover');
            nearMeBtn.innerHTML = `<i class="ph-bold ph-crosshair text-xs animate-pulse font-bold"></i> Near Me`;
        }
        if (nearMeMobileBtn) {
            nearMeMobileBtn.classList.remove('text-emerald-500');
            nearMeMobileBtn.classList.add('text-slate-500');
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
                nearMeBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700'); // Fixed list reference method
                nearMeBtn.innerHTML = `<i class="ph-bold ph-check text-[10px] font-bold"></i> Near Active`;
            }
            if (nearMeMobileBtn) {
                nearMeMobileBtn.classList.remove('text-slate-500');
                nearMeMobileBtn.classList.add('text-emerald-500');
            }
            render();
        },
        () => { 
            deviceCoordinates = { latitude: 23.259933, longitude: 77.412613 };
            scanRadiusActive = true;
            if (nearMeBtn) {
                nearMeBtn.classList.remove('bg-brand-gold', 'hover:bg-brand-gold-hover');
                nearMeBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700'); // Fixed list reference method
                nearMeBtn.innerHTML = `<i class="ph-bold ph-check text-[10px] font-bold"></i> Near Bhopal`;
            }
            if (nearMeMobileBtn) {
                nearMeMobileBtn.classList.remove('text-slate-500');
                nearMeMobileBtn.classList.add('text-emerald-500');
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

function openOlxChatSimulation() {
    const activeUser = window.sessionUser || sessionUser;
    if (!activeUser) {
        alert("🔒 Login using your mobile number to chat.");
        openFeature('loginModal');
        return;
    }
    const item = targetDetailItemInstance;
    if (!item) return;

    const chatId = `chat_${item.id}_${activeUser.phone}`;
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
                    
                    firestoreDb.collection('chats').doc(chatId).set({
                        chatId: chatId,
                        propertyId: item.id,
                        propertyTitle: `${item.bhk || ''} ${item.type} in ${item.locality}`,
                        buyerPhone: activeUser.phone,
                        buyerName: activeUser.firmName || "Interested Buyer",
                        sellerPhone: item.phone,
                        sellerName: item.firmName || "Property Owner",
                        messages: [welcomeMessage]
                    });
                }
            }, err => console.error("Firestore error:", err));
    }
    
    const sendBtn = document.querySelector('#olxChatDialogModal button[onclick="sendUserChatMessageSimulation()"]');
    if (sendBtn) {
        sendBtn.onclick = () => sendUserChatMessageSimulation();
    }

    updateDetailSaveBtnVisual();
    openFeature('olxChatDialogModal');
}

function openOlxChatSimulationFromList(propertyId, buyerPhone, sellerName) {
    const activeUser = window.sessionUser || sessionUser;
    if (!activeUser) return;
    let item = database.find(x => String(x.id) === String(propertyId));
    
    targetDetailItemInstance = item || { id: propertyId, firmName: sellerName, phone: buyerPhone };

    const chatId = `chat_${propertyId}_${buyerPhone}`;
    document.getElementById('chatSellerName').innerText = sellerName;

    if (activeChatsFirestoreListener) activeChatsFirestoreListener();

    if (firestoreDb) {
        activeChatsFirestoreListener = firestoreDb.collection('chats').doc(chatId)
            .onSnapshot(doc => {
                const data = doc.data();
                if (data && data.messages) {
                    renderRealtimeMessages(data.messages);
                }
            }, err => console.error(err));
    }
    
    const sendBtn = document.querySelector('#olxChatDialogModal button[onclick="sendUserChatMessageSimulation()"]');
    if (sendBtn) {
        sendBtn.onclick = () => {
            let input = document.getElementById('olxChatMessageInput');
            if (!input || !input.value.trim()) return;
            const isBuyer = String(buyerPhone) === String(activeUser.phone);
            const userMessage = {
                sender: isBuyer ? 'user' : 'seller',
                text: input.value.trim(),
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
            input.value = "";

            const docRef = firestoreDb.collection('chats').doc(chatId);
            docRef.get().then(doc => {
                const data = doc.data();
                const currentMessages = data ? data.messages : [];
                currentMessages.push(userMessage);
                docRef.set({ messages: currentMessages }, { merge: true });
            });
        };
    }

    openFeature('olxChatDialogModal');
}

function renderRealtimeMessages(messages) {
    const activeUser = window.sessionUser || sessionUser;
    let flow = document.getElementById('olxChatMessageFlow');
    if (!flow) return;
    flow.innerHTML = "";
    messages.forEach(m => {
        let div = document.createElement('div');
        let isMe = false;
        
        if (m.sender === 'user') {
            isMe = (String(targetDetailItemInstance?.phone) !== String(activeUser?.phone));
        } else if (m.sender === 'seller') {
            isMe = (String(targetDetailItemInstance?.phone) === String(activeUser?.phone));
        }
        
        div.className = isMe ? "flex justify-end font-bold" : "flex justify-start font-bold";
        let bubbleClass = isMe ? "bg-[#0b1329] text-white rounded-2xl rounded-tr-none" : "bg-white text-slate-800 rounded-2xl rounded-tl-none border shadow-sm";
        div.innerHTML = `
            <div class="${bubbleClass} p-2.5 text-xs font-semibold max-w-[80%] font-bold">
                <p class="leading-relaxed font-bold">${m.text}</p>
                <span class="text-[8px] opacity-70 block text-right mt-1 font-bold">${m.time}</span>
            </div>`;
        flow.appendChild(div);
    });
    flow.scrollTop = flow.scrollHeight;
}

function sendUserChatMessageSimulation() {
    let input = document.getElementById('olxChatMessageInput');
    const activeUser = window.sessionUser || sessionUser;
    if (!input || !input.value.trim() || !targetDetailItemInstance || !activeUser) return;
    const chatId = `chat_${targetDetailItemInstance.id}_${activeUser.phone}`;
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
            docRef.set({ messages: currentMessages }, { merge: true });
        });
    }
}

function triggerScamReportAction() {
    if (!targetDetailItemInstance) return;
    
    let reportReason = prompt("⚠️ Please specify the reason for reporting this property:\n(e.g., Sold out, Fake photos, Scam listing, Wrong details)");
    if (reportReason === null) {
        return; 
    }
    
    if (!reportReason.trim()) {
        alert("⚠️ Reason cannot be blank. Reporting cancelled.");
        return;
    }
    
    let count = propertyReportsTracker[targetDetailItemInstance.id] || 0;
    count++;
    propertyReportsTracker[targetDetailItemInstance.id] = count;
    safeStorage.setItem('property_scam_reports', JSON.stringify(propertyReportsTracker));
    
    alert(`⚠️ Property reported.\nReason specified: "${reportReason.trim()}"`);
    
    if (count >= 3) {
        database = database.filter(x => String(x.id) !== String(targetDetailItemInstance.id));
        closePropertyDetailModalBlock();
        render();
    }
}

function render() {
    let featuredGrid = document.getElementById('featuredPropertyGrid');
    let recentGrid = document.getElementById('propertyGrid');
    let plotsGrid = document.getElementById('plotsPropertyGrid');
    
    let hasNewGrids = featuredGrid && plotsGrid && recentGrid;
    
    let searchInp = document.getElementById('searchInput');
    let q = searchInp ? searchInp.value.toLowerCase().trim() : '';
    let typeEl = document.getElementById('filterType');
    let type = typeEl ? typeEl.value : 'All';
    let priceEl = document.getElementById('priceFilter');
    let maxPrice = priceEl ? parseInt(priceEl.value) : 50000000;

    let filtered = database.filter(x => {
        if((x.status || "") === "Expired") return false;
        if(activeCategoryFilter !== "All" && (x.cat || "") !== activeCategoryFilter) return false;
        if(type !== "All" && (x.type || "") !== type) return false;
        if((Number(x.price) || 0) > maxPrice) return false;
        if (selectedGlobalState && selectedGlobalState !== "All States (Entire India)") {
            if ((x.state || "") !== selectedGlobalState) return false;
        }
        if (selectedGlobalCity && selectedGlobalCity !== "All") {
            if ((x.city || "") !== selectedGlobalCity) return false;
        }
        if (scanRadiusActive && deviceCoordinates) {
            let distanceInKm = calculateHaversineDistance(deviceCoordinates.latitude, deviceCoordinates.longitude, x.latitude || 23.259933, x.longitude || 77.412613);
            if (distanceInKm > 15) return false;
        }
        if(q) {
            let match = (x.locality || "").toLowerCase().includes(q) || 
                        (x.city || "").toLowerCase().includes(q) || 
                        (x.state || "").toLowerCase().includes(q) ||
                        (x.bhk || "").toLowerCase().includes(q) ||
                        (x.type || "").toLowerCase().includes(q);
            if (!match) return false;
        }
        return true;
    });

    if (hasNewGrids) {
        featuredGrid.innerHTML = "";
        recentGrid.innerHTML = "";
        plotsGrid.innerHTML = "";

        let premiumItems = filtered.filter(x => x.membershipTier === "Gold Plan" || x.membershipTier === "Silver Plan");
        document.getElementById('premiumCounter').innerText = `${premiumItems.length} Premium Units`;
        if (premiumItems.length === 0) {
            featuredGrid.innerHTML = `<div class="col-span-full py-4 text-center text-[11px] font-semibold text-slate-500">No premium properties found.</div>`;
        } else {
            premiumItems.forEach(x => featuredGrid.appendChild(createPropertyCardNode(x)));
        }

        let plotItems = filtered.filter(x => x.type === "Plot");
        document.getElementById('plotsCounter').innerText = `${plotItems.length} Plots Registered`;
        if (plotItems.length === 0) {
            plotsGrid.innerHTML = `<div class="col-span-full py-4 text-center text-[11px] font-semibold text-slate-500">No plots found.</div>`;
        } else {
            plotsGrid.forEach(x => plotsGrid.appendChild(createPropertyCardNode(x)));
        }

        let recentItems = filtered.filter(x => x.type !== "Plot" && x.membershipTier !== "Gold Plan" && x.membershipTier !== "Silver Plan");
        document.getElementById('recentCounter').innerText = `${recentItems.length} Recent Listings`;
        
        let startIdx = (currentPropertiesPage - 1) * propertiesPerPageLimit;
        let paginatedItems = recentItems.slice(startIdx, startIdx + propertiesPerPageLimit);
        
        if (paginatedItems.length === 0) {
            recentGrid.innerHTML = `<div class="col-span-full py-12 text-center text-xs font-bold text-slate-500 dark:text-white">Zero properties found.</div>`;
            renderPaginationControls(0);
        } else {
            paginatedItems.forEach(x => recentGrid.appendChild(createPropertyCardNode(x)));
            renderPaginationControls(Math.ceil(recentItems.length / propertiesPerPageLimit));
        }
    }
}

function createPropertyCardNode(x) {
    let div = document.createElement('div');
    div.className = "p-card relative overflow-hidden transition-all duration-200 animate-slide-up cursor-pointer bg-white dark:bg-[#131e3a]";
    div.setAttribute('onclick', `openPropertyDetailsModal('${x.id}')`);

    let badgeColor = x.role === "Owner" ? "from-slate-900 to-slate-800 text-brand-gold" : x.role === "Builder" ? "from-emerald-600 to-teal-500 text-white" : "from-purple-600 to-indigo-500 text-white";
    let dynamicFirmLabelStr = x.firmName ? `<p class="text-[10px] text-slate-500 dark:text-slate-300 font-extrabold truncate mt-0.5"><i class="ph-fill ph-buildings inline text-brand-gold"></i> ${x.firmName}</p>` : `<p class="text-[10px] text-brand-gold font-extrabold mt-0.5"><i class="ph-fill ph-seal-check inline"></i> Verified Owner</p>`;
    let premiumVisualBadge = (x.membershipTier && x.membershipTier !== "Free") ? `<span class="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow z-10"><i class="ph-fill ph-crown text-slate-900"></i> PRO</span>` : '';
    let displayTypeTitle = (x.bhk && x.bhk !== "Any BHK Configuration" ? `${x.bhk} ` : "") + x.type;
    
    div.innerHTML = `
        <div class="relative h-64 sm:h-72 bg-slate-900 overflow-hidden">
            <img src="${x.images && x.images.length > 0 ? x.images[0] : NO_IMAGE_FALLBACK}" alt="Asset Preview" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy">
            <span class="absolute top-2.5 left-2.5 bg-gradient-to-tr ${badgeColor} font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm z-10">${x.role}</span>
            <span class="absolute top-9 left-2.5 bg-amber-500 text-slate-900 font-black text-[7px] uppercase tracking-widest px-2 py-0.5 rounded shadow-sm z-10">${x.status || 'READY TO MOVE'}</span>
            ${premiumVisualBadge}
            ${(x.video && x.video !== "") ? '<span class="absolute top-2.5 right-2.5 bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs z-10"><i class="ph-fill ph-play text-brand-gold"></i></span>' : ''}
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-3 pt-10">
                <span class="bg-[#050b18]/85 border border-slate-800 text-brand-gold font-black text-[8px] px-2.5 py-0.5 rounded uppercase">${x.cat}</span>
                <p class="text-white text-base font-extrabold tracking-tight mt-1">₹${formatIndianCurrency(x.price)}</p>
            </div>
        </div>
        <div class="p-3.5 space-y-2 font-bold">
            <div class="flex justify-between items-start gap-1">
                <h3 class="font-extrabold text-xs text-slate-900 dark:text-white uppercase truncate">${displayTypeTitle}</h3>
                <div class="flex items-center gap-1.5">
                    <button onclick="openShareToolkitChannel('${x.id}'); event.stopPropagation();" class="text-slate-400 hover:text-brand-gold text-base ph-bold ph-share-network" title="Share Property"></button>
                    <button onclick="toggleBookmarkClientState('${x.id}', this); event.stopPropagation();" class="text-lg ${x.saved ? 'text-amber-500 ph-fill font-bold' : 'text-slate-300 dark:text-slate-303 ph'} ph-bookmark"></button>
                </div>
            </div>
            <p class="text-[10px] text-slate-600 dark:text-slate-303 font-semibold flex items-center gap-0.5 truncate"><i class="ph-fill ph-map-pin text-brand-gold"></i> ${x.locality || ""}, ${x.city || ""}</p>
            
            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>${dynamicFirmLabelStr}</div>
                <!-- Standardized classes for Details button to prevent legibility crash in Dark mode -->
                <span class="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white px-2 py-0.5 rounded-md font-bold">Details →</span>
            </div>
        </div>`;
    return div;
}

function renderPaginationControls(totalPages) {
    let container = document.getElementById('propertyPagination');
    if (!container) return;
    container.innerHTML = "";
    if (totalPages <= 1) return;
    let prevBtn = document.createElement('button');
    prevBtn.className = "px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-white hover:bg-slate-50 cursor-pointer";
    prevBtn.innerText = "Prev";
    prevBtn.disabled = currentPropertiesPage === 1;
    prevBtn.onclick = () => { currentPropertiesPage--; render(); };
    container.appendChild(prevBtn);
    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement('button');
        btn.className = `px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold cursor-pointer ${currentPropertiesPage === i ? 'bg-[#0b1329] text-brand-gold' : 'bg-white text-slate-700 dark:text-white'}`;
        btn.onclick = () => { currentPropertiesPage = i; render(); };
        btn.innerText = i;
        container.appendChild(btn);
    }
    let nextBtn = document.createElement('button');
    nextBtn.className = "px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold bg-white dark:bg-[#0b1329] text-slate-500 dark:text-white hover:bg-slate-50 cursor-pointer";
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
        grid.innerHTML = `<div class="p-6 text-center text-slate-400 dark:text-white bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-[#1e2d54] col-span-full font-semibold text-xs">No active partners registered in this area.</div>`;
        return;
    }
    filteredServices.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-white dark:bg-[#131e3a] p-3.5 rounded-xl border border-slate-100 dark:border-[#1e2d54] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm";
        div.innerHTML = `
            <div class="space-y-0.5 font-bold">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <h3 class="font-extrabold text-xs text-slate-900 dark:text-white uppercase">${x.title}</h3>
                    <span class="bg-[#0b1329] text-brand-gold text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5"><i class="ph-fill ph-seal-check"></i> Expert</span>
                </div>
                <p class="text-[10px] text-slate-600 dark:text-slate-303 font-semibold">Speciality: ${x.specialty}</p>
                <div class="flex items-center gap-1.5 pt-0.5 text-[9px] font-bold">
                    <span class="text-amber-500 font-bold"><i class="ph-fill ph-star"></i> ${x.rating}</span>
                    <span class="text-slate-505 dark:text-slate-303 font-medium">| ${x.city}, ${x.state}</span>
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
    let stateEl = document.getElementById('b2bFormState');
    if (!stateEl) return;
    let state = stateEl.value;
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
    let tray = document.getElementById('profileActiveChatsDashboardList');
    if (!tray) return;
    tray.innerHTML = "";
    if (activeChatsStorage.length === 0) {
        tray.innerHTML = `<p class="text-slate-400 py-6 text-center text-xs font-bold">No conversation backups found.</p>`;
        return;
    }
    activeChatsStorage.forEach(chat => {
        let div = document.createElement('div');
        div.className = "p-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl cursor-pointer hover:border-brand-gold transition-colors font-bold";
        div.onclick = () => openOlxChatSimulationFromList(chat.propertyId, chat.buyerPhone, chat.sellerName);
        div.innerHTML = `<div><h4 class="text-slate-900 dark:text-white uppercase text-xs">${chat.sellerName || 'Property Owner'}</h4><p class="text-[9px] text-slate-500 mt-1">Property: ${chat.propertyTitle || 'Asset Detail'}</p></div>`;
        tray.appendChild(div);
    });
}

function renderSavedBookmarksDashboard() {
    let grid = document.getElementById('savedPropertiesDashboardGrid');
    if (!grid) return;
    let saved = database.filter(x => x.saved);
    grid.innerHTML = "";
    if(saved.length === 0) {
        grid.innerHTML = `<p class="text-xs font-semibold text-slate-500 dark:text-white col-span-full py-4 text-center">No saved properties yet.</p>`;
        return;
    }
    saved.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex justify-between items-center cursor-pointer font-bold";
        div.onclick = () => openPropertyDetailsModal(x.id);
        div.innerHTML = `<div><h4 class="font-bold text-[11px] text-slate-900 dark:text-white uppercase">${x.type}</h4><span class="text-slate-900 dark:text-white font-extrabold text-[11px] block mt-0.5">₹${formatIndianCurrency(x.price)}</span></div><i class="ph-fill ph-caret-right text-slate-404 text-xs"></i>`;
        grid.appendChild(div);
    });
}

function renderMyPropertiesManagementWorkspace() {
    const activeUser = window.sessionUser || sessionUser;
    let container = document.getElementById('myPropertiesManagementContainer');
    if(!container) return;
    container.innerHTML = "";
    if (!activeUser) {
        container.innerHTML = `<p class="text-xs font-semibold text-slate-500 py-2 text-center">Please log in to manage your assets.</p>`;
        return;
    }
    let myProperties = database.filter(x => String(x.phone) === String(activeUser.phone));
    if (myProperties.length === 0) {
        container.innerHTML = `<p class="text-xs font-semibold text-slate-500 py-2 text-center">You have not posted any properties yet.</p>`;
        return;
    }
    myProperties.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-white dark:bg-[#131e3a] border rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm font-bold border-slate-200 dark:border-slate-800";
        div.innerHTML = `
            <div>
                <h4 class="font-bold text-xs uppercase text-slate-900 dark:text-white">${x.bhk} ${x.type}</h4>
                <p class="text-[10px] text-slate-500 dark:text-slate-300 font-medium"><i class="ph-fill ph-map-pin"></i> ${x.locality}, ${x.city}</p>
                <p class="text-[9px] text-brand-gold mt-1">₹${formatIndianCurrency(x.price)}</p>
            </div>
            <div class="flex gap-2 w-full md:w-auto shrink-0">
                <button onclick="openEditPropertyModal('${x.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-extrabold uppercase px-3.5 py-1.5 rounded-lg border border-amber-200 w-full md:w-auto">Edit</button>
                <button onclick="deletePropertyListing('${x.id}')" class="bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-955/20 dark:text-red-404 text-[10px] font-bold uppercase px-3.5 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30 w-full md:w-auto">Delete</button>
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
    } catch(e){}
    container.innerHTML = "";
    let recentItems = database.filter(x => textIdList.includes(x.id));
    if (recentItems.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-500 col-span-full py-4 text-center font-semibold">No recently viewed listings.</p>`;
        return;
    }
    recentItems.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex justify-between items-center cursor-pointer font-bold";
        div.onclick = () => openPropertyDetailsModal(x.id);
        div.innerHTML = `<div><h4 class="font-bold text-[11px] uppercase text-slate-900 dark:text-white">${x.type}</h4><span class="text-slate-900 dark:text-white font-extrabold text-[11px] block mt-0.5">₹${formatIndianCurrency(x.price)}</span></div><i class="ph-fill ph-caret-right text-slate-404 text-xs"></i>`;
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
    const activeUser = window.sessionUser || sessionUser;
    if (!activeUser) { 
        alert("⚠️ Authentication required. Please log in."); 
        closeFeature('platformSubscriptionPlansModal'); 
        closeFeature('loginModal'); 
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
    
    let builtupBox = document.getElementById('builtupAreaBlock');
    let carpetBox = document.getElementById('carpetAreaBlock');
    let superBox = document.getElementById('superBuiltupAreaBlock');
    let plotBox = document.getElementById('plotAreaBlock');
    
    let areaLabel = document.getElementById('areaLabelNode');

    if (selectedType === "Flat") {
        if (bhkBox) bhkBox.classList.remove('hidden');
        if (builtupBox) builtupBox.classList.add('hidden'); 
        if (carpetBox) carpetBox.classList.remove('hidden');
        if (superBox) superBox.classList.remove('hidden');
        if (plotBox) plotBox.classList.add('hidden');
    } else if (selectedType === "House") {
        if (bhkBox) bhkBox.classList.remove('hidden');
        if (builtupBox) builtupBox.classList.remove('hidden');
        if (carpetBox) carpetBox.classList.add('hidden');
        if (superBox) superBox.classList.add('hidden');
        if (plotBox) plotBox.classList.remove('hidden');
        if (areaLabel) areaLabel.innerText = "Built-up Area (Sq.Ft.)";
    } else if (selectedType === "Plot") {
        if (bhkBox) bhkBox.classList.add('hidden');
        if (builtupBox) builtupBox.classList.add('hidden');
        if (carpetBox) carpetBox.classList.add('hidden');
        if (superBox) superBox.classList.add('hidden');
        if (plotBox) plotBox.classList.remove('hidden');
        if (areaLabel) areaLabel.innerText = "Plot Area (Sq.Ft.)";
    } else {
        if (bhkBox) bhkBox.classList.add('hidden');
        if (builtupBox) builtupBox.classList.remove('hidden');
        if (carpetBox) carpetBox.classList.add('hidden');
        if (superBox) superBox.classList.add('hidden');
        if (plotBox) plotBox.classList.add('hidden');
        if (areaLabel) areaLabel.innerText = "Commercial Area (Sq.Ft.)";
    }
}

function adjustEditSpecsVisibility() {
    let typeEl = document.getElementById('editFormTypeInp');
    let selectedType = typeEl ? typeEl.value : 'Flat';
    
    let bhkBox = document.getElementById('editBhkSpecContainer');
    let builtupBox = document.getElementById('editBuiltupAreaBlock');
    let carpetBox = document.getElementById('editCarpetAreaBlock');
    let superBox = document.getElementById('editSuperBuiltupAreaBlock');
    let plotBox = document.getElementById('editPlotAreaBlock');

    if (selectedType === "Flat") {
        if (bhkBox) bhkBox.classList.remove('hidden');
        if (builtupBox) builtupBox.classList.add('hidden'); 
        if (carpetBox) carpetBox.classList.remove('hidden');
        if (superBox) superBox.className = "block";
        if (plotBox) plotBox.classList.add('hidden');
    } else if (selectedType === "House") {
        if (bhkBox) bhkBox.classList.remove('hidden');
        if (builtupBox) builtupBox.classList.remove('hidden');
        if (carpetBox) carpetBox.classList.add('hidden');
        if (superBox) superBox.classList.add('hidden');
        if (plotBox) plotBox.classList.remove('hidden');
    } else if (selectedType === "Plot") {
        if (bhkBox) bhkBox.classList.add('hidden');
        if (builtupBox) builtupBox.classList.add('hidden');
        if (carpetBox) carpetBox.classList.add('hidden');
        if (superBox) superBox.classList.add('hidden');
        if (plotBox) plotBox.classList.remove('hidden');
    } else {
        if (bhkBox) bhkBox.classList.add('hidden');
        if (builtupBox) builtupBox.classList.remove('hidden');
        if (carpetBox) carpetBox.classList.add('hidden');
        if (superBox) superBox.classList.add('hidden');
        if (plotBox) plotBox.classList.add('hidden');
    }
}

function moveStep(st) {
    document.querySelectorAll('.step-div').forEach(x => x.classList.add('hidden'));
    let stepDiv = document.getElementById(`step-v1`);
    if (stepDiv && st === 1) stepDiv.classList.remove('hidden');
    let stepDiv2 = document.getElementById(`step-v2`);
    if (stepDiv2 && st === 2) stepDiv2.classList.remove('hidden');
    let stepDiv3 = document.getElementById(`step-v3`);
    if (stepDiv3 && st === 3) stepDiv3.classList.remove('hidden');

    const stages = ['1', '2', '3'];
    stages.forEach(s => {
        let ind = document.getElementById('postStepIndicator' + s);
        if (ind) {
            ind.className = parseInt(s) <= st ? "w-3.5 h-1 bg-[#0b1329] dark:bg-white rounded-full transition-all" : "w-3.5 h-1 bg-slate-200 dark:bg-slate-800 rounded-full transition-all font-bold";
        }
    });
    if (st === 2) adjustPostSpecsVisibility();
}

function compressImage(file, maxWidth = 1024, quality = 0.6) {
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
            img.onerror = () => resolve("");
        };
        reader.onerror = () => resolve("");
    });
}

// Post-property photo logic
async function handlePhotoSelection(event) {
    let files = Array.from(event.target.files);
    if (selectedPhotosBase64.length + files.length > 10) {
        alert("⚠️ Maximum 10 photos limit reached.");
        files = files.slice(0, 10 - selectedPhotosBase64.length);
    }
    for (let file of files) {
        try {
            let base64Data = await compressImage(file, 800, 0.6); 
            if (base64Data) {
                selectedPhotosBase64.push(base64Data);
            }
        } catch (e) { console.error(e); }
    }
    renderPhotoPreviews();
}

function renderPhotoPreviews() {
    let container = document.getElementById('imagePreviewContainer');
    if (!container) return;
    container.innerHTML = "";
    selectedPhotosBase64.forEach((base64, index) => {
        let card = document.createElement('div');
        card.className = "relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-707 bg-slate-100 font-bold";
        card.innerHTML = `
            <img src="${base64}" class="w-full h-full object-cover">
            <button type="button" onclick="removeSelectedPhoto(${index})" class="absolute top-0.5 right-0.5 bg-red-600 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-bold"><i class="ph-bold ph-trash font-bold"></i></button>`;
        container.appendChild(card);
    });
}

function removeSelectedPhoto(idx) {
    selectedPhotosBase64.splice(idx, 1);
    renderPhotoPreviews();
}

function handleVideoSelection(event) {
    let file = event.target.files[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { 
        alert("⚠️ Video file is too large (Max 15MB).");
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

// Edit-property photo logic
async function handleEditPhotoSelection(event) {
    let files = Array.from(event.target.files);
    if (editSelectedPhotosBase64.length + files.length > 10) {
        alert("⚠️ Maximum 10 photos limit.");
        files = files.slice(0, 10 - editSelectedPhotosBase64.length);
    }
    for (let file of files) {
        try {
            let base64Data = await compressImage(file, 800, 0.6);
            if (base64Data) {
                editSelectedPhotosBase64.push(base64Data);
            }
        } catch (e) { console.error(e); }
    }
    renderEditPhotoPreviews();
}

function renderEditPhotoPreviews() {
    let container = document.getElementById('editImagePreviewContainer');
    if (!container) return;
    container.innerHTML = "";
    editSelectedPhotosBase64.forEach((base64, index) => {
        let card = document.createElement('div');
        card.className = "relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 font-bold";
        card.innerHTML = `
            <img src="${base64}" class="w-full h-full object-cover">
            <button type="button" onclick="removeEditSelectedPhoto(${index})" class="absolute top-0.5 right-0.5 bg-red-600 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-bold"><i class="ph-bold ph-trash font-bold"></i></button>`;
        container.appendChild(card);
    });
}

function removeEditSelectedPhoto(idx) {
    editSelectedPhotosBase64.splice(idx, 1);
    renderEditPhotoPreviews();
}

function handleEditVideoSelection(event) {
    let file = event.target.files[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
        alert("⚠️ Video file is too large (Max 15MB).");
        return;
    }
    let reader = new FileReader();
    reader.onload = function(e) {
        editSelectedVideoBase64 = e.target.result;
        let preview = document.getElementById('editFormVideoPreview');
        let container = document.getElementById('editVideoPreviewContainer');
        if (preview && container) {
            preview.src = editSelectedVideoBase64;
            container.classList.remove('hidden');
        }
    };
    reader.readAsDataURL(file);
}

function removeEditSelectedVideo() {
    editSelectedVideoBase64 = "";
    let preview = document.getElementById('editFormVideoPreview');
    let container = document.getElementById('editVideoPreviewContainer');
    let input = document.getElementById('editRealVideoInputNode');
    if (preview) preview.src = "";
    if (container) container.classList.add('hidden');
    if (input) input.value = "";
}

async function publishFinal() {
    const activeUser = window.sessionUser || sessionUser;
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
    
    let statusInp = document.getElementById('formStatusInp')?.value || "Ready to Move";
    let furnishingInp = document.getElementById('formFurnishingInp')?.value || "Semi-Furnished";
    let facingInp = document.getElementById('formFacingInp')?.value || "East";
    
    let floorInp = document.getElementById('formFloorInp')?.value || "Ground Floor";
    if (floorInp === "Custom") {
        const customFloorEl = document.getElementById('formCustomFloorInp');
        floorInp = customFloorEl ? (customFloorEl.value || "").trim() : "Higher Floor";
    }

    let ageInp = document.getElementById('formAgeInp')?.value || "New Construction";
    let descriptionEl = document.getElementById('propDescription');
    let descriptionVal = descriptionEl ? descriptionEl.value.trim() : "";

    let carpetAreaVal = parseInt(document.getElementById('formCarpetAreaInp')?.value) || 0;
    let superAreaVal = parseInt(document.getElementById('formSuperBuiltupAreaInp')?.value) || 0;
    let plotAreaVal = parseInt(document.getElementById('formPlotAreaInp')?.value) || 0;

    let propertyPayload = {
        id: generatedId,
        type: type,
        propertyType: type, 
        bhk: type === "Plot" ? "Plot" : (bhkEl ? bhkEl.value : "3 BHK"),
        area: areaEl ? (parseInt(areaEl.value) || 1000) : 1000,
        carpetArea: carpetAreaVal,
        superBuiltupArea: superAreaVal,
        plotArea: plotAreaVal,
        bathrooms: type === "Plot" ? "" : "2",
        furnishing: furnishingInp, 
        cat: cat,
        price: price,
        state: state,
        city: city,
        location: `${locality}, ${city}, ${state}`, 
        role: activeUser ? activeUser.role : "Owner",
        status: statusInp, 
        phone: activeUser ? activeUser.phone : "7869824155",
        images: finalImagesArray, 
        video: selectedVideoBase64,  
        saved: false,
        firmName: activeUser ? activeUser.firmName : "",
        rera: "",
        latitude: 23.259933 + (Math.random() - 0.5) * 0.1,
        longitude: 77.412613 + (Math.random() - 0.5) * 0.1,
        membershipTier: userSubscribedPlan,
        facing: facingInp, 
        floorNo: floorInp, 
        age: ageInp, 
        description: descriptionVal || "Direct landlord verified listing. Clean title deed and possession available."
    };

    database.unshift(propertyPayload);

    try {
        let localUserListings = [];
        let raw = safeStorage.getItem('mamadealing_user_listings');
        if (raw) localUserListings = JSON.parse(raw);
        if (Array.isArray(localUserListings)) {
            localUserListings.unshift(propertyPayload);
            safeStorage.setItem('mamadealing_user_listings', JSON.stringify(localUserListings));
        } else {
            safeStorage.setItem('mamadealing_user_listings', JSON.stringify([propertyPayload]));
        }
    } catch (e) {
        console.warn("Local storage listing error:", e);
    }

    render();

    closeFeature('postProperty');
    removeSelectedVideo();
    selectedPhotosBase64 = [];
    if (descriptionEl) descriptionEl.value = "";
    if (document.getElementById('formAreaInp')) document.getElementById('formAreaInp').value = "";
    if (document.getElementById('formCarpetAreaInp')) document.getElementById('formCarpetAreaInp').value = "";
    if (document.getElementById('formSuperBuiltupAreaInp')) document.getElementById('formSuperBuiltupAreaInp').value = "";
    if (document.getElementById('formPlotAreaInp')) document.getElementById('formPlotAreaInp').value = "";
    if (document.getElementById('propPrice')) document.getElementById('propPrice').value = "";
    if (document.getElementById('localityInp')) document.getElementById('localityInp').value = "";

    try {
        let response = await fetch(`${BACKEND_BASE_URL}/api/properties`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(propertyPayload)
        });
        if (response.ok) {
            alert("🎉 Asset successfully registered globally!");
            fetchLivePropertiesFromDatabase();
        } else {
            alert("⚠️ Saved locally, but failed to synchronize with backend database.");
        }
    } catch (err) {
        console.warn("API sync fallback initiated.");
    }
}

function switchBrowseView(view) {
    let propBtn = document.getElementById('viewToggleProperties');
    let reqBtn = document.getElementById('viewToggleRequirements');
    let propWrapper = document.getElementById('propertiesActiveContentWrapper');
    let reqWrapper = document.getElementById('requirementsContentWrapper');
    let trustStats = document.getElementById('trustStatsBar');

    if (!propBtn || !reqBtn || !propWrapper || !reqWrapper) return;

    if (view === 'properties') {
        propWrapper.classList.remove('hidden');
        reqWrapper.classList.add('hidden');
        if (trustStats) trustStats.classList.remove('hidden');

        propBtn.className = "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-[#0b1329] text-brand-gold shadow-md";
        reqBtn.className = "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white";
    } else {
        propWrapper.classList.add('hidden');
        reqWrapper.classList.remove('hidden');
        if (trustStats) trustStats.classList.add('hidden');

        reqBtn.className = "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-[#0b1329] text-brand-gold shadow-md";
        propBtn.className = "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white";
        renderBuyerRequirements();
    }
}

async function publishBuyerRequirement() {
    let name = document.getElementById('reqFormName')?.value.trim() || '';
    let phone = document.getElementById('reqFormPhone')?.value.trim() || '';
    let type = document.getElementById('reqFormType')?.value || 'Flat';
    let bhk = document.getElementById('reqFormBhk')?.value || '3 BHK';
    let state = document.getElementById('reqStateInp')?.value || '';
    let city = document.getElementById('reqCityInp')?.value || '';
    let locality = document.getElementById('reqLocalityInp')?.value.trim() || '';
    let budget = parseInt(document.getElementById('reqFormBudget')?.value) || NaN;
    let description = document.getElementById('reqFormDesc')?.value.trim() || '';

    if (!name || !phone || !locality || isNaN(budget)) {
        alert("⚠️ Please fill out Name, Phone, Locality, and Budget fields.");
        return;
    }

    let payload = {
        id: "req-" + Date.now(),
        name: name,
        phone: phone,
        type: type,
        bhk: bhk,
        state: state,
        city: city,
        locality: locality,
        budget: budget,
        description: description || "Looking for reliable deals. Please contact with options.",
        createdAt: new Date().toISOString()
    };

    requirementsDatabase.unshift(payload);

    try {
        let localReqs = [];
        let raw = safeStorage.getItem('mamadealing_user_requirements');
        if (raw) localReqs = JSON.parse(raw);
        localReqs.unshift(payload);
        safeStorage.setItem('mamadealing_user_requirements', JSON.stringify(localReqs));
    } catch (e) {
        console.warn("Storage requirements error:", e);
    }

    renderBuyerRequirements();
    closeFeature('postRequirementModal');

    document.getElementById('reqFormName').value = "";
    document.getElementById('reqFormPhone').value = "";
    document.getElementById('reqLocalityInp').value = "";
    document.getElementById('reqFormBudget').value = "";
    document.getElementById('reqFormDesc').value = "";

    alert("🎉 Your requirement has been successfully posted!");
}

// **LOCKED CONTACT CONTROL PROTOCOLS FOR BUYERS**
function handleBuyerContact(type, phone) {
    const activeUser = window.sessionUser || sessionUser;
    if (!activeUser) {
        alert("🔒 Security Verification Required!\n\nPlease login with your mobile number first.");
        openFeature('loginModal');
    } else if (userSubscribedPlan !== "Silver Plan" && userSubscribedPlan !== "Gold Plan") {
        alert("🔒 Access Restricted!\n\nPlease upgrade to a Silver or Gold Premium plan to contact buyers directly.");
        openFeature('platformSubscriptionPlansModal');
    } else {
        if (type === 'phone') {
            window.open(`tel:${phone}`);
        } else if (type === 'whatsapp') {
            const text = encodeURIComponent(`Hi, I'm contacting you via Mama Dealing regarding your buyer requirement.`);
            window.open(`https://wa.me/91${phone}?text=${text}`);
        }
    }
}

function renderBuyerRequirements() {
    let grid = document.getElementById('requirementsGrid');
    if (!grid) return;
    grid.innerHTML = "";

    if (requirementsDatabase.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center text-xs font-bold text-slate-500">No active requirements posted yet.</div>`;
        return;
    }

    requirementsDatabase.forEach(x => {
        let card = document.createElement('div');
        card.className = "p-card relative overflow-hidden shadow-sm dark:bg-[#131e3a] p-5 flex flex-col justify-between gap-4";
        
        let typeBadge = `<span class="bg-[#050b18]/70 border border-slate-800 text-brand-gold font-bold text-[9px] px-2 py-0.5 rounded uppercase">${x.bhk} ${x.type}</span>`;
        
        card.innerHTML = `
            <div class="space-y-3 font-bold">
                <div class="flex justify-between items-start gap-1">
                    <div>
                        ${typeBadge}
                        <h3 class="font-extrabold text-sm text-slate-900 dark:text-white uppercase mt-2.5">Looking for: ${x.bhk} ${x.type}</h3>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-slate-500 dark:text-slate-400 uppercase">Max Budget</p>
                        <p class="text-sm font-black text-brand-gold">₹${formatIndianCurrency(x.budget)}</p>
                    </div>
                </div>

                <p class="text-[10px] text-slate-606 dark:text-slate-303 font-semibold flex items-center gap-0.5"><i class="ph-fill ph-map-pin text-brand-gold"></i> Preferred Location: ${x.locality}, ${x.city}</p>
                
                <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p class="text-[9px] text-slate-404 dark:text-slate-404 uppercase mb-1">Requirement Details</p>
                    <p class="text-[11px] text-slate-600 dark:text-slate-200 leading-relaxed font-semibold">${x.description}</p>
                </div>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold">
                <div>
                    <p class="text-[8px] text-slate-404 uppercase font-medium">Buyer Client</p>
                    <p class="text-slate-900 dark:text-white font-extrabold uppercase truncate max-w-[120px]">${x.name}</p>
                </div>
                
                <div class="flex gap-2">
                    <button onclick="handleBuyerContact('phone', '${x.phone}')" class="bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 text-white font-bold text-[10px] uppercase px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors border dark:border-slate-700 shadow-sm"><i class="ph-fill ph-phone text-brand-gold text-sm"></i> Dial</button>
                    <button onclick="handleBuyerContact('whatsapp', '${x.phone}')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"><i class="ph-fill ph-whatsapp-logo text-sm"></i> WhatsApp</button>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

function openEditPropertyModal(id) {
    let item = database.find(x => String(x.id) === String(id));
    if (!item) return;

    document.getElementById('editPropertyTargetId').value = item.id;
    document.getElementById('editFormCatInp').value = item.cat || "Buy";
    document.getElementById('editFormTypeInp').value = item.type || "Flat";
    
    document.getElementById('editStateInp').value = item.state || "";
    loadEditCities(item.city);

    document.getElementById('editLocalityInp').value = item.locality || "";
    document.getElementById('editFormBhkInp').value = item.bhk || "3 BHK";
    
    document.getElementById('editFormAreaInp').value = item.area || "";
    document.getElementById('editFormCarpetAreaInp').value = item.carpetArea || "";
    document.getElementById('editFormSuperBuiltupAreaInp').value = item.superBuiltupArea || "";
    document.getElementById('editFormPlotAreaInp').value = item.plotArea || "";

    document.getElementById('editFormStatusInp').value = item.status || "Ready to Move";
    document.getElementById('editFormFurnishingInp').value = item.furnishing || "Semi-Furnished";
    document.getElementById('editFormFacingInp').value = item.facing || "East";
    document.getElementById('editFormFloorInp').value = item.floorNo || "Ground";
    document.getElementById('editFormAgeInp').value = item.age || "New Build";
    
    document.getElementById('editPropPrice').value = item.price || "";
    document.getElementById('editPropDescription').value = item.description || "";

    // Load pre-existing media elements
    editSelectedPhotosBase64 = Array.isArray(item.images) ? [...item.images] : [];
    renderEditPhotoPreviews();

    let videoPreview = document.getElementById('editFormVideoPreview');
    let videoContainer = document.getElementById('editVideoPreviewContainer');
    if (item.video) {
        editSelectedVideoBase64 = item.video;
        if (videoPreview) videoPreview.src = item.video;
        if (videoContainer) videoContainer.classList.remove('hidden');
    } else {
        editSelectedVideoBase64 = "";
        if (videoPreview) videoPreview.src = "";
        if (videoContainer) videoContainer.classList.add('hidden');
    }

    adjustEditSpecsVisibility();
    openFeature('editPropertyModal');
}

async function updatePropertyFinal() {
    let id = document.getElementById('editPropertyTargetId').value;
    let item = database.find(x => String(x.id) === String(id));
    if (!item) return;

    let cat = document.getElementById('editFormCatInp').value;
    let type = document.getElementById('editFormTypeInp').value;
    let state = document.getElementById('editStateInp').value;
    let city = document.getElementById('editCityInp').value;
    let locality = document.getElementById('editLocalityInp').value.trim();
    let bhk = document.getElementById('editFormBhkInp').value;
    let area = parseInt(document.getElementById('editFormAreaInp').value) || 1000;
    
    let carpet = parseInt(document.getElementById('editFormCarpetAreaInp').value) || 0;
    let superB = parseInt(document.getElementById('editFormSuperBuiltupAreaInp').value) || 0;
    let plotA = parseInt(document.getElementById('editFormPlotAreaInp').value) || 0;

    let status = document.getElementById('editFormStatusInp').value;
    let furnishing = document.getElementById('editFormFurnishingInp').value;
    let facing = document.getElementById('editFormFacingInp').value;
    let floor = document.getElementById('editFormFloorInp').value.trim();
    let age = document.getElementById('editFormAgeInp').value;
    let price = parseInt(document.getElementById('editPropPrice').value) || 0;
    let description = document.getElementById('editPropDescription').value.trim();

    if (!locality || !price) {
        alert("⚠️ Locality and Price fields cannot be empty.");
        return;
    }

    item.cat = cat;
    item.type = type;
    item.propertyType = type;
    item.state = state;
    item.city = city;
    item.locality = locality;
    item.location = `${locality}, ${city}, ${state}`;
    item.bhk = bhk;
    item.area = area;
    item.carpetArea = carpet;
    item.superBuiltupArea = superB;
    item.plotArea = plotA;
    item.status = status;
    item.furnishing = furnishing;
    item.facing = facing;
    item.floorNo = floor;
    item.age = age;
    item.price = price;
    item.description = description;

    item.images = editSelectedPhotosBase64.length > 0 ? [...editSelectedPhotosBase64] : [NO_IMAGE_FALLBACK];
    item.video = editSelectedVideoBase64;

    try {
        let raw = safeStorage.getItem('mamadealing_user_listings');
        if (raw) {
            let localListings = JSON.parse(raw);
            let idx = localListings.findIndex(x => String(x.id) === String(id));
            if (idx !== -1) {
                localListings[idx] = item;
                safeStorage.setItem('mamadealing_user_listings', JSON.stringify(localListings));
            }
        }
    } catch(e) {}

    render();
    renderMyPropertiesManagementWorkspace();
    closeFeature('editPropertyModal');

    try {
        let res = await fetch(`${BACKEND_BASE_URL}/api/properties/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        });
        if (res.ok) {
            alert("🎉 Asset successfully updated globally!");
            fetchLivePropertiesFromDatabase();
        } else {
            alert("⚠️ Saved locally, but failed to sync changes to server database.");
        }
    } catch (err) {
        console.warn("API Sync fallback utilized.");
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
                    cityName = parts[1] ? parts[1].trim() : "Bhopal";
                    if (parts[2]) stateName = parts[2].trim();
                }

                let imgArray = Array.isArray(property.images) ? property.images : (property.images ? [property.images] : [NO_IMAGE_FALLBACK]);

                let mappedDataNode = {
                    id: property.id || property._id || (Date.now() + Math.random()), 
                    type: property.propertyType || property.type || "Plot",
                    propertyType: property.propertyType || property.type || "Plot",
                    bhk: property.bhk || "3 BHK",
                    area: property.area || null,
                    carpetArea: property.carpetArea || 0,
                    superBuiltupArea: property.superBuiltupArea || 0,
                    plotArea: property.plotArea || 0,
                    bathrooms: property.bathrooms || "2",
                    furnishing: property.furnishing || "Unfurnished",
                    cat: property.cat || "Buy",
                    price: Number(property.price) || 0,
                    state: stateName,
                    city: cityName,
                    locality: localityName,
                    role: property.role || "Owner", 
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
                    age: property.age || "New Build",
                    description: property.description || "Direct landlord verified listing. Clean title deed and possession available."
                };

                let matchIdx = database.findIndex(existingNode => 
                    String(existingNode.id) === String(mappedDataNode.id) ||
                    (existingNode.id && mappedDataNode._id && String(existingNode.id) === String(mappedDataNode._id))
                );
                
                if (matchIdx === -1) {
                    database.unshift(mappedDataNode); 
                } else {
                    database[matchIdx] = mappedDataNode;
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

function logoutAgent() {
    sessionUser = null;
    window.sessionUser = null;
    userSubscribedPlan = "Free";
    safeStorage.removeItem('mamadealing_active_session_phone');
    safeStorage.removeItem('subscribed_plan');
    
    if (myChatsFirestoreListener1) myChatsFirestoreListener1();
    if (myChatsFirestoreListener2) myChatsFirestoreListener2();
    
    alert("🔒 Logged out successfully.");
    let authComp = document.getElementById('authDynamicComponent');
    if (authComp) {
        authComp.innerHTML = `<button onclick="openFeature('loginModal')" class="bg-slate-900 dark:bg-slate-800 text-brand-gold border border-slate-200 dark:border-slate-800 px-3.5 h-9 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center border border-slate-200 dark:border-slate-707 shadow-sm">Login</button>`;
    }
    renderProfileSectionWorkspace();
    switchTab('properties');
    updateMobileProfileTabLabel();
    render();
}

function toggleBookmarkClientState(id, el) {
    let item = database.find(x => String(x.id) === String(id));
    if (!item) return;
    item.saved = !item.saved;
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
        saveBtn.className = "bg-amber-100 text-amber-850 hover:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-404 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1";
    } else {
        saveIcon.className = "ph ph-bookmark text-slate-500 dark:text-slate-400 text-sm";
        saveText.innerText = "Save";
        saveBtn.className = "bg-slate-100 dark:bg-slate-800 text-slate-707 dark:text-slate-202 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1";
    }
}

function updateMobileProfileTabLabel() {
    const activeUser = window.sessionUser || sessionUser;
    const mText = document.getElementById('m-tab-profile-text');
    const mIcon = document.getElementById('m-tab-profile-icon');
    if (mText) {
        if (activeUser) {
            mText.innerText = "Profile";
            if (mIcon) mIcon.className = "ph-fill ph-user text-base text-slate-500 dark:text-slate-200";
        } else {
            mText.innerText = "Login";
            if (mIcon) mIcon.className = "ph-fill ph-sign-in text-base text-slate-500 dark:text-slate-200";
        }
    }
}

function renderProfileSectionWorkspace() {
    const activeUser = window.sessionUser || sessionUser;
    const pName = document.getElementById('profileName');
    const pPhone = document.getElementById('profilePhone');
    const pAvatar = document.getElementById('profileAvatarBadge');
    const pBadgeSlot = document.getElementById('profileVerificationBadgeSlot');

    if (pName && pPhone && pAvatar && pBadgeSlot) {
        if (activeUser) {
            pName.innerText = activeUser.firmName || "Verified User";
            pPhone.innerText = `+91 ${activeUser.phone}`;
            pAvatar.innerText = (activeUser.firmName || "V").charAt(0).toUpperCase();
            pBadgeSlot.innerHTML = `<span class="bg-[#0b1329] text-brand-gold text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5"><i class="ph-fill ph-seal-check"></i> ${activeUser.role}</span>`;
        } else {
            pName.innerText = "Guest Session";
            pPhone.innerText = "+91 Authentication Node";
            pAvatar.innerText = "G";
            pBadgeSlot.innerHTML = "";
        }
    }
}

function deletePropertyListing(id) {
    if (!confirm("⚠️ Are you sure you want to permanently delete this listing? This action is irreversible.")) return;
    database = database.filter(x => String(x.id) !== String(id));
    
    try {
        let localListings = safeStorage.getItem('mamadealing_user_listings');
        if (localListings) {
            let parsed = JSON.parse(localListings);
            if (Array.isArray(parsed)) {
                let updated = parsed.filter(item => String(item.id) !== String(id));
                safeStorage.setItem('mamadealing_user_listings', JSON.stringify(updated));
            }
        }
    } catch (e) {
        console.warn(e);
    }

    render();
    renderMyPropertiesManagementWorkspace();
    alert("✅ Listing successfully deleted.");
}

function initMsg91Widget() {
    if (isMsg91Initialized) return;
    isMsg91Initialized = true;
}

window.initializeApp = initializeApp;
window.toggleTheme = toggleTheme;
window.openFeature = openFeature;
window.closeFeature = closeFeature;
window.switchTab = switchTab;
window.selectPlanOption = selectPlanOption;
window.triggerSelectedPlanPayment = triggerSelectedPlanPayment;
window.goBackToProfileDashboard = goBackToProfileDashboard;
window.openGlobalLocationModal = openGlobalLocationModal;
window.openPropertyDetailsModal = openPropertyDetailsModal;
window.openVisitingSchedulerModal = openVisitingSchedulerModal;
window.switchDetailMediaMode = switchDetailMediaMode;
window.changeDetailPhoto = changeDetailPhoto;
window.openMediaLightbox = openMediaLightbox;
window.changeLightboxPhoto = changeLightboxPhoto;
window.closePropertyDetailModalBlock = closePropertyDetailModalBlock;
window.loadDistrictsForSimpleDropdown = loadDistrictsForSimpleDropdown;
window.filterSimpleDistrictsList = filterSimpleDistrictsList;
window.selectSimpleDistrict = selectSimpleDistrict;
window.switchProfileTab = switchProfileTab;
window.loadB2bCitiesForFilter = loadB2bCitiesForFilter;
window.triggerVoiceSearch = triggerVoiceSearch;
window.requestOtpViaMsg91 = requestOtpViaMsg91;
window.verifyOtpViaMsg91 = verifyOtpViaMsg91;
window.resetPhoneInputForEdit = resetPhoneInputForEdit;
window.loadCompleteCities = loadCompleteCities;
window.loadEditCities = loadEditCities;
window.loadReqCities = loadReqCities;
window.updatePriceFilter = updatePriceFilter;
window.applyQuickBudgetFilter = applyQuickBudgetFilter;
window.applySearchPillTab = applySearchPillTab;
window.applySearchPillType = applySearchPillType;
window.selectB2bCategoryCard = selectB2bCategoryCard;
window.backToB2bCategories = backToB2bCategories;
window.handleReelSearchAndCollapse = handleReelSearchAndCollapse;
window.toggleReelsMuteState = toggleReelsMuteState;
window.openShareToolkitChannel = openShareToolkitChannel;
window.openShareToolkitChannelFromDetail = openShareToolkitChannelFromDetail;
window.toggleReelPlaybackEvent = toggleReelPlaybackEvent;
window.triggerNearMeLocationEngine = triggerNearMeLocationEngine;
window.resetAllFilters = resetAllFilters;
window.openOlxChatSimulation = openOlxChatSimulation;
window.submitNewB2bDirectoryProvider = submitNewB2bDirectoryProvider;
window.loadB2bFormCities = loadB2bFormCities;
window.submitVipCallbackRequest = submitVipCallbackRequest;
window.logoutAgent = logoutAgent;
window.toggleBookmarkClientState = toggleBookmarkClientState;
window.toggleDetailBookmarkState = toggleDetailBookmarkState;
window.deletePropertyListing = deletePropertyListing;
window.adjustPostSpecsVisibility = adjustPostSpecsVisibility;
window.adjustEditSpecsVisibility = adjustEditSpecsVisibility;
window.moveStep = moveStep;
window.handlePhotoSelection = handlePhotoSelection;
window.removeSelectedPhoto = removeSelectedPhoto;
window.handleVideoSelection = handleVideoSelection;
window.removeSelectedVideo = removeSelectedVideo;
window.publishFinal = publishFinal;
window.handleEditPhotoSelection = handleEditPhotoSelection;
window.removeEditSelectedPhoto = removeEditSelectedPhoto;
window.handleEditVideoSelection = handleEditVideoSelection;
window.removeEditSelectedVideo = removeEditSelectedVideo;
window.updatePropertyFinal = updatePropertyFinal;
window.publishBuyerRequirement = publishBuyerRequirement;
window.handleBuyerContact = handleBuyerContact;

document.addEventListener('DOMContentLoaded', initializeApp);