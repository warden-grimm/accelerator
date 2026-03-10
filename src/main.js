import './style.css'
import { marked } from 'marked';

document.querySelector('#app').innerHTML = `
  <div id="background-spheres"></div>
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

// Create background spheres
const spheresContainer = document.getElementById('background-spheres');
for (let i = 0; i < 4; i++) {
  const sphere = document.createElement('div');
  sphere.className = 'sphere';
  // Position in different quadrants to avoid overlap
  const quadrant = i % 4;
  let left, top;
  if (quadrant === 0) { left = Math.random() * 40 + 5; top = Math.random() * 40 + 5; }
  else if (quadrant === 1) { left = Math.random() * 40 + 55; top = Math.random() * 40 + 5; }
  else if (quadrant === 2) { left = Math.random() * 40 + 5; top = Math.random() * 40 + 55; }
  else { left = Math.random() * 40 + 55; top = Math.random() * 40 + 55; }
  sphere.style.left = left + '%';
  sphere.style.top = top + '%';
  sphere.style.width = (300 + Math.random() * 400) + 'px';
  sphere.style.height = sphere.style.width;
  sphere.dataset.speedY = (Math.random() - 0.5) * 0.15;
  sphere.dataset.speedX = (Math.random() - 0.5) * 0.03;
  sphere.dataset.speedScale = 0.98 + Math.random() * 0.04;
  spheresContainer.appendChild(sphere);
}

let sections = [];
let markdownText = '';

async function loadSummary() {
    const response = await fetch('summary.md');
    markdownText = await response.text();
    const parts = markdownText.split('---').filter(p => p.trim());
    const scrollContainer = document.getElementById('scroll-container');
    const sectionNav = document.getElementById('section-nav');
    sections = parts.map((part, i) => {
        const html = marked(part);
        const div = document.createElement('div');
        div.className = 'section';        if (i === 0) div.classList.add('visible'); // Make hero visible immediately        div.innerHTML = html;
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

    // Update sphere positions
    const spheres = document.querySelectorAll('.sphere');
    spheres.forEach(sphere => {
        const y = scrollTop * parseFloat(sphere.dataset.speedY);
        const x = scrollTop * parseFloat(sphere.dataset.speedX);
        const scale = parseFloat(sphere.dataset.speedScale);
        sphere.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
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