document.addEventListener('DOMContentLoaded', () => {
    // Allow browser to remember scroll position on reload
    if (history.scrollRestoration) {
        history.scrollRestoration = 'auto';
    }
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const nav = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section, header');

    // Theme Management
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.classList.add(`${savedTheme}-theme`);

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobile Menu Logic
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    mobileToggle.addEventListener('click', () => {
        const isActive = navLinksContainer.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isActive);
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Combined Scroll Listener (Performance Throttled)
    const scrollProgress = document.getElementById('scroll-progress');
    let isScrolling = false;

    const onScroll = () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScrollEffects();
                isScrolling = false;
            });
            isScrolling = true;
        }
    };

    const handleScrollEffects = () => {
        // 1. Active Link & Navbar Style Logic
        let current = "";
        const scrollPos = window.scrollY + nav.offsetHeight + 150;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        // Check if at the very bottom
        const atBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50;

        navLinks.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href").substring(1);
            if (atBottom && href === "contact") {
                link.classList.add("active");
            } else if (!atBottom && href === current) {
                link.classList.add("active");
            }
        });

        // 2. Navbar shadow/blur transition
        if (window.scrollY > 20) {
            nav.style.boxShadow = "var(--shadow-md)";
            nav.style.padding = "var(--sp-2) 0";
        } else {
            nav.style.boxShadow = "none";
            nav.style.padding = "var(--sp-4) 0";
        }

        // 3. Scroll Progress Indicator
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / height) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }

        // 4. Back to Top Visibility (Show when past 500px)
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', onScroll);
    handleScrollEffects(); // Initial check

    // Email Obfuscation Restoration
    document.querySelectorAll('.email-protected').forEach(el => {
        const restoreEmail = () => {
            const user = el.getAttribute('data-user');
            const domain = el.getAttribute('data-domain');
            if (user && domain) {
                el.setAttribute('href', `mailto:${user}@${domain}`);
            }
        };

        el.addEventListener('click', restoreEmail);
        el.addEventListener('mouseover', restoreEmail);
        el.addEventListener('focus', restoreEmail);
    });

    // Dynamic Year
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Smooth Scroll for anchor links
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation Observer Settings
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Initial Reveal: Trigger Hero and visible elements
    const revealInitial = () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('appear');
            hero.querySelectorAll('.fade-in').forEach(child => child.classList.add('appear'));
        }
    };

    // Track all elements for animation
    document.querySelectorAll('.section:not(.hero), .card, .tool-item, .middle-cta').forEach(el => {
        observer.observe(el);
    });

    // Run initial reveal
    revealInitial();

    // Magnetic Buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // Back to Top Click
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
