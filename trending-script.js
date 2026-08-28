// ===================================
// Trending Topics Data
// ===================================
const trendingTopicsData = [
    {
        rank: 1,
        title: "AI Revolution & ChatGPT Alternatives",
        description: "Latest AI tools, automation, and generative AI breakthroughs dominating Indian tech space",
        category: "Technology",
        videoCount: 125000,
        views: "450M+",
        growth: "+85%",
        trend: "hot",
        keywords: ["AI", "ChatGPT", "Machine Learning", "Automation"],
        icon: "🤖"
    },
    {
        rank: 2,
        title: "Cricket World Cup 2026 Highlights",
        description: "Match highlights, player performances, and cricket analysis capturing the nation",
        category: "Sports",
        videoCount: 98000,
        views: "380M+",
        growth: "+72%",
        trend: "hot",
        keywords: ["Cricket", "World Cup", "Sports", "India"],
        icon: "🏏"
    },
    {
        rank: 3,
        title: "Budget Smartphone Reviews 2026",
        description: "Latest affordable smartphones under ₹20,000 with detailed reviews and comparisons",
        category: "Technology",
        videoCount: 87000,
        views: "320M+",
        growth: "+68%",
        trend: "hot",
        keywords: ["Smartphone", "Tech Review", "Budget", "Mobile"],
        icon: "📱"
    },
    {
        rank: 4,
        title: "Bollywood Movies & Web Series",
        description: "New releases, trailers, reviews, and behind-the-scenes content from Indian entertainment",
        category: "Entertainment",
        videoCount: 156000,
        views: "520M+",
        growth: "+55%",
        trend: "rising",
        keywords: ["Bollywood", "Movies", "Web Series", "Entertainment"],
        icon: "🎬"
    },
    {
        rank: 5,
        title: "Stock Market & Investment Tips",
        description: "Financial advice, market analysis, and investment strategies for Indian investors",
        category: "Education",
        videoCount: 65000,
        views: "280M+",
        growth: "+63%",
        trend: "rising",
        keywords: ["Stock Market", "Investment", "Finance", "Money"],
        icon: "📈"
    },
    {
        rank: 6,
        title: "Cooking & Indian Recipes",
        description: "Traditional and modern Indian recipes, cooking hacks, and food vlogs",
        category: "Lifestyle",
        videoCount: 112000,
        views: "395M+",
        growth: "+48%",
        trend: "rising",
        keywords: ["Cooking", "Recipes", "Food", "Indian Cuisine"],
        icon: "🍛"
    },
    {
        rank: 7,
        title: "Fitness & Workout Routines",
        description: "Home workouts, gym routines, yoga, and health tips trending across India",
        category: "Lifestyle",
        videoCount: 78000,
        views: "265M+",
        growth: "+52%",
        trend: "rising",
        keywords: ["Fitness", "Workout", "Yoga", "Health"],
        icon: "💪"
    },
    {
        rank: 8,
        title: "Government Schemes & Job Notifications",
        description: "Latest government job openings, exam preparation, and welfare scheme updates",
        category: "Education",
        videoCount: 92000,
        views: "310M+",
        growth: "+44%",
        trend: "steady",
        keywords: ["Government Jobs", "Exam", "Education", "Career"],
        icon: "📚"
    },
    {
        rank: 9,
        title: "Travel Vlogs & Budget Tourism",
        description: "Travel guides, budget trips, and destination reviews from across India and abroad",
        category: "Lifestyle",
        videoCount: 71000,
        views: "245M+",
        growth: "+41%",
        trend: "steady",
        keywords: ["Travel", "Tourism", "Vlog", "Adventure"],
        icon: "✈️"
    },
    {
        rank: 10,
        title: "Electric Vehicles & Auto Reviews",
        description: "EV launches, car reviews, bike comparisons, and automobile industry news",
        category: "Technology",
        videoCount: 58000,
        views: "215M+",
        growth: "+38%",
        trend: "steady",
        keywords: ["Electric Vehicle", "Car Review", "Auto", "EV"],
        icon: "🚗"
    }
];

// Category data for charts
const categoryData = {
    "Technology": 270000,
    "Entertainment": 156000,
    "Lifestyle": 261000,
    "Sports": 98000,
    "Education": 157000
};

