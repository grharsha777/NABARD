// FarmGuard Application JavaScript

// Application State
let currentLanguage = 'en';
let currentUser = null;
let isLoggedIn = false;
let chatMessages = [];

// Sample Data (from provided JSON)
const appData = {
    weather: {
        current: {
            temperature: 28,
            humidity: 65,
            condition: "Partly Cloudy",
            windSpeed: 12,
            rainfall: 0
        },
        forecast: [
            {"day": "Today", "high": 32, "low": 24, "condition": "Sunny", "rain": 10},
            {"day": "Tomorrow", "high": 30, "low": 22, "condition": "Cloudy", "rain": 40},
            {"day": "Wednesday", "high": 28, "low": 20, "condition": "Rainy", "rain": 80},
            {"day": "Thursday", "high": 29, "low": 21, "condition": "Partly Cloudy", "rain": 30}
        ]
    },
    governmentSchemes: [
        {
            name: "PM-KISAN Samman Nidhi",
            amount: "₹6,000/year",
            eligibility: "Small & marginal farmers",
            status: "Active",
            description: "Direct income support to farmers"
        },
        {
            name: "Pradhan Mantri Fasal Bima Yojana",
            amount: "2-5% premium",
            eligibility: "All farmers",
            status: "Active",
            description: "Crop insurance against natural calamities"
        },
        {
            name: "Kisan Credit Card",
            amount: "Up to ₹3 lakh",
            eligibility: "All farmers",
            status: "Active",
            description: "Easy access to credit"
        },
        {
            name: "PM Krishi Sinchai Yojana",
            amount: "Subsidy on irrigation",
            eligibility: "All farmers",
            status: "Active",
            description: "Water conservation & irrigation efficiency"
        }
    ],
    crops: [
        {
            name: "Rice",
            stage: "Flowering",
            health: "Good",
            daysToHarvest: 45,
            area: "2.5 acres",
            predictedYield: "3.2 tons"
        },
        {
            name: "Wheat",
            stage: "Germination",
            health: "Excellent",
            daysToHarvest: 120,
            area: "1.8 acres",
            predictedYield: "2.1 tons"
        }
    ],
    marketPrices: [
        {"crop": "Rice", "price": "₹2,100/quintal", "change": "+5%", "location": "Local Mandi"},
        {"crop": "Wheat", "price": "₹2,350/quintal", "change": "+3%", "location": "Local Mandi"},
        {"crop": "Onion", "price": "₹3,500/quintal", "change": "-2%", "location": "Local Mandi"},
        {"crop": "Potato", "price": "₹1,800/quintal", "change": "+8%", "location": "Local Mandi"}
    ],
    iotSensors: {
        soilMoisture: "68%",
        soilTemperature: "24°C",
        soilPH: "6.8",
        npkLevels: {
            nitrogen: "45 mg/kg",
            phosphorus: "12 mg/kg",
            potassium: "180 mg/kg"
        }
    },
    languages: [
        {"code": "en", "name": "English", "flag": "🇺🇸"},
        {"code": "hi", "name": "हिन्दी", "flag": "🇮🇳"},
        {"code": "te", "name": "తెలుగు", "flag": "🇮🇳"},
        {"code": "ta", "name": "தமிழ்", "flag": "🇮🇳"},
        {"code": "bn", "name": "বাংলা", "flag": "🇧🇩"},
        {"code": "mr", "name": "मराठी", "flag": "🇮🇳"},
        {"code": "gu", "name": "ગુજરાતી", "flag": "🇮🇳"},
        {"code": "pa", "name": "ਪੰਜਾਬੀ", "flag": "🇮🇳"}
    ],
    alerts: [
        {"type": "weather", "message": "Heavy rainfall expected tomorrow", "severity": "high"},
        {"type": "disease", "message": "Brown spot detected in rice field", "severity": "medium"},
        {"type": "market", "message": "Rice prices increased by 5%", "severity": "low"}
    ],
    chatbotResponses: {
        weather: "Based on current conditions, expect partly cloudy skies with 28°C temperature. Tomorrow shows 40% chance of rain. I recommend covering sensitive crops and checking drainage systems.",
        disease: "For brown spot in rice, apply fungicide spray containing tricyclazole. Ensure proper drainage and avoid over-watering. Monitor regularly and remove affected leaves.",
        schemes: "You're eligible for PM-KISAN (₹6,000/year) and crop insurance. PM-KISAN provides direct income support, while crop insurance protects against natural calamities. Would you like help with applications?",
        market: "Current rice prices are ₹2,100/quintal, up 5% from last week. This is a good time to sell if you have stock. Wheat prices are also trending upward at ₹2,350/quintal.",
        general: "I'm here to help with all your farming needs! I can assist with weather forecasts, crop diseases, government schemes, market prices, and general farming advice. What would you like to know?"
    }
};

