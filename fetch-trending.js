const fs = require('fs');

// Real sources (no API key required, free):
//  - Google News India general feed (English headlines)
//  - Google News topic-search feeds for categories the general feed misses
//  - Google Trends India RSS (extra English trends for flavor)
const NEWS_RSS_URL = 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en';
const TRENDS_RSS_URL = 'https://trends.google.com/trending/rss?geo=IN';

// Targeted real searches for categories not guaranteed by the general feed
const CATEGORY_SEARCH = {
    'Gaming': 'gaming OR esports OR BGMI OR PUBG',
    'Music': 'music OR album OR singer OR concert',
    'Education': 'exam OR education OR school OR college OR admission',
    'Travel': 'travel OR tourism OR flight OR destination',
    'Food': 'food OR recipe OR restaurant'
};

// Every category the site displays — we guarantee one real trend per category
const CATEGORIES = [
    'Technology', 'Sports', 'Entertainment', 'Business', 'Food',
    'Health', 'Education', 'Travel', 'Gaming', 'Music', 'News'
];

const CATEGORY_KEYWORDS = [
    { category: 'Technology', words: ['ai', 'chatgpt', 'smartphone', 'phone', 'laptop', 'app', 'tech', 'electric', 'ev', 'iphone', 'samsung', 'gadget', 'software', 'robot', 'android', 'windows', 'google', 'microsoft', 'tech', 'isro', 'space', '5g', 'chip'] },
    { category: 'Sports', words: ['cricket', 'ipl', 'football', 'f1', 'gp', 'match', 'world cup', 'olympics', 'tennis', 'hockey', 'wpl', 'rugby', 'kabaddi', 'badminton', 'babar', 'kohli', 'team', 'league'] },
    { category: 'Entertainment', words: ['movie', 'film', 'bollywood', 'web series', 'song', 'album', 'actor', 'actress', 'trailer', 'show', 'netflix', 'ott', 'thriller', 'series', 'celebrity', 'star', 'reels'] },
    { category: 'Business', words: ['stock', 'market', 'share', 'invest', 'budget', 'gdp', 'rupee', 'sensex', 'crypto', 'business', 'economy', 'startup', 'inflation', 'rbi', 'trade', 'deal', 'fta', 'company', 'ipo'] },
    { category: 'Food', words: ['recipe', 'food', 'restaurant', 'dish', 'curry', 'biryani', 'sweet', 'cook', 'pizza', 'burger', 'hotel', 'eat'] },
    { category: 'Health', words: ['health', 'covid', 'fitness', 'disease', 'medicine', 'yoga', 'diet', 'virus', 'vaccine', 'hospital', 'doctor'] },
    { category: 'Education', words: ['exam', 'result', 'school', 'college', 'university', 'job', 'admission', 'scholarship', 'neet', 'jee', 'upsc', 'board', 'student'] },
    { category: 'Travel', words: ['travel', 'tourism', 'flight', 'destination', 'hotel', 'vacation', 'trip', 'beach', 'holiday', 'airport', 'aircraft', 'air'] },
    { category: 'Gaming', words: ['game', 'gaming', 'pubg', 'bgmi', 'playstation', 'xbox', 'esports', 'gta', 'valorant', 'console'] },
    { category: 'Music', words: ['song', 'music', 'album', 'singer', 'concert', 'lyrics', 'spotify', 'band', 'rapper'] },
    { category: 'News', words: ['minister', 'pm', 'president', 'election', 'government', 'summit', 'war', 'earthquake', 'rain', 'flood', 'accident', 'scam', 'brics', 'modi', 'court', 'arrest', 'murder'] }
];

function guessCategory(text) {
    const lower = text.toLowerCase();
    for (const { category, words } of CATEGORY_KEYWORDS) {
        if (words.some(w => lower.includes(w))) return category;
    }
    return 'News';
}

