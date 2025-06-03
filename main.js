// Configuration principale

// Fonction pour gérer la flèche de scroll
function initScrollArrow() {
    // Sélectionner l'indicateur de scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollArrow = document.querySelector('.scroll-arrow');
    
    if (!scrollIndicator) {
        console.warn('Scroll indicator non trouvé');
        return;
    }
    
    // Fonction de scroll fluide vers la section des personnages
    function scrollToCharacters() {
        const charactersSection = document.querySelector('#presentation') || 
                                 document.querySelector('#characters') ||
                                 document.querySelector('.characters-grid');
        
        if (charactersSection) {
            const offsetTop = charactersSection.getBoundingClientRect().top + window.pageYOffset;
            const navHeight = 80; // Hauteur approximative de la navigation
            
            window.scrollTo({
                top: offsetTop - navHeight,
                behavior: 'smooth'
            });
        } else {
            console.warn('Section personnages non trouvée');
        }
    }
    
    // Ajouter l'écouteur de clic sur l'indicateur
    scrollIndicator.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToCharacters();
        
        // Effet de feedback visuel
        if (scrollArrow) {
            scrollArrow.style.animation = 'none';
            setTimeout(() => {
                scrollArrow.style.animation = 'bounce 2s infinite';
            }, 100);
        }
    });
    
    // Masquer la flèche quand on scroll
    let hideTimeout;
    function hideArrowOnScroll() {
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
        
        // Réafficher temporairement quand on scroll vers le haut
        if (scrolled > 0) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
            
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                if (window.pageYOffset > 100) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                }
            }, 2000);
        }
    }
    
    // Écouteur pour masquer/afficher selon le scroll
    window.addEventListener('scroll', hideArrowOnScroll);
    
    // Optionnel : Ajouter du texte sous la flèche
    function addScrollText() {
        if (!scrollIndicator.querySelector('.scroll-text')) {
            const scrollText = document.createElement('div');
            scrollText.className = 'scroll-text';
            scrollText.textContent = 'Scroll down';
            scrollIndicator.insertBefore(scrollText, scrollArrow);
        }
    }
    
    // Décommenter si vous voulez du texte
    // addScrollText();
}

