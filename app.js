/**
 * Application Controller — Moussa Kouyaté 3D Portfolio
 * Gère l'interface utilisateur, les interactions et la synchronisation avec le monde 3D
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialiser le Moteur 3D
  const engine = new TourAfrique3D("webgl-container", PORTFOLIO_DATA);

  // Éléments du DOM
  const drawer = document.getElementById("detail-drawer");
  const closeDrawerBtn = document.getElementById("close-drawer");
  const drawerTag = document.getElementById("drawer-tag");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerDesc = document.getElementById("drawer-desc");
  const drawerBody = document.getElementById("drawer-body");
  const levelSteps = document.querySelectorAll(".level-step");
  const themeBtns = document.querySelectorAll(".theme-btn");
  const resetViewBtn = document.getElementById("reset-view-btn");
  const autoTourBtn = document.getElementById("auto-tour-btn");
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  const monumentInfoBtn = document.getElementById("monument-info-btn");
  const monumentModal = document.getElementById("monument-modal");
  const closeMonumentModal = document.getElementById("close-monument-modal");

  let isAutoTouring = false;
  let autoTourInterval = null;

  // 2. Gestion de la sélection des niveaux
  function activateLevel(index) {
    // Mise à jour de la barre inférieure
    levelSteps.forEach(step => {
      const stepIdx = parseInt(step.dataset.index, 10);
      if (stepIdx === index) {
        step.classList.add("active");
        // Assurer le centrage sur mobile pour défilement horizontal fluide
        step.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      } else {
        step.classList.remove("active");
      }
    });

    // Remplissage et ouverture du Drawer
    const level = PORTFOLIO_DATA.monumentLevels[index];
    renderDrawerContent(level);
    drawer.classList.add("open");
  }

  // 3. Rendu dynamique du contenu selon le niveau
  function renderDrawerContent(level) {
    drawerTag.innerHTML = `<i class="${level.iconClass}"></i> ${level.number} • ${level.badge}`;
    drawerTitle.textContent = level.name;
    drawerDesc.textContent = level.description;

    let html = "";

    switch (level.category) {
      case "about":
        html = renderAboutSection();
        break;
      case "skills":
        html = renderSkillsSection();
        break;
      case "projects":
        html = renderProjectsSection();
        break;
      case "education":
        html = renderEducationSection();
        break;
      case "contact":
        html = renderContactSection();
        break;
    }

    drawerBody.innerHTML = html;

    // Déclencher l'animation des jauges de compétences si présentes
    setTimeout(() => {
      const fills = drawerBody.querySelectorAll(".skill-progress-fill");
      fills.forEach(fill => {
        fill.style.width = fill.dataset.level + "%";
      });
    }, 100);
  }

  // --- SECTIONS DE CONTENU DU PORTFOLIO ---

  function renderAboutSection() {
    const p = PORTFOLIO_DATA.profile;
    return `
      <div class="content-section">
        <h4 class="content-section-title"><i class="fa-solid fa-user-tie"></i> Profil & Vision</h4>
        <p style="font-size: 0.88rem; line-height: 1.6; color: #e2e8f0; margin-bottom: 16px;">
          ${p.bio}
        </p>

        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 14px; margin-bottom: 16px;">
          <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--primary-light); font-weight: 700; margin-bottom: 6px;">Statut</div>
          <div style="font-size: 0.92rem; font-weight: 700; color: #fff;"><i class="fa-solid fa-circle-check" style="color: var(--accent-green); margin-right: 6px;"></i>${p.availability}</div>
          <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;"><i class="fa-solid fa-location-dot" style="color: var(--primary); margin-right: 6px;"></i>Basé à ${p.location} (Mobilité & Télétravail)</div>
        </div>

        <h4 class="content-section-title"><i class="fa-solid fa-bolt"></i> Points Forts & Qualités</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
          ${p.strengths.map(s => `<span class="tech-tag" style="background: rgba(245, 158, 11, 0.18); color: var(--primary-light); font-weight: 600; padding: 6px 14px; border-radius: 20px;"><i class="fa-solid fa-check" style="margin-right: 6px; font-size: 0.75rem;"></i>${s}</span>`).join("")}
        </div>

        <h4 class="content-section-title"><i class="fa-solid fa-language"></i> Langues Pratiquées</h4>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          ${p.languages.map(l => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 8px;">
              <span style="font-size: 0.85rem; font-weight: 600;">${l.name}</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">${l.level}</span>
                <span style="color: var(--primary); font-size: 0.75rem; letter-spacing: 2px;">${"●".repeat(l.dots)}${"○".repeat(5 - l.dots)}</span>
              </div>
            </div>
          `).join("")}
        </div>

        <h4 class="content-section-title"><i class="fa-solid fa-compass"></i> Centres d'Intérêt</h4>
        <ul class="card-points" style="margin-bottom: 20px;">
          ${p.interests.map(i => `<li>${i}</li>`).join("")}
        </ul>

        <div class="contact-actions">
          <a href="#contact" class="action-btn-main" onclick="window.selectLevelNav(4); return false;">
            <i class="fa-solid fa-comments"></i> <span>Discuter d'un projet</span> <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }

  function renderSkillsSection() {
    return `
      <div class="content-section">
        ${PORTFOLIO_DATA.skills.map(cat => `
          <div style="margin-bottom: 22px;">
            <h4 class="content-section-title"><i class="${cat.iconClass}"></i> ${cat.category}</h4>
            ${cat.items.map(skill => `
              <div class="skill-bar-item">
                <div class="skill-bar-labels">
                  <span class="skill-name">${skill.name} <small style="color: var(--text-muted); font-size: 0.72rem;">— ${skill.tag}</small></span>
                  <span class="skill-level-text">${skill.level}%</span>
                </div>
                <div class="skill-progress-track">
                  <div class="skill-progress-fill" data-level="${skill.level}" style="width: 0%;"></div>
                </div>
              </div>
            `).join("")}
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderProjectsSection() {
    return `
      <div class="content-section">
        <div style="display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; padding-bottom: 4px;">
          <span class="tech-tag" style="background: var(--primary); color: #000; font-weight: bold;"><i class="fa-solid fa-folder-open" style="margin-right: 6px;"></i>Tous les projets (${PORTFOLIO_DATA.projects.length})</span>
        </div>

        ${PORTFOLIO_DATA.projects.map(proj => `
          <div class="project-card">
            <div class="card-header-line">
              <span class="card-title"><i class="${proj.iconClass}" style="color: var(--primary); margin-right: 6px;"></i>${proj.title}</span>
              <span class="card-badge">${proj.period}</span>
            </div>
            <div class="tech-tags">
              ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join("")}
            </div>
            <p class="card-desc">${proj.description}</p>
            <ul class="card-points">
              ${proj.highlights.map(h => `<li>${h}</li>`).join("")}
            </ul>
          </div>
        `).join("")}

        <div style="text-align: center; margin-top: 15px;">
          <a href="${PORTFOLIO_DATA.profile.github}" target="_blank" class="action-btn-main" style="background: rgba(255,255,255,0.08); border: 1px solid var(--border-gold);">
            <i class="fa-brands fa-github" style="font-size: 1.1rem;"></i> <span>Voir tous les dépôts sur GitHub</span> <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.8rem;"></i>
          </a>
        </div>
      </div>
    `;
  }

  function renderEducationSection() {
    return `
      <div class="content-section">
        <h4 class="content-section-title"><i class="fa-solid fa-graduation-cap"></i> Diplômes & Cursus Universitaire</h4>
        ${PORTFOLIO_DATA.education.map(edu => `
          <div class="edu-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div class="edu-degree"><i class="${edu.iconClass}" style="color: var(--primary); margin-right: 6px;"></i>${edu.degree}</div>
              <span class="card-badge">${edu.badge}</span>
            </div>
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--primary-light); margin-top: 4px;">
              Spécialité : ${edu.specialty}
            </div>
            <div class="edu-school">${edu.school} — ${edu.location}</div>
            <div class="edu-footer">
              <span class="edu-mention"><i class="fa-solid fa-award" style="margin-right: 4px;"></i>${edu.mention}</span>
              <span class="edu-year"><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i>${edu.period}</span>
            </div>
          </div>
        `).join("")}

        <h4 class="content-section-title" style="margin-top: 24px;"><i class="fa-solid fa-certificate"></i> Certifications Spécialisées</h4>
        ${PORTFOLIO_DATA.certificates.map(cert => `
          <div class="edu-card" style="border-left: 3px solid var(--primary);">
            <div style="display: flex; justify-content: space-between;">
              <div class="edu-degree"><i class="${cert.iconClass}" style="color: var(--primary); margin-right: 6px;"></i>${cert.title}</div>
              <span class="edu-year"><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i>${cert.period}</span>
            </div>
            <div class="edu-school" style="color: var(--primary-light); font-weight: 600; margin-top: 2px;">
              Organisme : ${cert.issuer}
            </div>
            <div class="tech-tags" style="margin-top: 8px;">
              ${cert.skills.map(s => `<span class="tech-tag">${s}</span>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderContactSection() {
    const p = PORTFOLIO_DATA.profile;
    return `
      <div class="content-section">
        <h4 class="content-section-title"><i class="fa-solid fa-address-book"></i> Coordonnées Professionnelles</h4>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          <a href="tel:${p.phone.replace(/\s+/g, '')}" class="contact-row">
            <span class="contact-icon-box"><i class="fa-solid fa-phone"></i></span>
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Téléphone direct</div>
              <div style="font-weight: 700;">${p.phone}</div>
            </div>
          </a>

          <a href="mailto:${p.email}" class="contact-row">
            <span class="contact-icon-box"><i class="fa-solid fa-envelope"></i></span>
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Email professionnel</div>
              <div style="font-weight: 700;">${p.email}</div>
            </div>
          </a>

          <a href="${p.github}" target="_blank" class="contact-row">
            <span class="contact-icon-box"><i class="fa-brands fa-github"></i></span>
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Dépôt GitHub</div>
              <div style="font-weight: 700;">github.com/${p.githubUser}</div>
            </div>
          </a>

          <div class="contact-row">
            <span class="contact-icon-box"><i class="fa-solid fa-map-location-dot"></i></span>
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Localisation</div>
              <div style="font-weight: 700;">${p.location}</div>
            </div>
          </div>
        </div>

        <div class="contact-actions">
          <a href="mailto:${p.email}?subject=Opportunité%20de%20collaboration%20-%20Moussa%20Kouyaté" class="action-btn-main">
            <i class="fa-solid fa-paper-plane"></i> <span>Envoyer un message</span>
          </a>
          <button class="glass-btn" style="justify-content: center; width: 100%;" onclick="window.printCV()">
            <i class="fa-solid fa-file-pdf"></i> <span>Imprimer / Sauvegarder le CV</span>
          </button>
        </div>
      </div>
    `;
  }

  // 4. Écouteurs d'événements 3D
  window.addEventListener("levelSelected", (e) => {
    activateLevel(e.detail.index);
  });

  window.addEventListener("viewReset", () => {
    levelSteps.forEach(s => s.classList.remove("active"));
    drawer.classList.remove("open");
  });

  // Clic sur un bouton de la barre de navigation
  window.selectLevelNav = (index) => {
    if (isAutoTouring) stopAutoTour();
    engine.selectLevel(index);
    activateLevel(index);
  };

  levelSteps.forEach(step => {
    step.addEventListener("click", () => {
      const idx = parseInt(step.dataset.index, 10);
      window.selectLevelNav(idx);
    });
  });

  // Fermer le tiroir latéral
  closeDrawerBtn.addEventListener("click", () => {
    drawer.classList.remove("open");
    if (window.soundManager) soundManager.playHover();
  });

  // Bouton Réinitialiser la vue
  resetViewBtn.addEventListener("click", () => {
    if (isAutoTouring) stopAutoTour();
    engine.resetView();
  });

  // 5. Gestion des Thèmes d'ambiance d'éclairage
  themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      themeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const theme = btn.dataset.theme;
      engine.applyTheme(theme);
      if (window.soundManager) soundManager.playSelect();
    });
  });

  // 6. Gestion du Son (Audio SFX)
  soundToggleBtn.addEventListener("click", () => {
    const isMuted = soundManager.toggleMute();
    soundToggleBtn.innerHTML = isMuted 
      ? `<i class="fa-solid fa-volume-xmark"></i><span class="btn-text">Son off</span>` 
      : `<i class="fa-solid fa-volume-high"></i><span class="btn-text">Son on</span>`;
    soundToggleBtn.classList.toggle("active", !isMuted);
    if (!isMuted) {
      soundManager.startAmbient();
      soundManager.playSelect();
    }
  });

  // 7. Visite Guidée Automatique (Cinematic Tour)
  function startAutoTour() {
    isAutoTouring = true;
    autoTourBtn.classList.add("active");
    autoTourBtn.innerHTML = `<i class="fa-solid fa-pause"></i><span class="btn-text">Pause</span>`;

    let step = 0;
    engine.selectLevel(step);
    activateLevel(step);

    autoTourInterval = setInterval(() => {
      step = (step + 1) % PORTFOLIO_DATA.monumentLevels.length;
      engine.selectLevel(step);
      activateLevel(step);
    }, 6000);
  }

  function stopAutoTour() {
    isAutoTouring = false;
    clearInterval(autoTourInterval);
    autoTourBtn.classList.remove("active");
    autoTourBtn.innerHTML = `<i class="fa-solid fa-play"></i><span class="btn-text">Visite Guidée</span>`;
  }

  autoTourBtn.addEventListener("click", () => {
    if (isAutoTouring) {
      stopAutoTour();
    } else {
      startAutoTour();
    }
  });

  // 8. Modal Historique du Monument
  monumentInfoBtn.addEventListener("click", () => {
    monumentModal.classList.add("open");
    if (window.soundManager) soundManager.playSelect();
  });

  closeMonumentModal.addEventListener("click", () => {
    monumentModal.classList.remove("open");
  });

  monumentModal.addEventListener("click", (e) => {
    if (e.target === monumentModal) {
      monumentModal.classList.remove("open");
    }
  });

  // Imprimer ou enregistrer le CV en PDF
  window.printCV = () => {
    window.print();
  };

  // Interaction initiale : Démarrage doux avec son d'ambiance au premier clic
  document.body.addEventListener("pointerdown", () => {
    soundManager.init();
  }, { once: true });
});
