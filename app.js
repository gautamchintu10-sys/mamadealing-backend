const GEOGRAPHY_MATRIX = {
    "Andhra Pradesh": ["Ananakapalli", "Ananthapuramu", "Alluri Sitharama Raju", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Itanagar", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
    "Assam": ["Bajali", "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tamulpur", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh-Chirmiri-Bharatpur", "Mohla-Manpur-Ambagarh Chowki", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Sarangarh-Bilaigarh", "Sukma", "Surajpur", "Surguja"],
    "Goa": ["North Goa", "South Goa", "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Gold Verified Builder", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Vijayanagara", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Maihar", "Mandla", "Mandsaur", "Mauganj", "Morena", "Narmadapuram (Hoshangabad)", "Narsinghpur", "Neemuch", "Niwari", "Pandhurna", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Chhatrapati Sambhajinagar (Aurangabad)", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Dharashiv (Osmanabad)", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wordha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "Eastern West Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
    "Nagaland": ["Chümoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyü", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Karoput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Sri Muktsar Sahib", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar (Mohali)", "Sangrur", "Shahid Bhagat Singh Nagar", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Anupgarh", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Deeg", "Dholpur", "Didwana-Kuchaman", "Dudu", "Dungarpur", "Gangapur City", "Hanumangarh", "Jaipur", "Jaipur Rural", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Jodhpur Rural", "Karauli", "Kekri", "Khairthal-Tijara", "Kota", "Nagaur", "Neem Ka Thana", "Pali", "Phalodi", "Pratapgarh", "Rajsamand", "Salumbar", "Sanchore", "Sawai Madhopur", "Shahpura", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Sikkim": ["Gangtok", "Gyalshing", "Mangan", "Pakyong", "Soreng", "Namchi"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"],
    "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar (Noida)", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
    "Delhi NCR": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi", "Gurugram Zone", "Noida Extension", "Ghaziabad Hub", "Faridabad Edge"],
    "Andaman and Nicobar": ["Nicobar", "North and Middle Andaman", "South Andaman"],
    "Chandigarh": ["Chandigarh"],
    "Dadra & Nagar Haveli and Daman & Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
    "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
    "Ladakh": ["Leh", "Kargil"],
    "Lakshadweep": ["Kavaratti"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

let database = [];

let servicesDatabase = [
    { id: 1, category: "Legal", title: "Sharma & Associates Title Consultants", phone: "9827011223", specialty: "Registry, Title Clearance, RERA Expert", rating: 4.9, reviews: 24, verified: true, state: "Madhya Pradesh", city: "Bhopal" },
    { id: 2, category: "Interior", title: "The Decore & Spaces Design", phone: "9829023412", specialty: "Premium 3D Modular Kitchen & Wardrobe Experts", rating: 4.8, reviews: 31, verified: true, state: "Madhya Pradesh", city: "Bhopal" },
    { id: 3, category: "Construction", title: "Buildwell Infrastructure Developers", phone: "7000123456", specialty: "Turnkey Grey Structure & Building Contractor", rating: 4.7, reviews: 14, verified: true, state: "Madhya Pradesh", city: "Bhopal" }
];

let sessionUser = null;
let currentActiveTab = "properties";
let activeCategoryFilter = "All";
let activeB2bCategoryFilter = "All"; 
let targetDetailItemInstance = null;
let detailPhotoActiveIndex = 0;
let userB2bRegistrationCount = 0; 
let currentlyTargetedShareNodeData = null;
let selectedPhotosBase64 = []; 

// User's active package state
let userSubscribedPlan = "Free";

// Mute/Unmute state tracker for audio
let isReelsMuted = true;

const NO_IMAGE_FALLBACK = "https://placehold.co/600x400/f1f5f9/64748b?text=Photo+Pending";

let deviceCoordinates = null;
let scanRadiusActive = false;
let editingPropertyId = null;

const BACKEND_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://localhost:5000" 
    : "https://mamadealing-backend.onrender.com";

window.onload = function() {
    initGeographyMenus();
    initB2bGeographyMenus();
    render();
    renderB2bServicesHub();
    document.addEventListener('keydown', handleReelKeyboardNavigation);
    fetchLivePropertiesFromDatabase();
};

function initGeographyMenus() {
    let sMain = document.getElementById('filterStateMain');
    let sReel = document.getElementById('reelStateFilter');
    let sInp = document.getElementById('stateInp');
    
    if (sMain) sMain.innerHTML = '<option value="All">Select State</option>';
    if (sReel) sReel.innerHTML = '<option value="All">All States</option>';
    if (sInp) sInp.innerHTML = '<option value="">-- Choose State --</option>';

    Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
        if (sMain) sMain.innerHTML += `<option class="bg-slate-900 text-white" value="${st}">${st}</option>`;
        if (sReel) sReel.innerHTML += `<option value="${st}">${st}</option>`;
        if (sInp) sInp.innerHTML += `<option value="${st}">${st}</option>`;
    });
}

function initB2bGeographyMenus() {
    let sService = document.getElementById('filterServiceState');
    let sReg = document.getElementById('regB2bState');
    
    if (sService) sService.innerHTML = '<option value="All">Select State</option>';
    if (sReg) sReg.innerHTML = '<option value="">-- Choose State --</option>';

    Object.keys(GEOGRAPHY_MATRIX).sort().forEach(st => {
        if (sService) sService.innerHTML += `<option value="${st}">${st}</option>`;
        if (sReg) sReg.innerHTML += `<option value="${st}">${st}</option>`;
    });
}

function loadB2bServiceCitiesMenu() {
    let stateEl = document.getElementById('filterServiceState');
    if (!stateEl) return;
    let state = stateEl.value;
    let cService = document.getElementById('filterServiceCity');
    if (!cService) return;
    cService.innerHTML = '<option value="All">Select District</option>';
    if(state !== "All" && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cService.innerHTML += `<option value="${ci}">${ci}</option>`;
        });
    }
    renderB2bServicesHub();
}

function loadB2bRegCitiesMenu() {
    let stateEl = document.getElementById('regB2bState');
    if (!stateEl) return;
    let state = stateEl.value;
    let cReg = document.getElementById('regB2bCity');
    if (!cReg) return;
    cReg.innerHTML = '<option value="">-- Choose District --</option>';
    if(state && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cReg.innerHTML += `<option value="${ci}">${ci}</option>`;
        });
    }
}

function loadMainCitiesMenu() {
    let stateEl = document.getElementById('filterStateMain');
    if (!stateEl) return;
    let state = stateEl.value;
    let cMain = document.getElementById('filterCityMain');
    if (!cMain) return;
    cMain.innerHTML = '<option value="All">Select District</option>';
    if(state !== "All" && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cMain.innerHTML += `<option class="bg-slate-900 text-white" value="${ci}">${ci}</option>`;
        });
    }
}

function loadReelCitiesMenu() {
    let stateEl = document.getElementById('reelStateFilter');
    if (!stateEl) return;
    let state = stateEl.value;
    let cReel = document.getElementById('reelLocationFilter');
    if (!cReel) return;
    cReel.innerHTML = '<option value="All">All Districts</option>';
    if(state !== "All" && GEOGRAPHY_MATRIX[state]) {
        GEOGRAPHY_MATRIX[state].sort().forEach(ci => {
            cReel.innerHTML += `<option value="${ci}">${ci}</option>`;
        });
    }
}

function loadCompleteCities() {
    let stateEl = document.getElementById('stateInp');
    if (!stateEl) return;
    let state = stateEl.value;
    let cInp = document.getElementById('cityInp');
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
    if (pDisplay) pDisplay.innerText = val == 20000000 ? "Any Price" : "₹" + parseInt(val).toLocaleString('en-IN');
    render();
}