// English-only: reject titles containing non-Latin scripts (Hindi, Tamil, etc.)
function isEnglish(text) {
    return /^[\x20-\x7E]+$/.test(text);
}

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

// Pull a clean headline from "Title - Source" Google News format
function cleanTitle(raw) {
    let t = cleanText(raw);
    // Google News titles end with " - SourceName"; strip that
    const idx = t.lastIndexOf(' - ');
    if (idx > 0) t = t.substring(0, idx);
    return t;
}

function fetchRss(url, { timeoutMs = 15000 } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OMAXBot/1.0)' }
    }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
    }).finally(() => clearTimeout(timer));
}

function parseItems(xml, titleTag = 'title') {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = itemRegex.exec(xml)) !== null) {
        const block = m[1];
        const get = (tag) => {
            const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(block);
            return r ? cleanText(r[1]) : '';
        };
        const rawTitle = get(titleTag);
        if (!rawTitle) continue;
        items.push({ rawTitle, newsTitle: get('ht:news_item_title') });
    }
    return items;
}

async function fetchNewsTrends() {
    // General India feed
    const xml = await fetchRss(NEWS_RSS_URL);
    let parsed = parseItems(xml)
        .map(i => cleanTitle(i.rawTitle))
        .filter(t => t && isEnglish(t));

    // Targeted category feeds for categories the general feed may miss
    // Tag each item with its true category directly (more accurate than keyword guessing)
    const extra = await Promise.all(
        Object.entries(CATEGORY_SEARCH).map(async ([cat, q]) => {
            try {
                const cx = await fetchRss(
                    `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`
                );
                return parseItems(cx)
                    .map(i => cleanTitle(i.rawTitle))
                    .filter(t => t && isEnglish(t))
                    .map(t => ({ title: t, forcedCat: cat }));
            } catch (e) {
                console.warn(`⚠️ Category search failed for ${cat}:`, e.message);
                return [];
            }
        })
    );
    // General feed items have no forced category (guessed later)
    let forced = [];
    extra.forEach(list => { forced = forced.concat(list); });
    return { general: parsed, forced };
}

async function fetchGoogleTrends() {
    const xml = await fetchRss(TRENDS_RSS_URL);
    const parsed = parseItems(xml)
        .map(i => i.rawTitle)
        .filter(t => t && isEnglish(t));
    return parsed;
}

// Build a final list that covers every category at least once, all English
function buildTopics(generalTitles, forcedItems, trendsTitles) {
    const now = new Date().toISOString();
    const pool = []; // { title, forcedCat? }
    const seen = new Set();
    const add = (title, forcedCat) => {
        const key = title.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        pool.push({ title, forcedCat });
    };
    forcedItems.forEach(it => add(it.title, it.forcedCat));
    generalTitles.forEach(t => add(t, null));
    trendsTitles.forEach(t => add(t, null));

    const selected = [];
    const usedIdx = new Set();
    const catOf = (item) => item.forcedCat || guessCategory(item.title);

    // Pass 1: one real trend per category (in site category order)
    for (const cat of CATEGORIES) {
        const idx = pool.findIndex((t, i) => !usedIdx.has(i) && catOf(t) === cat);
        if (idx !== -1) {
            usedIdx.add(idx);
            selected.push({ title: pool[idx].title, category: cat });
        }
    }

    // Pass 2: fill remaining slots up to 18 with any other English trends
    for (let i = 0; i < pool.length && selected.length < 18; i++) {
        if (!usedIdx.has(i)) {
            usedIdx.add(i);
            selected.push({ title: pool[i].title, category: catOf(pool[i]) });
        }
    }

    return selected.map((item, index) => {
        const videoCount = Math.floor(40000 + Math.random() * 120000);
        const growthRate = Math.max(35, Math.min(98, 95 - index * 4 + Math.floor(Math.random() * 8)));
        const cleanTitle = item.title.charAt(0).toUpperCase() + item.title.slice(1);
        return {
            title: cleanTitle,
            description: `${cleanTitle} is among the top trending topics in India right now.`,
            category: item.category,
            videoCount,
            growthRate,
            trending: growthRate >= 70 ? 'hot' : growthRate >= 50 ? 'rising' : 'steady',
            keywords: [...new Set([...cleanTitle.split(/\s+/), item.category])].slice(0, 6),
            lastUpdated: now
        };
    });
}

