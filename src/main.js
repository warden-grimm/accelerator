import './style.css'
import { marked } from 'marked';

document.querySelector('#app').innerHTML = `
  <div id="progress-bar"></div>
  <nav id="section-nav"></nav>
  <main id="scroll-container"></main>
  <div id="controls">
    <button id="share-btn">Copy Share Link</button>
    <button id="markdown-btn">View as Markdown</button>
  </div>
  <div id="markdown-modal" class="hidden">
    <div class="modal-content">
      <button id="close-modal">×</button>
      <pre id="markdown-content"></pre>
    </div>
  </div>
`;

let sections = [];
let markdownText = '';

async function loadSummary() {
    const response = await fetch('/summary.md');
    markdownText = await response.text();
    const parts = markdownText.split(/^---$/gm).filter(p => p.trim());
    const scrollContainer = document.getElementById('scroll-container');
    const sectionNav = document.getElementById('section-nav');
    sections = parts.map((part, i) => {
        const html = marked.parse(part);
        const div = document.createElement('div');
        div.className = 'section';
        div.innerHTML = html;
        div.id = `section-${i}`;
        scrollContainer.appendChild(div);
        // Nav dot
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        dot.addEventListener('click', () => scrollToSection(i));
        sectionNav.appendChild(dot);
        return div;
    });
    updateNav();
}

function scrollToSection(index) {
    const section = document.getElementById(`section-${index}`);
    section.scrollIntoView({ behavior: 'smooth' });
}

function updateProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
}

function updateNav() {
    const scrollTop = window.pageYOffset + window.innerHeight / 2;
    const dots = document.querySelectorAll('.nav-dot');
    sections.forEach((section, i) => {
        const dot = dots[i];
        if (scrollTop >= section.offsetTop && scrollTop < section.offsetTop + section.offsetHeight) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function updateSections() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
            section.classList.add('visible');
        } else {
            section.classList.remove('visible');
        }
    });
}

window.addEventListener('scroll', () => {
    updateProgress();
    updateNav();
    updateSections();
});

document.getElementById('share-btn').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
    } catch {
        alert('Copy failed, please copy manually: ' + window.location.href);
    }
});

document.getElementById('markdown-btn').addEventListener('click', () => {
    document.getElementById('markdown-content').textContent = markdownText;
    document.getElementById('markdown-modal').classList.remove('hidden');
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('markdown-modal').classList.add('hidden');
});

loadSummary();