function applyQuickBudgetFilter(min, max, btnElement) {
    const pFilter = document.getElementById('priceFilter');
    const bBtns = document.querySelectorAll('.quick-b-btn');
    
    bBtns.forEach(b => b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600'));
    
    if (pFilter) {
        pFilter.value = max;
        updatePriceFilter(max);
    }
    
    if (btnElement) {
        btnElement.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
    }
}

function applySearchPillTab(cat, btn) {
    activeCategoryFilter = cat;
    document.querySelectorAll('.custom-search-tab').forEach(b => {
        b.classList.remove('active', 'border-blue-500', 'text-white');
        b.classList.add('border-transparent', 'text-slate-400');
    });
    if (btn) {
        btn.classList.add('active', 'border-blue-500', 'text-white');
        btn.classList.remove('border-transparent', 'text-slate-400');
    }
    let typeEl = document.getElementById('filterType');
    if (typeEl) typeEl.value = "All";
    render();
}

function applySearchPillType(type, btn) {
    document.querySelectorAll('.custom-search-tab').forEach(b => {
        b.classList.remove('active', 'border-blue-500', 'text-white');
        b.classList.add('border-transparent', 'text-slate-400');
    });
    if (btn) {
        btn.classList.add('active', 'border-blue-500', 'text-white');
        btn.classList.remove('border-transparent', 'text-slate-400');
    }
    let typeEl = document.getElementById('filterType');
    if (typeEl) typeEl.value = type;
    render();
}

function filterCat(cat, btn) {
    activeCategoryFilter = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    render();
}

function selectB2bCategoryCard(category) {
    activeB2bCategoryFilter = category;
    
    let catSelView = document.getElementById('b2bCategorySelectionView');
    let resListView = document.getElementById('b2bResultsListView');
    if (catSelView) catSelView.classList.add('hidden');
    if (resListView) resListView.classList.remove('hidden');

    document.querySelectorAll('.b2b-cat-btn').forEach(b => {
        b.classList.remove('active');
        if(b.getAttribute('data-category') === category) b.classList.add('active');
    });

    renderB2bServicesHub();
}

function backToB2bCategories() {
    let resListView = document.getElementById('b2bResultsListView');
    let catSelView = document.getElementById('b2bCategorySelectionView');
    if (resListView) resListView.classList.add('hidden');
    if (catSelView) catSelView.classList.remove('hidden');
}

function filterB2bCat(cat, btn) {
    activeB2bCategoryFilter = cat;
    document.querySelectorAll('.b2b-cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderB2bServicesHub();
}

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
}

function triggerNearMeLocationEngine() {
    const nearMeBtn = document.getElementById('nearMeTriggerBtn');
    if (!navigator.geolocation) {
        alert("⚠️ Geolocation feature is not supported by your browser framework.");
        return;
    }

    if (scanRadiusActive) {
        scanRadiusActive = false;
        deviceCoordinates = null;
        if (nearMeBtn) {
            nearMeBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
            nearMeBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            nearMeBtn.innerHTML = `<i class="ph-bold ph-crosshair text-xs animate-pulse"></i> Near Me`;
        }
        alert("📍 Nearby distance filters removed.");
        render();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            deviceCoordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            scanRadiusActive = true;
            if (nearMeBtn) {
                nearMeBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                nearMeBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
                nearMeBtn.innerHTML = `<i class="ph-bold ph-check text-xs"></i> Near Active`;
            }
            alert("📍 Location verification complete. Filtering closest matches dynamically.");
            render();
        },
        (error) => {
            console.error("Geolocation Error Code:", error.code);
            alert("⚠️ Location access denied. Please enable location permissions in browser preferences.");
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
}

function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("⚠️ Speech recognition is not supported in this browser environment. Try using Chrome.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const micBtn = document.querySelector('.ph-microphone');
    if (micBtn) {
        micBtn.classList.remove('ph-fill');
        micBtn.classList.add('ph-bold', 'animate-pulse', 'text-red-500');
    }

    recognition.start();

    recognition.onresult = (event) => {
        const speechOutput = event.results[0][0].transcript;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = speechOutput;
            render();
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Exception Error:", event.error);
    };

    recognition.onend = () => {
        if (micBtn) {
            micBtn.classList.remove('ph-bold', 'animate-pulse', 'text-red-500');
            micBtn.classList.add('ph-fill');
        }
    };
}

function render() {
    let grid = document.getElementById('propertyGrid');
    if (!grid) return;
    
    let searchInp = document.getElementById('searchInput');
    let q = searchInp ? searchInp.value.toLowerCase() : '';
    
    let typeEl = document.getElementById('filterType');
    let type = typeEl ? typeEl.value : 'All';
    
    // Fallback if filterBhk elements do not exist
    let bhkEl = document.getElementById('filterBhk');
    let bhk = bhkEl ? bhkEl.value : 'All';
    
    let stateEl = document.getElementById('filterStateMain');
    let state = stateEl ? stateEl.value : 'All';
    
    let cityEl = document.getElementById('filterCityMain');
    let city = cityEl ? cityEl.value : 'All';
    
    let priceEl = document.getElementById('priceFilter');
    let maxPrice = priceEl ? parseInt(priceEl.value) : 20000000;

    let filtered = database.filter(x => {
        if(activeCategoryFilter !== "All" && x.cat !== activeCategoryFilter) return false;
        if(type !== "All" && x.type !== type) return false;
        if(bhk !== "All" && x.bhk !== bhk) return false;
        if(state !== "All" && x.state !== state) return false;
        if(city !== "All" && x.city !== city) return false;
        if(x.price > maxPrice) return false;

        if (scanRadiusActive && deviceCoordinates) {
            let radEl = document.getElementById('nearMeRadius');
            let selectedRadiusLimit = radEl ? parseFloat(radEl.value) : 10;
            let distanceInKm = calculateHaversineDistance(
                deviceCoordinates.latitude, 
                deviceCoordinates.longitude, 
                x.latitude || 23.259933, 
                x.longitude || 77.412613
            );
            if (distanceInKm > selectedRadiusLimit) return false;
        }

        if(q) {
            let match = x.locality.toLowerCase().includes(q) || x.city.toLowerCase().includes(q);
            if(!match) return false;
        }
        return true;
    });

    let counterEl = document.getElementById('inventoryCounter');
    if (counterEl) counterEl.innerText = `${filtered.length} Active Nodes Checked`;
    grid.innerHTML = "";

    if(filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-16 text-center space-y-2">
            <i class="ph ph-database text-4xl text-slate-300"></i>
            <p class="text-sm font-bold text-slate-400">Zero asset match strings discovered in active matrix array.</p>
        </div>`;
        return;
    }

    filtered.forEach(x => {
        let div = document.createElement('div');
        div.className = "p-card animate-slide-up relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200";
        let badgeColor = x.role === "Owner" ? "from-blue-600 to-sky-500" : x.role === "Builder" ? "from-emerald-600 to-teal-500" : "from-purple-600 to-indigo-500";
        let dynamicFirmLabelStr = x.firmName ? `<p class="text-[10px] text-slate-400 font-extrabold truncate mt-0.5"><i class="ph-fill ph-buildings inline"></i> ${x.firmName}</p>` : `<p class="text-[10px] text-blue-500 font-extrabold mt-0.5">🔒 Verified Direct Landlord</p>`;

        let soldOutOverlayHTML = x.isSoldOut ? `
            <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none">
                <span class="bg-red-600 text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg border-2 border-white/40 transform -rotate-12 animate-pulse">SOLD OUT</span>
            </div>
        ` : '';

        let displayTypeTitle = (x.bhk && x.bhk !== "Any BHK Configuration") ? `${x.bhk} ${x.type}` : x.type;

        div.innerHTML = `
            ${soldOutOverlayHTML}
            <div class="relative h-52 bg-slate-900 overflow-hidden cursor-pointer" onclick="openPropertyDetailsModal('${x.id}')">
                <img src="${x.images && x.images.length > 0 ? x.images[0] : NO_IMAGE_FALLBACK}" alt="Asset Preview" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500">
                <span class="absolute top-3 left-3 bg-gradient-to-tr ${badgeColor} text-white font-black Cet text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md z-10">${x.role} Node</span>
                ${(x.video && x.video !== "") ? `<span class="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white w-7 h-7 rounded-full flex items-center justify-center text-xs z-10"><i class="ph-fill ph-play text-amber-400"></i></span>` : ''}
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4 pt-12">
                    <span class="bg-blue-600/90 text-white font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">${x.cat}</span>
                    <p class="text-white text-base font-black tracking-tight mt-1.5">₹${x.price.toLocaleString('en-IN')}</p>
                </div>
            </div>
            <div class="p-4 space-y-2">
                <div class="flex justify-between items-start gap-1">
                    <h3 class="font-extrabold text-sm text-slate-800 uppercase tracking-tight truncate cursor-pointer" onclick="openPropertyDetailsModal('${x.id}')">${displayTypeTitle}</h3>
                    <button onclick="toggleBookmarkClientState('${x.id}', this)" class="text-xl ${x.saved ? 'text-amber-500 ph-fill' : 'text-slate-400 ph'} ph-bookmark"></button>
                </div>
                <p class="text-[10px] text-amber-600 font-extrabold bg-amber-50 inline-block px-1.5 py-0.5 rounded">${x.status || 'Ready to Move'}</p>
                <p class="text-xs text-slate-500 font-bold flex items-center gap-0.5 truncate mt-1"><i class="ph-fill ph-map-pin text-slate-400"></i> ${x.locality}, ${x.city}</p>
                <div class="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <div>${dynamicFirmLabelStr}</div>
                    <span class="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">RERA: ${x.rera ? 'YES' : 'N/A'}</span>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
}

function switchTab(tabId) {
    currentActiveTab = tabId;
    
    const viewIds = ['main-properties-view', 'main-reels-view', 'main-services-view', 'main-profile-view'];
    viewIds.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    let navBar = document.getElementById('top-navbar-node');

    const desktopTabs = ['d-tab-props', 'd-tab-reels', 'd-tab-services', 'd-tab-profile'];
    desktopTabs.forEach(id => {
        let el = document.getElementById(id);
        if (el) {
            el.classList.remove('text-white');
            el.classList.add('text-slate-400');
        }
    });

    const mobileTabs = ['m-tab-props', 'm-tab-reels', 'm-tab-services', 'm-tab-profile'];
    mobileTabs.forEach(id => {
        let el = document.getElementById(id);
        if (el) {
            el.classList.remove('text-blue-600');
            el.classList.add('text-slate-400');
        }
    });

    let targetSuffix = tabId === 'properties' ? 'props' : tabId;
    let dTab = document.getElementById(`d-tab-${targetSuffix}`);
    let mTab = document.getElementById(`m-tab-${targetSuffix}`);

    if (dTab) {
        dTab.classList.remove('text-slate-400');
        dTab.classList.add('text-white');
    }
    if (mTab) {
        mTab.classList.remove('text-slate-400');
        mTab.classList.add('text-blue-600');
    }

    if(tabId === "properties") {
        if (navBar) navBar.classList.remove('hidden');
        let el = document.getElementById('main-properties-view');
        if (el) el.classList.remove('hidden');
        render();
    } else if(tabId === "reels") {
        if (navBar) navBar.classList.add('hidden');
        let el = document.getElementById('main-reels-view');
        if (el) el.classList.remove('hidden');
        renderReelsList();
    } else if(tabId === "services") {
        if (navBar) navBar.classList.remove('hidden');
        let el = document.getElementById('main-services-view');
        if (el) el.classList.remove('hidden');
        backToB2bCategories(); 
    } else if(tabId === "profile") {
        if (navBar) navBar.classList.remove('hidden');
        let el = document.getElementById('main-profile-view');
        if (el) el.classList.remove('hidden');
        renderProfileSectionWorkspace();
    }
}

function toggleReelsMuteState(buttonElement) {
    isReelsMuted = !isReelsMuted;
    
    const videos = document.querySelectorAll('#reelScrollContainer video');
    videos.forEach(vid => {
        vid.muted = isReelsMuted;
    });

    const muteIcons = document.querySelectorAll('.reels-mute-icon');
    muteIcons.forEach(icon => {
        if (isReelsMuted) {
            icon.className = "ph-bold ph-speaker-slash text-xl text-red-400 reels-mute-icon";
        } else {
            icon.className = "ph-bold ph-speaker-high text-xl text-emerald-400 reels-mute-icon";
        }
    });
}

function renderReelsList() {
    let container = document.getElementById('reelScrollContainer');
    if (!container) return;
    let stateEl = document.getElementById('reelStateFilter');
    let state = stateEl ? stateEl.value : 'All';
    let cityEl = document.getElementById('reelLocationFilter');
    let city = cityEl ? cityEl.value : 'All';
    let qEl = document.getElementById('reelAreaSearchInput');
    let q = qEl ? qEl.value.toLowerCase() : '';

    let reelsData = database.filter(x => x.video && x.video !== "" && !x.isPhotoReel);

    if(state !== "All") reelsData = reelsData.filter(x => x.state === state);
    if(city !== "All") reelsData = reelsData.filter(x => x.city === city);
    if(q) reelsData = reelsData.filter(x => x.locality.toLowerCase().includes(q) || x.city.toLowerCase().includes(q));

    container.innerHTML = "";

    if(reelsData.length === 0) {
        container.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
            <i class="ph ph-video-camera-slash text-4xl text-slate-500"></i>
            <p class="text-xs font-bold text-slate-400">No matching property short reels found in this region.</p>
        </div>`;
        return;
    }

    reelsData.forEach((x, index) => {
        let div = document.createElement('div');
        div.className = "single-reel-block";
        div.setAttribute('data-index', index);
        
        let musicTagHtml = x.musicTrack ? `<p class="text-[10px] text-pink-400 font-extrabold flex items-center gap-1 mt-1 drop-shadow"><i class="ph-fill ph-music-notes animate-bounce"></i> Audio: Original BGM Track Loaded</p>` : '';

        let soundIconClass = isReelsMuted ? "ph-bold ph-speaker-slash text-xl text-red-400" : "ph-bold ph-speaker-high text-xl text-emerald-400";

        div.innerHTML = `
            <video src="${x.video}" loop ${isReelsMuted ? 'muted' : ''} playsinline preload="auto" onclick="toggleReelPlaybackEvent(this)"></video>
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40 pointer-events-none"></div>
            
            <div class="absolute bottom-6 left-4 right-20 text-white space-y-1.5 pointer-events-none z-30">
                <div class="flex items-center gap-2">
                    <span class="bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded shadow">${x.role}</span>
                    <h4 class="font-black text-sm uppercase truncate tracking-tight drop-shadow-md">${x.bhk} ${x.type}</h4>
                </div>
                <p class="text-xs font-bold text-slate-200 truncate drop-shadow-md"><i class="ph-fill ph-map-pin text-sm text-red-500 inline mr-0.5"></i>${x.locality}, ${x.city}</p>
                <p class="text-base font-black text-amber-400 tracking-tight drop-shadow-lg">₹${x.price.toLocaleString('en-IN')}</p>
                ${musicTagHtml}
            </div>

            <div class="absolute bottom-10 right-4 flex flex-col items-center gap-4 z-40">
                <button onclick="toggleReelsMuteState(this); event.stopPropagation();" class="w-12 h-12 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex flex-col items-center justify-center text-white active:scale-95 transition-all shadow-xl" title="Mute / Unmute">
                    <i class="${soundIconClass} reels-mute-icon"></i>
                </button>

                <button onclick="toggleBookmarkClientState('${x.id}', this); event.stopPropagation();" class="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full border border-white/20 flex flex-col items-center justify-center text-white active:scale-95 transition-all shadow-xl">
                    <i class="${x.saved ? 'ph-fill ph-bookmark text-amber-400 text-xl' : 'ph ph-bookmark text-xl'}"></i>
                </button>
                
                <button onclick="window.open('tel:${x.phone}'); event.stopPropagation();" class="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-xl shadow-xl active:scale-95 transition-all border border-blue-400">
                    <i class="ph-fill ph-phone"></i>
                </button>

                <button onclick="openShareToolkitChannel('${x.id}'); event.stopPropagation();" class="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-xl shadow-xl active:scale-95 transition-all border border-purple-400" title="Share Property Layout">
                    <i class="ph-bold ph-share-network"></i>
                </button>

                <button onclick="openPropertyDetailsModal('${x.id}'); event.stopPropagation();" class="w-12 h-12 bg-slate-900/80 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center text-xl shadow-xl active:scale-95 transition-all">
                    <i class="ph ph-info"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });

    setTimeout(() => {
        manageReelsIntersectionEngine();
    }, 200);
}

function openShareToolkitChannel(id) {
    let item = database.find(x => x.id === id);
    if (!item) return;
    currentlyTargetedShareNodeData = item;

    let textMessage = `*MamaDealing Premium Asset Hub*\n\n🔥 *${item.bhk} ${item.type}* matching your choice is available!\n📍 *Location:* ${item.locality}, ${item.city}\n💰 *Target Valuation:* ₹${item.price.toLocaleString('en-IN')}\n\nCheck details directly on MamaDealing platform ecosystem.`;
    let encodedText = encodeURIComponent(textMessage);

    let sw = document.getElementById('shareWAActionChannelNode');
    if (sw) {
        sw.onclick = () => {
            window.open(`https://wa.me/?text=${encodedText}`);
        };
    }
    let sf = document.getElementById('shareFBActionChannelNode');
    if (sf) {
        sf.onclick = () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://mamadealing.com/property/' + item.id)}`);
        };
    }
    let sc = document.getElementById('shareCopyLinkActionChannelNode');
    if (sc) {
        sc.onclick = () => {
            navigator.clipboard.writeText(`https://mamadealing.com/property/${item.id}`).then(() => {
                alert("📋 Link cloned to clipboard array sequence node successfully!");
                closeFeature('shareToolkitModal');
            });
        };
    }

    openFeature('shareToolkitModal');
}

function toggleReelPlaybackEvent(vid) {
    if(vid.paused) {
        vid.play().catch(e => {});
    } else {
        vid.pause();
    }
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
    }, {
        root: container,
        threshold: 0.6
    });

    container.querySelectorAll('.single-reel-block').forEach(block => {
        observer.observe(block);
    });
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