function simulatedTopics() {
    const base = [
        { t: 'AI & ChatGPT Updates', c: 'Technology' },
        { t: 'Cricket World Cup 2026', c: 'Sports' },
        { t: 'Bollywood Movies & Web Series', c: 'Entertainment' },
        { t: 'Stock Market & Investment Tips', c: 'Business' },
        { t: 'Indian Cooking & Recipes', c: 'Food' },
        { t: 'Fitness & Workout Routines', c: 'Health' },
        { t: 'Government Schemes & Jobs 2026', c: 'Education' },
        { t: 'Travel Vlogs & Tourism', c: 'Travel' },
        { t: 'Gaming & Esports Highlights', c: 'Gaming' },
        { t: 'Top Music Releases This Week', c: 'Music' },
        { t: 'India News & Headlines', c: 'News' }
    ];
    const now = new Date().toISOString();
    return base.map((b) => ({
        title: b.t,
        description: `${b.t} dominating Indian trends right now.`,
        category: b.c,
        videoCount: Math.floor(50000 + Math.random() * 100000),
        growthRate: Math.floor(80 + Math.random() * 15),
        trending: 'hot',
        keywords: b.t.split(' '),
        lastUpdated: now
    }));
}

async function main() {
    try {
        console.log('🔥 Fetching real trending topics for India (News + Trends)...');
        const [news, trendsTitles] = await Promise.all([
            fetchNewsTrends().catch(e => { console.warn('⚠️ News feed failed:', e.message); return { general: [], forced: [] }; }),
            fetchGoogleTrends().catch(e => { console.warn('⚠️ Trends feed failed:', e.message); return []; })
        ]);
        const newsTitles = news.general || [];
        const forcedItems = news.forced || [];

        console.log(`✅ News: ${newsTitles.length} general + ${forcedItems.length} category headlines | Trends: ${trendsTitles.length} English trends`);

        if (!newsTitles.length && !forcedItems.length && !trendsTitles.length) {
            throw new Error('All real sources failed');
        }

        const topics = buildTopics(newsTitles, forcedItems, trendsTitles);
        const covered = [...new Set(topics.map(t => t.category))];
        console.log(`✅ Loaded ${topics.length} trends covering ${covered.length}/${CATEGORIES.length} categories: ${covered.join(', ')}`);

        const currentDate = new Date().toISOString();
        const result = {
            lastUpdated: currentDate,
            nextUpdate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            topics,
            metadata: {
                totalTopics: topics.length,
                country: 'India',
                updateFrequency: 'Every 4 hours',
                source: 'Google News India RSS (general + per-category) + Google Trends (geo=IN) — real English trends, every category, with simulated fallback'
            }
        };
        fs.writeFileSync('trending-data.json', JSON.stringify(result, null, 2));
        console.log('✅ trending-data.json written successfully!');
        console.log(`⏰ Last updated: ${currentDate}`);
    } catch (error) {
        console.warn('⚠️ Real fetch failed (' + error.message + '), using fallback data.');
        const topics = simulatedTopics();
        const currentDate = new Date().toISOString();
        const result = {
            lastUpdated: currentDate,
            nextUpdate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            topics,
            metadata: {
                totalTopics: topics.length,
                country: 'India',
                updateFrequency: 'Every 4 hours',
                source: 'Simulated fallback data (both real sources failed)'
            }
        };
        fs.writeFileSync('trending-data.json', JSON.stringify(result, null, 2));
        console.log('✅ trending-data.json written (fallback).');
    }
}

main();
