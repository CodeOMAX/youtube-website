const fs = require('fs');

// Real trending source: Google Trends RSS for India (no API key required)
const TRENDS_RSS_URL = 'https://trends.google.com/trending/rss?geo=IN';

// Keyword -> category mapping (used to tag each trend)
const CATEGORY_KEYWORDS = [
    { category: 'Technology', words: ['ai', 'chatgpt', 'smartphone', 'phone', 'laptop', 'app', 'tech', 'electric', 'ev', 'iphone', 'samsung', 'gadget', 'software', 'robot'] },
    { category: 'Sports', words: ['cricket', 'ipl', 'football', 'f1', 'gp', 'match', 'world cup', 'olympics', 'tennis', 'hockey', 'wpl', 'rugby'] },
    { category: 'Entertainment', words: ['movie', 'film', 'bollywood', 'web series', 'song', 'album', 'actor', 'actress', 'trailer', 'show', 'netflix', 'ott', 'thriller'] },
    { category: 'Business', words: ['stock', 'market', 'share', 'invest', 'budget', 'gdp', 'rupee', 'sensex', 'crypto', 'business', 'economy', 'startup'] },
    { category: 'Food', words: ['recipe', 'food', 'restaurant', 'dish', 'curry', 'biryani', 'sweet', 'cook'] },
    { category: 'Health', words: ['health', 'covid', 'fitness', 'disease', 'medicine', 'yoga', 'diet', 'virus', 'vaccine'] },
    { category: 'Education', words: ['exam', 'result', 'school', 'college', 'university', 'job', 'admission', 'scholarship', 'neet', 'jee', 'upsc'] },
    { category: 'Travel', words: ['travel', 'tourism', 'flight', 'destination', 'hotel', 'vacation', 'trip', 'beach'] },
    { category: 'Gaming', words: ['game', 'gaming', 'pubg', 'bgmi', 'playstation', 'xbox', 'esports', 'gta'] },
    { category: 'Music', words: ['song', 'music', 'album', 'singer', 'concert', 'lyrics', 'spotify'] }
];

function guessCategory(text) {
    const lower = text.toLowerCase();
    for (const { category, words } of CATEGORY_KEYWORDS) {
        if (words.some(w => lower.includes(w))) return category;
    }
    return 'News';
}

// Strip HTML tags and decode a few common entities
function cleanText(str) {
    if (!str) return '';
    return str
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .trim();
}

function parseTraffic(raw) {
    if (!raw) return null;
    const match = raw.replace(/[+,]/g, '').match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
}

// Minimal RSS item parser (no external deps)
function parseRss(xml) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = itemRegex.exec(xml)) !== null) {
        const block = m[1];
        const get = (tag) => {
            const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(block);
            return r ? cleanText(r[1]) : '';
        };
        const title = get('title');
        if (!title) continue;
        items.push({
            title,
            traffic: parseTraffic(get('ht:approx_traffic')),
            link: get('link'),
            picture: get('ht:picture'),
            newsTitle: get('ht:news_item_title')
        });
    }
    return items;
}

// Fallback so the page never goes blank if the fetch fails
function simulatedTopics() {
    const base = [
        { t: 'AI & ChatGPT Updates', c: 'Technology' },
        { t: 'Cricket World Cup 2026', c: 'Sports' },
        { t: 'Budget Smartphone Reviews', c: 'Technology' },
        { t: 'Bollywood Movies & Web Series', c: 'Entertainment' },
        { t: 'Stock Market & Investment Tips', c: 'Business' },
        { t: 'Indian Cooking & Recipes', c: 'Food' },
        { t: 'Fitness & Workout Routines', c: 'Health' },
        { t: 'Government Schemes & Jobs 2026', c: 'Education' },
        { t: 'Travel Vlogs & Tourism', c: 'Travel' },
        { t: 'Electric Vehicles & Auto Reviews', c: 'Technology' }
    ];
    const now = new Date().toISOString();
    return base.map((b, i) => ({
        title: b.t,
        description: `${b.t} dominating Indian trends right now.`,
        category: b.c,
        videoCount: Math.floor(50000 + Math.random() * 100000),
        growthRate: Math.floor(80 - i * 4 + Math.random() * 6),
        trending: 'hot',
        keywords: b.t.split(' '),
        lastUpdated: now
    }));
}

async function fetchTrendingData() {
    console.log('🔥 Fetching real trending topics for India from Google Trends...');
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(TRENDS_RSS_URL, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OMAXBot/1.0)' }
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        const parsed = parseRss(xml);

        if (!parsed.length) throw new Error('No items parsed from RSS');

        const now = new Date().toISOString();
        const topics = parsed.slice(0, 10).map((item, index) => {
            const traffic = item.traffic || Math.floor(40000 + Math.random() * 120000);
            const growthRate = Math.max(35, Math.min(98, 95 - index * 6 + Math.floor(Math.random() * 8)));
            const category = guessCategory(item.title + ' ' + (item.newsTitle || ''));
            return {
                title: item.title,
                description: item.newsTitle
                    ? `${item.newsTitle} — trending now in India.`
                    : `${item.title} is among the top trending searches in India right now.`,
                category,
                videoCount: traffic,
                growthRate,
                trending: growthRate >= 70 ? 'hot' : growthRate >= 50 ? 'rising' : 'steady',
                keywords: [...new Set([...item.title.split(/\s+/), category])].slice(0, 6),
                lastUpdated: now
            };
        });

        console.log(`✅ Loaded ${topics.length} real trends from Google Trends (geo=IN)`);
        return topics;
    } catch (err) {
        console.warn('⚠️ Real fetch failed (' + err.message + '), using fallback data.');
        return simulatedTopics();
    }
}

async function main() {
    try {
        const topics = await fetchTrendingData();
        const currentDate = new Date().toISOString();
        const result = {
            lastUpdated: currentDate,
            nextUpdate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            topics,
            metadata: {
                totalTopics: topics.length,
                country: 'India',
                updateFrequency: 'Every 4 hours',
                source: 'Google Trends RSS (geo=IN) — real data, with simulated fallback'
            }
        };
        fs.writeFileSync('trending-data.json', JSON.stringify(result, null, 2));
        console.log('✅ trending-data.json written successfully!');
        console.log(`📊 Total topics: ${topics.length}`);
        console.log(`⏰ Last updated: ${currentDate}`);
    } catch (error) {
        console.error('❌ Error writing trending data:', error);
        process.exit(1);
    }
}

main();