function renderB2bServicesHub() {
    let grid = document.getElementById('b2bServicesGrid');
    if(!grid) return;
    grid.innerHTML = "";

    let stEl = document.getElementById('filterServiceState');
    let ciEl = document.getElementById('filterServiceCity');
    
    let selectedState = stEl ? stEl.value : 'All';
    let selectedCity = ciEl ? ciEl.value : 'All';

    let filteredServices = servicesDatabase;
    if(activeB2bCategoryFilter !== "All") {
        filteredServices = servicesDatabase.filter(x => x.category === activeB2bCategoryFilter);
    }

    if(selectedState !== "All") {
        filteredServices = filteredServices.filter(x => x.state === selectedState);
    }
    if(selectedCity !== "All") {
        filteredServices = filteredServices.filter(x => x.city === selectedCity);
    }

    if(filteredServices.length === 0) {
        grid.innerHTML = `<div class="p-6 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 col-span-full">
            <i class="ph ph-user-focus text-3xl mb-1 block"></i>
            No active professionals registered in this district yet.
        </div>`;
        return;
    }

    filteredServices.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-slide-up shadow-sm";
        
        let categoryColorBadge = x.category === "Legal" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : x.category === "Interior" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-purple-50 text-purple-700 border-purple-200";

        div.innerHTML = `
            <div class="space-y-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <h3 class="font-black text-xs text-slate-800 uppercase tracking-tight">${x.title}</h3>
                    <span class="${categoryColorBadge} border text-[8px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-0.5"><i class="ph-fill ph-seal-check"></i> ${x.category} Expert</span>
                </div>
                <p class="text-[11px] text-slate-500 font-bold"><span class="text-blue-600">Speciality:</span> ${x.specialty}</p>
                <div class="flex items-center gap-2 pt-0.5 text-[10px]">
                    <span class="text-amber-500 font-black"><i class="ph-fill ph-star"></i> ${x.rating} (${x.reviews})</span>
                    <span class="text-slate-400 font-semibold"><i class="ph-fill ph-map-pin"></i> ${x.city || 'Bhopal'}, ${x.state || 'Madhya Pradesh'}</span>
                </div>
            </div>
            <a href="tel:${x.phone}" class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-center font-black text-[10px] uppercase px-4 py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all"><i class="ph-fill ph-phone"></i> Dial Connect</a>
        `;
        grid.appendChild(div);
    });
}

