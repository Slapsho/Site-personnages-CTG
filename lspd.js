// Script d'amélioration interactive pour le portfolio de Marc Priox

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Animation d'apparition progressive des éléments au scroll
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

    // Observer les cartes de projet
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // 2. Machine à écrire pour le titre
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        }
        typing();
    }

    // Appliquer l'effet machine à écrire au titre principal
    const mainTitle = document.querySelector('h1');
    const originalText = mainTitle.textContent;
    setTimeout(() => {
        typeWriter(mainTitle, originalText, 150);
    }, 500);

    // 3. Animation de comptage pour les réalisations
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            if (start < target) {
                start += increment;
                if (target.toString().includes('M')) {
                    element.textContent = (start / 1000000).toFixed(1) + 'M+';
                } else if (target.toString().includes('%')) {
                    element.textContent = Math.floor(start) + '%';
                } else {
                    element.textContent = Math.floor(start) + '+';
                }
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toString().includes('M') ? 
                    (target / 1000000).toFixed(1) + 'M+' : 
                    target.toString().includes('%') ? target + '%' : target + '+';
            }
        }
        updateCounter();
    }

    // Animer les compteurs quand ils deviennent visibles
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target;
                const originalText = number.textContent;
                let targetValue;
                
                if (originalText.includes('M')) {
                    targetValue = parseFloat(originalText) * 1000000;
                } else if (originalText.includes('%')) {
                    targetValue = parseInt(originalText);
                } else {
                    targetValue = parseInt(originalText);
                }
                
                animateCounter(number, originalText.includes('%') ? targetValue : targetValue, 2000);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.achievement-number').forEach(number => {
        counterObserver.observe(number);
    });

    // 4. Filtre interactif pour les projets
    function createFilterButtons() {
        const workSection = document.querySelector('.work-section');
        const projectsGrid = document.querySelector('.projects-grid');
        
        // Créer le conteneur des filtres
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        `;
        
        // Récupérer tous les types de projets uniques
        const projectTypes = [...new Set(Array.from(document.querySelectorAll('.project-type')).map(el => el.textContent))];
        
        // Ajouter le bouton "Tous"
        const allButton = document.createElement('button');
        allButton.textContent = 'Tous';
        allButton.className = 'filter-btn active';
        allButton.style.cssText = `
            padding: 0.7rem 1.5rem;
            border: none;
            border-radius: 25px;
            background: #4f46e5;
            color: white;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        `;
        
        // Créer les boutons de filtre
        projectTypes.forEach(type => {
            const button = document.createElement('button');
            button.textContent = type;
            button.className = 'filter-btn';
            button.style.cssText = `
                padding: 0.7rem 1.5rem;
                border: 2px solid #4f46e5;
                border-radius: 25px;
                background: white;
                color: #4f46e5;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            `;
            
            button.addEventListener('mouseover', () => {
                if (!button.classList.contains('active')) {
                    button.style.background = '#f1f5f9';
                }
            });
            
            button.addEventListener('mouseout', () => {
                if (!button.classList.contains('active')) {
                    button.style.background = 'white';
                }
            });
            
            button.addEventListener('click', () => filterProjects(type, button));
            filterContainer.appendChild(button);
        });
        
        // Ajouter le bouton "Tous" au début
        filterContainer.insertBefore(allButton, filterContainer.firstChild);
        allButton.addEventListener('click', () => filterProjects('all', allButton));
        
        // Insérer les filtres avant la grille
        workSection.insertBefore(filterContainer, projectsGrid);
        
        // Fonction de filtrage
        function filterProjects(filter, clickedButton) {
            // Mettre à jour les boutons actifs
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = btn === allButton ? 'white' : 'white';
                btn.style.color = '#4f46e5';
            });
            
            clickedButton.classList.add('active');
            clickedButton.style.background = '#4f46e5';
            clickedButton.style.color = 'white';
            
            // Filtrer les projets
            const projects = document.querySelectorAll('.project-card');
            projects.forEach(project => {
                const projectType = project.querySelector('.project-type').textContent;
                
                if (filter === 'all' || projectType === filter) {
                    project.style.display = 'block';
                    project.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    project.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        }
    }
    
    // Ajouter les animations CSS nécessaires
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.8); }
        }
        
        .tech {
            transition: all 0.3s ease;
        }
        
        .tech:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        
        .project-card {
            transition: all 0.3s ease;
        }
        
        .filter-container {
            opacity: 0;
            animation: slideInDown 0.8s ease 0.5s forwards;
        }
        
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Créer les boutons de filtre
    createFilterButtons();

    // 5. Effet de particules dans le header
    function createParticles() {
        const header = document.querySelector('header');
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                animation: float ${Math.random() * 3 + 2}s infinite ease-in-out;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
            `;
            particlesContainer.appendChild(particle);
        }
        
        header.appendChild(particlesContainer);
        
        // Ajouter l'animation des particules
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            }
        `;
        document.head.appendChild(particleStyle);
    }
    
    createParticles();

    // 6. Barre de progression du scroll
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    createScrollProgress();

    // 7. Effet de couleur aléatoire sur les technologies
    function randomizeTechColors() {
        const colors = [
            '#4f46e5', '#7c3aed', '#dc2626', '#ea580c',
            '#ca8a04', '#16a34a', '#0891b2', '#c026d3'
        ];
        
        document.querySelectorAll('.tech').forEach(tech => {
            tech.addEventListener('mouseenter', () => {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                tech.style.background = randomColor;
                tech.style.color = 'white';
                tech.style.transform = 'scale(1.05)';
            });
            
            tech.addEventListener('mouseleave', () => {
                tech.style.background = '#f1f5f9';
                tech.style.color = '#4f46e5';
                tech.style.transform = 'scale(1)';
            });
        });
    }
    
    randomizeTechColors();

    // 8. Effet de parallaxe subtil sur le header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});

// 9. Ajout d'un mode sombre (bonus)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Vérifier le mode sombre sauvegardé
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Création du bouton de mode sombre
const darkModeToggle = document.createElement('button');
darkModeToggle.innerHTML = '🌙';
darkModeToggle.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: #4f46e5;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transition: all 0.3s ease;
`;

darkModeToggle.addEventListener('click', toggleDarkMode);
darkModeToggle.addEventListener('mouseenter', () => {
    darkModeToggle.style.transform = 'scale(1.1)';
});
darkModeToggle.addEventListener('mouseleave', () => {
    darkModeToggle.style.transform = 'scale(1)';
});

document.body.appendChild(darkModeToggle);

// CSS pour le mode sombre
const darkModeStyles = document.createElement('style');
darkModeStyles.textContent = `
    .dark-mode {
        background-color: #1a1a1a;
        color: #e0e0e0;
    }
    
    .dark-mode .profile-section,
    .dark-mode .work-section {
        background: #2a2a2a;
        border-color: #404040;
    }
    
    .dark-mode .project-card {
        background: #2a2a2a;
        border-color: #404040;
    }
    
    .dark-mode .personal-info {
        background: #333;
    }
    
    .dark-mode .bio-text {
        background: #2a2a2a;
        border-color: #404040;
    }
    
    .dark-mode .achievements-summary {
        background: #333;
    }
`;
document.head.appendChild(darkModeStyles);