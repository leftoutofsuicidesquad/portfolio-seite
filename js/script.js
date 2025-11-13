// Navigation scroll effect
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');

// Add shadow to navbar on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
}, { passive: true });

// Mobile menu toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scrolling for anchor links (removed duplicate)

// Active link highlighting
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

// Set initial theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update button icon
    const moonIcon = document.querySelector('.fa-moon');
    const sunIcon = document.querySelector('.fa-sun');
    
    if (theme === 'dark') {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    } else {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    }
}

// Initialize theme
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    setTheme('dark');
} else {
    setTheme('light');
}

// Toggle theme on button click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contact-form');

// Function to encode form data as URL-encoded string
function urlEncodeFormData(form) {
    const formData = new FormData(form);
    const pairs = [];
    for (const [key, value] of formData.entries()) {
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
    return pairs.join('&');
}

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form elements
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        try {
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Wird gesendet...';
            
            // Get form values as URL-encoded string
            const formData = urlEncodeFormData(form);
            
            // Send data to Python server
            const response = await fetch('http://localhost:8000/save_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });
            
            // Check if response is OK
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Fehler beim Senden der Nachricht');
            }
            
            // Try to parse JSON response
            let result;
            try {
                result = await response.json();
            } catch (e) {
                throw new Error('Ungültige Antwort vom Server');
            }
            
            if (result && result.success) {
                // Show success message
                alert('Vielen Dank für deine Nachricht! Ich werde mich so schnell wie möglich bei dir melden.');
                
                // Reset form
                form.reset();
            } else {
                throw new Error(result.message || 'Unbekannter Fehler ist aufgetreten');
            }
            
        } catch (error) {
            console.error('Fehler beim Senden der Nachricht:', error);
            alert('Es ist ein Fehler aufgetreten: ' + (error.message || 'Bitte versuche es später erneut.'));
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .education-item, .personal-interests li');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
});

// Simple SVG infrastructure diagram (can be replaced with a proper SVG later)
const infraSvg = document.getElementById('infra-svg');
if (infraSvg) {
    // This is a placeholder. In a real scenario, you would use a proper SVG or diagram
    infraSvg.outerHTML = `
        <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
            <!-- Proxmox Cluster -->
            <rect x="50" y="50" width="120" height="80" rx="5" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2"/>
            <text x="60" y="90" font-family="Arial" font-size="12">Proxmox Cluster</text>
            
            <!-- VMs -->
            <rect x="200" y="30" width="100" height="60" rx="3" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
            <text x="220" y="60" font-family="Arial" font-size="10">VMs</text>
            
            <!-- Containers -->
            <rect x="200" y="110" width="100" height="60" rx="3" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
            <text x="210" y="145" font-family="Arial" font-size="10">Container</text>
            
            <!-- Network lines -->
            <line x1="170" y1="90" x2="200" y2="60" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
            <line x1="170" y1="140" x2="200" y2="140" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
            
            <!-- Services -->
            <g>
                <circle cx="350" cy="40" r="20" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.5"/>
                <text x="335" y="45" font-family="Arial" font-size="10" text-anchor="middle">NPM</text>
                
                <circle cx="400" cy="40" r="20" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.5"/>
                <text x="385" y="45" font-family="Arial" font-size="10" text-anchor="middle">HA</text>
                
                <circle cx="350" cy="90" r="20" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.5"/>
                <text x="335" y="95" font-family="Arial" font-size="10" text-anchor="middle">DB</text>
                
                <circle cx="400" cy="90" r="20" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.5"/>
                <text x="385" y="95" font-family="Arial" font-size="10" text-anchor="middle">App</text>
            </g>
            
            <!-- Connection lines -->
            <line x1="300" y1="60" x2="330" y2="40" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
            <line x1="300" y1="80" x2="330" y2="90" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
            
            <!-- Legend -->
            <rect x="50" y="200" width="400" height="80" fill="#f8fafc" stroke="#cbd5e1" rx="5"/>
            <text x="60" y="220" font-family="Arial" font-size="12" font-weight="bold">Legende:</text>
            <text x="60" y="240" font-family="Arial" font-size="10">• Proxmox Cluster: 2 Nodes mit Ceph-Speicher</text>
            <text x="60" y="260" font-family="Arial" font-size="10">• VMs: Docker-Host, Home Assistant, WireGuard</text>
        </svg>
    `;
}