// Multilingual Support
const translations = {
    en: {
        welcome: "Welcome to FarmGuard",
        login: "Login",
        register: "Register",
        continueAsGuest: "Continue as Guest",
        dashboard: "Dashboard",
        aiAssistant: "AI Assistant",
        weather: "Weather",
        crops: "Crops",
        govSchemes: "Gov Schemes",
        marketPrices: "Market Prices",
        sensors: "IoT Sensors"
    },
    hi: {
        welcome: "फार्मगार्ड में आपका स्वागत है",
        login: "लॉगिन",
        register: "पंजीकरण",
        continueAsGuest: "अतिथि के रूप में जारी रखें",
        dashboard: "डैशबोर्ड",
        aiAssistant: "AI सहायक",
        weather: "मौसम",
        crops: "फसलें",
        govSchemes: "सरकारी योजनाएं",
        marketPrices: "बाजार की कीमतें",
        sensors: "IoT सेंसर"
    }
};

// Utility Functions
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('active');
    });
}

function showScreen(screenId) {
    hideAllScreens();
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.remove('hidden');
        screen.classList.add('active');
    }
    
    // Show/hide bottom navigation based on screen
    const bottomNav = document.getElementById('bottomNav');
    const showNavScreens = ['dashboardScreen', 'weatherScreen', 'cropsScreen', 'marketScreen', 'sensorsScreen'];
    
    if (showNavScreens.includes(screenId)) {
        bottomNav.classList.remove('hidden');
        updateActiveNavItem(screenId);
    } else {
        bottomNav.classList.add('hidden');
    }
}

function updateActiveNavItem(screenId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Map screen IDs to nav items
    const screenNavMap = {
        'dashboardScreen': 0,
        'cropsScreen': 1,
        'weatherScreen': 2,
        'marketScreen': 3,
        'chatbotScreen': 4
    };
    
    const activeIndex = screenNavMap[screenId];
    if (activeIndex !== undefined) {
        navItems[activeIndex].classList.add('active');
    }
}

// Screen Navigation Functions
function showWelcome() {
    showScreen('welcomeScreen');
}

function showLogin() {
    showScreen('loginScreen');
}

function showRegister() {
    showScreen('registerScreen');
}

function showDashboard() {
    showScreen('dashboardScreen');
    updateDashboardData();
}

function showChatbot() {
    showScreen('chatbotScreen');
    updateActiveNavItem('chatbotScreen');
}

function showWeather() {
    showScreen('weatherScreen');
}

function showCrops() {
    showScreen('cropsScreen');
}

function showSchemes() {
    showScreen('schemesScreen');
}

function showMarket() {
    showScreen('marketScreen');
}

function showSensors() {
    showScreen('sensorsScreen');
}

// Language Selection
function initializeLanguageSelector() {
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            languageButtons.forEach(b => b.classList.remove('selected'));
            // Add active class to clicked button
            this.classList.add('selected');
            // Update current language
            currentLanguage = this.dataset.lang;
            // Update UI text (simplified)
            updateUILanguage();
        });
    });
}

function updateUILanguage() {
    // Simple language update - in a real app, this would be more comprehensive
    console.log(`Language changed to: ${currentLanguage}`);
    showNotification(`Language changed to ${appData.languages.find(l => l.code === currentLanguage)?.name || 'English'}`);
}

// Dashboard Data Updates
function updateDashboardData() {
    // Update weather data
    const weatherCard = document.querySelector('.weather-card .stat-info h3');
    const weatherDesc = document.querySelector('.weather-card .stat-info p');
    if (weatherCard && weatherDesc) {
        weatherCard.textContent = `${appData.weather.current.temperature}°C`;
        weatherDesc.textContent = appData.weather.current.condition;
    }
    
    // Update crop count
    const cropCard = document.querySelector('.crop-card .stat-info h3');
    const cropDesc = document.querySelector('.crop-card .stat-info p');
    if (cropCard && cropDesc) {
        cropCard.textContent = `${appData.crops.length} Crops`;
        cropDesc.textContent = 'Active Growing';
    }
    
    // Update market price
    const marketCard = document.querySelector('.market-card .stat-info h3');
    if (marketCard) {
        const ricePrice = appData.marketPrices.find(p => p.crop === 'Rice');
        if (ricePrice) {
            marketCard.textContent = ricePrice.price.split('/')[0];
        }
    }
    
    // Update alerts count
    const alertCard = document.querySelector('.alert-card .stat-info h3');
    if (alertCard) {
        alertCard.textContent = `${appData.alerts.length} Alerts`;
    }
}

