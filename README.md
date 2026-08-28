# YouTube Channel Website

A stunning, modern personal website for your YouTube channel with smooth animations, responsive design, and professional aesthetics.

## 🎨 Features

- **Modern Design**: Sleek, minimal interface with vibrant gradient accents
- **Smooth Animations**: Hover effects, transitions, and scroll-based animations
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Fast loading with lazy loading and debounced scroll events
- **SEO Ready**: Semantic HTML and meta tags for better search visibility
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🎨 Color Palette

The website uses a vibrant yet professional color scheme:

- **Primary**: `#6366f1` (Indigo) - Main brand color
- **Secondary**: `#ec4899` (Pink) - Accent color
- **Accent**: `#8b5cf6` (Purple) - Additional highlights
- **Background**: Dark theme with `#0a0a0f` base
- **Gradients**: Smooth color transitions for visual depth

## 📁 File Structure

```
youtube-website/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Interactive functionality
└── README.md          # Documentation
```

## 🚀 Quick Start

### Option 1: Open Locally

1. Open `index.html` in your browser
2. That's it! No build process needed.

### Option 2: Use a Local Server

For better performance and to test features like service workers:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 🌐 Deployment Options

### GitHub Pages (Recommended)

1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Select branch `main` and folder `/ (root)`
5. Your site will be live at `https://yourusername.github.io/your-repo/`

### Netlify

1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your project folder to Netlify
3. Your site is live instantly with a custom URL
4. **Optional**: Connect to GitHub for automatic deployments

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Your site is deployed!

### Traditional Hosting (cPanel, FTP)

1. Compress your files into a ZIP
2. Upload to your hosting via FTP or File Manager
3. Extract in your `public_html` or `www` directory

## ✏️ Customization Guide

### 1. Update Your Information

**Replace placeholder content:**

- `index.html` line 19: Change `YourChannel` to your channel name
- `index.html` line 38: Update navigation links
- `index.html` line 53-55: Edit hero title and description
- `index.html` lines 68-78: Update subscriber stats
- `index.html` line 86: Replace YouTube embed URL
- `index.html` lines 186-192: Add your profile photo and bio
- `index.html` line 257: Update email address
- Footer: Update all branding

### 2. Customize Colors

Edit `styles.css` (lines 6-16):

```css
:root {
    --primary: #6366f1;        /* Your brand color */
    --secondary: #ec4899;      /* Accent color */
    --accent: #8b5cf6;         /* Additional highlights */
}
```

### 3. Add Your Videos

Edit `script.js` (lines 50-97) to add your real video data:

```javascript
const videoData = [
    {
        id: 1,
        title: "Your Video Title",
        thumbnail: "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
        duration: "15:42",
        views: "125K",
        date: "2 days ago",
        url: "https://youtube.com/watch?v=VIDEO_ID"
    },
    // Add more videos...
];
```

**Pro Tip**: Get YouTube thumbnails using this URL format:
```
https://img.youtube.com/vi/[VIDEO_ID]/maxresdefault.jpg
```

### 4. Add Blog Posts

Edit `script.js` (lines 125-157) to add your blog content.

### 5. Connect Social Media

Update social links in `index.html` (lines 263-287):

```html
<a href="https://youtube.com/@yourchannel" class="social-link">
<a href="https://twitter.com/yourhandle" class="social-link">
<a href="https://instagram.com/yourhandle" class="social-link">
<a href="https://discord.gg/yourinvite" class="social-link">
```

### 6. Setup Contact Form

The form currently logs to console. To make it functional:

**Option A: Use Formspree** (Easy, Free)
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Option B: Use Netlify Forms** (If hosting on Netlify)
```html
<form name="contact" method="POST" data-netlify="true">
```

**Option C: Backend Integration**
Edit `script.js` line 168 to send data to your API endpoint.

## 📊 Adding YouTube Data Automatically

### Using YouTube Data API v3

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add this script to fetch your videos:

```javascript
const API_KEY = 'YOUR_API_KEY';
const CHANNEL_ID = 'YOUR_CHANNEL_ID';

async function fetchYouTubeVideos() {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`
    );
    const data = await response.json();
    return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        url: `https://youtube.com/watch?v=${item.id.videoId}`
    }));
}
```

## 🎯 SEO Optimization

### Update Meta Tags

Edit `index.html` head section:

```html
<meta name="description" content="Your channel description">
<meta name="keywords" content="your, keywords, here">
<meta property="og:title" content="Your Channel Name">
<meta property="og:description" content="Your description">
<meta property="og:image" content="https://yoursite.com/preview.jpg">
<meta property="og:url" content="https://yoursite.com">
<meta name="twitter:card" content="summary_large_image">
```

### Add Structured Data

Add this before closing `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Name",
  "url": "https://yoursite.com",
  "sameAs": [
    "https://youtube.com/@yourchannel",
    "https://twitter.com/yourhandle"
  ]
}
</script>
```

## 🔧 Advanced Customization

### Enable Custom Cursor

Uncomment lines 256-273 in `script.js`

### Add Theme Toggle

Uncomment lines 315-322 in `script.js` for light/dark mode switching

### Google Analytics

Add before closing `</head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🎨 Font Customization

Current fonts:
- **Headings**: Space Grotesk
- **Body**: Inter

To change fonts, update the Google Fonts link in `index.html` line 11 and CSS variables.

## 🐛 Troubleshooting

**Issue**: YouTube embed not showing
- Check the video ID in the iframe src
- Ensure the video is not private/unlisted

**Issue**: Animations not working
- Check browser console for JavaScript errors
- Ensure script.js is loaded properly

**Issue**: Mobile menu not opening
- Clear browser cache
- Check that script.js is loaded

**Issue**: Styles not applying
- Verify styles.css path is correct
- Check for CSS syntax errors
- Clear browser cache

## 📱 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support
- IE11: ⚠️ Partial support (some animations may not work)

## 📄 License

Free to use for personal and commercial projects. Attribution appreciated but not required.

## 🤝 Support

For issues or questions:
1. Check this README
2. Inspect browser console for errors
3. Verify all file paths are correct

## 🚀 Performance Tips

1. **Optimize Images**: Use WebP format and compress images
2. **Enable Caching**: Add cache headers on your server
3. **Use CDN**: Consider Cloudflare for static assets
4. **Minify Code**: Use tools like UglifyJS and CSSNano for production
5. **Enable Gzip**: Compress files on server

## 📈 Next Steps

- [ ] Replace all placeholder content with your real data
- [ ] Update colors to match your brand
- [ ] Add your actual YouTube videos
- [ ] Connect contact form to a backend
- [ ] Add Google Analytics
- [ ] Test on multiple devices
- [ ] Deploy to your chosen platform
- [ ] Share with your audience!

---

**Built with ❤️ for content creators**

Need help? Feel free to reach out or check online resources for HTML/CSS/JavaScript basics.