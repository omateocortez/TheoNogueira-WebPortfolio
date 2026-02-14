// Portfolio data
const filmData = [
    {
        id: 1,
        title: "Motion Study I",
        category: "film",
        description: "16mm film experiment",
        icon: "fa-film"
    },
    {
        id: 2,
        title: "Urban Flow",
        category: "film",
        description: "Street cinematography",
        icon: "fa-video"
    },
    {
        id: 3,
        title: "Analog Dreams",
        category: "film",
        description: "Super 8 project",
        icon: "fa-film"
    },
    {
        id: 4,
        title: "Time Fragments",
        category: "film",
        description: "Experimental short",
        icon: "fa-video"
    }
];

const stillsData = [
    {
        id: 5,
        title: "Portrait Series",
        category: "stills",
        description: "Kodak Portra 400",
        icon: "fa-user"
    },
    {
        id: 6,
        title: "Urban Landscapes",
        category: "stills",
        description: "Ilford HP5+",
        icon: "fa-city"
    },
    {
        id: 7,
        title: "Natural Light",
        category: "stills",
        description: "Fujifilm Pro 400H",
        icon: "fa-sun"
    },
    {
        id: 8,
        title: "Monochrome",
        category: "stills",
        description: "Kodak Tri-X",
        icon: "fa-camera"
    },
    {
        id: 9,
        title: "Street Moments",
        category: "stills",
        description: "Kodak Portra 800",
        icon: "fa-walking"
    },
    {
        id: 10,
        title: "Still Life",
        category: "stills",
        description: "Kodak Ektar 100",
        icon: "fa-image"
    }
];

// DOM elements
const filmGrid = document.getElementById('filmGrid');
const stillsGrid = document.getElementById('stillsGrid');
const contactForm = document.getElementById('contactForm');
const lightboxModal = new bootstrap.Modal(document.getElementById('lightboxModal'));
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');

// Render portfolio items using CSS Grid with organic layout
function renderPortfolio(data, gridElement) {
    console.log('Rendering portfolio to:', gridElement);
    gridElement.innerHTML = '';
    
    data.forEach((item, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.style.animationDelay = `${index * 0.1}s`;
        
        // Create different sizes for organic layout
        if (index % 8 === 0) {
            photoItem.classList.add('large');
        } else if (index % 6 === 0) {
            photoItem.classList.add('wide');
        } else if (index % 4 === 0) {
            photoItem.classList.add('tall');
        } else if (index % 3 === 0) {
            photoItem.classList.add('medium');
        } else {
            photoItem.classList.add('small');
        }
        
        photoItem.innerHTML = `
            <div class="photo-placeholder">
                <i class="fas ${item.icon}"></i>
                <div style="position: absolute; bottom: 10px; left: 10px; font-size: 0.8rem; color: var(--gray-600); background: rgba(255,255,255,0.8); padding: 4px 8px; border-radius: 4px;">
                    ${item.title}
                </div>
            </div>
            <div class="photo-overlay">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        
        photoItem.addEventListener('click', () => openLightbox(item));
        gridElement.appendChild(photoItem);
        
        console.log(`Added photo item ${index}:`, photoItem.className);
    });
    
    console.log('Finished rendering portfolio items');
}

// Lightbox functionality using Bootstrap Modal
function openLightbox(item) {
    const imageUrl = `https://via.placeholder.com/1200x800/000000/FFFFFF?text=${encodeURIComponent(item.title)}`;
    lightboxImage.src = imageUrl;
    lightboxTitle.textContent = item.title;
    lightboxModal.show();
}

// Contact form handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple form validation
    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Navigation highlighting on scroll with Bootstrap classes
function updateActiveLink() {
    const sections = ['home', 'film', 'stills', 'about', 'contact'];
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const link = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (section && link) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
    
    // Add scroll effect to navbar using Bootstrap classes
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize everything
function initializePortfolio() {
    console.log('Film grid element:', filmGrid);
    console.log('Stills grid element:', stillsGrid);
    
    // Render portfolio items
    renderPortfolio(filmData, filmGrid);
    renderPortfolio(stillsData, stillsGrid);
    
    console.log('Portfolio items rendered');
    
    // Add scroll event listener for navigation
    window.addEventListener('scroll', updateActiveLink);
    
    // Initial active link update
    updateActiveLink();
    
    // Add Bootstrap scrollspy functionality
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add portfolio item hover effects - but only if they exist
    setTimeout(() => {
        const portfolioItems = document.querySelectorAll('.photo-item');
        console.log('Found portfolio items:', portfolioItems.length);
        
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'none';
            });
        });
        
        // Add intersection observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe portfolio items
        portfolioItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }, 100);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing portfolio...');
    initializePortfolio();
});