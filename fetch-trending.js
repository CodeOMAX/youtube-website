const fs = require('fs');

// Simulated trending data fetcher (no external dependencies needed)
async function fetchTrendingData() {
    console.log('🔥 Fetching trending topics for India...');

    const currentDate = new Date().toISOString();

    // Simulated trending topics with randomized data
    const trendingTopics = [
        {
            title: "AI Revolution & ChatGPT Updates",
            description: "Latest AI developments and generative AI breakthroughs dominating Indian tech space",
            category: "Technology",
            videoCount: Math.floor(120000 + Math.random() * 20000),
            growthRate: Math.floor(75 + Math.random() * 15),
            trending: "hot",
            keywords: ["AI", "ChatGPT", "Technology", "Innovation"],
            lastUpdated: currentDate
        },
        {
            title: "Cricket World Cup 2026",
            description: "ICC Cricket World Cup coverage, match highlights, and player performances",
            category: "Sports",
            videoCount: Math.floor(95000 + Math.random() * 15000),
            growthRate: Math.floor(70 + Math.random() * 12),
            trending: "hot",
            keywords: ["Cricket", "World Cup", "Sports", "ICC"],
            lastUpdated: currentDate
        },
        {
            title: "Budget Smartphone Reviews 2026",
            description: "Latest affordable smartphones under ₹20,000 with detailed reviews",
            category: "Technology",
            videoCount: Math.floor(85000 + Math.random() * 12000),
            growthRate: Math.floor(60 + Math.random() * 15),
            trending: "rising",
            keywords: ["Smartphone", "Tech Review", "Budget", "Mobile"],
            lastUpdated: currentDate
        },
        {
            title: "Bollywood Movies & Web Series",
            description: "Latest Bollywood releases, OTT content, and entertainment news",
            category: "Entertainment",
            videoCount: Math.floor(105000 + Math.random() * 18000),
            growthRate: Math.floor(55 + Math.random() * 10),
            trending: "rising",
            keywords: ["Bollywood", "Movies", "Web Series", "Entertainment"],
            lastUpdated: currentDate
        },
        {
            title: "Stock Market & Investment Tips",
            description: "Share market analysis, mutual funds, and investment strategies for 2026",
            category: "Business",
            videoCount: Math.floor(63000 + Math.random() * 8000),
            growthRate: Math.floor(58 + Math.random() * 12),
            trending: "rising",
            keywords: ["Stock Market", "Investment", "Finance", "Trading"],
            lastUpdated: currentDate
        },
        {
            title: "Indian Cooking & Recipes",
            description: "Traditional and modern Indian recipes, cooking tips, and food vlogs",
            category: "Food",
            videoCount: Math.floor(110000 + Math.random() * 15000),
            growthRate: Math.floor(45 + Math.random() * 10),
            trending: "steady",
            keywords: ["Cooking", "Recipe", "Indian Food", "Cuisine"],
            lastUpdated: currentDate
        },
        {
            title: "Fitness & Workout Routines",
            description: "Home workouts, gym training, yoga, and fitness transformation stories",
            category: "Health",
            videoCount: Math.floor(76000 + Math.random() * 10000),
            growthRate: Math.floor(48 + Math.random() * 12),
            trending: "steady",
            keywords: ["Fitness", "Workout", "Gym", "Health"],
            lastUpdated: currentDate
        },
        {
            title: "Government Schemes & Jobs 2026",
            description: "Latest government job notifications, exam preparation, and welfare schemes",
            category: "Education",
            videoCount: Math.floor(90000 + Math.random() * 12000),
            growthRate: Math.floor(50 + Math.random() * 8),
            trending: "steady",
            keywords: ["Government Jobs", "Exams", "Education", "Schemes"],
            lastUpdated: currentDate
        },
        {
            title: "Travel Vlogs & Tourism",
            description: "India travel guides, destination reviews, and travel tips",
            category: "Travel",
            videoCount: Math.floor(69000 + Math.random() * 9000),
            growthRate: Math.floor(38 + Math.random() * 10),
            trending: "steady",
            keywords: ["Travel", "Tourism", "Vlog", "India"],
            lastUpdated: currentDate
        },
        {
            title: "Electric Vehicles & Auto Reviews",
            description: "EV launches, car reviews, and automotive industry news in India",
            category: "Technology",
            videoCount: Math.floor(56000 + Math.random() * 8000),
            growthRate: Math.floor(42 + Math.random() * 8),
            trending: "steady",
            keywords: ["Electric Vehicle", "Car", "Auto", "Review"],
            lastUpdated: currentDate
        }
    ];

    // Sort by growth rate (hottest first)
    trendingTopics.sort((a, b) => b.growthRate - a.growthRate);

    const result = {
        lastUpdated: currentDate,
        nextUpdate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
        topics: trendingTopics,
        metadata: {
            totalTopics: trendingTopics.length,
            country: "India",
            updateFrequency: "Every 4 hours",
            source: "Simulated data (replace with real API)"
        }
    };

    return result;
}

// Main execution
async function main() {
    try {
        console.log('🚀 Starting trending data fetch...');
        const data = await fetchTrendingData();

        // Write to JSON file
        fs.writeFileSync('trending-data.json', JSON.stringify(data, null, 2));
        console.log('✅ Trending data updated successfully!');
        console.log(`📊 Total topics: ${data.topics.length}`);
        console.log(`⏰ Last updated: ${data.lastUpdated}`);
        console.log(`🔄 Next update: ${data.nextUpdate}`);

    } catch (error) {
        console.error('❌ Error fetching trending data:', error);
        process.exit(1);
    }
}

main();