// Alternative avec une autre méthode de flèche
function createBetterArrow() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    // Remplacer la flèche existante par une version SVG
    const scrollArrow = scrollIndicator.querySelector('.scroll-arrow');
    if (scrollArrow) {
        scrollArrow.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17L6 11L7.5 9.5L12 14L16.5 9.5L18 11L12 17Z" fill="currentColor"/>
            </svg>
        `;
        scrollArrow.style.animation = 'bounce 2s infinite';
        scrollArrow.style.color = 'var(--accent-gold, #d4af37)';
    }
}

// Animation alternative pour la flèche
function pulseArrow() {
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (!scrollArrow) return;
    
    setInterval(() => {
        scrollArrow.style.transform = 'rotate(45deg) scale(1.2)';
        setTimeout(() => {
            scrollArrow.style.transform = 'rotate(45deg) scale(1)';
        }, 300);
    }, 2000);
}

// Initialiser toutes les fonctions de la flèche
function initializeScrollFeatures() {
    initScrollArrow();
    // Décommenter pour des effets alternatifs
    // createBetterArrow();
    // pulseArrow();
}

// Export pour usage dans main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeScrollFeatures };
}

// Auto-init si pas déjà géré par main.js
if (typeof window !== 'undefined') {
    // Vérifier si main.js gère déjà l'initialisation
    if (!window.mainJsLoaded) {
        document.addEventListener('DOMContentLoaded', initializeScrollFeatures);
    }
}

const config = {
    spotlightSize: 300,
    responsiveBreakpoint: 768,
    glitchDuration: 3000,
    darkModeStorageKey: 'gta-rp-dark-mode'
};

// Gestion du Dark Mode
class DarkModeManager {
    constructor() {
        this.darkMode = false;
        this.button = null;
        this.spotlight = null;
        this.init();
    }
    
    init() {
        // Récupération du bouton dark mode
        this.button = document.getElementById('darkModeToggle');
        this.spotlight = document.querySelector('.spotlight');
        
        if (!this.button) {
            console.error('Bouton dark mode non trouvé');
            return;
        }
        
        // Vérification du mode sauvegardé
        this.loadSavedMode();
        
        // Ajout de l'écouteur d'événement
        this.button.addEventListener('click', () => this.toggle());
        
        // Gestion du survol pour l'effet spotlight
        this.setupSpotlightEffects();
        
        console.log('Dark mode initialisé avec succès');
    }
    
    loadSavedMode() {
        // Vérification du localStorage
        const savedMode = localStorage.getItem(config.darkModeStorageKey);
        
        if (savedMode === 'true') {
            this.darkMode = true;
            this.applyMode();
        } else {
            // Vérification des préférences système
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.darkMode = true;
                this.applyMode();
            }
        }
    }
    
    toggle() {
        this.darkMode = !this.darkMode;
        this.applyMode();
        this.saveMode();
        
        // Animation du bouton
        this.animateButton();
        
        console.log(`Mode ${this.darkMode ? 'sombre' : 'clair'} activé`);
    }
    
    applyMode() {
        const html = document.documentElement;
        
        if (this.darkMode) {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
        }
        
        // Mise à jour de l'icône du bouton
        this.updateButtonIcon();
        
        // Mise à jour de l'effet spotlight
        this.updateSpotlightBlendMode();
    }
    
    updateButtonIcon() {
        if (this.darkMode) {
            this.button.innerHTML = '☀️';
            this.button.title = 'Activer le mode clair';
        } else {
            this.button.innerHTML = '🌙';
            this.button.title = 'Activer le mode sombre';
        }
    }
    
    updateSpotlightBlendMode() {
        if (this.spotlight) {
            if (this.darkMode) {
                this.spotlight.style.mixBlendMode = 'screen';
            } else {
                this.spotlight.style.mixBlendMode = 'multiply';
            }
        }
    }
    
    animateButton() {
        this.button.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            this.button.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    }
    
    saveMode() {
        localStorage.setItem(config.darkModeStorageKey, this.darkMode.toString());
    }
    
    setupSpotlightEffects() {
        if (!this.spotlight) return;
        
        // Variables pour le suivi précis de la souris
        let mouseX = 0;
        let mouseY = 0;
        let spotlightX = 0;
        let spotlightY = 0;
        let animationId = null;
        
        // Configuration initiale du spotlight
        this.spotlight.style.width = config.spotlightSize + 'px';
        this.spotlight.style.height = config.spotlightSize + 'px';
        this.spotlight.style.pointerEvents = 'none';
        this.spotlight.style.zIndex = '999';
        
        // Fonction d'interpolation pour un mouvement fluide
        const lerp = (start, end, factor) => {
            return start * (1 - factor) + end * factor;
        };
        
        // Animation du spotlight
        const animateSpotlight = () => {
            // Interpolation pour un mouvement fluide
            spotlightX = lerp(spotlightX, mouseX, 0.15);
            spotlightY = lerp(spotlightY, mouseY, 0.15);
            
            // Centrage du spotlight sur la position de la souris
            this.spotlight.style.left = (spotlightX - config.spotlightSize / 2) + 'px';
            this.spotlight.style.top = (spotlightY - config.spotlightSize / 2) + 'px';
            
            // Continuer l'animation
            animationId = requestAnimationFrame(animateSpotlight);
        };
        
        // Effet spotlight qui suit la souris
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Démarrer l'animation si elle n'est pas déjà en cours
            if (!animationId) {
                animateSpotlight();
            }
            
            // Rendre le spotlight visible
            this.spotlight.style.opacity = '0.4';
        });
        
        // Masquer le spotlight quand la souris quitte la fenêtre
        document.addEventListener('mouseleave', () => {
            this.spotlight.style.opacity = '0';
            // Arrêter l'animation
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
        
        // Afficher le spotlight quand la souris entre dans la fenêtre
        document.addEventListener('mouseenter', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            spotlightX = mouseX;
            spotlightY = mouseY;
            this.spotlight.style.opacity = '0.4';
            
            // Redémarrer l'animation
            if (!animationId) {
                animateSpotlight();
            }
        });
        
        // Pause/reprise de l'animation selon la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            } else {
                if (!animationId && this.spotlight.style.opacity !== '0') {
                    animateSpotlight();
                }
            }
        });
    }
}

// Initialisation après le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page chargée - Initialisation...');
    
    // Initialisation du dark mode
    const darkModeManager = new DarkModeManager();
    
    // Récupération des éléments du DOM
    const cards = document.querySelectorAll('.character-card');
    const container = document.querySelector('.container');
    const mainElement = document.querySelector('main');
    const navigation = document.querySelector('.main-nav');
    
    // Validation des éléments requis
    if (!cards.length) {
        console.error('Aucune carte trouvée avec la classe .character-card');
        return;
    }
    
    // Configuration du système audio
    let audioContext;
    let oscillator;
    let gainNode;
    
    console.log(`Nombre de cartes trouvées: ${cards.length}`);
    
    // Ajout des écouteurs d'événements pour chaque carte
    cards.forEach((card, index) => {
        // Événement mouseenter
        card.addEventListener('mouseenter', function() {
            console.log(`Survol de la carte ${index}`);
            startHoverEffects(card);
        });
        
        // Événement mouseleave
        card.addEventListener('mouseleave', function() {
            console.log(`Fin de survol de la carte ${index}`);
            this.style.zIndex = '1';
            // Reset glitch effect
            const badge = this.querySelector('.character-badge');
            if (badge) {
                badge.style.animation = '';
            }
        });
        
        // Événement click
        card.addEventListener('click', function() {
            console.log(`Clic sur la carte ${index}`);
            handleCardClick(card, index);
        });
    });
    
    // Gestion du scroll pour la navigation
    window.addEventListener('scroll', function() {
        if (navigation) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            navigation.style.transform = `translateY(${rate}px)`;
            
            // Effet de transparence sur la navigation
            if (scrolled > 100) {
                navigation.style.background = darkModeManager.darkMode ? 
                    'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)';
            } else {
                navigation.style.background = darkModeManager.darkMode ? 
                    'var(--bg-secondary)' : 'var(--bg-secondary)';
            }
        }
    });
    
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', handleResize);
    
    // Initialisation responsive
    handleResize();
    
    // Fonction pour démarrer les effets au survol
    function startHoverEffects(card) {
        // Effet de profondeur
        card.style.zIndex = '10';
        
        // Effet glitch sur le badge
        const badge = card.querySelector('.character-badge');
        if (badge) {
            badge.style.animation = 'glitch 3s ease-in-out infinite';
            
            // Arrêt du glitch après 3 secondes
            setTimeout(() => {
                if (badge) {
                    badge.style.animation = '';
                }
            }, config.glitchDuration);
        }
        
        // Jouer le son au survol
        playHoverSound();
    }
    
    // Fonction pour gérer le clic sur une carte
    function handleCardClick(card, index) {
        // Animation de clic
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 100);
        
        // Affichage d'informations (exemple)
        const cardTitle = card.querySelector('.character-name');
        if (cardTitle) {
            console.log(`Carte sélectionnée: ${cardTitle.textContent}`);
        }
        
        // Redirection vers la page du personnage
        const link = card.querySelector('a[href*="Personnage"]');
        if (link) {
            // Effet de transition avant redirection
            card.style.opacity = '0.7';
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        }
    }
    
    // Fonction pour créer et jouer un son au survol
    function playHoverSound() {
        try {
            // Création d'un contexte audio simple
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            oscillator = audioContext.createOscillator();
            gainNode = audioContext.createGain();
            
            // Configuration de l'oscillateur
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            // Connexion des nœuds audio
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Démarrage et arrêt de l'oscillateur
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio non supporté:', error);
        }
    }
    
    // Gestion du redimensionnement
    function handleResize() {
        const width = window.innerWidth;
        
        if (width < config.responsiveBreakpoint) {
            config.spotlightSize = 200;
            // Réduction des effets sur mobile
            cards.forEach(card => {
                card.style.transition = 'transform 0.2s ease';
            });
        } else {
            config.spotlightSize = 300;
            // Effets complets sur desktop
            cards.forEach(card => {
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            });
        }
        
        // Mise à jour de la taille du spotlight
        const spotlight = document.querySelector('.spotlight');
        if (spotlight) {
            spotlight.style.width = config.spotlightSize + 'px';
            spotlight.style.height = config.spotlightSize + 'px';
        }
    }
    
    // Effet de particules flottantes (optionnel)
    function createFloatingParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(particleContainer);
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--accent-gold);
                border-radius: 50%;
                animation: float ${Math.random() * 20 + 10}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0;
            `;
            particleContainer.appendChild(particle);
        }
    }
    
    // Initialisation des particules flottantes
    createFloatingParticles();
    
    // Nettoyage au déchargement de la page
    window.addEventListener('beforeunload', function() {
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close();
        }
    });
    
    // Gestion des liens de navigation fluide
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Vérification si c'est un lien vers une ancre
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const topOffset = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    
                    window.scrollTo({
                        top: topOffset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animation d'entrée des cartes
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les cartes pour l'animation d'entrée
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    console.log('Initialisation terminée avec succès');
});