function renderProfileSectionWorkspace() {
    let pName = document.getElementById('profileName');
    let pPhone = document.getElementById('profilePhone');
    let pAvatar = document.getElementById('profileAvatarBadge');
    let pVerify = document.getElementById('profileVerificationBadgeSlot');
    let pCounter = document.getElementById('profileUserPostCounterBadge');

    if(!sessionUser) {
        if (pName) pName.innerText = "Guest Session Terminal";
        if (pPhone) pPhone.innerText = "+91 Authentication Lock Screen Node";
        if (pAvatar) pAvatar.innerText = "G";
        if (pVerify) pVerify.innerHTML = "";
        if (pCounter) pCounter.innerText = "Total Free Post Used: 0 / 1";
    } else {
        let initial = sessionUser.firmName ? sessionUser.firmName.charAt(0).toUpperCase() : "U";
        if (pName) pName.innerText = sessionUser.firmName ? sessionUser.firmName : "Verified User Instance";
        if (pPhone) pPhone.innerText = "+91 " + sessionUser.phone;
        if (pAvatar) pAvatar.innerText = initial;
        if (pVerify) pVerify.innerHTML = `<span class="bg-blue-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded tracking-widest"><i class="ph-fill ph-shield-check inline"></i> SECURE APEX</span>`;
        
        let userPostsCount = database.filter(x => x.phone === sessionUser.phone).length;
        let limit = sessionUser.role === "Owner" ? 1 : 3;
        
        if (userSubscribedPlan !== "Free") {
            if (pCounter) pCounter.innerText = `Premium Active Plan: ${userSubscribedPlan} (Unlimited Posts)`;
        } else {
            if (pCounter) pCounter.innerText = `Total Free Post Used: ${userPostsCount} / ${limit}`;
        }
    }
    renderSavedBookmarksDashboard();
    renderMyPropertiesManagementWorkspace();
}

function renderSavedBookmarksDashboard() {
    let grid = document.getElementById('savedPropertiesDashboardGrid');
    if (!grid) return;
    let saved = database.filter(x => x.saved);
    let countBadge = document.getElementById('savedCountBadge');
    if (countBadge) countBadge.innerText = saved.length;
    grid.innerHTML = "";
    if(saved.length === 0) {
        grid.innerHTML = `<p class="text-xs font-bold text-slate-400 col-span-full py-4 text-center">No properties saved yet.</p>`;
        return;
    }
    saved.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-slate-50 border p-4 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-slate-100/70 transition-all";
        div.onclick = () => openPropertyDetailsModal(x.id);
        div.innerHTML = `<div><h4 class="font-black text-xs text-slate-800 uppercase">${x.type}</h4><span class="text-blue-600 font-black text-xs block mt-1">₹${x.price.toLocaleString('en-IN')}</span></div><i class="ph-fill ph-caret-right text-slate-400"></i>`;
        grid.appendChild(div);
    });
}

function renderMyPropertiesManagementWorkspace() {
    let container = document.getElementById('myPropertiesManagementContainer');
    if(!container) return;
    container.innerHTML = "";

    if (!sessionUser) {
        container.innerHTML = `<p class="text-xs font-bold text-slate-400 py-2 text-center">Please log in to manage your listed assets.</p>`;
        return;
    }

    let myProperties = database.filter(x => x.phone === sessionUser.phone);

    if (myProperties.length === 0) {
        container.innerHTML = `<p class="text-xs font-bold text-slate-400 py-2 text-center">You have not posted any properties yet.</p>`;
        return;
    }

    myProperties.forEach(x => {
        let div = document.createElement('div');
        div.className = "bg-white border rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up shadow-sm";
        
        let soldStatusLabel = x.isSoldOut ? `<span class="bg-red-100 text-red-600 font-black text-[9px] uppercase px-2 py-0.5 rounded">SOLD OUT</span>` : `<span class="bg-emerald-100 text-emerald-600 font-black text-[9px] uppercase px-2 py-0.5 rounded">Active Live</span>`;

        div.innerHTML = `
            <div class="space-y-1 w-full md:w-auto">
                <div class="flex items-center gap-2">
                    <h4 class="font-black text-xs text-slate-800 uppercase">${x.bhk} ${x.type}</h4>
                    ${soldStatusLabel}
                </div>
                <p class="text-[11px] text-slate-400 font-semibold"><i class="ph-fill ph-map-pin"></i> ${x.locality}, ${x.city}</p>
                <p class="text-xs font-black text-blue-600">₹${x.price.toLocaleString('en-IN')}</p>
            </div>
            <div class="flex flex-wrap gap-2 w-full md:w-auto">
                <button onclick="toggleSoldOutStatus('${x.id}')" class="flex-1 md:flex-none text-[10px] font-black uppercase px-4 py-2 border rounded-xl hover:bg-slate-50 transition-colors ${x.isSoldOut ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-700'}">
                    <i class="ph ph-hand-palm"></i> ${x.isSoldOut ? 'Mark Active' : 'Mark Sold'}
                </button>
                <button onclick="editPropertyListing('${x.id}')" class="flex-1 md:flex-none bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-blue-200">
                    <i class="ph ph-note-pencil"></i> Edit
                </button>
                <button onclick="deletePropertyListing('${x.id}')" class="flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-red-200">
                    <i class="ph ph-trash"></i> Delete
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

async function toggleSoldOutStatus(id) {
    let item = database.find(x => x.id === id);
    if (!item) return;

    let targetStatus = !item.isSoldOut;

    try {
        let response = await fetch(`${BACKEND_BASE_URL}/api/properties/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isSoldOut: targetStatus })
        });

        if (response.ok) {
            item.isSoldOut = targetStatus;
            alert(`🎉 Property marked successfully as ${targetStatus ? 'Sold Out' : 'Active'}!`);
            render();
            renderProfileSectionWorkspace();
        } else {
            alert("⚠️ Status change could not be processed.");
        }
    } catch (err) {
        console.error("Sold Out Update error:", err);
    }
}

function editPropertyListing(id) {
    let item = database.find(x => x.id === id);
    if(!item) return;

    editingPropertyId = id; 

    document.getElementById('localityInp').value = item.locality;
    document.getElementById('propPrice').value = item.price;
    document.getElementById('stateInp').value = item.state;
    loadCompleteCities();
    setTimeout(() => {
        document.getElementById('cityInp').value = item.city;
    }, 150);

    let radioType = document.querySelector(`input[name="form_type"][value="${item.type}"]`);
    if(radioType) radioType.checked = true;

    let radioCat = document.querySelector(`input[name="form_cat"][value="${item.cat}"]`);
    if(radioCat) radioCat.checked = true;

    if (document.getElementById('formBhkInp')) document.getElementById('formBhkInp').value = item.bhk || "3 BHK";
    if (document.getElementById('formAreaInp')) document.getElementById('formAreaInp').value = item.area || "";
    if (document.getElementById('formBathroomsInp')) document.getElementById('formBathroomsInp').value = item.bathrooms || "2";
    if (document.getElementById('formFurnishingInp')) document.getElementById('formFurnishingInp').value = item.furnishing || "Unfurnished";

    selectedPhotosBase64 = [...item.images];
    renderPhotoPreviews();

    moveStep(1);
    openFeature('postProperty');
}

