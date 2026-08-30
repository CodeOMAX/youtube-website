// AI Prompt Engineer - Professional Prompt Generator
// All functionality in one place

let selectedStyle = 'detailed';
let isRecording = false;
let recognition = null;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;  // Stop after one utterance
    recognition.interimResults = false;
    recognition.lang = 'en-US';
}

// Theme Management
const themeButtons = document.querySelectorAll('.theme-btn');
const savedTheme = localStorage.getItem('theme') || 'default';

// Apply saved theme on load
if (savedTheme !== 'default') {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === savedTheme);
    });
} else {
    document.documentElement.removeAttribute('data-theme');
}

themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;

        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }

        localStorage.setItem('theme', theme);

        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Style Selection
const styleButtons = document.querySelectorAll('.style-btn');
styleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        styleButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedStyle = btn.dataset.style;
    });
});

// Voice Input
const micBtn = document.getElementById('micBtn');
const recordingStatus = document.getElementById('recording');
const inputField = document.getElementById('input');

if (micBtn && recognition) {
    micBtn.addEventListener('click', () => {
        if (!isRecording) {
            recognition.start();
            isRecording = true;
            micBtn.classList.add('recording');
            recordingStatus.classList.add('active');
        } else {
            recognition.stop();
            isRecording = false;
            micBtn.classList.remove('recording');
            recordingStatus.classList.remove('active');
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        inputField.value = transcript;
    };

    recognition.onend = () => {
        isRecording = false;
        micBtn.classList.remove('recording');
        recordingStatus.classList.remove('active');
    };

    recognition.onerror = () => {
        isRecording = false;
        micBtn.classList.remove('recording');
        recordingStatus.classList.remove('active');
        showToast('Microphone error. Please try again.', 'error');
    };
}

// Silent Grammar Correction
function fixGrammarSilently(text) {
    let fixed = text;

    const spelling = {
        'recieve':'receive','recepe':'recipe','seperate':'separate','definately':'definitely',
        'occured':'occurred','occuring':'occurring','refered':'referred','begining':'beginning',
        'untill':'until','successfull':'successful','writting':'writing','commited':'committed',
        'enviroment':'environment','goverment':'government','acheive':'achieve','beleive':'believe',
        'whrer':'where','whre':'where','waht':'what','taht':'that','teh':'the','adn':'and',
        'thier':'their','recive':'receive','thats':'that\'s','dont':'don\'t','cant':'can\'t',
        'wont':'won\'t','didnt':'didn\'t','doesnt':'doesn\'t','isnt':'isn\'t','arent':'aren\'t',
        'wasnt':'wasn\'t','werent':'weren\'t','hasnt':'hasn\'t','havent':'haven\'t','hadnt':'hadn\'t',
        'shouldnt':'shouldn\'t','wouldnt':'wouldn\'t','couldnt':'couldn\'t'
    };

    Object.entries(spelling).forEach(([wrong, right]) => {
        const regex = new RegExp('\\b' + wrong + '\\b', 'gi');
        fixed = fixed.replace(regex, right);
    });

    // Basic grammar patterns
    fixed = fixed.replace(/\bi\b/g, 'I');
    fixed = fixed.replace(/\s+/g, ' ');
    fixed = fixed.trim();
    fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);

    return fixed;
}

// Intelligent Input Parsing
function parseInput(text) {
    const lower = text.toLowerCase();

    // Detect project type with intelligence
    let projectType = 'tool';
    if (/\b(browser\s+)?(extension|addon|plugin)\b/.test(lower)) {
        projectType = 'browser extension';
    } else if (/\b(web(site)?|site|page|landing\s*page)\b/.test(lower)) {
        projectType = 'website';
    } else if (/\b(app|application|mobile\s*app)\b/.test(lower)) {
        projectType = 'application';
    } else if (/\b(api|backend|server)\b/.test(lower)) {
        projectType = 'API';
    } else if (/\b(dashboard|admin\s*panel)\b/.test(lower)) {
        projectType = 'dashboard';
    } else if (/\b(bot|automation)\b/.test(lower)) {
        projectType = 'bot';
    }

    // Extract action verbs by category
    const actionVerbs = {
        monitoring: ['watches?', 'monitors?', 'tracks?', 'observes?', 'detects?'],
        analysis: ['analyz(e|es|ing)', 'examines?', 'inspects?', 'reviews?', 'audits?'],
        transformation: ['converts?', 'transforms?', 'changes?', 'translates?', 'processes?'],
        generation: ['generates?', 'creates?', 'builds?', 'produces?', 'makes?'],
        management: ['manages?', 'organizes?', 'handles?', 'controls?', 'coordinates?'],
        extraction: ['extracts?', 'pulls?', 'retrieves?', 'fetches?', 'gets?'],
        notification: ['notif(y|ies)', 'alerts?', 'warns?', 'tells?', 'informs?']
    };

    let verbCategory = null;
    let mainVerb = '';

    for (const [category, verbs] of Object.entries(actionVerbs)) {
        for (const verb of verbs) {
            const match = lower.match(new RegExp('\\b(' + verb + ')\\b'));
            if (match) {
                verbCategory = category;
                mainVerb = match[1];
                break;
            }
        }
        if (verbCategory) break;
    }

    // Extract subject (what's being acted upon)
    let subject = '';
    const subjectPatterns = [
        /\b(?:screen|video|audio|image|file|data|code|text|document|webpage?|website|link|url)\b/gi,
        /\b(?:error|bug|issue|problem|mistake|failure)\b/gi,
        /\b(?:user|person|people|visitor|client|customer)\b/gi
    ];

    for (const pattern of subjectPatterns) {
        const matches = text.match(pattern);
        if (matches) {
            subject = matches.join(' and ');
            break;
        }
    }

    // Extract purpose/outcome
    let purpose = '';
    const purposeMatch = lower.match(/\b(?:to|and)\s+(.+?)(?:\.|$)/);
    if (purposeMatch) {
        purpose = purposeMatch[1].trim();
    }

    // Generate contextual features based on what was detected
    const features = [];

    if (verbCategory === 'monitoring' && subject.includes('screen')) {
        features.push('Real-time screen monitoring and activity tracking');
        features.push('Error pattern recognition and detection');
        features.push('Automated issue identification and classification');
        features.push('Visual feedback with highlighted problem areas');
        features.push('Detailed error logs with timestamps and context');
    } else if (verbCategory === 'transformation' && /video|audio/.test(subject)) {
        features.push('Multi-format video/audio processing');
        features.push('High-quality transcription with timestamps');
        features.push('Intelligent content summarization');
        features.push('Speaker identification and separation');
        features.push('Export in multiple formats (text, SRT, JSON)');
    } else if (verbCategory === 'analysis') {
        features.push('Deep content analysis and pattern detection');
        features.push('Comprehensive reporting with insights');
        features.push('Historical data tracking and trends');
        features.push('Customizable analysis parameters');
        features.push('Export and sharing capabilities');
    } else {
        // Generic but intelligent features
        features.push('Intuitive and user-friendly interface');
        features.push('Fast processing with real-time feedback');
        features.push('Customizable settings and preferences');
        features.push('Detailed results with actionable insights');
        features.push('Cross-platform compatibility');
    }

    return {
        projectType,
        verbCategory,
        mainVerb,
        subject,
        purpose,
        features
    };
}

// Generate Professional Prompt
function generatePrompt(userInput, style) {
    const correctedInput = fixGrammarSilently(userInput);
    const parsed = parseInput(correctedInput);

    let prompt = '';

    if (style === 'detailed') {
        prompt = `Build a professional ${parsed.projectType} with the following specifications:

**Core Functionality:**
${parsed.mainVerb ? `- ${parsed.mainVerb.charAt(0).toUpperCase() + parsed.mainVerb.slice(1)} ${parsed.subject || 'target content'}` : `- ${correctedInput}`}
${parsed.purpose ? `- ${parsed.purpose.charAt(0).toUpperCase() + parsed.purpose.slice(1)}` : ''}

**Key Features:**
${parsed.features.map(f => `- ${f}`).join('\n')}

**Technical Requirements:**
- Clean, modern, and responsive user interface
- Efficient performance with optimized algorithms
- Error handling with helpful user feedback
- Accessibility compliance (WCAG 2.1 AA standards)
- Cross-browser compatibility
- Mobile-responsive design

**User Experience:**
- Clear visual hierarchy and intuitive navigation
- Smooth animations and transitions
- Loading states for async operations
- Success/error notifications
- Help documentation and tooltips

Please implement this ${parsed.projectType} with production-ready code, following best practices and modern development standards.`;

    } else if (style === 'technical') {
        prompt = `Develop a ${parsed.projectType} system:

REQUIREMENTS:
${parsed.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

TECHNICAL STACK:
- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)
- Architecture: Modular component-based structure
- Performance: Lazy loading, debouncing, caching
- Security: Input validation, XSS prevention, CSP compliance

IMPLEMENTATION:
- Clean separation of concerns (MVC pattern)
- Reusable utility functions
- Event-driven architecture
- Comprehensive error handling
- Unit-testable code structure

DELIVERABLES:
- Production-ready source code
- Inline documentation
- Performance optimizations
- Browser compatibility layer`;

    } else if (style === 'creative') {
        prompt = `Create an innovative ${parsed.projectType} that ${correctedInput}.

Imagine a tool that not only ${parsed.mainVerb || 'solves the problem'} but does it with style and elegance:

✨ **The Vision:**
${parsed.features.slice(0, 3).map(f => `• ${f}`).join('\n')}

🎨 **The Experience:**
• Beautiful, intuitive interface that users will love
• Smooth, delightful interactions at every step
• Smart features that anticipate user needs
• A design that feels both modern and timeless

🚀 **The Magic:**
Make it feel effortless. The complex work happens behind the scenes while users enjoy a seamless, powerful experience.

Build something that makes people say "wow, this is exactly what I needed" the moment they use it.`;

    } else { // concise
        prompt = `Build a ${parsed.projectType}: ${correctedInput}

Core features:
${parsed.features.slice(0, 4).map(f => `• ${f}`).join('\n')}

Requirements: Clean UI, fast performance, mobile-responsive, error handling.`;
    }

    return {
        original: correctedInput,
        professional: prompt,
        improvements: [
            'Structured the request with clear sections and hierarchy',
            'Added specific technical requirements and standards',
            'Defined expected features and functionality',
            'Included user experience considerations',
            'Specified implementation best practices'
        ]
    };
}

// Generate Button
const generateBtn = document.getElementById('generate');
const outputSection = document.getElementById('output');
const originalText = document.getElementById('originalText');
const proText = document.getElementById('proText');
const improvementsList = document.getElementById('improvementsList');

generateBtn.addEventListener('click', () => {
    const input = inputField.value.trim();

    if (!input) {
        showToast('Please enter a command first', 'error');
        return;
    }

    const result = generatePrompt(input, selectedStyle);

    originalText.textContent = result.original;
    proText.textContent = result.professional;

    improvementsList.innerHTML = '';
    result.improvements.forEach(imp => {
        const li = document.createElement('li');
        li.textContent = imp;
        improvementsList.appendChild(li);
    });

    outputSection.classList.remove('hidden');
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Copy Functionality
const copyButtons = document.querySelectorAll('.copy-btn');
copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const target = btn.dataset.target;
        const textToCopy = target === 'original'
            ? originalText.textContent
            : proText.textContent;

        try {
            await navigator.clipboard.writeText(textToCopy);
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            showToast('Copied to clipboard!', 'success');

            setTimeout(() => {
                btn.textContent = 'Copy';
                btn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
    });
});

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');

    toastMsg.textContent = message;
    toastIcon.textContent = type === 'success' ? '✓' : '✕';

    toast.className = 'toast ' + type;

    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