// Injection des styles additionnels
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = additionalStyles;
document.head.appendChild(styleSheet);

// Système d'authentification - À ajouter dans main.js

// Clé pour le localStorage
const AUTH_STORAGE_KEY = 'gta-rp-auth-user';

// Simulation d'une base de données utilisateurs (en production, remplacer par API)
let users = JSON.parse(localStorage.getItem('gta-rp-users') || '[]');

// Classe pour gérer l'authentification
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.modal = null;
        this.loginForm = null;
        this.registerForm = null;
        this.forgotForm = null;
        this.init();
    }
    
    init() {
        // Récupération des éléments du DOM
        this.modal = document.getElementById('authModal');
        this.loginForm = document.getElementById('loginFormElement');
        this.registerForm = document.getElementById('registerFormElement');
        this.forgotForm = document.getElementById('forgotFormElement');
        
        if (!this.modal) {
            console.error('Modal d\'authentification non trouvée');
            return;
        }
        
        // Vérifier si l'utilisateur est déjà connecté
        this.checkExistingAuth();
        
        // Initialisation des événements
        this.setupEventListeners();
        
        // Affichage initial
        this.updateUI();
        
        console.log('Système d\'authentification initialisé');
    }
    
    checkExistingAuth() {
        const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
            console.log('Utilisateur connecté:', this.currentUser.name);
        }
    }
    
    setupEventListeners() {
        // Boutons d'ouverture modal
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.openModal('login'));
        }
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.openModal('register'));
        }
        
        // Fermeture modal
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeModal());
        }
        
        // Gestion des onglets
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.showTab(tab);
            });
        });
        
        // Lien mot de passe oublié
        const forgotLink = document.getElementById('forgotPasswordLink');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showTab('forgot');
            });
        }
        
        // Retour à la connexion depuis mot de passe oublié
        const backToLogin = document.getElementById('backToLogin');
        if (backToLogin) {
            backToLogin.addEventListener('click', () => this.showTab('login'));
        }
        
        // Soumission des formulaires
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        if (this.forgotForm) {
            this.forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }
        
        // Affichage/masquage des mots de passe
        this.setupPasswordToggles();
        
        // Validation du mot de passe en temps réel
        const registerPassword = document.getElementById('registerPassword');
        if (registerPassword) {
            registerPassword.addEventListener('input', () => this.checkPasswordStrength());
        }
        
        // Menu utilisateur
        const userMenuToggle = document.getElementById('userMenuToggle');
        if (userMenuToggle) {
            userMenuToggle.addEventListener('click', () => {
                const dropdown = document.getElementById('userDropdown');
                if (dropdown) {
                    dropdown.classList.toggle('hidden');
                }
            });
        }
        
        // Déconnexion
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.showLogoutModal());
        }
        
        // Modal de déconnexion
        const confirmLogout = document.getElementById('confirmLogout');
        const cancelLogout = document.getElementById('cancelLogout');
        
        if (confirmLogout) {
            confirmLogout.addEventListener('click', () => this.logout());
        }
        if (cancelLogout) {
            cancelLogout.addEventListener('click', () => this.hideLogoutModal());
        }
        
        // Fermer les dropdowns en cliquant ailleurs
        document.addEventListener('click', (e) => {
            const userMenu = document.getElementById('userMenu');
            const dropdown = document.getElementById('userDropdown');
            
            if (userMenu && dropdown && !userMenu.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
        
        // Boutons de détail des personnages
        const detailButtons = document.querySelectorAll('.character-detail-btn');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleCharacterDetail());
        });
    }
    
    openModal(tab = 'login') {
        if (this.modal) {
            this.modal.classList.remove('hidden');
            this.showTab(tab);
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            document.body.style.overflow = '';
            this.clearErrors();
        }
    }
    
    showTab(tab) {
        // Masquer tous les formulaires
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => form.classList.remove('active'));
        
        // Désactiver tous les onglets
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(t => t.classList.remove('active'));
        
        // Afficher le formulaire sélectionné
        const targetForm = document.getElementById(tab + 'Form');
        if (targetForm) {
            targetForm.classList.add('active');
        }
        
        // Activer l'onglet correspondant
        if (tab !== 'forgot') {
            const targetTab = document.querySelector(`[data-tab="${tab}"]`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        }
        
        this.clearErrors();
    }
    
    setupPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                    toggle.textContent = '🙈';
                } else {
                    input.type = 'password';
                    toggle.textContent = '👁️';
                }
            });
        });
    }
    
    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(this.loginForm);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validation basique
        if (!this.validateEmail(email)) {
            this.showError('loginEmailError', 'Email invalide');
            return;
        }
        
        if (!password) {
            this.showError('loginPasswordError', 'Mot de passe requis');
            return;
        }
        
        // Simulation de connexion (remplacer par appel API)
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.isLoggedIn = true;
            
            if (rememberMe) {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            } else {
                sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            }
            
            this.updateUI();
            this.closeModal();
            this.showMessage('loginMessage', 'Connexion réussie !', 'success');
            
            // Redirection après connexion
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            this.showError('loginPasswordError', 'Email ou mot de passe incorrect');
        }
    }
    
    handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(this.registerForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const acceptTerms = document.getElementById('acceptTerms').checked;
        
        // Validation
        let hasErrors = false;
        
        if (!name || name.length < 3) {
            this.showError('registerNameError', 'Le nom doit contenir au moins 3 caractères');
            hasErrors = true;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('registerEmailError', 'Email invalide');
            hasErrors = true;
        }
        
        if (users.find(u => u.email === email)) {
            this.showError('registerEmailError', 'Cet email est déjà utilisé');
            hasErrors = true;
        }
        
        if (!this.validatePassword(password)) {
            this.showError('registerPasswordError', 'Le mot de passe doit contenir au moins 8 caractères');
            hasErrors = true;
        }
        
        if (password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Les mots de passe ne correspondent pas');
            hasErrors = true;
        }
        
        if (!acceptTerms) {
            this.showError('termsError', 'Vous devez accepter les conditions d\'utilisation');
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        // Création du nouvel utilisateur
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('gta-rp-users', JSON.stringify(users));
        
        this.showMessage('registerMessage', 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'success');
        
        // Basculer vers la page de connexion
        setTimeout(() => {
            this.showTab('login');
        }, 2000);
    }
    
    handleForgotPassword(e) {
        e.preventDefault();
        
        const formData = new FormData(this.forgotForm);
        const email = formData.get('email');
        
        if (!this.validateEmail(email)) {
            this.showError('forgotEmailError', 'Email invalide');
            return;
        }
        
        // Simulation d'envoi d'email (remplacer par appel API)
        this.showMessage('forgotMessage', 'Un lien de réinitialisation a été envoyé à votre email.', 'success');
    }
    
    checkPasswordStrength() {
        const password = document.getElementById('registerPassword').value;
        const strengthDiv = document.getElementById('passwordStrength');
        
        if (!strengthDiv) return;
        
        let strength = 0;
        let message = '';
        let className = '';
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        switch (strength) {
            case 0:
            case 1:
                message = 'Faible';
                className = 'weak';
                break;
            case 2:
            case 3:
                message = 'Moyen';
                className = 'medium';
                break;
            case 4:
            case 5:
                message = 'Fort';
                className = 'strong';
                break;
        }
        
        strengthDiv.textContent = message ? `Force: ${message}` : '';
        strengthDiv.className = `password-strength ${className}`;
    }
    
    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userDisplayName = document.getElementById('userDisplayName');
        const needLoginMessage = document.getElementById('needLoginMessage');
        
        if (this.isLoggedIn && this.currentUser) {
            // Masquer les boutons de connexion
            if (authButtons) authButtons.classList.add('hidden');
            
            // Afficher le menu utilisateur
            if (userMenu) userMenu.classList.remove('hidden');
            
            // Mettre à jour le nom d'utilisateur
            if (userDisplayName) userDisplayName.textContent = this.currentUser.name;
            
            // Masquer le message de connexion requise
            if (needLoginMessage) needLoginMessage.classList.add('hidden');
        } else {
            // Afficher les boutons de connexion
            if (authButtons) authButtons.classList.remove('hidden');
            
            // Masquer le menu utilisateur
            if (userMenu) userMenu.classList.add('hidden');
            
            // Afficher le message de connexion requise
            if (needLoginMessage) needLoginMessage.classList.remove('hidden');
        }
    }
    
    showLogoutModal() {
        const logoutModal = document.getElementById('logoutModal');
        if (logoutModal) {
            logoutModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideLogoutModal() {
        const logoutModal = document.getElementById('logoutModal');
        if (logoutModal) {
            logoutModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
    
    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        
        this.hideLogoutModal();
        this.updateUI();
        
        // Redirection après déconnexion
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
    
    handleCharacterDetail() {
        if (!this.isLoggedIn) {
            this.openModal('login');
        } else {
            // Ici vous pouvez rediriger vers la page de détail du personnage
            console.log('Redirection vers le détail du personnage');
        }
    }
    
    // Utilitaires de validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validatePassword(password) {
        return password && password.length >= 8;
    }
    
    // Gestion des erreurs
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    clearErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }
    
    // Affichage des messages
    showMessage(elementId, message, type = 'info') {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `form-message ${type}`;
            messageElement.style.display = 'block';
        }
    }
    
    // Fonction globale pour ouvrir la modal
    openLoginModal() {
        this.openModal('login');
    }
}

