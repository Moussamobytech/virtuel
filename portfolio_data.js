// Données du Portfolio Virtuel de Moussa Kouyaté - Intégration Tour de l'Afrique
const PORTFOLIO_DATA = {
  profile: {
    name: "MOUSSA KOUYATÉ",
    title: "Développeur Front-End & Full-Stack",
    subtitle: "Spécialiste Web, Mobile & UI/UX Design",
    location: "Bamako, Mali",
    phone: "+223 91-17-77-84",
    email: "kouyatemoussa003@gmail.com",
    github: "https://github.com/Moussamobytech",
    githubUser: "Moussamobytech",
    availability: "Disponible immédiatement",
    bio: "Développeur front-end passionné par les nouvelles technologies et le numérique, je suis spécialisé dans la création de sites web et d’applications mobiles en utilisant React, JavaScript, CSS et Angular. Créatif et rigoureux, je m'engage à concevoir des interfaces conviviales, esthétiques et intuitives.",
    avatarBadge: "Tour de l'Afrique • Bamako",
    strengths: ["Passionné", "Motivé", "Autonome", "Créatif", "Rigoureux"],
    languages: [
      { name: "Français", level: "Courant", dots: 5 },
      { name: "Bambara", level: "Langue maternelle", dots: 5 },
      { name: "Anglais", level: "Professionnel / Technique", dots: 3 }
    ],
    interests: [
      "Résolution de problèmes complexes",
      "Veille technologique & apprentissage continu",
      "Pratique du sport & endurance",
      "Lecture et participation à des événements technologiques"
    ]
  },

  // Sections associées aux niveaux de la Tour de l'Afrique
  monumentLevels: [
    {
      id: "summit",
      number: "Niveau 5",
      name: "Sommet — Silhouette de l'Afrique",
      shortName: "À propos",
      category: "about",
      cameraPos: { x: 0, y: 38, z: 22 },
      targetPos: { x: 0, y: 34, z: 0 },
      description: "Le sommet couronné par la sculpture emblématique du continent africain symbolise la vision panafricaine, l'ambition et l'excellence technologique.",
      badge: "Vision & Profil",
      iconClass: "fa-solid fa-earth-africa"
    },
    {
      id: "observatory",
      number: "Niveau 4",
      name: "Belvédère Supérieur",
      shortName: "Compétences",
      category: "skills",
      cameraPos: { x: 18, y: 28, z: 18 },
      targetPos: { x: 0, y: 24, z: 0 },
      description: "L'étage panoramique offrant une vue stratégique à 360° sur l'écosystème technologique : frameworks modernes, langages et outils de pointe.",
      badge: "Compétences & Tech Stack",
      iconClass: "fa-solid fa-laptop-code"
    },
    {
      id: "shaft",
      number: "Niveau 3",
      name: "Fût & Anneau Décoratif",
      shortName: "Projets",
      category: "projects",
      cameraPos: { x: -20, y: 19, z: 18 },
      targetPos: { x: 0, y: 16, z: 0 },
      description: "Le cœur de la tour orné de frises soudano-sahéliennes abrite l'ensemble des réalisations concrètes : applications web, quiz JEE, et plateformes.",
      badge: "Projets Professionnels & Perso",
      iconClass: "fa-solid fa-rocket"
    },
    {
      id: "base",
      number: "Niveau 2",
      name: "Base Monumentale & Contreforts",
      shortName: "Diplômes",
      category: "education",
      cameraPos: { x: 22, y: 11, z: 20 },
      targetPos: { x: 0, y: 7, z: 0 },
      description: "Les solides fondations en grès ocre représentent le socle académique : ESCT, Orange Digital Center et parcours scientifique.",
      badge: "Formations & Certifications",
      iconClass: "fa-solid fa-graduation-cap"
    },
    {
      id: "plaza",
      number: "Niveau 1",
      name: "Esplanade Circulaire & Portes Sahéliennes",
      shortName: "Contact",
      category: "contact",
      cameraPos: { x: 0, y: 7, z: 32 },
      targetPos: { x: 0, y: 2, z: 0 },
      description: "Le grand parvis circulaire entouré de portes traditionnelles : le point de rencontre pour initier vos projets et partenariats.",
      badge: "Contact & Connexion",
      iconClass: "fa-solid fa-paper-plane"
    }
  ],

  // Compétences détaillées par catégorie
  skills: [
    {
      category: "Langages de programmation",
      iconClass: "fa-solid fa-code",
      items: [
        { name: "JavaScript (ES6+)", level: 90, tag: "Expertise frontend" },
        { name: "HTML5 & CSS3 / Modern CSS", level: 95, tag: "Responsive & Animations" },
        { name: "Java (JEE)", level: 80, tag: "Architecture backend & Quiz app" },
        { name: "Python", level: 75, tag: "Algorithmique & Scripting" }
      ]
    },
    {
      category: "Frameworks & Librairies",
      iconClass: "fa-solid fa-layer-group",
      items: [
        { name: "React.js", level: 88, tag: "SPA & State management" },
        { name: "Angular", level: 78, tag: "Applications modulaires" },
        { name: "React Native", level: 75, tag: "Applications mobiles" },
        { name: "Bootstrap & jQuery", level: 90, tag: "Intégration rapide & UI" }
      ]
    },
    {
      category: "Bases de Données & CMS",
      iconClass: "fa-solid fa-database",
      items: [
        { name: "MySQL", level: 85, tag: "Requêtes & Relations" },
        { name: "SQL Server", level: 80, tag: "Administration BDD" },
        { name: "WordPress", level: 88, tag: "Thèmes, plugins & sites clubs" },
        { name: "Drupal", level: 72, tag: "CMS d'entreprise" }
      ]
    },
    {
      category: "Outils, UI/UX & Méthodes",
      iconClass: "fa-solid fa-screwdriver-wrench",
      items: [
        { name: "Git & GitHub", level: 85, tag: "Version control" },
        { name: "Figma & Canva", level: 85, tag: "Prototypage & Maquettes" },
        { name: "VS Code / Eclipse / NetBeans", level: 90, tag: "IDE & Debugging" },
        { name: "UML & Merise", level: 82, tag: "Conception & Modélisation" },
        { name: "Systèmes Linux & Windows", level: 85, tag: "Administration & Dev" }
      ]
    }
  ],

  // Projets
  projects: [
    {
      title: "Application de Quiz Professionnelle JEE",
      period: "2023 - 2024",
      category: "Professionnel",
      tech: ["Java (JEE)", "Bootstrap", "jQuery", "MySQL"],
      description: "Conception et développement complet (front & back) d'une application de quiz interactive. Définition du cahier des charges, architecture MVC et version mobile responsive.",
      highlights: [
        "Architecture robuste Java Enterprise Edition (JEE)",
        "Interface responsive avec Bootstrap & jQuery",
        "Gestion sécurisée des sessions et calcul dynamique des scores"
      ],
      iconClass: "fa-solid fa-circle-question"
    },
    {
      title: "Site Web Club de Formation IKADEV",
      period: "2023 - 2024",
      category: "Professionnel",
      tech: ["WordPress", "PHP", "CSS3", "Responsive Web"],
      description: "Développement front-end et back-end du site web officiel du club de formation IKADEV pour la présentation des activités et l'engagement des membres.",
      highlights: [
        "Conception sur mesure du thème et de la navigation",
        "Espace de communication pour étudiants et formateurs",
        "Optimisation du référencement et des performances"
      ],
      iconClass: "fa-solid fa-globe"
    },
    {
      title: "Déploiement Réseau & Windows Server 2012",
      period: "2023 - 2024",
      category: "Système & Réseau",
      tech: ["Windows Server 2012", "Active Directory", "Partage Sécurisé"],
      description: "Création des groupes d'utilisateurs, mise en place des postes clients et configuration, partage sécurisé des fichiers entre clients.",
      highlights: [
        "Administration des droits d'accès et stratégies réseau",
        "Configuration client-serveur stable et sécurisée"
      ],
      iconClass: "fa-solid fa-server"
    },
    {
      title: "Application Web de Quiz Interactive",
      period: "2021 - 2022",
      category: "Personnel",
      tech: ["React.js", "MySQL", "Node / Express", "CSS Modules"],
      description: "Application web interactive permettant aux utilisateurs de jouer, répondre aux quiz et gérer leurs profils avec stockage persistant.",
      highlights: [
        "Interface dynamique en React.js",
        "Base de données MySQL pour la persistance des profils",
        "Animations fluides et expérience intuitive"
      ],
      iconClass: "fa-solid fa-bolt"
    },
    {
      title: "Conception UX/UI Design & Prototypes",
      period: "2021 - 2022",
      category: "Design UX/UI",
      tech: ["Figma", "Canva", "Prototypage", "Design System"],
      description: "Création de maquettes d'applications, univers visuels originaux, clonage et prototypes haute fidélité de YouTube et Alibaba, logos personnalisés.",
      highlights: [
        "Clonage et prototypage de plateformes majeures (YouTube, Alibaba)",
        "Création d'identités visuelles et logos uniques",
        "Expérience utilisateur moderne et soignée"
      ],
      iconClass: "fa-solid fa-palette"
    },
    {
      title: "Suite d'Outils Web & Portfolio",
      period: "2021 - 2022",
      category: "Personnel",
      tech: ["HTML5", "CSS3", "JavaScript Natif"],
      description: "Création d'un premier site portfolio personnel, développement d'une Todo-liste dynamique et d'une calculatrice complète en JavaScript.",
      highlights: [
        "Maîtrise approfondie des fondamentaux du Web (Vanilla JS)",
        "Gestion efficace des événements et du DOM",
        "Design épuré et adapté au mobile"
      ],
      iconClass: "fa-solid fa-code"
    }
  ],

  // Formations & Diplômes
  education: [
    {
      degree: "Licence en Sciences Économiques et Gestion",
      specialty: "Informatique de Gestion",
      school: "Université des Écoles Supérieures de Commerce et de Technologie (ESCT)",
      location: "Bamako, Mali",
      period: "2023 - 2024",
      mention: "Mention Bien",
      badge: "Bac +3",
      iconClass: "fa-solid fa-user-graduate"
    },
    {
      degree: "D.U.T : Diplôme Universitaire de Technologie",
      specialty: "Informatique de Gestion",
      school: "Université des Écoles Supérieures de Commerce et de Technologie (ESCT)",
      location: "Bamako, Mali",
      period: "2021 - 2022",
      mention: "Mention Bien",
      badge: "Bac +2",
      iconClass: "fa-solid fa-certificate"
    },
    {
      degree: "Baccalauréat Scientifique (TSE)",
      specialty: "Sciences Exactes / Mathématiques",
      school: "Lycée Niampere Ballo",
      location: "Mali",
      period: "2020 - 2021",
      mention: "Admis",
      badge: "Baccalauréat",
      iconClass: "fa-solid fa-school"
    }
  ],

  // Certifications
  certificates: [
    {
      title: "Formation Impressions 3D",
      issuer: "Orange Digital Center",
      period: "2022 - 2023",
      skills: ["Impression 3D", "Modélisation", "Fabrication numérique"],
      iconClass: "fa-solid fa-cube"
    },
    {
      title: "Certification Outils Graphiques Canva",
      issuer: "Orange Digital Center",
      period: "2022 - 2023",
      skills: ["Design graphique", "Création de visuels", "Canva Pro"],
      iconClass: "fa-solid fa-paintbrush"
    }
  ],

  // À propos du monument
  monumentInfo: {
    name: "La Tour de l'Afrique",
    city: "Bamako",
    country: "Mali",
    location: "Rond-point de la Tour de l'Afrique, Faladié",
    height: "46 mètres",
    inauguration: "2001",
    architecturalStyle: "Style Soudano-Sahélien contemporain",
    symbolism: "Érigée comme symbole de la renaissance et de l'unité africaine, avec au sommet la carte stylisée du continent africain. Ses arches et sa base s'inspirent des fortifications soudano-sahéliennes traditionnelles du Mali.",
    imageSrc: "tour_afrique_original.jpg"
  }
};
