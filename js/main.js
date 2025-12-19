document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible to run only once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .fade-right, .fade-left');
    animatedElements.forEach(el => observer.observe(el));

    // Parallax Effect for Hero
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if (scroll < window.innerHeight) {
                heroBg.style.transform = `translateY(${scroll * 0.5}px) scale(${1 + scroll * 0.0005})`;
            }
        });
    }

    // Check Login State
    const user = JSON.parse(localStorage.getItem('user'));
    const loginLink = document.querySelector('.nav-links li:last-child a');

    if (user && loginLink) {
        // Change "Login" to User's Name or "Account"
        loginLink.textContent = user.name || 'Account';
        loginLink.href = '#'; // Prevent default navigation

        // Add Logout option (append strictly for this demo)
        const logoutLi = document.createElement('li');
        const logoutLink = document.createElement('a');
        logoutLink.textContent = 'Logout';
        logoutLink.href = '#';
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            window.location.reload();
        });
        logoutLi.appendChild(logoutLink);
        document.querySelector('.nav-links').appendChild(logoutLi);
    }


    // Dynamic Product Loading
    const modelsGrid = document.querySelector('.models-grid, #models-grid');
    if (modelsGrid) {
        fetch('/api/products')
            .then(res => res.json())
            .then(products => {
                if (products.length > 0) {
                    // modelsGrid.innerHTML = ''; // Keep if replacing hardcoded, but we cleared it in HTML 
                    // If using a container inside grid:
                    const targetContainer = document.getElementById('models-grid') || modelsGrid;

                    products.forEach((product, index) => {
                        const delayClass = index === 0 ? '' : `delay-${index}`;
                        const card = document.createElement('div');
                        card.className = `model-card fade-up ${delayClass}`;
                        card.innerHTML = `
                            <div class="card-image-wrapper">
                                <div class="card-image" style="background-image: url('${product.image}');"></div>
                            </div>
                            <div class="card-info">
                                <h3>${product.name}</h3>
                                <p>${product.tagline}</p>
                                <a href="#" class="btn-link">Explore</a>
                            </div>
                        `;
                        targetContainer.appendChild(card);

                        // Observe the new element for animation
                        if (typeof observer !== 'undefined') {
                            observer.observe(card);
                        }
                    });
                }
            })
            .catch(err => console.error('Error fetching products:', err));
    }
});