// Growth trend data (last 7 days)
const growthTrendData = [
    { day: "Day 1", value: 1200 },
    { day: "Day 2", value: 1850 },
    { day: "Day 3", value: 2100 },
    { day: "Day 4", value: 2700 },
    { day: "Day 5", value: 3200 },
    { day: "Day 6", value: 3800 },
    { day: "Day 7", value: 4500 }
];

// ===================================
// Initialize Trending Page
// ===================================
let currentFilter = 'all';
let currentSort = 'trending';

document.addEventListener('DOMContentLoaded', () => {
    initializeTrendingPage();
    updateLastUpdateTime();
    setupEventListeners();
    renderTrendingList(trendingTopicsData);
    renderCharts();

    console.log('🔥 Trending page loaded successfully!');
});

function initializeTrendingPage() {
    // Add fade-in animations
    const heroContent = document.querySelector('.trending-hero-content');
    if (heroContent) heroContent.classList.add('fade-in');
}

// ===================================
// Update Last Update Time
// ===================================
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const dateString = now.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        lastUpdateElement.textContent = `${dateString} at ${timeString}`;
    }
}

// ===================================
// Event Listeners
// ===================================
function setupEventListeners() {
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentFilter = e.target.value;
            filterAndRenderTopics();
        });
    }

    // Sort by
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterAndRenderTopics();
        });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshData();
        });
    }
}

// ===================================
// Filter and Sort Topics
// ===================================
function filterAndRenderTopics() {
    let filteredData = [...trendingTopicsData];

    // Apply category filter
    if (currentFilter !== 'all') {
        filteredData = filteredData.filter(topic =>
            topic.category.toLowerCase() === currentFilter.toLowerCase()
        );
    }

    // Apply sorting
    if (currentSort === 'growth') {
        filteredData.sort((a, b) => {
            const growthA = parseInt(a.growth.replace(/[+%]/g, ''));
            const growthB = parseInt(b.growth.replace(/[+%]/g, ''));
            return growthB - growthA;
        });
    } else if (currentSort === 'videos') {
        filteredData.sort((a, b) => b.videoCount - a.videoCount);
    }

    renderTrendingList(filteredData);
}

