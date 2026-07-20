import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Mail, 
  Volume2, 
  VolumeX, 
  Terminal as TerminalIcon, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  Menu, 
  X, 
  ExternalLink, 
  RefreshCw, 
  Code, 
  Sparkles, 
  Send, 
  Database, 
  Compass, 
  Sliders, 
  FileText, 
  Download,
  Instagram,
  Compass as PinterestIcon,
  Play
} from 'lucide-react';

// Interfaces
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  accent: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  index: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'system' | 'action' | 'audio' | 'success' | 'warning';
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Cyber-Link Interface',
    description: 'Dashboard blockchain kustom untuk pemantauan aset real-time dan visualisasi data neural.',
    tags: ['React', 'Three.js', 'Web3'],
    link: 'https://github.com/AkbarBatagore',
    accent: 'cyan',
    index: '01'
  },
  {
    id: '2',
    title: 'Zenon Cloud OS',
    description: 'Desain sistem operasi minimalis untuk perangkat komputasi wearable generasi masa depan.',
    tags: ['Next.js', 'Framer', 'Rust'],
    link: 'https://github.com/AkbarBatagore',
    accent: 'purple',
    index: '02'
  },
  {
    id: '3',
    title: 'Void Marketplace',
    description: 'Hub e-commerce terdesentralisasi dengan protokol transaksi latensi ultra-rendah.',
    tags: ['Solidity', 'Rust', 'Web3'],
    link: 'https://github.com/AkbarBatagore',
    accent: 'emerald',
    index: '03'
  },
  {
    id: '4',
    title: 'Aura Media Engine',
    description: 'Platform audio generatif menggunakan analisis spektral untuk menyinkronkan visual real-time.',
    tags: ['Python', 'WebGL', 'AudioAPI'],
    link: 'https://github.com/AkbarBatagore',
    accent: 'amber',
    index: '04'
  }
];

const SKILLS = [
  { name: 'Frontend Architecture', level: 92, category: 'development' },
  { name: 'React / Next.js Frameworks', level: 95, category: 'development' },
  { name: 'TypeScript & Typings', level: 88, category: 'development' },
  { name: 'Tailwind CSS / UI Systems', level: 96, category: 'creative' },
  { name: 'Framer & Web Animations', level: 85, category: 'creative' },
  { name: 'Smart Contract / Solidity', level: 70, category: 'engineering' },
  { name: 'Rust Core Development', level: 75, category: 'engineering' },
  { name: 'AI Engineering & Prompting', level: 90, category: 'engineering' }
];