// Chatbot Functionality
function initializeChatbot() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function askQuestion(category) {
    const questions = {
        weather: "What's the weather forecast for this week?",
        disease: "How do I treat crop diseases?",
        schemes: "What government schemes am I eligible for?",
        market: "What are the current market prices?"
    };
    
    const question = questions[category];
    if (question) {
        addMessageToChat(question, 'user');
        
        // Simulate AI response delay
        setTimeout(() => {
            const response = appData.chatbotResponses[category] || appData.chatbotResponses.general;
            addMessageToChat(response, 'bot');
        }, 1000);
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message) {
        addMessageToChat(message, 'user');
        chatInput.value = '';
        
        // Generate AI response
        setTimeout(() => {
            const response = generateAIResponse(message);
            addMessageToChat(response, 'bot');
        }, 1000);
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'bot' ? '🤖' : '👤';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = message;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature')) {
        return appData.chatbotResponses.weather;
    } else if (lowerMessage.includes('disease') || lowerMessage.includes('pest') || lowerMessage.includes('fungus')) {
        return appData.chatbotResponses.disease;
    } else if (lowerMessage.includes('scheme') || lowerMessage.includes('government') || lowerMessage.includes('subsidy')) {
        return appData.chatbotResponses.schemes;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('sell')) {
        return appData.chatbotResponses.market;
    } else if (lowerMessage.includes('soil') || lowerMessage.includes('sensor') || lowerMessage.includes('moisture')) {
        return `Current soil conditions: Moisture ${appData.iotSensors.soilMoisture}, Temperature ${appData.iotSensors.soilTemperature}, pH ${appData.iotSensors.soilPH}. Your soil is in good condition for most crops.`;
    } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('npk')) {
        return `Current NPK levels: Nitrogen ${appData.iotSensors.npkLevels.nitrogen} (Low - needs attention), Phosphorus ${appData.iotSensors.npkLevels.phosphorus} (Good), Potassium ${appData.iotSensors.npkLevels.potassium} (Excellent). I recommend applying urea fertilizer for nitrogen deficiency.`;
    } else {
        return appData.chatbotResponses.general;
    }
}

