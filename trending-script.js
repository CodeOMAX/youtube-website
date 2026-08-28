// ============================
// DYNAMIC TRENDING TOPICS LOADER
// Auto-updates every 4 hours via GitHub Actions
// ============================

let trendingTopicsData = [];
let lastUpdateTime = null;

// Category icons mapping
const categoryIcons = {
    'Technology': '🤖',
    'Sports': '🏏',
    'Entertainment': '🎬',
    'Business': '📈',
    'Food': '🍛',
    'Health': '💪',
    'Education': '📚',
    'Travel': '✈️',
    'Gaming': '🎮',
    'Music': '🎵',
    'News': '📰'
};

// Status badge mapping
const getTrendStatus = (growthRate) => {
    if (growthRate >= 70) return 'hot';
    if (growthRate >= 50) return 'rising';
    return 'steady';
};

// Load trending data from JSON file
async function loadTrendingData() {
    try {
        const response = await fetch('trending-data.json');
        if (!response.ok) {
            throw new Error('Failed to load trending data');
        }

        const data = await response.json();
        lastUpdateTime = new Date(data.lastUpdated);

        // Transform data to match existing format
        trendingTopicsData = data.topics.map((topic, index) => ({
            rank: index + 1,
            title: topic.title,
            description: topic.description,
            category: topic.category,
            videoCount: topic.videoCount,
            views: formatViews(topic.videoCount),
            growth: `+${topic.growthRate}%`,
            trend: getTrendStatus(topic.growthRate),
            keywords: topic.keywords,
            icon: categoryIcons[topic.category] || '📊'
        }));

        console.log('✅ Trending data loaded:', trendingTopicsData.length, 'topics');
        updateLastUpdateTime();
        return true;

    } catch (error) {
        console.error('❌ Error loading trending data:', error);
        // Fallback to static data if fetch fails
        loadFallbackData();
        return false;
    }
}

// Format video count to views
function formatViews(count) {
    if (count >= 1000000) {
        return `${Math.floor(count / 1000000)}M+`;
    } else if (count >= 1000) {
        return `${Math.floor(count / 1000)}K+`;
    }
    return `${count}+`;
}

// Update last update timestamp
function updateLastUpdateTime() {
    const updateElement = document.getElementById('lastUpdate');
    if (updateElement && lastUpdateTime) {
        const timeAgo = getTimeAgo(lastUpdateTime);
        updateElement.textContent = `Last updated: ${timeAgo}`;
    }
}

// Calculate time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

// Fallback data if JSON fails to load
function loadFallbackData() {
    console.log('⚠️ Using fallback static data');
    trendingTopicsData = [
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
            description: "Share market analysis, mutual funds, and investment strategies for Indian investors",
            category: "Business",
            videoCount: 65000,
            views: "240M+",
            growth: "+63%",
            trend: "rising",
            keywords: ["Stock Market", "Investment", "Finance", "Trading"],
            icon: "📈"
        },
        {
            rank: 6,
            title: "Indian Cooking & Traditional Recipes",
            description: "Authentic Indian dishes, street food, and cooking tutorials trending across platforms",
            category: "Food",
            videoCount: 112000,
            views: "410M+",
            growth: "+48%",
            trend: "steady",
            keywords: ["Cooking", "Recipe", "Indian Food", "Cuisine"],
            icon: "🍛"
        },
        {
            rank: 7,
            title: "Fitness & Workout Routines",
            description: "Home workouts, gym training, yoga, and fitness transformation stories",
            category: "Health",
            videoCount: 78000,
            views: "290M+",
            growth: "+52%",
            trend: "steady",
            keywords: ["Fitness", "Workout", "Gym", "Health"],
            icon: "💪"
        },
        {
            rank: 8,
            title: "Government Schemes & Job Exams",
            description: "Latest government job notifications, exam preparation, and welfare scheme updates",
            category: "Education",
            videoCount: 92000,
            views: "335M+",
            growth: "+47%",
            trend: "steady",
            keywords: ["Government Jobs", "Exams", "Education", "Schemes"],
            icon: "📚"
        },
        {
            rank: 9,
            title: "Travel Vlogs & Hidden Destinations",
            description: "Exploring India's beauty - travel guides, budget trips, and adventure vlogs",
            category: "Travel",
            videoCount: 71000,
            views: "265M+",
            growth: "+41%",
            trend: "steady",
            keywords: ["Travel", "Tourism", "Vlog", "India"],
            icon: "✈️"
        },
        {
            rank: 10,
            title: "Electric Vehicles & Auto Industry",
            description: "EV launches, car reviews, and automotive industry updates shaping India's future",
            category: "Technology",
            videoCount: 58000,
            views: "215M+",
            growth: "+45%",
            trend: "steady",
            keywords: ["Electric Vehicle", "Car", "Auto", "Review"],
            icon: "🚗"
        }
    ];
    lastUpdateTime = new Date();
}

