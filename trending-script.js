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
            growthRate: topic.growthRate,
            trend: getTrendStatus(topic.growthRate),
            keywords: topic.keywords,
            icon: categoryIcons[topic.category] || '📊'
        }));

        console.log('✅ Trending data loaded:', trendingTopicsData.length, 'topics');
        updateLastUpdateTime();
        return true;

    } catch (error) {
        console.error('❌ Error loading trending data:', error);
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
        updateElement.textContent = timeAgo;
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
            description: "Latest AI tools and generative AI breakthroughs",
            category: "Technology",
            videoCount: 125000,
            views: "450M+",
            growth: "+85%",
            growthRate: 85,
            trend: "hot",
            keywords: ["AI", "ChatGPT", "Machine Learning"],
            icon: "🤖"
        },
        {
            rank: 2,
            title: "Cricket World Cup 2026",
            description: "Match highlights and player performances",
            category: "Sports",
            videoCount: 98000,
            views: "380M+",
            growth: "+72%",
            growthRate: 72,
            trend: "hot",
            keywords: ["Cricket", "World Cup", "Sports"],
            icon: "🏏"
        }
    ];
    lastUpdateTime = new Date();
}

// ===================================
// Render Trending Topics
// ===================================
const trendingGrid = document.getElementById('trendingGrid');
let currentFilter = 'all';
let currentSort = 'trending';

function renderTrendingTopics(topics = trendingTopicsData) {
    if (!trendingGrid) return;

    if (topics.length === 0) {
        trendingGrid.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-secondary);">No trending topics found</p>';
        return;
    }

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
                <span class="category-tag">${topic.category}</span>
                <div class="trending-stats">
                    <span class="stat-item">
                        📊 ${formatNumber(topic.videoCount)} videos
                    </span>
                    <span class="stat-item">
                        📈 ${topic.growth}
                    </span>
                </div>
            </div>
            <div class="trending-keywords">
                ${topic.keywords.map(kw => `<span class="keyword-tag">#${kw}</span>`).join('')}
            </div>
        </div>
    `).join('');
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
}

function applySorting(topics) {
    let sorted = [...topics];

    switch(currentSort) {
        case 'growth':
            sorted.sort((a, b) => b.growthRate - a.growthRate);
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
    renderCharts(sorted);
}

// ===================================
// Chart Rendering
// ===================================
function renderCharts(topics = trendingTopicsData) {
    renderCategoryChart(topics);
    renderGrowthChart(topics);
}

function renderCategoryChart(topics) {
    const chartContainer = document.getElementById('categoryChart');
    if (!chartContainer) return;

    // Group by category and sum video counts
    const categoryData = {};
    topics.forEach(topic => {
        if (!categoryData[topic.category]) {
            categoryData[topic.category] = 0;
        }
        categoryData[topic.category] += topic.videoCount;
    });

    // Sort by video count
    const sortedCategories = Object.entries(categoryData)
        .sort((a, b) => b[1] - a[1]);

    const maxValue = Math.max(...sortedCategories.map(c => c[1]));

    chartContainer.innerHTML = sortedCategories.map(([category, count]) => {
        const percentage = (count / maxValue) * 100;
        return `
            <div class="chart-bar-container">
                <div class="chart-label">
                    <span>${categoryIcons[category] || '📊'} ${category}</span>
                    <span class="chart-value">${formatNumber(count)}</span>
                </div>
                <div class="chart-bar">
                    <div class="chart-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderGrowthChart(topics) {
    const chartContainer = document.getElementById('growthChart');
    if (!chartContainer) return;

    // Sort by growth rate
    const sortedByGrowth = [...topics]
        .sort((a, b) => b.growthRate - a.growthRate)
        .slice(0, 5); // Top 5

    const maxGrowth = Math.max(...sortedByGrowth.map(t => t.growthRate));

    chartContainer.innerHTML = sortedByGrowth.map(topic => {
        const percentage = (topic.growthRate / maxGrowth) * 100;
        return `
            <div class="chart-bar-container">
                <div class="chart-label">
                    <span>${topic.icon} ${topic.title.substring(0, 30)}...</span>
                    <span class="chart-value">+${topic.growthRate}%</span>
                </div>
                <div class="chart-bar">
                    <div class="chart-bar-fill growth" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// ===================================
// Refresh Data
// ===================================
async function refreshTrendingData() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.classList.add('spinning');
        refreshBtn.disabled = true;
    }

    const success = await loadTrendingData();

    if (success) {
        renderTrendingTopics();
        renderCharts();
        showNotification('✅ Trending data refreshed!', 'success');
    } else {
        showNotification('⚠️ Using cached data', 'warning');
    }

    if (refreshBtn) {
        setTimeout(() => {
            refreshBtn.classList.remove('spinning');
            refreshBtn.disabled = false;
        }, 1000);
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
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
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

    // Render topics and charts
    renderTrendingTopics();
    renderCharts();

    // Event listeners for dropdowns
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => filterTopics(e.target.value));
    }

    const sortBySelect = document.getElementById('sortBy');
    if (sortBySelect) {
        sortBySelect.addEventListener('change', (e) => sortTopics(e.target.value));
    }

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshTrendingData);
    }

    // Auto-refresh every 4 hours
    setInterval(refreshTrendingData, 4 * 60 * 60 * 1000);

    console.log('✅ Trending page initialized!');
});

// Update timestamp every minute
setInterval(updateLastUpdateTime, 60000);
