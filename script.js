document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = savedTheme || systemTheme;
    
    // Apply initial theme
    htmlElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    
    if (mobileNavToggle && navLinksContainer) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpened = mobileNavToggle.classList.contains('active');
            
            if (isOpened) {
                mobileNavToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                mobileNavToggle.classList.add('active');
                navLinksContainer.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        // Close menu when a link is clicked
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth Scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal to sections
    document.querySelectorAll('.section, .card, .result-block').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navIndicator = document.getElementById('nav-indicator');

    function updateNavIndicator(activeLink) {
        if (!navIndicator || !activeLink) return;
        const rect = activeLink.getBoundingClientRect();
        const parentRect = activeLink.parentElement.parentElement.getBoundingClientRect();
        navIndicator.style.width = `${rect.width}px`;
        navIndicator.style.left = `${rect.left - parentRect.left}px`;
    }

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
                updateNavIndicator(link);
            }
        });
    });

    // Card Mouse Effect
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Initialize nav indicator on load and resize
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-links a.active');
        if (activeLink) updateNavIndicator(activeLink);
    });
    
    // Initial call
    setTimeout(() => {
        const firstLink = document.querySelector('.nav-links a.active') || navLinks[0];
        updateNavIndicator(firstLink);
    }, 100);
});