// ===================================
// Render Trending List
// ===================================
function renderTrendingList(data) {
    const trendingList = document.getElementById('trendingList');
    if (!trendingList) return;

    if (data.length === 0) {
        trendingList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3 class="empty-state-title">No Topics Found</h3>
                <p class="empty-state-description">Try adjusting your filters to see more results</p>
            </div>
        `;
        return;
    }

    trendingList.innerHTML = data.map((topic, index) => `
        <div class="trending-item fade-in-up stagger-${(index % 10) + 1}">
            <div class="trending-rank ${topic.trend === 'hot' ? 'hot' : ''}">
                ${topic.rank}
            </div>
            <div class="trending-content">
                <div class="trending-header">
                    <h3 class="trending-title">
                        ${topic.icon} ${topic.title}
                    </h3>
                    <span class="trending-badge ${topic.trend}">${topic.trend.toUpperCase()}</span>
                    <span class="category-tag">${topic.category}</span>
                </div>
                <p class="trending-description">${topic.description}</p>
                <div class="trending-meta">
                    <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        ${topic.views} views
                    </div>
                    <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Last 24 hours
                    </div>
                </div>
            </div>
            <div class="trending-stats">
                <div>
                    <div class="video-count">${formatNumber(topic.videoCount)}</div>
                    <div class="video-label">Total Videos</div>
                </div>
                <div class="growth-indicator positive">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    ${topic.growth}
                </div>
            </div>
        </div>
    `).join('');

    // Update stats
    updateStatCards(data);
}

// ===================================
// Update Stat Cards
// ===================================
function updateStatCards(data) {
    const totalVideos = data.reduce((sum, topic) => sum + topic.videoCount, 0);
    const hotTopics = data.filter(topic => topic.trend === 'hot').length;
    const avgGrowth = Math.round(
        data.reduce((sum, topic) => sum + parseInt(topic.growth.replace(/[+%]/g, '')), 0) / data.length
    );

    document.getElementById('totalTopics').textContent = data.length;
    document.getElementById('hotTopics').textContent = hotTopics;
    document.getElementById('avgGrowth').textContent = `+${avgGrowth}%`;
}

// ===================================
// Render Charts
// ===================================
function renderCharts() {
    renderCategoryChart();
    renderGrowthChart();
}

function renderCategoryChart() {
    const container = document.getElementById('categoryChart');
    if (!container) return;

    const maxValue = Math.max(...Object.values(categoryData));

    const chartHTML = `
        <div class="bar-chart">
            ${Object.entries(categoryData).map(([category, value]) => {
                const height = (value / maxValue) * 100;
                return `
                    <div class="bar-item">
                        <div class="bar-value">${formatNumber(value)}</div>
                        <div class="bar" style="height: ${height}%; background: ${getCategoryGradient(category)}"></div>
                        <div class="bar-label">${category}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    container.innerHTML = chartHTML;
}

function renderGrowthChart() {
    const container = document.getElementById('growthChart');
    if (!container) return;

    const maxValue = Math.max(...growthTrendData.map(d => d.value));
    const width = 600;
    const height = 300;
    const padding = 40;

    // Calculate points for the line
    const points = growthTrendData.map((d, i) => {
        const x = padding + (i * (width - 2 * padding) / (growthTrendData.length - 1));
        const y = height - padding - ((d.value / maxValue) * (height - 2 * padding));
        return `${x},${y}`;
    }).join(' ');

    // Create area path
    const areaPoints = `${padding},${height - padding} ` + points + ` ${width - padding},${height - padding}`;

    const chartHTML = `
        <svg class="line-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:rgba(99, 102, 241, 0.3);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgba(99, 102, 241, 0);stop-opacity:1" />
                </linearGradient>
            </defs>

            <!-- Grid lines -->
            ${[0, 1, 2, 3, 4].map(i => {
                const y = padding + (i * (height - 2 * padding) / 4);
                return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
            }).join('')}

            <!-- Area -->
            <polygon points="${areaPoints}" fill="url(#areaGradient)" />

            <!-- Line -->
            <polyline points="${points}" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

            <!-- Data points -->
            ${growthTrendData.map((d, i) => {
                const x = padding + (i * (width - 2 * padding) / (growthTrendData.length - 1));
                const y = height - padding - ((d.value / maxValue) * (height - 2 * padding));
                return `
                    <circle cx="${x}" cy="${y}" r="4" fill="#6366f1" stroke="#0a0a0f" stroke-width="2"/>
                    <text x="${x}" y="${height - padding + 20}" text-anchor="middle" fill="#71717a" font-size="12">${d.day}</text>
                `;
            }).join('')}
        </svg>
    `;

    container.innerHTML = chartHTML;
}

// ===================================
// Refresh Data
// ===================================
function refreshData() {
    const refreshBtn = document.getElementById('refreshBtn');
    const originalText = refreshBtn.innerHTML;

    refreshBtn.innerHTML = '<div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div> Refreshing...';
    refreshBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        updateLastUpdateTime();
        filterAndRenderTopics();
        renderCharts();

        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;

        showNotification('Data refreshed successfully!', 'success');
    }, 1500);
}

// ===================================
// Utility Functions
// ===================================
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function getCategoryGradient(category) {
    const gradients = {
        'Technology': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'Entertainment': 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        'Sports': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        'Education': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'Lifestyle': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    };
    return gradients[category] || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'success' ? '#10b981' : '#f59e0b'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================================
// Auto-refresh every 5 minutes
// ===================================
setInterval(() => {
    updateLastUpdateTime();
}, 300000); // 5 minutes

// ===================================
// Search Functionality (Optional Enhancement)
// ===================================
function searchTopics(query) {
    const filteredData = trendingTopicsData.filter(topic =>
        topic.title.toLowerCase().includes(query.toLowerCase()) ||
        topic.description.toLowerCase().includes(query.toLowerCase()) ||
        topic.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
    );
    renderTrendingList(filteredData);
}

// ===================================
// Export Data (Optional)
// ===================================
function exportTrendingData() {
    const dataStr = JSON.stringify(trendingTopicsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trending-topics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

console.log('🔥 Trending topics loaded:', trendingTopicsData.length);