// Fonction globale pour ouvrir la modal de connexion (utilisée par le HTML)
function openLoginModal() {
    if (window.authManager) {
        window.authManager.openModal('login');
    }
}

// Initialisation du système d'authentification
window.authManager = new AuthManager();

// Ajout de fonctions utilitaires pour sécuriser les mots de passe
class CryptoUtils {
    static async hashPassword(password) {
        // Utilisation de SubtleCrypto pour hasher le mot de passe
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    static generateSalt() {
        // Génération d'un salt aléatoire
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    static async hashPasswordWithSalt(password, salt) {
        const saltedPassword = password + salt;
        return this.hashPassword(saltedPassword);
    }
}

// Version améliorée de AuthManager
class SecureAuthManager extends AuthManager {
    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(this.registerForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const acceptTerms = document.getElementById('acceptTerms').checked;
        
        // Validation (même que précédemment)
        let hasErrors = false;
        
        if (!name || name.length < 3) {
            this.showError('registerNameError', 'Le nom doit contenir au moins 3 caractères');
            hasErrors = true;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('registerEmailError', 'Email invalide');
            hasErrors = true;
        }
        
        if (users.find(u => u.email === email)) {
            this.showError('registerEmailError', 'Cet email est déjà utilisé');
            hasErrors = true;
        }
        
        if (!this.validatePassword(password)) {
            this.showError('registerPasswordError', 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
            hasErrors = true;
        }
        
        if (password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Les mots de passe ne correspondent pas');
            hasErrors = true;
        }
        
        if (!acceptTerms) {
            this.showError('termsError', 'Vous devez accepter les conditions d\'utilisation');
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        try {
            // Génération du salt et hachage du mot de passe
            const salt = CryptoUtils.generateSalt();
            const hashedPassword = await CryptoUtils.hashPasswordWithSalt(password, salt);
            
            // Création du nouvel utilisateur avec mot de passe sécurisé
            const newUser = {
                id: Date.now(),
                name,
                email,
                password: hashedPassword,
                salt: salt,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('gta-rp-users', JSON.stringify(users));
            
            this.showMessage('registerMessage', 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'success');
            
            // Basculer vers la page de connexion
            setTimeout(() => {
                this.showTab('login');
            }, 2000);
        } catch (error) {
            console.error('Erreur lors de la création du compte:', error);
            this.showError('registerPasswordError', 'Erreur technique lors de la création du compte');
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(this.loginForm);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validation basique
        if (!this.validateEmail(email)) {
            this.showError('loginEmailError', 'Email invalide');
            return;
        }
        
        if (!password) {
            this.showError('loginPasswordError', 'Mot de passe requis');
            return;
        }
        
        try {
            // Recherche de l'utilisateur
            const user = users.find(u => u.email === email);
            
            if (!user) {
                this.showError('loginPasswordError', 'Email ou mot de passe incorrect');
                return;
            }
            
            // Vérification du mot de passe avec le salt
            const hashedPassword = await CryptoUtils.hashPasswordWithSalt(password, user.salt);
            
            if (hashedPassword === user.password) {
                // Connexion réussie - ne pas stocker le mot de passe
                const userData = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                };
                
                this.currentUser = userData;
                this.isLoggedIn = true;
                
                if (rememberMe) {
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
                } else {
                    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
                }
                
                this.updateUI();
                this.closeModal();
                this.showMessage('loginMessage', 'Connexion réussie !', 'success');
                
                // Redirection après connexion
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showError('loginPasswordError', 'Email ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            this.showError('loginPasswordError', 'Erreur technique lors de la connexion');
        }
    }
    
    // Validation de mot de passe renforcée
    validatePassword(password) {
        const hasMinLength = password.length >= 8;
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        
        return hasMinLength && hasLowerCase && hasUpperCase && hasNumbers;
    }
    
    // Vérification de force de mot de passe améliorée
    checkPasswordStrength() {
        const password = document.getElementById('registerPassword').value;
        const strengthDiv = document.getElementById('passwordStrength');
        
        if (!strengthDiv) return;
        
        let strength = 0;
        const requirements = [];
        
        // Vérification des critères
        if (password.length >= 8) {
            strength++;
        } else {
            requirements.push('au moins 8 caractères');
        }
        
        if (/[a-z]/.test(password)) {
            strength++;
        } else {
            requirements.push('une minuscule');
        }
        
        if (/[A-Z]/.test(password)) {
            strength++;
        } else {
            requirements.push('une majuscule');
        }
        
        if (/[0-9]/.test(password)) {
            strength++;
        } else {
            requirements.push('un chiffre');
        }
        
        if (/[^A-Za-z0-9]/.test(password)) {
            strength++;
        }
        
        // Affichage de la force
        let message = '';
        let className = '';
        
        switch (strength) {
            case 0:
            case 1:
                message = 'Faible';
                className = 'weak';
                break;
            case 2:
            case 3:
                message = 'Moyen';
                className = 'medium';
                break;
            case 4:
            case 5:
                message = 'Fort';
                className = 'strong';
                break;
        }
        
        if (requirements.length > 0) {
            message += ` - Manque: ${requirements.join(', ')}`;
        }
        
        strengthDiv.textContent = message;
        strengthDiv.className = `password-strength ${className}`;
    }
    
    // Migration des anciens utilisateurs (si nécessaire)
    async migrateOldUsers() {
        const oldUsers = JSON.parse(localStorage.getItem('gta-rp-users') || '[]');
        const migratedUsers = [];
        
        for (const user of oldUsers) {
            if (!user.salt) {
                // Utilisateur avec mot de passe en clair
                const salt = CryptoUtils.generateSalt();
                const hashedPassword = await CryptoUtils.hashPasswordWithSalt(user.password, salt);
                
                migratedUsers.push({
                    ...user,
                    password: hashedPassword,
                    salt: salt
                });
            } else {
                migratedUsers.push(user);
            }
        }
        
        users = migratedUsers;
        localStorage.setItem('gta-rp-users', JSON.stringify(users));
    }
}