// Rest of your existing code continues here...
// (All the rendering functions, filters, charts etc.)

// ===================================
// Render Trending Topics
// ===================================
const trendingGrid = document.getElementById('trendingGrid');
let currentFilter = 'all';
let currentSort = 'trending';

function renderTrendingTopics(topics = trendingTopicsData) {
    if (!trendingGrid) return;

    trendingGrid.innerHTML = topics.map(topic => `
        <div class="trending-card" data-category="${topic.category.toLowerCase()}" data-trend="${topic.trend}">
            <div class="trending-rank">
                <span class="rank-number">#${topic.rank}</span>
                <span class="trend-badge ${topic.trend}">${getTrendBadge(topic.trend)}</span>
            </div>
            <div class="trending-icon">${topic.icon}</div>
            <h3 class="trending-title">${topic.title}</h3>
            <p class="trending-description">${topic.description}</p>
            <div class="trending-meta">
                <span class="category-tag ${topic.category.toLowerCase()}">${topic.category}</span>
                <div class="trending-stats">
                    <span class="stat-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        ${topic.views}
                    </span>
                    <span class="stat-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                            <polyline points="16 7 22 7 22 13"></polyline>
                        </svg>
                        ${topic.growth}
                    </span>
                    <span class="stat-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        ${formatNumber(topic.videoCount)}
                    </span>
                </div>
            </div>
            <div class="trending-keywords">
                ${topic.keywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
            </div>
        </div>
    `).join('');

    // Add stagger animation
    const cards = document.querySelectorAll('.trending-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
    });
}

function getTrendBadge(trend) {
    const badges = {
        hot: '🔥 Hot',
        rising: '📈 Rising',
        steady: '📊 Steady'
    };
    return badges[trend] || '📊 Steady';
}

function formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

// ===================================
// Filter & Sort Functions
// ===================================
function filterTopics(category) {
    currentFilter = category;
    let filteredTopics = trendingTopicsData;

    if (category !== 'all') {
        filteredTopics = trendingTopicsData.filter(topic =>
            topic.category.toLowerCase() === category.toLowerCase()
        );
    }

    applySorting(filteredTopics);
    updateActiveFilter();
}

function sortTopics(sortBy) {
    currentSort = sortBy;
    let sortedTopics = [...trendingTopicsData];

    if (currentFilter !== 'all') {
        sortedTopics = sortedTopics.filter(topic =>
            topic.category.toLowerCase() === currentFilter.toLowerCase()
        );
    }

    applySorting(sortedTopics);
    updateActiveSort();
}

function applySorting(topics) {
    let sorted = [...topics];

    switch(currentSort) {
        case 'growth':
            sorted.sort((a, b) => parseInt(b.growth) - parseInt(a.growth));
            break;
        case 'videos':
            sorted.sort((a, b) => b.videoCount - a.videoCount);
            break;
        case 'trending':
        default:
            // Already sorted by rank
            break;
    }

    renderTrendingTopics(sorted);
}

function updateActiveFilter() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === currentFilter);
    });
}

function updateActiveSort() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === currentSort);
    });
}

// ===================================
// Refresh Data
// ===================================
async function refreshTrendingData() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.classList.add('spinning');
    }

    const success = await loadTrendingData();

    if (success) {
        renderTrendingTopics();
        showNotification('✅ Trending data refreshed!', 'success');
    } else {
        showNotification('⚠️ Using cached data', 'warning');
    }

    if (refreshBtn) {
        setTimeout(() => refreshBtn.classList.remove('spinning'), 1000);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: var(--primary);
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================================
// Initialize on Page Load
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing trending page...');

    // Load data first
    await loadTrendingData();

    // Render topics
    renderTrendingTopics();

    // Event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterTopics(btn.dataset.category));
    });

    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => sortTopics(btn.dataset.sort));
    });

    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshTrendingData);
    }

    // Auto-refresh every 4 hours
    setInterval(refreshTrendingData, 4 * 60 * 60 * 1000);

    console.log('✅ Trending page initialized!');
});

// Update timestamp every minute
setInterval(updateLastUpdateTime, 60000);
