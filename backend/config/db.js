import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Default Seed Data
const initialSeed = {
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
    name: 'Abhishek Yadav',
    email: process.env.ADMIN_EMAIL || 'rootabhishekyadav@gmail.com'
  },
  analyticsConfig: {
    gaMeasurementId: process.env.GA_MEASUREMENT_ID || 'G-7L8K9J2M3N',
    gaPropertyId: process.env.GA_PROPERTY_ID || '429182390',
    searchConsoleSiteUrl: process.env.GSC_SITE_URL || 'https://www.rootabhi.com',
    googleServiceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY || '',
    githubClientId: process.env.GITHUB_CLIENT_ID || '',
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    githubPersonalToken: process.env.GITHUB_TOKEN || '',
    updatedAt: new Date().toISOString()
  },
  projects: [
    {
      id: "proj-1",
      title: "Smartbin",
      description: "IoT-based waste management system that senses levels and sends real-time alerts via MERN stack.",
      image: "./smartbin.png",
      live: "https://smartbin-theta.vercel.app/",
      githubRepo: "theabhi-labs/smartbin",
      githubURL: "https://github.com/theabhi-labs/smartbin",
      tech: ["React", "Node.js", "IoT", "MongoDB"],
      order: 1
    },
    {
      id: "proj-2",
      title: "LeetCode Clone",
      description: "A full-stack playground for Data Structures & Algorithms with real-time code execution and test cases.",
      image: "./leetcode.png",
      live: "https://leetcode.com",
      githubRepo: "theabhi-labs/leetcode-clone",
      githubURL: "https://github.com/theabhi-labs/leetcode-clone",
      tech: ["Next.js", "Firebase", "Monaco Editor"],
      order: 2
    },
    {
      id: "proj-3",
      title: "JAS Computer Institute",
      description: "Full-stack institutional web portal & student management platform featuring automated admissions, dynamic course curricula, inquiry engine, and fee tracking.",
      image: "./jas_institute.png",
      live: "https://www.jascomputerinstitute.in/",
      githubRepo: "theabhi-labs/jas-computer-institute",
      githubURL: "https://github.com/theabhi-labs/jas-computer-institute",
      tech: ["React.js", "Node.js", "Express", "Tailwind CSS", "MongoDB"],
      order: 3
    }
  ],
  activities: [
    {
      id: "act-1",
      title: "Health Technology Assessment (HTAIn)",
      tag: "IIT DELHI EVENT",
      author: [
        "Dr. Vivekanandan Perumal (Professor, IIT-D)",
        "Dr. Kavitha Rajsekar (Scientist-F, DHR)"
      ],
      date: "21 April 2025",
      location: "FITT, IIT Delhi",
      images: ["/iitimage.png", "/iitgroup.png", "/certificate.png"],
      shortDesc: "Attended the HTAIn workshop focused on Health Tech innovation and research strategies.",
      fullDesc: `Attending the HTAIn Workshop at IIT Delhi was an incredible opportunity to dive into the world of Health Technology Assessment. Hosted by FITT, the event focused on bridging the gap between clinical research and practical innovation.

Witnessing the 'Pitch the Ideas' segment was a highlight, showcasing how brilliant minds are shaping the future of global healthcare. It was an amazing platform for networking with senior scientists and professors.

### Key Takeaways:
- **Health Tech Innovation**: Exploring clinical research methodologies and integrating them with scalable software architecture.
- **Idea Pitching**: Gaining deep insights into articulating complex technical ideas to scientists and venture directors.
- **Collaborative Engineering**: Connecting with healthcare research fellows and interdisciplinary innovators.`,
      highlights: ["Research Methodology", "Innovation Pitching", "Clinical Collaboration", "IIT Delhi FITT"],
      createdAt: new Date().toISOString()
    }
  ],
  timeline: [
    {
      id: "time-1",
      year: "2024",
      title: "Started My B.Tech Journey",
      description: "Began my engineering journey — curious about how technology shapes the world. Started learning the fundamentals of coding and computer science.",
      icon: "rocket",
      side: "left",
      order: 1
    },
    {
      id: "time-2",
      year: "2024",
      title: "Dived into Web Development",
      description: "Discovered the power of full-stack development with MERN. Built my first authentication system, portfolio, and dynamic UI projects.",
      icon: "laptop",
      side: "right",
      order: 2
    },
    {
      id: "time-3",
      year: "2025",
      title: "Hackathons & Real Projects",
      description: "Participated in hackathons and collaborated with creative teams. Worked on solving real-world problems through innovation and tech.",
      icon: "code",
      side: "left",
      order: 3
    },
    {
      id: "time-4",
      year: "Future",
      title: "Building My Legacy",
      description: "Now focusing on creating projects that leave a mark — from AI-powered apps to meaningful solutions through BehindTheCode.",
      icon: "trophy",
      side: "right",
      order: 4
    }
  ],
  articles: [
    {
      id: "art-1",
      topic: "javascript",
      subtopic: "strings",
      title: "JavaScript / Strings",
      summary: "String ek data type hota hai — jo text ko represent karta hai.",
      content: `**String** ek fundamental data type hota hai — jo text (characters) ko represent karta hai.

JavaScript me string ka matlab hota hai *quotes* ke andar likha hua text.

\`\`\`js
const name = "Abhishek";
const greeting = 'Hello, ' + name;
console.log(\`Welcome \${name}!\`);
\`\`\`

### Common String Methods
- \`.toLowerCase()\` / \`.toUpperCase()\`
- \`.trim()\` - removes whitespace
- \`.slice(start, end)\` - extracts substrings
- \`.replace(search, replaceWith)\`

**Important Note:** Strings in JavaScript are immutable.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "art-2",
      topic: "javascript",
      subtopic: "array",
      title: "JavaScript / Arrays",
      summary: "Array ek ordered list hoti hai jisme multiple values store hoti hain.",
      content: `Arrays ordered collections hoti hain jo indexing follow karti hain:

\`\`\`js
const techStack = ["React", "Node.js", "Express", "MongoDB"];
techStack.push("TailwindCSS");

// Array mapping
const upperTech = techStack.map(item => item.toUpperCase());
\`\`\`

### Essential Higher-Order Methods
1. **.map()**: Transform every item
2. **.filter()**: Extract items satisfying a condition
3. **.reduce()**: Accumulate into a single value`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "art-3",
      topic: "reactjs",
      subtopic: "hooks",
      title: "React / Hooks",
      summary: "Hooks React ke functional components me state aur lifecycle allow karte hain.",
      content: `**useState** and **useEffect** modern React ke building blocks hain.

\`\`\`jsx
import React, { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Clicked \${count} times\`;
  }, [count]);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

### Custom Hooks
Custom hooks allow you to extract and reuse stateful logic cleanly across components.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  products: [
    {
      id: "prod-1",
      title: "PrimeID Pro",
      tagline: "Next-Gen Professional Identity & Smart ID Card Generation Suite",
      description: "An ultra-fast SaaS platform designed for educational institutions, enterprises, and event organizers to create, customize, batch generate, and securely distribute smart ID cards with QR & Barcode verification.",
      liveUrl: "https://www.primeidpro.online/",
      status: "Live in Production",
      badge: "Featured SaaS",
      highlights: [
        "Real-time Instant Card Canvas Engine",
        "High-Resolution Print-Ready PDF/PNG Batch Export",
        "Encrypted QR Code & Barcode Verification",
        "Multi-Role Permission & Student/Employee Import",
        "Custom Brand Templates & Dynamic Fields"
      ],
      techStack: ["Next.js / React", "Tailwind CSS", "Canvas API", "Node.js", "Cloud Storage"],
      createdAt: new Date().toISOString()
    }
  ],
  contactMessages: [],
  analyticsEvents: []
};

// In-Memory & Local JSON Store
class LocalDataStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return {
          ...initialSeed,
          ...parsed,
          analyticsConfig: { ...initialSeed.analyticsConfig, ...(parsed.analyticsConfig || {}) },
          projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : initialSeed.projects
        };
      }
    } catch (err) {
      console.error('Error loading DB file, initializing defaults:', err.message);
    }
    this.save(initialSeed);
    return initialSeed;
  }

  save(data) {
    try {
      this.data = data || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving DB file:', err.message);
    }
  }

  get(collection) {
    return this.data[collection] || [];
  }

  set(collection, items) {
    this.data[collection] = items;
    this.save();
  }

  insert(collection, item) {
    if (!this.data[collection]) this.data[collection] = [];
    this.data[collection].unshift(item);
    // Keep analytics events capped at 5,000 to prevent memory blowup
    if (collection === 'analyticsEvents' && this.data[collection].length > 5000) {
      this.data[collection] = this.data[collection].slice(0, 5000);
    }
    this.save();
    return item;
  }

  update(collection, id, updates) {
    if (!this.data[collection]) return null;
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return null;
    this.data[collection][index] = {
      ...this.data[collection][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data[collection][index];
  }

  delete(collection, id) {
    if (!this.data[collection]) return false;
    const before = this.data[collection].length;
    this.data[collection] = this.data[collection].filter(item => item.id !== id);
    this.save();
    return this.data[collection].length < before;
  }

  getAdmin() {
    return this.data.admin;
  }

  updateAdmin(adminData) {
    this.data.admin = { ...this.data.admin, ...adminData };
    this.save();
    return this.data.admin;
  }

  getAnalyticsConfig() {
    return this.data.analyticsConfig || initialSeed.analyticsConfig;
  }

  updateAnalyticsConfig(configData) {
    this.data.analyticsConfig = { ...this.getAnalyticsConfig(), ...configData, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.analyticsConfig;
  }
}

export const dbStore = new LocalDataStore();

// Optional MongoDB Connection Setup
export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log('⚡ Running with local persistent JSON data store (Fast & Zero Config)');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.warn('MongoDB connection failed. Continuing with local persistent storage:', err.message);
  }
};