export default function App() {
  // Theme & Sound Config
  const [accentColor, setAccentColor] = useState<'cyan' | 'purple' | 'emerald' | 'amber' | 'rose'>('cyan');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [digitalTime, setDigitalTime] = useState<string>('00:00:00');
  
  // Projects state (Persisted in localStorage)
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('reonzy_projects');
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  // Terminal Logs State
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Navigation / UI States
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [filterTag, setFilterTag] = useState<string>('All');
  
  // Interactive Sound Synthesizer Node Handler
  const audioContextRef = useRef<AudioContext | null>(null);

  // Form State for Adding / Editing Projects
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    tags: [],
    link: '',
    accent: 'cyan'
  });
  const [formTagsString, setFormTagsString] = useState<string>('');

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Initialize synth helper
  const triggerSynth = (type: 'click' | 'success' | 'hover' | 'boot' | 'delete' | 'warning') => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1050, now);
        gainNode.gain.setValueAtTime(0.015, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.22); // C6
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'delete') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.22);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'warning') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.1);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'boot') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
        gainNode.gain.setValueAtTime(0.04, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio fallback
    }
  };

  // Add system event log
  const pushLog = (message: string, type: 'system' | 'action' | 'audio' | 'success' | 'warning' = 'action') => {
    const time = new Date();
    const ts = `${time.toTimeString().split(' ')[0]}.${String(time.getMilliseconds()).padStart(3, '0')}`;
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: ts,
      message,
      type
    };
    setLogs(prev => [newEntry, ...prev.slice(0, 39)]);
  };

  // Persist projects inside storage when changed
  useEffect(() => {
    localStorage.setItem('reonzy_projects', JSON.stringify(projects));
  }, [projects]);

  // Digital Clock and Boot Sequences
  useEffect(() => {
    // Initial clock ticks
    const updateTime = () => {
      const now = new Date();
      setDigitalTime(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Boot Terminal Messages
    pushLog("INITIALIZING NEURAL NET V4.2...", "system");
    pushLog("AUTHENTICATING LOCALHOST SESSION...", "system");
    pushLog("REONZY OS BOOT_SEQUENCE: COMPLETE.", "success");
    pushLog("SOCIAL PLATFORMS PARSED: EMAIL, TIKTOK, INSTAGRAM, PINTEREST", "system");
    pushLog("READY FOR OPERATIONS.", "success");

    triggerSynth('boot');

    return () => clearInterval(interval);
  }, []);

  // Sync Tag Filters
  const allTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))];

  // Accent Styles Class Map
  const accentBorderColors = {
    cyan: 'border-cyan-500/30 hover:border-cyan-400 group-hover:border-cyan-400',
    purple: 'border-fuchsia-500/30 hover:border-fuchsia-400 group-hover:border-fuchsia-400',
    emerald: 'border-emerald-500/30 hover:border-emerald-400 group-hover:border-emerald-400',
    amber: 'border-amber-500/30 hover:border-amber-400 group-hover:border-amber-400',
    rose: 'border-rose-500/30 hover:border-rose-400 group-hover:border-rose-400'
  };

  const accentTextColors = {
    cyan: 'text-cyan-400',
    purple: 'text-fuchsia-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
  };

  const accentBgColors = {
    cyan: 'bg-cyan-500',
    purple: 'bg-fuchsia-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500'
  };

  const currentThemeHex = {
    cyan: '#06b6d4',
    purple: '#d946ef',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e'
  }[accentColor];

  // Smooth Scroll Anchor Function
  const scrollToAnchor = (id: string) => {
    triggerSynth('click');
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      pushLog(`NAVIGATED TO SEC: [${id.toUpperCase()}]`, 'action');
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Create or Update Project
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      pushLog("FORM ERROR: Missing Title or Description", "warning");
      triggerSynth('warning');
      return;
    }

    const tagsArray = formTagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingProject) {
      // Update
      setProjects(prev => prev.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            title: formData.title || '',
            description: formData.description || '',
            tags: tagsArray,
            link: formData.link || 'https://github.com/AkbarBatagore',
            accent: formData.accent || 'cyan'
          };
        }
        return p;
      }));
      pushLog(`UPDATED PROJECT: [${formData.title}]`, 'success');
    } else {
      // Create new
      const nextIndex = String(projects.length + 1).padStart(2, '0');
      const newProj: Project = {
        id: Math.random().toString(36).substring(2, 9),
        title: formData.title,
        description: formData.description,
        tags: tagsArray,
        link: formData.link || 'https://github.com/AkbarBatagore',
        accent: formData.accent || 'cyan',
        index: nextIndex
      };
      setProjects(prev => [...prev, newProj]);
      pushLog(`ADDED NEW PROJECT: [${formData.title}]`, 'success');
    }

    // Reset Form
    setEditingProject(null);
    setFormData({ title: '', description: '', tags: [], link: '', accent: 'cyan' });
    setFormTagsString('');
    setShowConfigModal(false);
    triggerSynth('success');
  };

  // Edit Initiator
  const startEdit = (proj: Project) => {
    triggerSynth('click');
    setEditingProject(proj);
    setFormData(proj);
    setFormTagsString(proj.tags.join(', '));
    setShowConfigModal(true);
    pushLog(`TERMINAL INPUT: Editing [${proj.title}]`, 'action');
  };

  // Delete Initiator
  const handleDeleteProject = (id: string, name: string) => {
    triggerSynth('delete');
    setProjects(prev => prev.filter(p => p.id !== id));
    pushLog(`DELETED PROJECT ID: [${name}]`, 'warning');
  };

  // Reset to default projects
  const handleResetProjects = () => {
    triggerSynth('warning');
    if (window.confirm("Kembalikan daftar proyek ke default desain?")) {
      setProjects(DEFAULT_PROJECTS);
      pushLog("RESTORED DEFAULT CASE STUDIES", "system");
      triggerSynth('success');
    }
  };

  // Handle Contact Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      pushLog("CONTACT WARNING: Field Kosong", "warning");
      triggerSynth('warning');
      return;
    }

    setIsSending(true);
    triggerSynth('click');
    pushLog(`TRANSMITTING MESSAGE: [${contactForm.subject || 'Inquiry'}]`, 'action');

    // Simulate cyber network sending transmission
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      pushLog("MESSAGE TRANSMITTED SECURELY TO REONZY.AKBAR@GMAIL.COM", "success");
      triggerSynth('success');
      
      // Keep state clean
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSendSuccess(false), 5000);
    }, 1500);
  };

  // Export config to clipboard
  const exportConfig = () => {
    triggerSynth('success');
    navigator.clipboard.writeText(JSON.stringify(projects, null, 2));
    pushLog("CONFIG COPIED TO SYSTEM CLIPBOARD", "success");
    alert("Daftar project disalin sebagai JSON! Anda dapat menyimpannya untuk backup.");
  };

  // Import config from prompt
  const importConfig = () => {
    triggerSynth('click');
    const pasted = prompt("Tempel kode JSON backup portofolio proyek Anda di sini:");
    if (!pasted) return;
    try {
      const parsed = JSON.parse(pasted);
      if (Array.isArray(parsed)) {
        setProjects(parsed);
        pushLog("IMPORTED NEW CONFIGURATION DATA", "success");
        triggerSynth('success');
      } else {
        throw new Error("Bukan array valid");
      }
    } catch {
      triggerSynth('warning');
      pushLog("IMPORT FAILED: Format JSON tidak valid", "warning");
      alert("Gagal mengimpor. Pastikan format JSON sesuai.");
    }
  };

  // Download Standalone HTML Version of Portfolio
  const downloadHTMLVersion = () => {
    triggerSynth('success');
    pushLog("EXPORT_SECURE_HTML: Compiling current configurations...", "system");
    
    const serializedProjects = JSON.stringify(projects, null, 2);
    
    const htmlTemplate = `<!doctype html>
<html lang="id" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reonzy Akbar - Futuristic Web Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            cyber: {
              bg: '#050505',
              card: '#0a0a0a',
              dark: '#121212'
            }
          },
          animation: {
            'spin-slow': 'spin 15s linear infinite',
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }
        }
      }
    }
  </script>
  <style type="text/css">
    :root {
      --accent-color: #06b6d4;
      --accent-glow: rgba(6, 182, 212, 0.15);
    }
    .cyber-grid {
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
    }
    .scanline {
      position: relative;
    }
    .scanline::after {
      content: " ";
      display: block;
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04));
      z-index: 10;
      background-size: 100% 3px, 6px 100%;
      pointer-events: none;
    }
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #050505;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--accent-color);
      opacity: 0.3;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--accent-color);
    }
    .accent-bg { background-color: var(--accent-color); }
    .accent-text { color: var(--accent-color); }
    .accent-border { border-color: var(--accent-color); }
    .accent-shadow { box-shadow: 0 0 15px var(--accent-glow); }
    .color-cyan { --accent-color: #06b6d4; --accent-glow: rgba(6, 182, 212, 0.2); }
    .color-purple { --accent-color: #d946ef; --accent-glow: rgba(217, 70, 239, 0.2); }
    .color-emerald { --accent-color: #10b981; --accent-glow: rgba(16, 185, 129, 0.2); }
    .color-amber { --accent-color: #f59e0b; --accent-glow: rgba(245, 158, 11, 0.2); }
    .color-rose { --accent-color: #f43f5e; --accent-glow: rgba(244, 63, 94, 0.2); }
  </style>
</head>
<body class="bg-cyber-bg text-[#e0e0e0] font-sans relative min-h-screen flex flex-col overflow-x-hidden scanline cyber-grid selection:bg-cyan-500/30 selection:text-white color-cyan">
  <div class="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
  <div class="absolute bottom-1/3 right-10 w-[35vw] h-[35vw] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>

  <header class="sticky top-0 z-40 bg-[#050505]/85 backdrop-blur-md border-b border-white/10 px-6 py-4 md:px-12 flex items-center justify-between transition-all duration-300">
    <div onclick="scrollToSection('home')" class="flex items-center gap-3 cursor-pointer group">
      <div class="w-8 h-8 rounded-sm rotate-45 flex items-center justify-center transition-all duration-300 border accent-border accent-shadow">
        <span class="text-white font-bold -rotate-45 text-xs tracking-wider">A</span>
      </div>
      <div class="flex flex-col">
        <span class="text-xs font-bold tracking-[0.3em] uppercase group-hover:text-white transition-colors">
          AKBAR <span class="accent-text">BATAGORE</span>
        </span>
        <span class="text-[8px] text-white/30 tracking-widest uppercase">System Portofolio</span>
      </div>
    </div>

    <nav class="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-semibold items-center">
      <button onclick="scrollToSection('home')" class="text-white border-b-2 accent-border pb-1 nav-btn transition-all duration-300" id="nav-home">Terminal Home</button>
      <button onclick="scrollToSection('projects')" class="text-white/50 hover:text-white nav-btn transition-all duration-300" id="nav-projects">Selected Work</button>
      <button onclick="scrollToSection('skills')" class="text-white/50 hover:text-white nav-btn transition-all duration-300" id="nav-skills">Skills Matrix</button>
      <button onclick="scrollToSection('contact')" class="text-white/50 hover:text-white nav-btn transition-all duration-300" id="nav-contact">Contact</button>
    </nav>

    <div class="flex items-center gap-4">
      <div class="hidden lg:flex items-center gap-1.5 border border-white/10 px-2.5 py-1 rounded bg-black/40">
        <span class="text-[8px] uppercase tracking-wider text-white/40 mr-1">Hue:</span>
        <button onclick="changeThemeAccent('cyan')" class="w-3.5 h-3.5 rounded-full border border-white ring-1 ring-cyan-500/50 bg-[#06b6d4] scale-110 theme-dot transition-all"></button>
        <button onclick="changeThemeAccent('purple')" class="w-3.5 h-3.5 rounded-full border border-transparent bg-[#d946ef] theme-dot transition-all"></button>
        <button onclick="changeThemeAccent('emerald')" class="w-3.5 h-3.5 rounded-full border border-transparent bg-[#10b981] theme-dot transition-all"></button>
        <button onclick="changeThemeAccent('amber')" class="w-3.5 h-3.5 rounded-full border border-transparent bg-[#f59e0b] theme-dot transition-all"></button>
        <button onclick="changeThemeAccent('rose')" class="w-3.5 h-3.5 rounded-full border border-transparent bg-[#f43f5e] theme-dot transition-all"></button>
      </div>

      <div class="hidden sm:block text-[11px] font-mono tracking-widest text-white/50 bg-black/50 border border-white/10 px-3 py-1 rounded">
        SYS_TIME: <span id="clock" class="accent-text font-bold">00:00:00</span>
      </div>

      <button id="sound-btn" onclick="toggleMute()" class="p-1.5 rounded border border-white/10 bg-black/40 text-white/60 hover:text-white transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
      </button>

      <button onclick="toggleMobileMenu()" class="md:hidden p-1.5 rounded border border-white/10 bg-black/40 text-white/60 hover:text-white transition-all">
        <svg id="menu-icon-open" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        <svg id="menu-icon-close" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  </header>

  <div id="mobile-menu" class="hidden md:hidden fixed top-[65px] left-0 w-full bg-[#050505]/95 border-b border-white/15 z-30 p-6 flex flex-col gap-5 text-sm uppercase tracking-[0.2em] font-medium backdrop-blur-xl">
    <div class="flex justify-between items-center pb-2 border-b border-white/5">
      <span class="text-[10px] text-white/30 tracking-[0.3em]">NAVIGASI</span>
      <div class="flex items-center gap-1.5">
        <button onclick="changeThemeAccent('cyan')" class="w-3 h-3 rounded-full bg-[#06b6d4]"></button>
        <button onclick="changeThemeAccent('purple')" class="w-3 h-3 rounded-full bg-[#d946ef]"></button>
        <button onclick="changeThemeAccent('emerald')" class="w-3 h-3 rounded-full bg-[#10b981]"></button>
        <button onclick="changeThemeAccent('amber')" class="w-3 h-3 rounded-full bg-[#f59e0b]"></button>
        <button onclick="changeThemeAccent('rose')" class="w-3 h-3 rounded-full bg-[#f43f5e]"></button>
      </div>
    </div>
    <button onclick="scrollToSection('home')" class="text-left py-2 flex justify-between items-center text-white">
      <span>01 // HOME</span>
      <span class="text-xs accent-text">►</span>
    </button>
    <button onclick="scrollToSection('projects')" class="text-left py-2 flex justify-between items-center text-white/50">
      <span>02 // SELECTED WORK</span>
      <span class="text-xs accent-text">►</span>
    </button>
    <button onclick="scrollToSection('skills')" class="text-left py-2 flex justify-between items-center text-white/50">
      <span>03 // SKILLS MATRIX</span>
      <span class="text-xs accent-text">►</span>
    </button>
    <button onclick="scrollToSection('contact')" class="text-left py-2 flex justify-between items-center text-white/50">
      <span>04 // CONTACT INTERFACE</span>
      <span class="text-xs accent-text">►</span>
    </button>
  </div>

  <div class="w-full max-w-[1400px] mx-auto flex-1 flex flex-col md:flex-row border-x border-white/10 min-h-[calc(100vh-65px)]">
    <aside id="aside-home" class="w-full md:w-[38%] border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-12 flex flex-col justify-between gap-12 bg-black/20">
      <div class="space-y-8">
        <div class="relative w-44 h-44 mb-6 group mx-auto md:mx-0">
          <div class="absolute inset-0 border rounded-full animate-spin-slow accent-border opacity-30"></div>
          <div class="absolute inset-2 border border-dashed border-white/10 rounded-full"></div>
          <div class="absolute inset-0 rounded-full filter blur-md transition-all duration-300 opacity-20 group-hover:opacity-60 accent-bg"></div>
          <img src="https://github.com/AkbarBatagore.png" class="w-full h-full object-cover rounded-full border-2 border-white/20 grayscale group-hover:grayscale-0 group-hover:border-white/50 transition-all duration-500 relative z-10" alt="Akbar Batagore" />
          <div class="absolute -bottom-2 -right-1 bg-[#050505] border border-white/10 px-3 py-1 text-[9px] uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5 rounded-sm z-20 shadow-lg">
            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            ACTIVE_NOW
          </div>
        </div>

        <div class="text-center md:text-left">
          <h1 class="text-4xl md:text-5xl font-light leading-tight tracking-tight mb-4 text-white">
            REONZY <br class="hidden md:block"/>
            <span class="italic font-bold tracking-widest accent-text transition-all duration-300">AKBAR</span>
          </h1>
          <div class="h-0.5 w-16 mb-4 rounded accent-bg"></div>
          <p class="text-white/60 text-xs md:text-sm leading-relaxed max-w-sm font-light">
            Membangun pengalaman digital masa depan yang sangat responsif, presisi tinggi, dan kaya visual melalui integrasi visual mutakhir serta rekayasa desain web.
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold text-center md:text-left">
          SOCIALS & CHANNELS
        </div>
        <div class="grid grid-cols-2 gap-3">
          <a href="mailto:reonzy.akbar@gmail.com" onclick="synthSound('click')" class="flex items-center gap-2 text-[10px] font-mono hover:text-white border border-white/5 p-3 rounded bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
            <svg class="accent-text" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <div class="flex flex-col truncate">
              <span class="text-[8px] text-white/40">EMAIL</span>
              <span class="truncate">reonzy.akbar</span>
            </div>
          </a>

          <a href="https://www.tiktok.com/@reonzy33" target="_blank" onclick="synthSound('click')" class="flex items-center gap-2 text-[10px] font-mono hover:text-white border border-white/5 p-3 rounded bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
            <svg class="accent-text" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <div class="flex flex-col truncate">
              <span class="text-[8px] text-white/40">TIKTOK</span>
              <span class="truncate">@reonzy33</span>
            </div>
          </a>

          <a href="https://www.instagram.com/reonzyyx" target="_blank" onclick="synthSound('click')" class="flex items-center gap-2 text-[10px] font-mono hover:text-white border border-white/5 p-3 rounded bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
            <svg class="accent-text" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <div class="flex flex-col truncate">
              <span class="text-[8px] text-white/40">INSTAGRAM</span>
              <span class="truncate">reonzyyx</span>
            </div>
          </a>

          <a href="https://www.pinterest.com/reonzyyx" target="_blank" onclick="synthSound('click')" class="flex items-center gap-2 text-[10px] font-mono hover:text-white border border-white/5 p-3 rounded bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
            <svg class="accent-text" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
            <div class="flex flex-col truncate">
              <span class="text-[8px] text-white/40">PINTEREST</span>
              <span class="truncate">@reonzyyx</span>
            </div>
          </a>
        </div>
      </div>

      <div class="hidden lg:flex flex-col border border-white/10 rounded bg-[#020202]/90 p-4 font-mono text-[9px] h-44 relative overflow-hidden">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
          <div class="flex items-center gap-1.5">
            <svg class="accent-text" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
            <span class="text-white/40 tracking-widest font-bold">REONZY_CONSOLE v2.2</span>
          </div>
          <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        </div>
        <div id="terminal-logs" class="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs"></div>
        <div class="absolute bottom-1 right-2 text-white/10 select-none">STANDALONE_NODE</div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col bg-[#070707] overflow-y-auto">
      <section id="projects" class="p-6 md:p-12 border-b border-white/10 relative">
        <div class="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.01] border-b border-l border-white/5 pointer-events-none"></div>

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <svg class="accent-text animate-spin" style="animation-duration: 8s" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              <span class="text-[10px] tracking-[0.4em] uppercase font-bold text-white/40">OPERATIONAL CASE STUDIES</span>
            </div>
            <h2 class="text-3xl font-light tracking-wide text-white">
              Karya <span class="font-bold">Pilihan</span>
            </h2>
          </div>
          <div id="filter-container" class="flex flex-wrap gap-1.5"></div>
        </div>

        <div id="projects-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10"></div>

        <div class="border border-white/10 rounded-lg bg-black/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-white flex items-center gap-1.5">
              <svg class="accent-text" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Control Panel Portofolio (Atur Sendiri)
            </h4>
            <p class="text-xs text-white/40 max-w-lg font-light leading-relaxed">
              Konfigurasi kartu di atas langsung di browser Anda! Perubahan Anda akan disimpan ke penyimpanan lokal.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button onclick="openProjectModal(false)" class="text-[9px] uppercase font-mono tracking-widest bg-white text-black font-semibold hover:bg-white/95 px-4 py-2 rounded transition-all flex items-center gap-1.5 shadow-lg cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Tambah Project
            </button>
            <button onclick="exportJSONBackup()" class="text-[9px] uppercase font-mono tracking-widest border border-white/10 hover:border-white/25 hover:bg-white/5 text-white/70 px-3 py-2 rounded transition-all flex items-center gap-1.5 cursor-pointer">
              Export Backup
            </button>
            <button onclick="importJSONBackup()" class="text-[9px] uppercase font-mono tracking-widest border border-white/10 hover:border-white/25 hover:bg-white/5 text-white/70 px-3 py-2 rounded transition-all flex items-center gap-1.5 cursor-pointer">
              Import Backup
            </button>
            <button onclick="resetToDefaultProjects()" class="text-[9px] uppercase font-mono tracking-widest border border-red-500/10 hover:border-red-500/30 text-red-400 hover:bg-red-500/5 px-3 py-2 rounded transition-all flex items-center gap-1 cursor-pointer">
              Reset Default
            </button>
          </div>
        </div>
      </section>

      <section id="skills" class="p-6 md:p-12 border-b border-white/10 relative">
        <div class="mb-10">
          <div class="flex items-center gap-2 mb-2">
            <svg class="accent-text animate-pulse" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            <span class="text-[10px] tracking-[0.4em] uppercase font-bold text-white/40">EXPERTISE INVENTORY</span>
          </div>
          <h2 class="text-3xl font-light tracking-wide text-white">
            Matriks <span class="font-bold">Keahlian</span>
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" id="skills-grid"></div>
      </section>

      <section id="contact" class="p-6 md:p-12 relative flex-1 flex flex-col justify-between min-h-[500px]">
        <div class="absolute bottom-0 right-0 w-44 h-44 bg-cyan-500/[0.01] border-t border-l border-white/5 pointer-events-none"></div>

        <div class="mb-8">
          <div class="flex items-center gap-2 mb-2">
            <svg class="accent-text" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            <span class="text-[10px] tracking-[0.4em] uppercase font-bold text-white/40">SECURE COMMS INTERFACE</span>
          </div>
          <h2 class="text-3xl font-light tracking-wide text-white">
            Koneksi <span class="font-bold">Sistem</span>
          </h2>
          <p class="text-xs text-white/40 mt-3 max-w-md font-light leading-relaxed">
            Kirim pesan langsung ke Reonzy Akbar. Saluran transmisi tanggapan dijamin aktif dalam waktu 24 jam operasional bumi.
          </p>
        </div>

        <form id="contact-form" onsubmit="submitContactForm(event)" class="space-y-4 max-w-xl mb-12">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Identitas Pemanggil *</label>
              <input type="text" id="contact-name" required placeholder="Nama / Korporasi" class="w-full bg-cyber-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label class="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Alamat Email *</label>
              <input type="email" id="contact-email" required placeholder="nama@domain.com" class="w-full bg-cyber-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Subjek Node</label>
            <input type="text" id="contact-subject" placeholder="Inquiry Proyek / Kolaborasi" class="w-full bg-cyber-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div>
            <label class="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Pesan Payload *</label>
            <textarea id="contact-message" required rows="4" placeholder="Ketikkan pesan detail Anda di sini..." class="w-full bg-cyber-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"></textarea>
          </div>

          <div class="flex items-center gap-4">
            <button type="submit" class="text-[10px] uppercase font-mono tracking-widest bg-white text-black font-semibold hover:bg-white/90 px-5 py-2.5 rounded transition-all flex items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> 
              TRANSMIT_PESAN
            </button>
            <span id="contact-success" class="hidden text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 animate-pulse">
              ✓ Pesan Berhasil Ditransmisikan ke Server Email!
            </span>
          </div>
        </form>

        <footer class="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            <span class="text-[10px] uppercase tracking-widest text-white/40 font-mono">
              All Systems Fully Functional // Ping Stable
            </span>
          </div>
          <div class="text-[10px] uppercase tracking-widest text-white/20 font-mono">
            © <span id="current-year">2026</span> REONZY AKBAR / CRAFTED WITH SINGLE FILE STANDALONE HTML
          </div>
        </footer>
      </section>
    </main>
  </div>

  <div id="project-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="w-full max-w-lg border border-white/15 bg-cyber-card rounded-xl overflow-hidden p-6 relative accent-shadow">
      <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div class="flex items-center gap-2">
          <svg class="accent-text" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span id="modal-title" class="text-xs uppercase font-mono tracking-widest font-bold text-white">Konfigurator Proyek</span>
        </div>
        <button onclick="closeProjectModal()" class="p-1 rounded text-white/40 hover:text-white hover:bg-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <form id="project-form" onsubmit="saveProjectData(event)" class="space-y-4">
        <input type="hidden" id="project-id" value="" />
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Judul Proyek *</label>
          <input type="text" id="project-title" required placeholder="Contoh: Interface Neural V3" class="w-full bg-cyber-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Deskripsi Proyek *</label>
          <textarea id="project-description" required rows="3" placeholder="Jelaskan ringkasan fungsionalitas dan stack teknis proyek." class="w-full bg-cyber-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"></textarea>
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Tautan URL / Github Repository</label>
          <input type="url" id="project-link" placeholder="https://github.com/AkbarBatagore" class="w-full bg-cyber-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Tags (Pisahkan koma)</label>
            <input type="text" id="project-tags" placeholder="React, Solidity, JS" class="w-full bg-cyber-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div>
            <label class="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Warna Aksen Kartu</label>
            <select id="project-accent" class="w-full bg-cyber-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors">
              <option value="cyan">Cyan (Sian)</option>
              <option value="purple">Purple (Fuchsia)</option>
              <option value="emerald">Emerald (Hijau)</option>
              <option value="amber">Amber (Kuning)</option>
              <option value="rose">Rose (Merah)</option>
            </select>
          </div>
        </div>
        <div class="pt-4 border-t border-white/10 flex justify-end gap-2">
          <button type="button" onclick="closeProjectModal()" class="text-[10px] font-mono uppercase tracking-widest border border-white/10 text-white/60 hover:text-white px-4 py-2 rounded transition-all">Batal</button>
          <button type="submit" class="text-[10px] font-mono uppercase tracking-widest bg-white text-black font-semibold hover:bg-white/95 px-4 py-2 rounded transition-all">Simpan Konfigurasi</button>
        </div>
      </form>
    </div>
  </div>

  <script type="text/javascript">
    let isMutedState = false;
    let selectedAccent = 'cyan';
    let currentFilterTag = 'All';
    let editingId = null;

    let projects = ${serializedProjects};

    const SKILLS_MATRIX = [
      { name: 'Frontend Architecture', level: 92 },
      { name: 'React / Next.js Frameworks', level: 95 },
      { name: 'TypeScript Systems', level: 88 },
      { name: 'Tailwind CSS / UI Systems', level: 96 },
      { name: 'Framer & Web Animations', level: 85 },
      { name: 'Smart Contract / Solidity', level: 70 },
      { name: 'Rust Core Development', level: 75 },
      { name: 'AI Engineering & Prompting', level: 90 }
    ];

    let audioContext = null;

    function synthSound(type) {
      if (isMutedState) return;
      try {
        if (!audioContext) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        const now = audioContext.currentTime;

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now); osc.stop(now + 0.12);
        } else if (type === 'hover') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1050, now);
          gain.gain.setValueAtTime(0.015, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now); osc.stop(now + 0.05);
        } else if (type === 'success') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.07);
          osc.frequency.setValueAtTime(783.99, now + 0.14);
          osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.22);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'delete') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.linearRampToValueAtTime(120, now + 0.22);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now); osc.stop(now + 0.22);
        } else if (type === 'warning') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(180, now + 0.1);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now); osc.stop(now + 0.25);
        }
      } catch (err) {}
    }

    function pushSystemLog(message, type = 'action') {
      const logsContainer = document.getElementById('terminal-logs');
      if (!logsContainer) return;
      const time = new Date();
      const ts = \`\${time.toTimeString().split(' ')[0]}.\${String(time.getMilliseconds()).padStart(3, '0')}\`;
      let colorClass = 'text-white/40';
      if (type === 'system') colorClass = 'text-cyan-500/80';
      if (type === 'success') colorClass = 'text-emerald-400';
      if (type === 'warning') colorClass = 'text-amber-500';
      const line = document.createElement('div');
      line.className = 'leading-relaxed hover:bg-white/5 px-1 py-0.5 rounded transition-all flex items-start gap-1.5';
      line.innerHTML = \`<span class="text-white/20 select-none">[\${ts}]</span><span class="\${colorClass}">\${message}</span>\`;
      logsContainer.insertBefore(line, logsContainer.firstChild);
      while (logsContainer.children.length > 25) { logsContainer.removeChild(logsContainer.lastChild); }
    }

    function initClock() {
      const clockElem = document.getElementById('clock');
      setInterval(() => {
        const now = new Date();
        if (clockElem) clockElem.textContent = now.toTimeString().split(' ')[0];
      }, 1000);
      document.getElementById('current-year').textContent = new Date().getFullYear();
    }

    function scrollToSection(id) {
      synthSound('click');
      const elem = document.getElementById(id === 'home' ? 'aside-home' : id);
      if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('mobile-menu').classList.add('hidden');
      document.getElementById('menu-icon-open').classList.remove('hidden');
      document.getElementById('menu-icon-close').classList.add('hidden');
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = 'text-white/50 hover:text-white nav-btn transition-all duration-300';
      });
      const activeBtn = document.getElementById(\`nav-\${id}\`);
      if (activeBtn) activeBtn.className = 'text-white border-b-2 accent-border pb-1 nav-btn transition-all duration-300';
    }

    function toggleMobileMenu() {
      synthSound('click');
      const drawer = document.getElementById('mobile-menu');
      const openIcon = document.getElementById('menu-icon-open');
      const closeIcon = document.getElementById('menu-icon-close');
      if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden'); openIcon.classList.add('hidden'); closeIcon.classList.remove('hidden');
      } else {
        drawer.classList.add('hidden'); openIcon.classList.remove('hidden'); closeIcon.classList.add('hidden');
      }
    }

    function toggleMute() {
      isMutedState = !isMutedState;
      const btn = document.getElementById('sound-btn');
      if (isMutedState) {
        btn.innerHTML = \`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>\`;
        pushSystemLog('AUDIO FEEDBACK STATE: MUTED', 'warning');
      } else {
        btn.innerHTML = \`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-pulse"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>\`;
        synthSound('click'); pushSystemLog('AUDIO FEEDBACK STATE: ACTIVE', 'success');
      }
    }

    function changeThemeAccent(color) {
      synthSound('click'); selectedAccent = color;
      document.body.className = document.body.className.replace(/color-\\w+/, \`color-\${color}\`);
      pushSystemLog(\`SYSTEM COLOUR HUE ALIGNED: \${color.toUpperCase()}\`, 'system');
      renderCards();
    }

    function renderFilters() {
      const allTags = ['All', ...new Set(projects.flatMap(p => p.tags))];
      const filterContainer = document.getElementById('filter-container');
      filterContainer.innerHTML = '';
      allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = \`text-[9px] uppercase tracking-wider px-3 py-1.5 rounded font-mono border transition-all \${currentFilterTag === tag ? 'text-white border-white/30 bg-white/5 font-semibold' : 'text-white/40 border-white/5 hover:border-white/15 hover:text-white bg-black/20'}\`;
        btn.textContent = tag;
        btn.onclick = () => {
          synthSound('click'); currentFilterTag = tag;
          pushSystemLog(\`FILTER CHIPS APPLIED: [\${tag.toUpperCase()}]\`, 'system');
          renderFilters(); renderCards();
        };
        filterContainer.appendChild(btn);
      });
    }

    function renderCards() {
      const container = document.getElementById('projects-grid');
      container.innerHTML = '';
      const filtered = projects.filter(p => {
        if (currentFilterTag === 'All') return true;
        return p.tags.includes(currentFilterTag);
      });
      const borderColors = {
        cyan: 'border-cyan-500/30 hover:border-cyan-400',
        purple: 'border-fuchsia-500/30 hover:border-fuchsia-400',
        emerald: 'border-emerald-500/30 hover:border-emerald-400',
        amber: 'border-amber-500/30 hover:border-amber-400',
        rose: 'border-rose-500/30 hover:border-rose-400'
      };
      const bgAccentColors = {
        cyan: 'bg-cyan-500', purple: 'bg-fuchsia-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', rose: 'bg-rose-500'
      };
      filtered.forEach(proj => {
        const activeBorder = borderColors[proj.accent] || borderColors[selectedAccent];
        const activeBg = bgAccentColors[proj.accent] || bgAccentColors[selectedAccent];
        const card = document.createElement('div');
        card.className = \`group relative border rounded-xl overflow-hidden bg-[#0c0c0c]/80 hover:bg-[#0f0f0f] p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 \${activeBorder}\`;
        card.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
        card.innerHTML = \`
          <div class="absolute top-4 right-4 font-mono text-[10px] text-white/20 group-hover:text-white/60 transition-colors">[ \${proj.index} ]</div>
          <div>
            <div class="w-10 h-0.5 mb-6 transition-all duration-500 group-hover:w-20 \${activeBg}"></div>
            <h3 class="text-lg font-bold text-white mb-2 tracking-wide">\${proj.title}</h3>
            <p class="text-xs text-white/50 group-hover:text-white/70 leading-relaxed font-light mb-6">\${proj.description}</p>
          </div>
          <div>
            <div class="flex flex-wrap gap-1.5 mb-4">\${proj.tags.map(t => \`<span class="text-[8px] font-mono tracking-widest px-2 py-0.5 bg-white/5 rounded text-white/60 uppercase">\${t}</span>\`).join('')}</div>
            <div class="flex items-center justify-between pt-2 border-t border-white/5">
              <a href="\${proj.link}" target="_blank" onclick="synthSound('click')" class="text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 text-white/40 hover:text-white hover:underline transition-colors">
                Launch Hub
              </a>
              <div class="flex gap-2">
                <button onclick="openProjectModal(true, '\${proj.id}')" class="p-1 rounded bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
                <button onclick="deleteProject('\${proj.id}')" class="p-1 rounded bg-white/5 hover:bg-red-950/40 text-white/40 hover:text-red-400 border border-transparent hover:border-red-500/35 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          </div>\`;
        container.appendChild(card);
      });
    }

    function renderSkills() {
      const grid = document.getElementById('skills-grid'); grid.innerHTML = '';
      SKILLS_MATRIX.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'space-y-2 border border-white/5 p-4 rounded-lg bg-white/[0.01] hover:bg-white/[0.02] transition-all';
        item.innerHTML = \`<div class="flex justify-between items-center text-xs"><span class="font-mono uppercase text-white/70 font-semibold">\${skill.name}</span><span class="font-mono accent-text">\${skill.level}%</span></div><div class="w-full bg-white/5 h-1 rounded-full overflow-hidden"><div class="accent-bg h-full rounded-full" style="width: \${skill.level}%"></div></div>\`;
        grid.appendChild(item);
      });
    }

    function deleteProject(id) {
      synthSound('delete'); const item = projects.find(p => p.id === id); projects = projects.filter(p => p.id !== id);
      pushSystemLog(\`DELETED PROJECT: [\${item ? item.title : id}]\`, 'warning'); renderFilters(); renderCards();
    }

    function openProjectModal(isEdit, id = null) {
      synthSound('click'); const modal = document.getElementById('project-modal'); modal.classList.remove('hidden');
      if (isEdit) {
        editingId = id; document.getElementById('modal-title').textContent = 'Edit Kartu Proyek';
        const p = projects.find(item => item.id === id);
        if (p) {
          document.getElementById('project-id').value = p.id; document.getElementById('project-title').value = p.title;
          document.getElementById('project-description').value = p.description; document.getElementById('project-link').value = p.link;
          document.getElementById('project-tags').value = p.tags.join(', '); document.getElementById('project-accent').value = p.accent;
        }
      } else {
        editingId = null; document.getElementById('modal-title').textContent = 'Konfigurator Proyek Baru';
        document.getElementById('project-form').reset(); document.getElementById('project-id').value = '';
      }
    }

    function closeProjectModal() { synthSound('click'); document.getElementById('project-modal').classList.add('hidden'); }

    function saveProjectData(e) {
      e.preventDefault();
      const title = document.getElementById('project-title').value;
      const description = document.getElementById('project-description').value;
      const link = document.getElementById('project-link').value || 'https://github.com/AkbarBatagore';
      const tagsRaw = document.getElementById('project-tags').value;
      const accent = document.getElementById('project-accent').value;
      const tagsArray = tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0);

      if (editingId) {
        projects = projects.map(p => p.id === editingId ? { ...p, title, description, link, tags: tagsArray, accent } : p);
        pushSystemLog(\`UPDATED PROJECT: [\${title}]\`, 'success');
      } else {
        const nextIndex = String(projects.length + 1).padStart(2, '0');
        projects.push({ id: Math.random().toString(36).substring(2, 9), title, description, link, tags: tagsArray, accent, index: nextIndex });
        pushSystemLog(\`ADDED NEW PROJECT CARD: [\${title}]\`, 'success');
      }
      closeProjectModal(); synthSound('success'); renderFilters(); renderCards();
    }

    function resetToDefaultProjects() {
      synthSound('warning');
      if (confirm("Kembalikan daftar proyek ke default?")) {
        projects = ${JSON.stringify(DEFAULT_PROJECTS, null, 2)};
        pushSystemLog("RESTORED DEFAULT CASE STUDIES", "system"); synthSound('success'); renderFilters(); renderCards();
      }
    }

    function submitContactForm(e) {
      e.preventDefault(); synthSound('click');
      const subject = document.getElementById('contact-subject').value || 'Inquiry';
      pushSystemLog(\`TRANSMITTING MESSAGE NODE: [\${subject}]\`, 'action');
      setTimeout(() => {
        pushSystemLog(\`TRANSMITTED MESSAGE TO REONZY.AKBAR@GMAIL.COM SECURELY!\`, 'success'); synthSound('success');
        document.getElementById('contact-success').classList.remove('hidden'); document.getElementById('contact-form').reset();
        setTimeout(() => document.getElementById('contact-success').classList.add('hidden'), 5000);
      }, 1500);
    }

    function exportJSONBackup() {
      synthSound('success'); navigator.clipboard.writeText(JSON.stringify(projects, null, 2));
      pushSystemLog("CONFIG COPIED TO LOCAL CLIPBOARD", "success"); alert("Konfigurasi proyek disalin ke clipboard!");
    }

    function importJSONBackup() {
      synthSound('click'); const val = prompt("Tempel JSON konfigurasi proyek Anda:");
      if (!val) return;
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          projects = parsed; pushSystemLog("IMPORTED CONFIG FROM CLIPBOARD", "success"); synthSound('success'); renderFilters(); renderCards();
        } else { throw new Error(); }
      } catch { synthSound('warning'); pushSystemLog("IMPORT ERROR: Invalid JSON Format", "warning"); alert("Format JSON tidak valid."); }
    }

    window.addEventListener('load', () => {
      initClock(); renderFilters(); renderCards(); renderSkills();
      pushSystemLog("NEURAL INTERFACE STANDALONE MODULE LOADED.", "system");
    });
  </script>
</body>
</html>`;

    // Trigger file download
    const blob = new Blob([htmlTemplate], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "portfolio_reonzy_akbar.html");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    pushLog("STANDALONE HTML PORTFOLIO DOWNLOADED SUCCESSFULLY", "success");
  };

  // Filter projects list
  const filteredProjects = projects.filter(p => {
    if (filterTag === 'All') return true;
    return p.tags.includes(filterTag);
  });


  return (
    <div id="app" className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans relative flex flex-col overflow-x-hidden scanline cyber-grid selection:bg-cyan-500/35 selection:text-white">
      
      {/* Background Ambience Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 right-10 w-[35vw] h-[35vw] bg-fuchsia-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* FIXED HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#050505]/85 backdrop-blur-md border-b border-white/10 px-6 py-4 md:px-12 flex items-center justify-between transition-all duration-300">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => scrollToAnchor('home')}
          className="flex items-center gap-3 cursor-pointer group"
          onMouseEnter={() => triggerSynth('hover')}
        >
          <div 
            className="w-8 h-8 rounded-sm rotate-45 flex items-center justify-center transition-all duration-300 border"
            style={{ 
              borderColor: currentThemeHex, 
              boxShadow: `0 0 10px ${currentThemeHex}33`
            }}
          >
            <span className="text-white font-bold -rotate-45 text-xs tracking-wider">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-[0.3em] uppercase group-hover:text-white transition-colors">
              AKBAR <span style={{ color: currentThemeHex }}>BATAGORE</span>
            </span>
            <span className="text-[8px] text-white/30 tracking-widest uppercase">System Portofolio</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-semibold items-center">
          <button 
            onClick={() => scrollToAnchor('home')} 
            className={`transition-all duration-300 ${activeSection === 'home' ? 'text-white border-b-2 pb-1' : 'text-white/50 hover:text-white'}`}
            style={activeSection === 'home' ? { borderBottomColor: currentThemeHex } : {}}
            onMouseEnter={() => triggerSynth('hover')}
          >
            Terminal Home
          </button>
          <button 
            onClick={() => scrollToAnchor('projects')} 
            className={`transition-all duration-300 ${activeSection === 'projects' ? 'text-white border-b-2 pb-1' : 'text-white/50 hover:text-white'}`}
            style={activeSection === 'projects' ? { borderBottomColor: currentThemeHex } : {}}
            onMouseEnter={() => triggerSynth('hover')}
          >
            Selected Work
          </button>
          <button 
            onClick={() => scrollToAnchor('skills')} 
            className={`transition-all duration-300 ${activeSection === 'skills' ? 'text-white border-b-2 pb-1' : 'text-white/50 hover:text-white'}`}
            style={activeSection === 'skills' ? { borderBottomColor: currentThemeHex } : {}}
            onMouseEnter={() => triggerSynth('hover')}
          >
            Skills Matrix
          </button>
          <button 
            onClick={() => scrollToAnchor('contact')} 
            className={`transition-all duration-300 ${activeSection === 'contact' ? 'text-white border-b-2 pb-1' : 'text-white/50 hover:text-white'}`}
            style={activeSection === 'contact' ? { borderBottomColor: currentThemeHex } : {}}
            onMouseEnter={() => triggerSynth('hover')}
          >
            Contact
          </button>
        </nav>

        {/* Status System Metrics (Sound, Theme Hue, Local Clock) */}
        <div className="flex items-center gap-4">
          
          {/* Accent Color quick change */}
          <div className="hidden lg:flex items-center gap-1.5 border border-white/10 px-2.5 py-1 rounded bg-black/40">
            <span className="text-[8px] uppercase tracking-wider text-white/40 mr-1">Hue:</span>
            {(['cyan', 'purple', 'emerald', 'amber', 'rose'] as const).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setAccentColor(c);
                  triggerSynth('click');
                  pushLog(`THEME SCHEME CONFIGURED TO: ${c.toUpperCase()}`, 'system');
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  accentColor === c ? 'scale-125 border-white ring-1 ring-cyan-500/50' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: 
                    c === 'cyan' ? '#06b6d4' : 
                    c === 'purple' ? '#d946ef' : 
                    c === 'emerald' ? '#10b981' : 
                    c === 'amber' ? '#f59e0b' : '#f43f5e'
                }}
                title={`Ganti tema aksen ke ${c}`}
              />
            ))}
          </div>

          {/* Time indicator */}
          <div className="hidden sm:block text-[11px] font-mono tracking-widest text-white/50 bg-black/50 border border-white/10 px-3 py-1 rounded">
            SYS_TIME: <span style={{ color: currentThemeHex }} className="font-bold">{digitalTime}</span>
          </div>

          {/* Audio toggle button */}
          <button 
            onClick={() => {
              const nextMute = !isMuted;
              setIsMuted(nextMute);
              if (!nextMute) {
                setTimeout(() => triggerSynth('click'), 100);
              }
              pushLog(`AUDIO FEEDBACK STATE: ${nextMute ? 'MUTED' : 'ACTIVE'}`, 'audio');
            }}
            className="p-1.5 rounded border border-white/10 bg-black/40 text-white/60 hover:text-white hover:border-white/20 transition-all"
            title={isMuted ? "Aktifkan Suara" : "Bisukan Suara"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-pulse" />}
          </button>

          {/* Mobile hamburger menu */}
          <button 
            onClick={() => {
              triggerSynth('click');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-1.5 rounded border border-white/10 bg-black/40 text-white/60 hover:text-white transition-all"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

        </div>

      </header>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[69px] left-0 w-full bg-[#050505]/95 border-b border-white/15 z-30 p-6 flex flex-col gap-5 text-sm uppercase tracking-[0.2em] font-medium backdrop-blur-xl animate-fadeIn">
          
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] text-white/30 tracking-[0.3em]">NAVIGASI</span>
            <div className="flex items-center gap-1.5">
              {(['cyan', 'purple', 'emerald', 'amber', 'rose'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setAccentColor(c);
                    triggerSynth('click');
                  }}
                  className={`w-3 h-3 rounded-full ${accentColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                  style={{
                    backgroundColor: 
                      c === 'cyan' ? '#06b6d4' : 
                      c === 'purple' ? '#d946ef' : 
                      c === 'emerald' ? '#10b981' : 
                      c === 'amber' ? '#f59e0b' : '#f43f5e'
                  }}
                />
              ))}
            </div>
          </div>

          <button 
            onClick={() => scrollToAnchor('home')}
            className={`text-left py-2 flex justify-between items-center ${activeSection === 'home' ? 'text-white' : 'text-white/50'}`}
          >
            <span>01 // HOME</span>
            <span className="text-xs text-cyan-400">►</span>
          </button>
          <button 
            onClick={() => scrollToAnchor('projects')}
            className={`text-left py-2 flex justify-between items-center ${activeSection === 'projects' ? 'text-white' : 'text-white/50'}`}
          >
            <span>02 // SELECTED WORK</span>
            <span className="text-xs text-cyan-400">►</span>
          </button>
          <button 
            onClick={() => scrollToAnchor('skills')}
            className={`text-left py-2 flex justify-between items-center ${activeSection === 'skills' ? 'text-white' : 'text-white/50'}`}
          >
            <span>03 // SKILLS MATRIX</span>
            <span className="text-xs text-cyan-400">►</span>
          </button>
          <button 
            onClick={() => scrollToAnchor('contact')}
            className={`text-left py-2 flex justify-between items-center ${activeSection === 'contact' ? 'text-white' : 'text-white/50'}`}
          >
            <span>04 // CONTACT INTERFACE</span>
            <span className="text-xs text-cyan-400">►</span>
          </button>

          <div className="pt-4 border-t border-white/5 text-[9px] text-white/30 font-mono text-center">
            SYS_TIME: {digitalTime} // SECURITY SECURE
          </div>
        </div>
      )}

      {/* CORE WORKSPACE / WRAPPER */}
      <div className="w-full max-w-[1400px] mx-auto flex-1 flex flex-col md:flex-row border-x border-white/10 min-h-[calc(100vh-69px)]">
        
        {/* LEFT COLUMN: THE STATIONARY PROFILE PANEL */}
        <aside id="home" className="w-full md:w-[38%] border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-12 flex flex-col justify-between gap-12 bg-black/20">
          
          {/* Header Profile Info */}
          <div className="space-y-8">
            
            {/* Pulsing visual photo avatar */}
            <div className="relative w-44 h-44 mb-6 group mx-auto md:mx-0">
              
              {/* Spinning visual borders */}
              <div 
                className="absolute inset-0 border rounded-full animate-spin pointer-events-none" 
                style={{ 
                  animationDuration: '15s',
                  borderColor: `${currentThemeHex}33`,
                  borderTopColor: currentThemeHex
                }}
              ></div>
              <div className="absolute inset-2 border border-dashed border-white/10 rounded-full"></div>
              
              {/* Glowing Ambient Glow */}
              <div 
                className="absolute inset-0 rounded-full filter blur-md transition-all duration-300 opacity-30 group-hover:opacity-70"
                style={{ backgroundColor: currentThemeHex }}
              ></div>

              {/* Real Profile Image */}
              <img 
                src="https://github.com/AkbarBatagore.png" 
                className="w-full h-full object-cover rounded-full border-2 border-white/20 grayscale group-hover:grayscale-0 group-hover:border-white/50 transition-all duration-500 relative z-10" 
                alt="Akbar Batagore Profile Avatar"
                onError={(e) => {
                  // Fallback if avatar fails loading
                  (e.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/9919?v=4';
                }}
              />
              
              {/* Active Now Status badge */}
              <div className="absolute -bottom-2 -right-1 bg-[#050505] border border-white/10 px-3 py-1 text-[9px] uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5 rounded-sm z-20 shadow-lg">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                ACTIVE_NOW
              </div>

            </div>

            {/* Profile Intro Texts */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-light leading-tight tracking-tight mb-4 text-white">
                REONZY <br className="hidden md:block"/>
                <span 
                  className="italic font-bold tracking-widest transition-all duration-300"
                  style={{ color: currentThemeHex }}
                >
                  AKBAR
                </span>
              </h1>
              
              <div className="h-0.5 w-16 mb-4 rounded" style={{ backgroundColor: currentThemeHex }}></div>
              
              <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-sm font-light">
                Membangun pengalaman digital masa depan yang sangat responsif, presisi tinggi, dan kaya visual melalui integrasi visual mutakhir serta rekayasa desain web.
              </p>
            </div>

          </div>

          {/* Social Media Grid */}
          <div className="space-y-4">
            <div className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold text-center md:text-left">
              SOCIALS & CHANNELS
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              
              {/* Email contact */}
              <a 
                href="mailto:reonzy.akbar@gmail.com" 
                onClick={() => {
                  triggerSynth('click');
                  pushLog("SOCIAL ENGAGEMENT: Email Mailto triggered", "action");
                }}
                className="flex items-center gap-2 text-[10px] font-mono hover:text-white border border-white/5 p-3 rounded bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
              >
                <Mail size={13} style={{ color: currentThemeHex }} className="group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/40">EMAIL</span>
                  <span className="truncate">reonzy.akbar</span>
                </div>
              </a>

              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@reonzy33" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => {
                  triggerSynth('click');
                  pushLog("SOCIAL ENGAGEMENT: Redirecting to TikTok @reonzy33", "action");
                }}
                className="flex items-center gap-2 text-[10px] font-mono hover:text-white border border-white/5 p-3 rounded bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
              >
                <Play size={13} style={{ color: currentThemeHex }} className="group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/40">TIKTOK</span>
                  <span>@reonzy33</span>
                </div>
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/reonzyyx" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => {
                  triggerSynth('click');
                  pushLog("SOCIAL ENGAGEMENT: Redirecting to Instagram @reonzyyx", "action");
                }}
                className="flex items-center gap-2 text-[10px] font-mono hover:text-white border border-white/5 p-3 rounded bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
              >
                <Instagram size={13} style={{ color: currentThemeHex }} className="group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/40">INSTAGRAM</span>
                  <span>reonzyyx</span>
                </div>
              </a>

              {/* Pinterest */}
              <a 
                href="https://www.pinterest.com/reonzyyx" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => {
                  triggerSynth('click');
                  pushLog("SOCIAL ENGAGEMENT: Redirecting to Pinterest @reonzyyx", "action");
                }}
                className="flex items-center gap-2 text-[10px] font-mono hover:text-white border border-white/5 p-3 rounded bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
              >
                <PinterestIcon size={13} style={{ color: currentThemeHex }} className="group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/40">PINTEREST</span>
                  <span>@reonzyyx</span>
                </div>
              </a>

            </div>
          </div>

          {/* FUTURISTIC TERMINAL LOGS */}
          <div className="hidden lg:flex flex-col border border-white/10 rounded bg-[#020202]/90 p-4 font-mono text-[9px] h-44 relative overflow-hidden">
            
            {/* Header console bar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <TerminalIcon size={11} style={{ color: currentThemeHex }} />
                <span className="text-white/40 tracking-widest font-bold">REONZY_SYSTEM_CONSOLE v2.1</span>
              </div>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>

            {/* Scrollable Log Lines */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {logs.map((log) => {
                let colorClass = 'text-white/40';
                if (log.type === 'system') colorClass = 'text-cyan-500/80';
                if (log.type === 'success') colorClass = 'text-emerald-400';
                if (log.type === 'warning') colorClass = 'text-amber-500';
                if (log.type === 'audio') colorClass = 'text-fuchsia-400/80';

                return (
                  <div key={log.id} className="leading-relaxed hover:bg-white/5 px-1 py-0.5 rounded transition-all">
                    <span className="text-white/20 select-none mr-1.5">[{log.timestamp}]</span>
                    <span className={`${colorClass}`}>{log.message}</span>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-1 right-2 text-white/10 select-none">SECURE_NODE</div>

          </div>

        </aside>

        {/* RIGHT COLUMN: MAIN CONTENT CHANNELS */}
        <main className="flex-1 flex flex-col bg-[#070707] overflow-y-auto">
          
          {/* SECTION: SELECTED PROJECTS */}
          <section id="projects" className="p-6 md:p-12 border-b border-white/10 relative">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.01] border-b border-l border-white/5 pointer-events-none"></div>

            {/* Title / Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} style={{ color: currentThemeHex, animationDuration: '6s' }} className="animate-spin" />
                  <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/40">OPERATIONAL CASE STUDIES</span>
                </div>
                <h2 className="text-3xl font-light tracking-wide text-white">
                  Karya <span className="font-bold">Pilihan</span>
                </h2>
              </div>

              {/* Tag filters slider */}
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setFilterTag(tag);
                      triggerSynth('click');
                      pushLog(`FILTERING BY CATEGORY: [${(tag as string).toUpperCase()}]`, 'system');
                    }}
                    className={`text-[9px] uppercase tracking-wider px-3 py-1.5 rounded font-mono border transition-all ${
                      filterTag === tag 
                        ? 'text-white border-white/30 bg-white/5 font-semibold' 
                        : 'text-white/40 border-white/5 hover:border-white/15 hover:text-white bg-black/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* PROJECTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              
              {filteredProjects.map((proj) => {
                const currentAccentColor = accentTextColors[proj.accent] || accentTextColors[accentColor];
                const currentAccentBorder = accentBorderColors[proj.accent] || accentBorderColors[accentColor];
                const currentAccentBg = accentBgColors[proj.accent] || accentBgColors[accentColor];

                return (
                  <div 
                    key={proj.id} 
                    className={`group relative border rounded-xl overflow-hidden bg-[#0c0c0c]/80 hover:bg-[#0f0f0f] p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 ${currentAccentBorder}`}
                    style={{
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    {/* Index tag top right */}
                    <div className="absolute top-4 right-4 font-mono text-[10px] text-white/20 group-hover:text-white/60 transition-colors">
                      [ {proj.index} ]
                    </div>

                    <div>
                      {/* Accent Color Band */}
                      <div className={`w-10 h-0.5 mb-6 transition-all duration-500 group-hover:w-20 ${currentAccentBg}`}></div>
                      
                      {/* Project Title */}
                      <h3 className="text-lg font-bold text-white group-hover:text-white mb-2 tracking-wide flex items-center gap-1.5">
                        {proj.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs text-white/50 group-hover:text-white/70 leading-relaxed font-light mb-6">
                        {proj.description}
                      </p>
                    </div>

                    <div>
                      {/* Tags & Action Row */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="text-[8px] font-mono tracking-widest px-2 py-0.5 bg-white/5 rounded text-white/60 uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        
                        {/* Project Link */}
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => {
                            triggerSynth('click');
                            pushLog(`LAUNCH_URL: Redirecting to ${proj.title} repository`, 'action');
                          }}
                          className="text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 text-white/40 hover:text-white hover:underline transition-colors"
                        >
                          <ExternalLink size={10} /> Launch Hub
                        </a>

                        {/* Quick Action Editor Controls */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(proj)}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            title="Edit Proyek Ini"
                          >
                            <Edit3 size={11} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id, proj.title)}
                            className="p-1 rounded bg-white/5 hover:bg-red-950/40 text-white/40 hover:text-red-400 transition-all border border-transparent hover:border-red-500/35"
                            title="Hapus Proyek"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })}

              {/* EMPTY PLACEHOLDER CARD */}
              {filteredProjects.length === 0 && (
                <div className="col-span-full border border-dashed border-white/10 rounded-xl p-12 text-center flex flex-col items-center justify-center bg-black/10">
                  <Database size={24} className="text-white/20 mb-3 animate-bounce" />
                  <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Tidak ada proyek yang sesuai dengan filter</span>
                  <button 
                    onClick={() => setFilterTag('All')}
                    className="mt-4 text-[10px] font-mono tracking-wider border border-white/10 rounded px-3 py-1.5 hover:bg-white/5 text-white/70"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

            </div>

            {/* INTERACTIVE CONTROLS ENGINE (Yang akan diatur sendiri) */}
            <div className="border border-white/10 rounded-lg bg-black/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Settings size={14} style={{ color: currentThemeHex }} /> Control Panel Portofolio
                </h4>
                <p className="text-xs text-white/40 max-w-lg font-light">
                  Anda dapat menyetel sendiri proyek di atas secara instan! Tambahkan proyek baru, edit isi kartu, atau salin file backup konfigurasi Anda di sini.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    triggerSynth('click');
                    setEditingProject(null);
                    setFormData({ title: '', description: '', tags: [], link: '', accent: 'cyan' });
                    setFormTagsString('');
                    setShowConfigModal(true);
                    pushLog("TERMINAL INPUT: Open Project Creator", "action");
                  }}
                  className="text-[9px] uppercase font-mono tracking-widest bg-white text-black font-semibold hover:bg-white/95 px-4 py-2 rounded transition-all flex items-center gap-1.5 shadow-lg shadow-white/5 cursor-pointer"
                >
                  <Plus size={12} /> Tambah Project
                </button>

                <button
                  onClick={downloadHTMLVersion}
                  className="text-[9px] uppercase font-mono tracking-widest border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-cyan-500/5 text-cyan-400 px-3 py-2 rounded transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Unduh portofolio sebagai satu file HTML mandiri"
                >
                  <Download size={12} /> Unduh HTML
                </button>

                <button
                  onClick={exportConfig}
                  className="text-[9px] uppercase font-mono tracking-widest border border-white/10 hover:border-white/25 hover:bg-white/5 text-white/70 px-3 py-2 rounded transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Salin JSON konfigurasi saat ini"
                >
                  Export Backup
                </button>

                <button
                  onClick={importConfig}
                  className="text-[9px] uppercase font-mono tracking-widest border border-white/10 hover:border-white/25 hover:bg-white/5 text-white/70 px-3 py-2 rounded transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Impor daftar proyek dari cadangan JSON"
                >
                  Import Backup
                </button>

                <button
                  onClick={handleResetProjects}
                  className="text-[9px] uppercase font-mono tracking-widest border border-red-500/10 hover:border-red-500/30 text-red-400 hover:bg-red-500/5 px-3 py-2 rounded transition-all flex items-center gap-1"
                >
                  Reset Default
                </button>
              </div>
            </div>

          </section>

          {/* PROJECT CREATOR MODAL OVERLAY */}
          {showConfigModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              
              <div 
                className="w-full max-w-lg border border-white/15 bg-[#0a0a0a] rounded-xl overflow-hidden p-6 relative animate-fadeIn"
                style={{
                  boxShadow: `0 10px 40px rgba(0,0,0,0.8), 0 0 15px ${currentThemeHex}15`
                }}
              >
                {/* Header modal */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <Sliders size={15} style={{ color: currentThemeHex }} />
                    <span className="text-xs uppercase font-mono tracking-widest font-bold text-white">
                      {editingProject ? 'Sistem Edit Kartu Proyek' : 'Konfigurator Proyek Baru'}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      triggerSynth('click');
                      setShowConfigModal(false);
                      setEditingProject(null);
                    }}
                    className="p-1 rounded text-white/40 hover:text-white transition-all hover:bg-white/5"
                  >
                    <X size={15} />
                  </button>
                </div>

                <form onSubmit={handleSaveProject} className="space-y-4">
                  
                  {/* Title field */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Judul Proyek *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                      placeholder="Contoh: Neural Web Interface" 
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  {/* Description field */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Deskripsi Proyek *</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                      placeholder="Jelaskan ringkasan fungsionalitas dan stack teknis proyek." 
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Link field */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Tautan URL / Github Repository</label>
                    <input 
                      type="url" 
                      value={formData.link || ''}
                      onChange={(e) => setFormData(p => ({ ...p, link: e.target.value }))}
                      placeholder="https://github.com/AkbarBatagore" 
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  {/* Accent design & Tags side-by-side */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Tags input */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Tags (Pisahkan koma)</label>
                      <input 
                        type="text" 
                        value={formTagsString}
                        onChange={(e) => setFormTagsString(e.target.value)}
                        placeholder="React, Rust, UI" 
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    {/* Accent selection */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Warna Aksen Kartu</label>
                      <select
                        value={formData.accent || 'cyan'}
                        onChange={(e) => setFormData(p => ({ ...p, accent: e.target.value as any }))}
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      >
                        <option value="cyan">Cyan (Sian)</option>
                        <option value="purple">Purple (Fuchsia)</option>
                        <option value="emerald">Emerald (Hijau)</option>
                        <option value="amber">Amber (Kuning)</option>
                        <option value="rose">Rose (Merah)</option>
                      </select>
                    </div>

                  </div>

                  {/* Submit controls */}
                  <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerSynth('click');
                        setShowConfigModal(false);
                        setEditingProject(null);
                      }}
                      className="text-[10px] font-mono uppercase tracking-wider px-4 py-2 border border-white/10 rounded text-white/50 hover:text-white"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="text-[10px] font-mono uppercase tracking-wider px-5 py-2 rounded bg-white text-black font-semibold hover:bg-white/90 transition-colors flex items-center gap-1"
                    >
                      <Check size={11} /> Simpan Kartu
                    </button>
                  </div>

                </form>

              </div>

            </div>
          )}

          {/* SECTION: SKILLS MATRIX */}
          <section id="skills" className="p-6 md:p-12 border-b border-white/10 relative">
            
            <div className="absolute top-0 left-0 w-32 h-32 bg-fuchsia-500/[0.01] border-b border-r border-white/5 pointer-events-none"></div>

            <div className="mb-10">
              <div className="flex items-center gap-2 mb-2">
                <Code size={12} style={{ color: currentThemeHex }} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/40">PROFICIENCY GRID</span>
              </div>
              <h2 className="text-3xl font-light tracking-wide text-white">
                Spesialisasi <span className="font-bold">Sistem</span>
              </h2>
            </div>

            {/* SKILLS CONTAINER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {SKILLS.map((skill, index) => (
                <div 
                  key={index}
                  className="border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] rounded-lg p-5 transition-all duration-300 relative group overflow-hidden"
                  onMouseEnter={() => triggerSynth('hover')}
                >
                  <div className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: currentThemeHex }}></div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono font-semibold tracking-wider text-white group-hover:text-white transition-colors">{skill.name}</span>
                    <span className="text-[10px] font-mono text-white/30 group-hover:text-white/80 transition-colors" style={{ color: currentThemeHex }}>{skill.level}%</span>
                  </div>

                  {/* Custom animated neon loader bar */}
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${skill.level}%`, 
                        backgroundColor: currentThemeHex,
                        boxShadow: `0 0 8px ${currentThemeHex}aa`
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mt-3 text-[8px] font-mono text-white/20">
                    <span>SYS_ALLOC: ACTIVE</span>
                    <span>TYPE // {skill.category.toUpperCase()}</span>
                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* SECTION: CONTACT INTERFACE */}
          <section id="contact" className="p-6 md:p-12 relative flex-1 flex flex-col justify-between min-h-[500px]">
            
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-cyan-500/[0.01] border-t border-l border-white/5 pointer-events-none"></div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Send size={12} style={{ color: currentThemeHex }} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/40">SECURE COMMS INTERFACE</span>
              </div>
              <h2 className="text-3xl font-light tracking-wide text-white">
                Koneksi <span className="font-bold">Sistem</span>
              </h2>
              <p className="text-xs text-white/40 mt-3 max-w-md font-light leading-relaxed">
                Kirim pesan terenkripsi langsung ke Reonzy Akbar. Saluran tanggapan sistem dijamin aktif dalam waktu 24 jam operasional bumi.
              </p>
            </div>

            {/* CONTACT FORM */}
            <form onSubmit={handleContactSubmit} className="space-y-4 max-w-xl mb-12">
              
              {/* Row for Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Identitas Pemanggil *</label>
                  <input 
                    type="text" 
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nama / Korporasi" 
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Alamat Email *</label>
                  <input 
                    type="email" 
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="nama@domain.com" 
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

              </div>

              {/* Subject */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Subjek Node</label>
                <input 
                  type="text" 
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Inquiry Proyek / Kolaborasi" 
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Message Payload */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Pesan Payload *</label>
                <textarea 
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Ketikkan pesan detail Anda di sini..." 
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              {/* Submit Transmit Button */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSending}
                  className="text-[10px] uppercase font-mono tracking-widest bg-white text-black font-semibold hover:bg-white/90 disabled:bg-white/50 disabled:text-black/50 px-5 py-2.5 rounded transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" /> MENTRANSMISIKAN...
                    </>
                  ) : (
                    <>
                      <Send size={11} /> TRANSMIT_PESAN
                    </>
                  )}
                </button>

                {sendSuccess && (
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 animate-pulse">
                    <Check size={12} /> Pesan Berhasil Ditransmisikan ke Server Email!
                  </div>
                )}
              </div>

            </form>

            {/* STATUS FOOTER SYSTEM */}
            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
                  All Systems Fully Functional // Ping Stable
                </span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/20 font-mono">
                © {new Date().getFullYear()} REONZY AKBAR / CRAFTED WITH REACT & TAILWIND V4
              </div>
            </div>

          </section>

        </main>

      </div>

    </div>
  );
}