async function deletePropertyListing(id) {
    if(!confirm("⚠️ Kya aap sach mein is listing ko delete karna chahte hain?")) return;

    try {
        let response = await fetch(`${BACKEND_BASE_URL}/api/properties/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("✅ Property successfully deleted!");
            database = database.filter(x => x.id !== id);
            render();
            renderProfileSectionWorkspace();
        } else {
            alert("⚠️ Deletion request failed on MongoDB core center.");
        }
    } catch (err) {
        console.error("Delete call exception error:", err);
    }
}

function toggleBookmarkClientState(id, elem) {
    let item = database.find(x => x.id === id);
    if(item) {
        item.saved = !item.saved;
        if(elem) {
            let targetIcon = elem.querySelector('i') || elem;
            if(item.saved) {
                targetIcon.className = "ph-fill ph-bookmark text-amber-400 text-xl";
            } else {
                targetIcon.className = "ph ph-bookmark text-xl";
            }
        }
        renderSavedBookmarksDashboard();
    }
}

function updateEmiCalculations(propertyPrice) {
    const loanRatio = 0.8; 
    const annualRate = 0.085; 
    const tenureMonths = 240; 

    const loanAmount = propertyPrice * loanRatio;
    const downpayment = propertyPrice - loanAmount;
    
    const monthlyRate = annualRate / 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    let emiEl = document.getElementById('calcEmiDisplay');
    let downEl = document.getElementById('calcDownpaymentDisplay');
    let loanEl = document.getElementById('calcLoanDisplay');

    if (emiEl) emiEl.innerText = `₹${Math.round(emi).toLocaleString('en-IN')} / mo`;
    if (downEl) downEl.innerText = `₹${Math.round(downpayment).toLocaleString('en-IN')}`;
    if (loanEl) loanEl.innerText = `₹${Math.round(loanAmount).toLocaleString('en-IN')}`;
}

function openSiteVisitScheduler() {
    if (!targetDetailItemInstance) return;
    let titleEl = document.getElementById('visitPropertyTitle');
    let locEl = document.getElementById('visitPropertyLocation');
    if (titleEl) titleEl.innerText = `${targetDetailItemInstance.bhk} ${targetDetailItemInstance.type}`;
    if (locEl) locEl.innerText = `${targetDetailItemInstance.locality}, ${targetDetailItemInstance.city}`;
    openFeature('siteVisitBookingModal');
}

function submitSiteVisitBooking() {
    let date = document.getElementById('visitDate').value;
    let time = document.getElementById('visitTime').value;
    let assist = document.getElementById('visitTransport').value;

    if(!date || !time) {
        alert("⚠️ Please select scheduling date and preferred time slot details.");
        return;
    }

    alert(`🎉 Site Visit Scheduled Successfully!\n📅 Date: ${date}\n⏰ Time: ${time}\n🚗 Transport Assist: ${assist}\n\nOur property manager will get in touch shortly.`);
    closeFeature('siteVisitBookingModal');
}

function openHomeLoanEligibilityPortal() {
    openFeature('homeLoanEligibilityModal');
}

function calculateHomeLoanEligibility() {
    let name = document.getElementById('loanCustName').value.trim();
    let phone = document.getElementById('loanCustPhone').value.trim();
    let income = parseFloat(document.getElementById('loanCustIncome').value);
    let existingEmi = parseFloat(document.getElementById('loanCustEmi').value) || 0;
    let requiredAmount = parseFloat(document.getElementById('loanCustAmount').value);

    if(!name || !phone || isNaN(income) || isNaN(requiredAmount)) {
        alert("⚠️ Kripya loan eligibility check karne ke liye sabhi fields ko dhyan se bharein.");
        return;
    }

    let netDisposableIncome = income - existingEmi;
    if (netDisposableIncome < 0) netDisposableIncome = 0;

    let maxEligibleLoan = netDisposableIncome * 60;

    closeFeature('homeLoanEligibilityModal');
    openFeature('loanResultModal');

    let rName = document.getElementById('loanResultName');
    let rReq = document.getElementById('loanResultRequired');
    let rEli = document.getElementById('loanResultEligible');

    if (rName) rName.innerText = name;
    if (rReq) rReq.innerText = `₹${requiredAmount.toLocaleString('en-IN')}`;
    if (rEli) rEli.innerText = `₹${Math.round(maxEligibleLoan).toLocaleString('en-IN')}`;

    let statusBox = document.getElementById('loanResultStatusBox');
    if (statusBox) {
        if (maxEligibleLoan >= requiredAmount) {
            statusBox.className = "p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center font-bold text-xs";
            statusBox.innerHTML = `<i class="ph-fill ph-check-circle text-lg block mx-auto text-emerald-600 mb-1"></i> Pre-Approved! Your profile fits perfectly for this home loan amount.`;
        } else if (maxEligibleLoan > 0) {
            statusBox.className = "p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-center font-bold text-xs";
            statusBox.innerHTML = `<i class="ph-fill ph-info text-lg block mx-auto text-amber-600 mb-1"></i> Partially Eligible! Your maximum eligible loan amount is restricted to ₹${Math.round(maxEligibleLoan).toLocaleString('en-IN')}.`;
        } else {
            statusBox.className = "p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-center font-bold text-xs";
            statusBox.innerHTML = `<i class="ph-fill ph-x-circle text-lg block mx-auto text-red-600 mb-1"></i> Not Eligible! Disposable income is below eligibility threshold values.`;
        }
    }
}

function openFeature(id) { 
    let el = document.getElementById(id);
    if(el) {
        el.classList.remove('hidden'); 
        el.classList.add('flex'); 
        el.style.setProperty('display', 'flex', 'important'); 
    }
}

function closeFeature(id) { 
    let el = document.getElementById(id);
    if(el) {
        el.classList.add('hidden'); 
        el.classList.remove('flex'); 
        el.style.setProperty('display', 'none', 'important'); 
    }
}

function openGoogleMapsNavigation() {
    if (!targetDetailItemInstance) return;
    const lat = targetDetailItemInstance.latitude || 23.259933;
    const lon = targetDetailItemInstance.longitude || 77.412613;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
}

function openPropertyDetailsModal(id) {
    let item = database.find(x => x.id === id);
    if(!item) return;
    targetDetailItemInstance = item;
    detailPhotoActiveIndex = 0;

    let detTitle = document.getElementById('detailTitle');
    let detLoc = document.getElementById('detailLoc');

    if (detTitle) {
        let displayTitle = (item.bhk && item.bhk !== "Any BHK Configuration") ? `${item.bhk} ${item.type} For Sale` : `${item.type} For Sale`;
        detTitle.innerText = displayTitle;
    }
    if (detLoc) detLoc.innerHTML = `<i class="ph-fill ph-map-pin text-slate-400"></i> ${item.locality}, ${item.city}, ${item.state}`;
    
    let badges = document.getElementById('detailExtraBadges');
    if (badges) {
        badges.innerHTML = `
            <span class="bg-slate-100 text-slate-700 font-black text-[10px] uppercase px-2.5 py-1 rounded">Segment: ${item.cat}</span>
            <span class="bg-blue-50 text-blue-600 font-black text-[10px] uppercase px-2.5 py-1 rounded">Price: ₹${item.price.toLocaleString('en-IN')}</span>
            <span class="bg-purple-50 text-purple-600 font-black text-[10px] uppercase px-2.5 py-1 rounded">Identity: ${item.role}</span>
            <span class="bg-amber-50 text-amber-700 font-black text-[10px] uppercase px-2.5 py-1 rounded border border-amber-200">Status: ${item.status || 'Ready to Move'}</span>
            ${item.area ? `<span class="bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase px-2.5 py-1 rounded border border-emerald-200">Area: ${item.area} Sqft</span>` : ''}
            ${item.bathrooms && item.bathrooms !== "N/A" ? `<span class="bg-teal-50 text-teal-700 font-black text-[10px] uppercase px-2.5 py-1 rounded border border-teal-200">Baths: ${item.bathrooms}</span>` : ''}
            ${item.furnishing && item.furnishing !== "Unfurnished" ? `<span class="bg-rose-50 text-rose-700 font-black text-[10px] uppercase px-2.5 py-1 rounded border border-rose-200">Furnishing: ${item.furnishing}</span>` : ''}
        `;
        if(item.rera) badges.innerHTML += `<span class="bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase px-2.5 py-1 rounded border border-emerald-200">RERA Code: ${item.rera}</span>`;
    }

    let bkBtn = document.getElementById('detailBookmarkActionButtonNode');
    if (bkBtn) {
        if(item.saved) {
            bkBtn.innerHTML = `<i class="ph-fill ph-bookmark text-amber-500"></i> Saved`;
        } else {
            bkBtn.innerHTML = `<i class="ph ph-bookmark"></i> Bookmark Asset`;
        }
        bkBtn.onclick = () => {
            toggleBookmarkClientState(item.id, null);
            openPropertyDetailsModal(item.id);
        };
    }

    updateEmiCalculations(item.price);

    let secShield = document.getElementById('shieldUnlockedChannelsBlock');
    let shieldTrig = document.getElementById('shieldTriggerButton');

    if (secShield) secShield.classList.add('hidden');
    if (shieldTrig) shieldTrig.classList.remove('hidden');

    let vBtn = document.getElementById('mediaTabBtnVideo');
    if (vBtn) {
        if (!item.video || item.video === "") {
            vBtn.classList.add('hidden');
        } else {
            vBtn.classList.remove('hidden');
        }
    }

    switchDetailMediaTab('photos');
    openFeature('propertyDetails');
}

function switchDetailMediaTab(type) {
    let pBtn = document.getElementById('mediaTabBtnPhotos');
    let vBtn = document.getElementById('mediaTabBtnVideo');
    let pPanel = document.getElementById('detailTabPanelPhotos');
    let vPanel = document.getElementById('detailTabPanelVideo');
    let player = document.getElementById('detailModalPlayerNode');

    if (player) player.pause();

    if(type === 'photos') {
        if (pBtn) pBtn.className = "px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all bg-blue-600 text-white shadow-md";
        if (vBtn) vBtn.className = "px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all text-slate-300 hover:text-white flex items-center gap-1";
        if (pPanel) pPanel.classList.remove('hidden');
        if (vPanel) vPanel.classList.add('hidden');
        updateDetailModalPhotoDisplayTrack();
    } else {
        if(!targetDetailItemInstance || !targetDetailItemInstance.video || targetDetailItemInstance.video === "") {
            alert("⚠️ Is property mein koi video nahi hai.");
            return;
        }
        if (vBtn) vBtn.className = "px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all bg-blue-600 text-white shadow-md";
        if (pBtn) pBtn.className = "px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all text-slate-300 hover:text-white flex items-center gap-1";
        if (vPanel) vPanel.classList.remove('hidden');
        if (pPanel) pPanel.classList.add('hidden');
        if (player) {
            player.src = targetDetailItemInstance.video;
            player.play().catch(e => {});
        }
    }
}

function updateDetailModalPhotoDisplayTrack() {
    if(!targetDetailItemInstance) return;
    let img = document.getElementById('detailImg');
    let counter = document.getElementById('detailGalleryBadgeCounter');
    if (targetDetailItemInstance.images && targetDetailItemInstance.images.length > 0) {
        if (img) img.src = targetDetailItemInstance.images[detailPhotoActiveIndex];
        if (counter) counter.innerText = `${detailPhotoActiveIndex + 1} / ${targetDetailItemInstance.images.length}`;
    } else {
        if (img) img.src = NO_IMAGE_FALLBACK;
        if (counter) counter.innerText = "0 / 0";
    }
}

function shiftDetailPhotoChannel(dir) {
    if(!targetDetailItemInstance || !targetDetailItemInstance.images || targetDetailItemInstance.images.length === 0) return;
    let total = targetDetailItemInstance.images.length;
    detailPhotoActiveIndex = (detailPhotoActiveIndex + dir + total) % total;
    updateDetailModalPhotoDisplayTrack();
}

function closePropertyDetailModalBlock() {
    let player = document.getElementById('detailModalPlayerNode');
    if (player) player.pause();
    closeFeature('propertyDetails');
}

function processSecureShieldUnlock() {
    if(!sessionUser) {
        openFeature('loginModal');
        return;
    }
    if(!targetDetailItemInstance) return;
    let shieldTrig = document.getElementById('shieldTriggerButton');
    let secShield = document.getElementById('shieldUnlockedChannelsBlock');
    let phoneNode = document.getElementById('shieldTargetPhoneNode');
    let callBtn = document.getElementById('callBtn');
    let waBtn = document.getElementById('waBtn');

    if (shieldTrig) shieldTrig.classList.add('hidden');
    if (secShield) secShield.classList.remove('hidden');
    if (phoneNode) phoneNode.innerText = "+91 " + targetDetailItemInstance.phone;
    if (callBtn) callBtn.onclick = () => window.open("tel:" + targetDetailItemInstance.phone);
    if (waBtn) waBtn.onclick = () => window.open(`https://wa.me/91${targetDetailItemInstance.phone}?text=Hello,%20I%20am%20interested%20in%20your%20property%20listed%20on%20MamaDealing.`);
}

function triggerDirectPostFlow() {
    if(!sessionUser) {
        openFeature('loginModal');
        return;
    }

    let userPostsCount = database.filter(x => x.phone === sessionUser.phone).length;
    let postLimit = sessionUser.role === "Owner" ? 1 : 3;

    if (userSubscribedPlan === "Free" && userPostsCount >= postLimit) {
        openFeature('platformSubscriptionPlansModal');
        alert(`⚠️ Aapne free limit (${postLimit} posts) exhaust kar li hai. Post karne ke liye premium plan select karein.`);
        return;
    }
    
    editingPropertyId = null; 
    selectedPhotosBase64 = [];
    
    try {
        renderPhotoPreviews();
        moveStep(1);
    } catch (err) {
        console.warn(err);
    }

    openFeature('postProperty');
}

async function reportFakeListing() {
    if(!sessionUser) {
        openFeature('loginModal');
        return;
    }
    if(!targetDetailItemInstance) return;

    if(!confirm("Kya aap sach mein is property ko scam/fake report karna chahte hain? 3 reports par yeh system se hamesha ke liye delete ho jayegi.")) {
        return;
    }

    try {
        let response = await fetch(`${BACKEND_BASE_URL}/api/properties/${targetDetailItemInstance.id}/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        let result = await response.json();
        alert(result.message);

        if (result.action === 'deleted') {
            window.location.reload(); 
        }
    } catch (error) {
        console.error("Report Error:", error);
        alert("⚠️ Backend server se connect nahi ho paya.");
    }
}

let selectedRegRoleNode = "Owner";
function selectRole(role) {
    selectedRegRoleNode = role;
    let block = document.getElementById('authSpecialOnboardingFormBlock');
    let label = document.getElementById('specialLabelNodeInput');
    if(role === "Owner") {
        if (block) block.classList.add('hidden');
    } else if(role === "Broker") {
        if (block) block.classList.remove('hidden');
        if (label) label.innerText = "Agency / Broker Firm Name";
    } else if(role === "Builder") {
        if (block) block.classList.remove('hidden');
        if (label) label.innerText = "Infrastructure Builder Brand Title";
    }
    let s1 = document.getElementById('authStep1');
    let s2 = document.getElementById('authStep2');
    if (s1) s1.classList.add('hidden');
    if (s2) s2.classList.remove('hidden');
}

async function triggerOtpRequestSequence() {
    let phoneEl = document.getElementById('authPhoneInput');
    let phone = phoneEl ? phoneEl.value.trim() : '';
    if(phone.length < 10) {
        alert("⚠️ Enter valid 10-digit mobile target string setup element.");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/auth/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: phone })
        });
        const result = await response.json();

        if (response.ok) {
            let otpCont = document.getElementById('otpInputContainerNode');
            if (otpCont) otpCont.classList.remove('hidden');
            let actionBtn = document.getElementById('authPrimaryActionSubmitBtn');
            if (actionBtn) {
                actionBtn.innerText = "Verify OTP & Join";
                actionBtn.onclick = verifyRealOtpSequence; 
            }
            alert("📩 OTP has been sent successfully to your mobile number.");
        } else {
            // ACTIVATE FAIL-SAFE BYPASS IF REAL SMS API FAILS
            console.warn("Real OTP API failed, activating mock bypass fallback.");
            activateMockOtpBypassSequence();
        }
    } catch (err) {
        console.error("OTP send error, activating mock bypass fallback:", err);
        activateMockOtpBypassSequence();
    }
}

function activateMockOtpBypassSequence() {
    let otpCont = document.getElementById('otpInputContainerNode');
    if (otpCont) otpCont.classList.remove('hidden');
    let actionBtn = document.getElementById('authPrimaryActionSubmitBtn');
    if (actionBtn) {
        actionBtn.innerText = "Verify OTP (Use Code: 123456)";
        actionBtn.onclick = verifyMockOtpFrameworkSequence; 
    }
    alert("⚠️ SMS API DLT Blocked! Fail-Safe Mode Activated.\n\n👉 Type mock code '123456' to login instantly!");
}

async function verifyRealOtpSequence() {
    let otpEl = document.getElementById('authOtpInput');
    let phoneEl = document.getElementById('authPhoneInput');
    let firmEl = document.getElementById('authOnboardingFirmName');
    let reraEl = document.getElementById('authOnboardingReraCode');

    let otp = otpEl ? otpEl.value.trim() : '';
    let phone = phoneEl ? phoneEl.value.trim() : '';
    let firm = firmEl ? firmEl.value.trim() : '';
    let rera = reraEl ? reraEl.value.trim() : '';

    if (!otp) {
        alert("⚠️ Please enter the OTP sent to your phone.");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: phone, otp: otp })
        });
        const result = await response.json();

        if (response.ok && result.success) {
            sessionUser = { role: selectedRegRoleNode, phone: phone, firmName: firm, reraCode: rera };
            closeFeature('loginModal');
            alert("✅ Secure Login Successful!");
            
            let component = document.getElementById('authDynamicComponent');
            if (component) {
                component.innerHTML = `<button onclick="switchTab('profile')" class="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg font-black text-[10px] uppercase tracking-wide shadow-sm flex items-center gap-1 hover:scale-95 transition-all"><i class="ph-fill ph-user-circle text-xs"></i> Active</button>`;
            }
            
            if(currentActiveTab === "profile") renderProfileSectionWorkspace();
        } else {
            alert("❌ Authentication failed: " + result.message);
        }
    } catch (err) {
        console.error("OTP Verification Error:", err);
        alert("⚠️ Server connection error during OTP verification.");
    }
}

function verifyMockOtpFrameworkSequence() {
    let otpEl = document.getElementById('authOtpInput');
    let phoneEl = document.getElementById('authPhoneInput');
    let firmEl = document.getElementById('authOnboardingFirmName');
    let reraEl = document.getElementById('authOnboardingReraCode');

    let otp = otpEl ? otpEl.value.trim() : '';
    let phone = phoneEl ? phoneEl.value.trim() : '';
    let firm = firmEl ? firmEl.value.trim() : '';
    let rera = reraEl ? reraEl.value.trim() : '';

    if (otp === "123456" || otp === "111111") {
        sessionUser = { 
            role: selectedRegRoleNode, 
            phone: phone, 
            firmName: firm || (selectedRegRoleNode + " User"), 
            reraCode: rera 
        };
        closeFeature('loginModal');
        alert("✅ Logged in successfully via Fail-Safe OTP bypass mode!");
        
        let component = document.getElementById('authDynamicComponent');
        if (component) {
            component.innerHTML = `<button onclick="switchTab('profile')" class="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg font-black text-[10px] uppercase tracking-wide shadow-sm flex items-center gap-1 hover:scale-95 transition-all"><i class="ph-fill ph-user-circle text-xs"></i> Active</button>`;
        }
        if(currentActiveTab === "profile") renderProfileSectionWorkspace();
    } else {
        alert("❌ Incorrect Mock OTP. Please enter '123456' to bypass.");
    }
}

function logoutAgent() {
    sessionUser = null;
    userSubscribedPlan = "Free";
    let component = document.getElementById('authDynamicComponent');
    if (component) {
        component.innerHTML = `<button onclick="openFeature('loginModal')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all">Login / Join</button>`;
    }
    alert("🔒 Active credentials token purged. Session terminated.");
    switchTab('properties');
}

function submitAssistedSellingRequest() {
    let name = document.getElementById('assistOwnerName').value.trim();
    let phone = document.getElementById('assistOwnerPhone').value.trim();
    let locality = document.getElementById('assistOwnerLocality').value.trim();
    let price = document.getElementById('assistOwnerPrice').value.trim();
    
    if (!name || !phone || !locality || !price) {
        alert("⚠️ Kripya sabhi fields ko dhyan se bharein taaki humari team aapse contact kar sake.");
        return;
    }
    
    alert(`🎉 Success! Exclusive Request Registered!\n\nHamari video team aur executive Bhopal ke is patte par visit karenge:\n📍 Area: ${locality}, Bhopal\n📞 Mobile: +91 ${phone}\n💰 Expected Price: ₹${parseInt(price).toLocaleString('en-IN')}\n\nSuccessful transaction par standard 1% brokerage apply hogi.`);
    closeFeature('assistedSellingModal');
}

function selectPremiumPlan(planType, price) {
    if (!sessionUser) {
        alert("⚠️ Pehle dashboard me login karein.");
        openFeature('loginModal');
        return;
    }

    if (price === 0) {
        userSubscribedPlan = "Free";
        alert("✅ Free subscription activated successfully!");
        closeFeature('platformSubscriptionPlansModal');
        renderProfileSectionWorkspace();
        return;
    }

    alert(`Redirecting to Gateway interface to subscribe to the ${planType} plan (₹${price}/mo)...`);
    
    setTimeout(() => {
        userSubscribedPlan = planType;
        alert(`🎉 Thank you! Your account has been upgraded to the ${planType} plan.`);
        closeFeature('platformSubscriptionPlansModal');
        renderProfileSectionWorkspace();
    }, 1500);
}

function adjustPostSpecsVisibility() {
    let typeEl = document.querySelector('input[name="form_type"]:checked');
    let selectedType = typeEl ? typeEl.value : 'Flat';
    
    let bhkBox = document.getElementById('bhkSpecContainer');
    let areaBox = document.getElementById('areaSpecContainer');
    let bathBox = document.getElementById('bathroomsSpecContainer');
    let furnishBox = document.getElementById('furnishingSpecContainer');
    
    if (selectedType === "Plot") {
        if (bhkBox) bhkBox.classList.add('hidden');
        if (bathBox) bathBox.classList.add('hidden');
        if (furnishBox) furnishBox.classList.add('hidden');
        
        if (areaBox) {
            areaBox.classList.remove('col-span-1');
            areaBox.classList.add('col-span-full');
        }
    } else if (selectedType === "Commercial" || selectedType === "Upcoming Project") {
        if (bhkBox) bhkBox.classList.add('hidden');
        if (bathBox) bathBox.classList.remove('hidden');
        if (furnishBox) furnishBox.classList.remove('hidden');
        
        if (areaBox) {
            areaBox.classList.remove('col-span-1');
            areaBox.classList.add('col-span-full');
        }
    } else {
        if (bhkBox) bhkBox.classList.remove('hidden');
        if (bathBox) bathBox.classList.remove('hidden');
        if (furnishBox) furnishBox.classList.remove('hidden');
        
        if (areaBox) {
            areaBox.classList.remove('col-span-full');
            areaBox.classList.add('col-span-1');
        }
    }
}

function moveStep(st) {
    document.querySelectorAll('.step-div').forEach(x => x.classList.add('hidden'));
    let stepDiv = document.getElementById(`step-v${st}`);
    if (stepDiv) stepDiv.classList.remove('hidden');
    
    if (st === 2) {
        adjustPostSpecsVisibility();
    }
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

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
        };
    });
}

async function handlePhotoSelection(event) {
    let files = Array.from(event.target.files);
    
    if (selectedPhotosBase64.length + files.length > 10) {
        alert("⚠️ Aap ek baar mein maximum 10 photos hi upload kar sakte hain.");
        files = files.slice(0, 10 - selectedPhotosBase64.length);
    }

    let progressText = document.getElementById('photoCountBadge');
    if(progressText) {
        progressText.classList.remove('hidden');
        progressText.innerHTML = `<i class="ph-fill ph-spinner animate-spin"></i> Processing & compressing selected files...`;
    }

    for (let file of files) {
        try {
            let base64Data = await compressImage(file, 1024, 0.7);
            selectedPhotosBase64.push(base64Data);
        } catch (error) {
            console.error("Media processing exception:", error);
        }
    }

    renderPhotoPreviews();
}

function renderPhotoPreviews() {
    let container = document.getElementById('imagePreviewContainer');
    let badge = document.getElementById('photoCountBadge');
    if (!container) return;
    container.innerHTML = "";

    selectedPhotosBase64.forEach((base64, index) => {
        let card = document.createElement('div');
        card.className = "relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm animate-slide-up bg-slate-100";
        card.innerHTML = `
            <img src="${base64}" class="w-full h-full object-cover">
            <button type="button" onclick="removeSelectedPhoto(${index})" class="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-md transition-all">
                <i class="ph-bold ph-trash"></i>
            </button>
        `;
        container.appendChild(card);
    });

    if (badge) {
        if (selectedPhotosBase64.length > 0) {
            badge.classList.remove('hidden');
            badge.innerHTML = `<i class="ph-fill ph-check-circle text-emerald-500"></i> ${selectedPhotosBase64.length}/10 Photo(s) Selected successfully.`;
        } else {
            badge.classList.add('hidden');
        }
    }
}

function removeSelectedPhoto(idx) {
    selectedPhotosBase64.splice(idx, 1);
    renderPhotoPreviews();
}

async function publishFinal() {
    let type = document.querySelector('input[name="form_type"]:checked').value;
    let cat = document.querySelector('input[name="form_cat"]:checked').value;
    
    let statusEle = document.querySelector('input[name="form_status"]:checked');
    let statusVal = statusEle ? statusEle.value : "Ready to Move";

    let state = document.getElementById('stateInp').value;
    let city = document.getElementById('cityInp').value;
    let locality = document.getElementById('localityInp').value;
    let price = parseInt(document.getElementById('propPrice').value);

    let bhkVal = (type === "Plot" || type === "Commercial" || type === "Upcoming Project") ? "Any BHK Configuration" : document.getElementById('formBhkInp').value;
    let areaVal = parseInt(document.getElementById('formAreaInp').value) || null;
    let bathroomsVal = (type === "Plot") ? "N/A" : document.getElementById('formBathroomsInp').value;
    let furnishingVal = (type === "Plot") ? "Unfurnished" : document.getElementById('formFurnishingInp').value;

    if(!state || !city || !locality || isNaN(price)) {
        alert("⚠️ Details adhoori hain! Kripya Step 1 ki details check karein.");
        moveStep(1);
        return;
    }

    let progressContainer = document.getElementById('uploadProgressContainer');
    let progressBar = document.getElementById('uploadProgressBar');
    let progressText = document.getElementById('uploadProgressText');
    let progressPercent = document.getElementById('uploadProgressPercent');

    if(progressContainer) progressContainer.classList.remove('hidden');
    if(progressText) progressText.innerText = "Processing metadata... (Please wait)";

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    };

    let finalImagesArray = [...selectedPhotosBase64];

    if (finalImagesArray.length === 0) {
        let userImgUrl = document.getElementById('propImgUrl')?.value.trim();
        if (userImgUrl) {
            finalImagesArray.push(userImgUrl);
        } else {
            finalImagesArray.push(NO_IMAGE_FALLBACK);
        }
    }

    let videoInput = document.getElementById('realVideoInputNode');
    let finalVideoBase64 = ""; 
    
    if (videoInput && videoInput.files && videoInput.files.length > 0) {
        if(progressText) progressText.innerText = "Encoding Video Format... (Please wait)";
        finalVideoBase64 = await readFileAsBase64(videoInput.files[0]);
    }

    let generatedTitle = type === "Plot" ? "Premium Plot Asset" : type === "Commercial" ? "Commercial Space" : type === "Upcoming Project" ? "Upcoming Premium Project" : bhkVal + " " + type;

    let mockLatitude = 23.259933 + (Math.random() - 0.5) * 0.1;
    let mockLongitude = 77.412613 + (Math.random() - 0.5) * 0.1;

    let propertyPayload = {
        title: generatedTitle,
        status: statusVal,
        description: "Freshly listed property by " + (sessionUser ? sessionUser.role : "Owner"),
        price: price,
        location: locality + ", " + city + ", " + state,
        propertyType: type,
        bhk: bhkVal,
        area: areaVal,
        bathrooms: bathroomsVal,
        furnishing: furnishingVal,
        images: finalImagesArray, 
        video: finalVideoBase64,  
        phone: sessionUser ? sessionUser.phone : "9111000011",
        firmName: sessionUser ? sessionUser.firmName : "",
        rera: sessionUser ? sessionUser.reraCode : "",
        latitude: mockLatitude,
        longitude: mockLongitude
    };

    let targetUrl = `${BACKEND_BASE_URL}/api/properties`;
    let targetMethod = "POST";

    if (editingPropertyId) {
        targetUrl = `${BACKEND_BASE_URL}/api/properties/${editingPropertyId}`;
        targetMethod = "PUT";
    }

    if(progressText) progressText.innerText = "Connecting to Server...";

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(targetMethod, targetUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                let percentComplete = Math.round((event.loaded / event.total) * 100);
                if(progressBar) progressBar.style.width = percentComplete + "%";
                if(progressPercent) progressPercent.innerText = percentComplete + "%";
                if(progressText) progressText.innerText = "Uploading Media files...";
            }
        };

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                let result = JSON.parse(xhr.responseText);
                if(progressText) progressText.innerText = "Upload Complete! ✅";
                if(progressBar) progressBar.style.width = "100%";
                
                setTimeout(() => {
                    alert("🎉 Property Database Mein Successfully Save Ho Gayi!");
                    if(progressContainer) progressContainer.classList.add('hidden');
                    closeFeature('postProperty');
                    window.location.reload(); 
                }, 800); 
                
                resolve(result);
            } else {
                try {
                    let result = JSON.parse(xhr.responseText);
                    alert("❌ Database Error: " + result.message);
                } catch(e) {
                    alert("⚠️ Process Response error: " + xhr.statusText);
                }
                if(progressContainer) progressContainer.classList.add('hidden');
                reject(new Error("Database write error"));
            }
        };

        xhr.onerror = function() {
            alert("⚠️ Backend se connect nahi ho paya! Kripya check karein ki backend chal raha hai.");
            if(progressContainer) progressContainer.classList.add('hidden');
            reject(new Error("Network Error"));
        };

        xhr.send(JSON.stringify(propertyPayload));
    });
}

function submitNewB2bBusinessForm() {
    let t = document.getElementById('regB2bTitle').value;
    let p = document.getElementById('regB2bPhone').value;
    let s = document.getElementById('regB2bSpecialty').value;
    let c = document.getElementById('regB2bCategory').value;
    let st = document.getElementById('regB2bState').value;
    let ci = document.getElementById('regB2bCity').value;
    
    if(!t || !p || !s || !st || !ci) { 
        alert("⚠️ Complete details (including service region) required to list business on our directory."); 
        return; 
    }
    
    closeFeature('addB2bModal');
    let pendingListing = { id: Date.now(), category: c, title: t, phone: p, specialty: s, rating: 5.0, reviews: 1, verified: true, state: st, city: ci };
    openB2bSubscriptionGate(pendingListing);
}

function openB2bSubscriptionGate(pendingListing) {
    openFeature('b2bSubscriptionModal');
    
    document.getElementById('b2bPayButton').onclick = async () => {
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/payments/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const orderData = await response.json();

            if (!response.ok) {
                alert("⚠️ Order creation failed. Please try again.");
                return;
            }

            const options = {
                key: "rzp_test_zI3vHl1VvCg26u", 
                amount: orderData.amount,
                currency: orderData.currency,
                name: "MamaDealing Network",
                description: "Premium Leads Business Directory Activation",
                order_id: orderData.id,
                handler: async function (response) {
                    const verifyResponse = await fetch(`${BACKEND_BASE_URL}/api/payments/verify`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                    const verifyResult = await verifyResponse.json();

                    if (verifyResult.success) {
                        servicesDatabase.unshift(pendingListing);
                        closeFeature('b2bSubscriptionModal');
                        selectB2bCategoryCard(pendingListing.category); 
                        alert("🎉 Payment Success! Your business profile is now active on the directory.");
                    } else {
                        alert("❌ Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: sessionUser ? sessionUser.firmName : "Guest User",
                    contact: sessionUser ? sessionUser.phone : ""
                },
                theme: { color: "#2563EB" } 
            };

            const rzp1 = new Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment Process Error:", error);
            alert("⚠️ Something went wrong while initiating the payment.");
        }
    };
}

async function fetchLivePropertiesFromDatabase() {
    try {
        console.log("🛰️ Pinging Live MongoDB Data Center Core Sequence...");
        const response = await fetch(`${BACKEND_BASE_URL}/api/properties`);
        const liveProperties = await response.json();

        if (!Array.isArray(liveProperties)) return;

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

            let imgArray = [];
            if (Array.isArray(property.images)) {
                imgArray = property.images;
            } else if (typeof property.images === 'string' && property.images !== "") {
                imgArray = [property.images];
            }
            if (imgArray.length === 0) {
                imgArray = [NO_IMAGE_FALLBACK];
            }

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
                role: property.phone === "9111000011" ? "Owner" : "Broker", 
                status: property.status || "Ready to Move",
                phone: property.phone || "9111000011",
                images: imgArray,
                video: property.video || "", 
                musicTrack: (property.video && property.video !== "") ? "trending_bgm.mp3" : "",
                saved: false,
                firmName: property.firmName || "",
                rera: property.rera || "",
                latitude: property.latitude || 23.259933,
                longitude: property.longitude || 77.412613,
                isSoldOut: property.isSoldOut || false
            };

            let isAlreadyIndexed = database.some(existingNode => existingNode.id === mappedDataNode.id);
            if (!isAlreadyIndexed) {
                database.unshift(mappedDataNode); 
            }
        });

        console.log("🔋 Live Core Synchronization Successful. Database Count Updated.");
        render(); 

    } catch (error) {
        console.error("❌ MongoDB Core Synchronization Pipeline Interrupted:", error);
    }
}