// Voice Input Simulation
function initializeVoiceInput() {
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', function() {
            this.textContent = '🎙️';
            this.style.background = 'var(--color-error)';
            
            showNotification('Voice input activated (demo)');
            
            // Simulate voice input
            setTimeout(() => {
                this.textContent = '🎤';
                this.style.background = 'var(--color-primary)';
                const sampleQuestion = "What's the weather forecast for tomorrow?";
                document.getElementById('chatInput').value = sampleQuestion;
                showNotification('Voice captured: "' + sampleQuestion + '"');
            }, 2000);
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        padding: var(--space-12) var(--space-16);
        box-shadow: var(--shadow-md);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    notification.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Weather Recommendations
function updateWeatherRecommendations() {
    const recommendations = document.querySelector('.weather-recommendations');
    if (recommendations) {
        // Add dynamic recommendations based on weather
        const forecast = appData.weather.forecast;
        let recHTML = '<h3>Farming Recommendations</h3>';
        
        if (forecast[1].rain > 50) {
            recHTML += `
                <div class="recommendation-item">
                    <span class="rec-icon">🌧️</span>
                    <p>Heavy rain expected ${forecast[1].day.toLowerCase()}. Avoid spraying and ensure proper drainage.</p>
                </div>
            `;
        }
        
        if (appData.weather.current.temperature > 30) {
            recHTML += `
                <div class="recommendation-item">
                    <span class="rec-icon">☀️</span>
                    <p>High temperature today. Increase irrigation frequency and provide shade for sensitive crops.</p>
                </div>
            `;
        }
        
        recHTML += `
            <div class="recommendation-item">
                <span class="rec-icon">🌾</span>
                <p>Good conditions for rice flowering stage. Monitor for pests after rain.</p>
            </div>
        `;
        
        recommendations.innerHTML = recHTML;
    }
}

// Market Price Updates
function simulateMarketUpdates() {
    setInterval(() => {
        // Simulate price changes
        appData.marketPrices.forEach(item => {
            const change = (Math.random() - 0.5) * 10; // Random change between -5% and +5%
            const currentPrice = parseInt(item.price.replace(/[₹,]/g, ''));
            const newPrice = Math.round(currentPrice * (1 + change / 100));
            item.price = `₹${newPrice.toLocaleString()}/quintal`;
            item.change = change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
        });
        
        // Update dashboard if visible
        if (document.getElementById('dashboardScreen').classList.contains('active')) {
            updateDashboardData();
        }
    }, 30000); // Update every 30 seconds
}

// IoT Sensor Simulation
function simulateSensorUpdates() {
    setInterval(() => {
        // Simulate sensor value changes
        const moisture = Math.round(Math.random() * 20 + 60); // 60-80%
        const temp = Math.round(Math.random() * 10 + 20); // 20-30°C
        const ph = (Math.random() * 2 + 6).toFixed(1); // 6.0-8.0
        
        appData.iotSensors.soilMoisture = `${moisture}%`;
        appData.iotSensors.soilTemperature = `${temp}°C`;
        appData.iotSensors.soilPH = ph;
        
        // Update sensor display if visible
        if (document.getElementById('sensorsScreen').classList.contains('active')) {
            updateSensorDisplay();
        }
    }, 10000); // Update every 10 seconds
}

function updateSensorDisplay() {
    const sensors = document.querySelectorAll('.sensor-card');
    sensors.forEach((sensor, index) => {
        const valueElement = sensor.querySelector('.sensor-value');
        const statusElement = sensor.querySelector('.sensor-status');
        
        if (index === 0) { // Soil Moisture
            valueElement.textContent = appData.iotSensors.soilMoisture;
            const moisture = parseInt(appData.iotSensors.soilMoisture);
            statusElement.className = moisture > 65 ? 'sensor-status status--success' : 
                                    moisture > 40 ? 'sensor-status status--warning' : 
                                    'sensor-status status--error';
            statusElement.textContent = moisture > 65 ? 'Optimal' : 
                                      moisture > 40 ? 'Low' : 'Critical';
        }
    });
}

// Progressive Web App Features
function initializePWA() {
    // Service Worker Registration (simulated)
    if ('serviceWorker' in navigator) {
        console.log('Service Worker supported');
        showNotification('App can work offline!', 'success');
    }
    
    // Install prompt simulation
    setTimeout(() => {
        if (Math.random() > 0.7) { // 30% chance to show install prompt
            const installBanner = document.createElement('div');
            installBanner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: var(--color-primary);
                color: var(--color-btn-primary-text);
                padding: var(--space-12);
                text-align: center;
                z-index: 10001;
            `;
            installBanner.innerHTML = `
                📱 Install FarmGuard for better experience! 
                <button onclick="this.parentNode.remove()" style="background: none; border: 1px solid white; color: white; padding: 4px 8px; margin-left: 8px; border-radius: 4px;">Install</button>
                <button onclick="this.parentNode.remove()" style="background: none; border: none; color: white; margin-left: 8px;">×</button>
            `;
            document.body.appendChild(installBanner);
        }
    }, 5000);
}

// Emergency Features
function initializeEmergencyFeatures() {
    // Emergency contact simulation
    const emergencyBtn = document.createElement('button');
    emergencyBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: var(--color-error);
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 24px;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
    `;
    emergencyBtn.innerHTML = '🚨';
    emergencyBtn.title = 'Emergency Help';
    emergencyBtn.onclick = () => {
        showNotification('Emergency services contacted! Help is on the way.', 'error');
        // In a real app, this would contact emergency services
    };
    document.body.appendChild(emergencyBtn);
}

// Carbon Credit Tracking
function initializeCarbonTracking() {
    const carbonData = {
        currentCredits: 125,
        monthlyIncrease: 15,
        practicesAdopted: ['Crop Rotation', 'Organic Farming', 'Water Conservation']
    };
    
    // Add carbon credit widget to dashboard
    setTimeout(() => {
        const dashboard = document.querySelector('.dashboard-container');
        if (dashboard) {
            const carbonWidget = document.createElement('div');
            carbonWidget.className = 'section';
            carbonWidget.innerHTML = `
                <h2>Carbon Credits 🌍</h2>
                <div class="card">
                    <div class="card__body">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h3>${carbonData.currentCredits} Credits</h3>
                                <p>+${carbonData.monthlyIncrease} this month</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="margin: 0; color: var(--color-success);">₹${carbonData.currentCredits * 50}</p>
                                <small>Potential earnings</small>
                            </div>
                        </div>
                        <div style="margin-top: 16px;">
                            <p><strong>Sustainable practices:</strong></p>
                            <ul style="margin: 8px 0; padding-left: 20px;">
                                ${carbonData.practicesAdopted.map(practice => `<li>${practice}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            dashboard.appendChild(carbonWidget);
        }
    }, 2000);
}

// Crop Disease Detection Simulation
function initializeDiseaseDetection() {
    // Add camera button to crops screen
    setTimeout(() => {
        const cropsHeader = document.querySelector('.crops-header');
        if (cropsHeader) {
            const cameraBtn = document.createElement('button');
            cameraBtn.className = 'btn btn--secondary btn--sm';
            cameraBtn.innerHTML = '📷 Scan Disease';
            cameraBtn.onclick = () => {
                showNotification('Camera activated for disease detection...', 'info');
                setTimeout(() => {
                    showNotification('Disease detected: Brown Spot. Treatment recommended.', 'warning');
                    // Add to alerts
                    appData.alerts.unshift({
                        type: 'disease',
                        message: 'Brown spot detected via AI scan',
                        severity: 'medium'
                    });
                }, 3000);
            };
            cropsHeader.appendChild(cameraBtn);
        }
    }, 1000);
}

// Weather Alerts System
function initializeWeatherAlerts() {
    // Check for severe weather and show alerts
    setInterval(() => {
        const tomorrow = appData.weather.forecast[1];
        if (tomorrow.rain > 70) {
            showNotification(`⚠️ Heavy rain alert for ${tomorrow.day}: ${tomorrow.rain}% chance`, 'warning');
        }
        
        if (appData.weather.current.temperature > 35) {
            showNotification('🌡️ High temperature alert: Increase irrigation', 'warning');
        }
    }, 60000); // Check every minute
}

// Equipment Management
function initializeEquipmentManagement() {
    const equipmentData = [
        { name: 'Tractor', status: 'Working', nextMaintenance: '15 days' },
        { name: 'Irrigation Pump', status: 'Needs Service', nextMaintenance: 'Overdue' },
        { name: 'Harvester', status: 'Working', nextMaintenance: '45 days' }
    ];
    
    // Add equipment section to dashboard
    setTimeout(() => {
        const dashboard = document.querySelector('.dashboard-container');
        if (dashboard) {
            const equipmentSection = document.createElement('div');
            equipmentSection.className = 'section';
            equipmentSection.innerHTML = `
                <h2>Equipment Status 🚜</h2>
                <div class="equipment-list">
                    ${equipmentData.map(equipment => `
                        <div class="card" style="margin-bottom: 12px;">
                            <div class="card__body" style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="margin: 0;">${equipment.name}</h4>
                                    <p style="margin: 4px 0; font-size: 12px;">Next service: ${equipment.nextMaintenance}</p>
                                </div>
                                <span class="status ${equipment.status === 'Working' ? 'status--success' : 'status--warning'}">
                                    ${equipment.status}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            dashboard.appendChild(equipmentSection);
        }
    }, 3000);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('FarmGuard Application Initialized');
    
    // Initialize all components
    initializeLanguageSelector();
    initializeChatbot();
    initializeVoiceInput();
    initializePWA();
    initializeEmergencyFeatures();
    initializeCarbonTracking();
    initializeDiseaseDetection();
    initializeWeatherAlerts();
    initializeEquipmentManagement();
    
    // Start data simulations
    simulateMarketUpdates();
    simulateSensorUpdates();
    
    // Update weather recommendations
    updateWeatherRecommendations();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to FarmGuard! Your revolutionary farming companion.', 'success');
    }, 1000);
    
    // Auto-update dashboard every 30 seconds
    setInterval(() => {
        if (document.getElementById('dashboardScreen').classList.contains('active')) {
            updateDashboardData();
        }
    }, 30000);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    showDashboard();
                    break;
                case '2':
                    e.preventDefault();
                    showWeather();
                    break;
                case '3':
                    e.preventDefault();
                    showCrops();
                    break;
                case '4':
                    e.preventDefault();
                    showMarket();
                    break;
                case '5':
                    e.preventDefault();
                    showChatbot();
                    break;
                case 'h':
                    e.preventDefault();
                    showNotification('Keyboard shortcuts: Ctrl+1-5 for navigation, Esc to go back');
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            // Go back to dashboard from any screen
            if (!document.getElementById('dashboardScreen').classList.contains('active') && 
                !document.getElementById('welcomeScreen').classList.contains('active')) {
                showDashboard();
            }
        }
    });
    
    console.log('All FarmGuard features initialized successfully!');
});