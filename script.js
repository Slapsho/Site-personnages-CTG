// Configuration principale
const config = {
    spotlightSize: 200,
    responsiveBreakpoint: 768,
    glitchDuration: 3000
};

// Initialisation après le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page chargée - Initialisation...');
    
    // Récupération des éléments du DOM
    const cards = document.querySelectorAll('.character-card');
    const container = document.querySelector('.container');
    const mainElement = document.querySelector('main');
    
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
        const cardTitle = card.querySelector('.stat-label');
        if (cardTitle) {
            console.log(`Carte sélectionnée: ${cardTitle.textContent}`);
        }
        
        // Redirection vers la page du personnage
        const link = card.querySelector('a[href*="Personnages"]');
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
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
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
            config.spotlightSize = 150;
            // Réduction des effets sur mobile
            cards.forEach(card => {
                card.style.transition = 'transform 0.2s ease';
            });
        } else {
            config.spotlightSize = 200;
            // Effets complets sur desktop
            cards.forEach(card => {
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            });
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
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                animation: float ${Math.random() * 20 + 10}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particleContainer.appendChild(particle);
        }
    }
    
    // Initialisation des particules flottantes
    createFloatingParticles();
    
    // Nettoyage au déchargement de la page
    window.addEventListener('beforeunload', function() {
        if (audioContext) {
            audioContext.close();
        }
    });
    
    console.log('Initialisation terminée avec succès');
});

// Styles CSS additionnels à ajouter
const additionalStyles = `
    /* Animation de glitch pour les badges */
    @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
    }
    
    /* Animation pour les particules flottantes */
    @keyframes float {
        0% { transform: translateY(0px); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh); opacity: 0; }
    }
    
    /* Effets hover pour les cartes */
    .character-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
    }
    
    .character-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .character-card:hover {
            transform: translateY(-5px);
        }
    }
`;

// Injection des styles additionnels
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = additionalStyles;
document.head.appendChild(styleSheet);