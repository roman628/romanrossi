// Professional Portfolio - Main JavaScript

// ==================== SMOOTH SCROLL & BACK TO TOP ====================
document.addEventListener('DOMContentLoaded', () => {
    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Load projects
    loadProjects();
});

// ==================== LOAD PROJECTS FROM JSON ====================
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();
        
        if (!data.projects || !Array.isArray(data.projects)) {
            console.error('Invalid projects data structure');
            displayErrorMessage();
            return;
        }

        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '';

        // Sort projects by category for better organization (optional)
        const sortedProjects = [...data.projects].sort((a, b) => {
            const categoryOrder = { 'major': 0, 'webapps': 1, 'automation': 2 };
            return (categoryOrder[a.category] || 999) - (categoryOrder[b.category] || 999);
        });

        sortedProjects.forEach(project => {
            const card = createProjectCard(project);
            projectsGrid.appendChild(card);
        });

        // Add fade-in animation to cards
        observeProjectCards();

    } catch (error) {
        console.error('Error loading projects:', error);
        displayErrorMessage();
    }
}

// ==================== CREATE PROJECT CARD ====================
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Create header with title and optional GitHub link
    const header = document.createElement('div');
    header.className = 'project-header';

    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;
    header.appendChild(title);

    // Add GitHub link if available
    if (project.repoLink) {
        const link = document.createElement('a');
        link.href = project.repoLink;
        link.className = 'project-link';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.title = 'View on GitHub';
        link.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
        `;
        header.appendChild(link);
    }

    card.appendChild(header);

    // Category badge
    if (project.category) {
        const category = document.createElement('span');
        category.className = 'project-category';
        category.textContent = project.category;
        card.appendChild(category);
    }

    // Description
    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description;
    card.appendChild(description);

    // Tags
    if (project.tags && project.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'project-tags';

        project.tags.forEach(tagText => {
            const tag = document.createElement('span');
            tag.className = 'project-tag';
            tag.textContent = tagText;
            tagsContainer.appendChild(tag);
        });

        card.appendChild(tagsContainer);
    }

    return card;
}

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
function observeProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

// ==================== ERROR HANDLING ====================
function displayErrorMessage() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <p style="color: var(--neon-coral); font-size: 1.2rem; margin-bottom: 1rem;">
                ⚠️ Unable to load projects
            </p>
            <p style="color: var(--text-muted);">
                Please check that projects.json is in the same directory as this page.
            </p>
        </div>
    `;
}

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
// If you add anchor links in the future, this handles smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== LAZY LOADING FOR PROFILE IMAGE ====================
// Improve performance by lazy loading the profile image
document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.querySelector('.profile-pic');
    if (profilePic && 'loading' in HTMLImageElement.prototype) {
        profilePic.loading = 'lazy';
    }
});

// ==================== KEYBOARD ACCESSIBILITY ====================
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Press 'T' to scroll to top
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
});

// ==================== CONSOLE EASTER EGG ====================
console.log('%c👋 Hey there!', 'font-size: 20px; font-weight: bold; color: #c084fc;');
console.log('%cThanks for checking out my portfolio!', 'font-size: 14px; color: #f472b6;');
console.log('%cIf you want to see more of my work, check out my GitHub:', 'font-size: 12px; color: #e8e8e8;');
console.log('%chttps://github.com/roman628', 'font-size: 12px; color: #a78bfa; text-decoration: underline;');
