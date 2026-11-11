/**
 * Tour de l'Afrique 3D Engine — Moussa Kouyaté Virtual Portfolio
 * Procedural 3D Monument Generation with Three.js & GSAP
 */

class TourAfrique3D {
  constructor(containerId, data) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.monumentGroup = new THREE.Group();
    this.hotspots = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.currentLevelIndex = -1;
    this.isTransitioning = false;
    this.autoRotateSpeed = 0.4;
    this.currentTheme = "golden"; // 'golden', 'day', 'night'
    this.lights = {};
    this.particles = null;
    this.africaSculpture = null;
    this.init();
  }

  init() {
    this.setupScene();
    this.setupLights();
    this.createMaterials();
    this.buildWorld();
    this.buildMonument();
    this.createHotspots();
    this.createAtmosphereParticles();
    this.setupEvents();
    this.applyTheme(this.currentTheme);
    this.animate();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdbe7f0);
    this.scene.fog = new THREE.FogExp2(0xdbe7f0, 0.008);

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    this.camera.position.set(0, 20, 52);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03; // Ne pas traverser le sol
    this.controls.minDistance = 8;
    this.controls.maxDistance = 85;
    this.controls.target.set(0, 16, 0);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = this.autoRotateSpeed;
  }

  createMaterials() {
    // Génération procédurale de textures avec Canvas HTML5
    const stoneCanvas = document.createElement("canvas");
    stoneCanvas.width = 512;
    stoneCanvas.height = 512;
    const ctx = stoneCanvas.getContext("2d");
    ctx.fillStyle = "#c89d7c";
    ctx.fillRect(0, 0, 512, 512);
    // Bruit de pierre et joints d'assise
    for (let i = 0; i < 40000; i++) {
      const v = Math.random() * 35 - 17;
      ctx.fillStyle = `rgba(${190 + v}, ${145 + v}, ${110 + v}, 0.25)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    // Lignes horizontales de taille de pierre
    ctx.strokeStyle = "rgba(120, 85, 60, 0.2)";
    ctx.lineWidth = 1;
    for (let y = 0; y < 512; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    const stoneTex = new THREE.CanvasTexture(stoneCanvas);
    stoneTex.wrapS = THREE.RepeatWrapping;
    stoneTex.wrapT = THREE.RepeatWrapping;
    stoneTex.repeat.set(4, 8);

    // Texture pour l'anneau décoratif traditionnel aux couleurs nationales du MALI (Vert, Jaune/Or, Rouge)
    const bandCanvas = document.createElement("canvas");
    bandCanvas.width = 1024;
    bandCanvas.height = 256;
    const bCtx = bandCanvas.getContext("2d");
    
    // 1. Bande Supérieure : VERT DU MALI (#009A44 / #14B866)
    bCtx.fillStyle = "#009A44";
    bCtx.fillRect(0, 0, 1024, 76);

    // 2. Bande Centrale : JAUNE / OR DU MALI (#FFCD00 / #FCD116)
    bCtx.fillStyle = "#FFCD00";
    bCtx.fillRect(0, 76, 1024, 104);

    // 3. Bande Inférieure : ROUGE DU MALI (#CE1126)
    bCtx.fillStyle = "#CE1126";
    bCtx.fillRect(0, 180, 1024, 76);

    // Motifs géométriques traditionnels soudano-sahéliens sculptés (reliefs blancs & or)
    bCtx.fillStyle = "rgba(255, 255, 255, 0.85)";
    for (let x = 0; x < 1024; x += 64) {
      // Triangles traditionnels dans la bande verte
      bCtx.beginPath();
      bCtx.moveTo(x + 32, 12);
      bCtx.lineTo(x + 52, 64);
      bCtx.lineTo(x + 12, 64);
      bCtx.closePath();
      bCtx.fill();

      // Chevrons dans la bande rouge
      bCtx.beginPath();
      bCtx.moveTo(x + 32, 244);
      bCtx.lineTo(x + 52, 192);
      bCtx.lineTo(x + 12, 192);
      bCtx.closePath();
      bCtx.fill();
    }

    // Losanges et médaillons dorés dans la bande centrale jaune
    bCtx.fillStyle = "#8a4b08";
    for (let x = 0; x < 1024; x += 64) {
      bCtx.beginPath();
      bCtx.moveTo(x + 32, 85);
      bCtx.lineTo(x + 60, 128);
      bCtx.lineTo(x + 32, 171);
      bCtx.lineTo(x + 4, 128);
      bCtx.closePath();
      bCtx.fill();
    }
    bCtx.fillStyle = "#fff4cc";
    for (let x = 0; x < 1024; x += 64) {
      bCtx.beginPath();
      bCtx.arc(x + 32, 128, 11, 0, Math.PI * 2);
      bCtx.fill();
    }
    const bandTex = new THREE.CanvasTexture(bandCanvas);
    bandTex.wrapS = THREE.RepeatWrapping;
    bandTex.repeat.set(6, 1);

    this.materials = {
      baseStone: new THREE.MeshStandardMaterial({
        color: 0xd29d77,
        map: stoneTex,
        roughness: 0.82,
        metalness: 0.05
      }),
      upperShaft: new THREE.MeshStandardMaterial({
        color: 0xdecbb4,
        roughness: 0.75,
        metalness: 0.08
      }),
      decorativeBand: new THREE.MeshStandardMaterial({
        map: bandTex,
        roughness: 0.5,
        metalness: 0.15
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: 0xf1c40f,
        roughness: 0.25,
        metalness: 0.85,
        emissive: 0x5a4205,
        emissiveIntensity: 0.2
      }),
      lanternDeck: new THREE.MeshStandardMaterial({
        color: 0xbe825c,
        roughness: 0.8,
        metalness: 0.1
      }),
      windowGlass: new THREE.MeshStandardMaterial({
        color: 0x1a2e3b,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x0d1e2b,
        emissiveIntensity: 0.3
      }),
      sculptureGold: new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.2,
        metalness: 0.95,
        emissive: 0x996515,
        emissiveIntensity: 0.35
      }),
      plazaTerracotta: new THREE.MeshStandardMaterial({
        color: 0xda9371,
        roughness: 0.9,
        metalness: 0.05
      }),
      curbStone: new THREE.MeshStandardMaterial({
        color: 0xa89f91,
        roughness: 0.7,
        metalness: 0.1
      }),
      lawnGrass: new THREE.MeshStandardMaterial({
        color: 0x4a7c36,
        roughness: 0.9,
        metalness: 0.02
      }),
      asphaltRoad: new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.95,
        metalness: 0.05
      }),
      waterBasin: new THREE.MeshStandardMaterial({
        color: 0x1b7a90,
        roughness: 0.1,
        metalness: 0.4,
        transparent: true,
        opacity: 0.85
      })
    };
  }

  setupLights() {
    // Lumière d'ambiance
    this.lights.ambient = new THREE.HemisphereLight(0xfff3e0, 0x554433, 0.75);
    this.scene.add(this.lights.ambient);

    // Lumière du Soleil (Directional)
    this.lights.sun = new THREE.DirectionalLight(0xffebd2, 1.4);
    this.lights.sun.position.set(35, 55, 30);
    this.lights.sun.castShadow = true;
    this.lights.sun.shadow.mapSize.width = 2048;
    this.lights.sun.shadow.mapSize.height = 2048;
    this.lights.sun.shadow.camera.near = 1;
    this.lights.sun.shadow.camera.far = 150;
    const d = 35;
    this.lights.sun.shadow.camera.left = -d;
    this.lights.sun.shadow.camera.right = d;
    this.lights.sun.shadow.camera.top = d;
    this.lights.sun.shadow.camera.bottom = -d;
    this.lights.sun.shadow.bias = -0.0005;
    this.scene.add(this.lights.sun);

    // Lumière secondaire douce de rebond
    this.lights.fill = new THREE.DirectionalLight(0xd9b38c, 0.5);
    this.lights.fill.position.set(-30, 25, -25);
    this.scene.add(this.lights.fill);

    // Projecteur ponctuel sur la sculpture du sommet
    this.lights.summitSpot = new THREE.PointLight(0xffdf80, 1.2, 25);
    this.lights.summitSpot.position.set(0, 36, 0);
    this.scene.add(this.lights.summitSpot);

    // Projecteurs nocturnes à la base
    this.lights.nightSpots = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const spot = new THREE.SpotLight(0xffecc4, 0, 45, Math.PI / 6, 0.5, 1);
      spot.position.set(Math.cos(angle) * 16, 1.5, Math.sin(angle) * 16);
      spot.target.position.set(0, 18, 0);
      this.scene.add(spot);
      this.scene.add(spot.target);
      this.lights.nightSpots.push(spot);
    }
  }

  buildWorld() {
    const worldGroup = new THREE.Group();

    // 1. Chaussée du grand rond-point (anneau extérieur)
    const roadGeo = new THREE.RingGeometry(24, 38, 64);
    const roadMesh = new THREE.Mesh(roadGeo, this.materials.asphaltRoad);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = -0.05;
    roadMesh.receiveShadow = true;
    worldGroup.add(roadMesh);

    // Bordure extérieure / trottoir
    const curbGeo = new THREE.RingGeometry(23.4, 24.2, 64);
    const curbMesh = new THREE.Mesh(curbGeo, this.materials.curbStone);
    curbMesh.rotation.x = -Math.PI / 2;
    curbMesh.position.y = 0.05;
    worldGroup.add(curbMesh);

    // 2. Anneau de pelouse verte entourant l'esplanade
    const lawnGeo = new THREE.RingGeometry(18.2, 23.6, 64);
    const lawnMesh = new THREE.Mesh(lawnGeo, this.materials.lawnGrass);
    lawnMesh.rotation.x = -Math.PI / 2;
    lawnMesh.position.y = 0.06;
    lawnMesh.receiveShadow = true;
    worldGroup.add(lawnMesh);

    // Petit bassin d'eau d'ornement sur le parvis frontal
    const basinGeo = new THREE.CylinderGeometry(2, 2, 0.35, 24);
    const basinWall = new THREE.Mesh(basinGeo, this.materials.curbStone);
    basinWall.position.set(0, 0.2, 19.5);
    worldGroup.add(basinWall);

    const waterGeo = new THREE.CircleGeometry(1.8, 24);
    const waterMesh = new THREE.Mesh(waterGeo, this.materials.waterBasin);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, 0.36, 19.5);
    worldGroup.add(waterMesh);

    // 3. Esplanade circulaire en dalles de terre cuite / sable chaud
    const esplanadeGeo = new THREE.CylinderGeometry(18.2, 18.2, 0.3, 64);
    const esplanadeMesh = new THREE.Mesh(esplanadeGeo, this.materials.plazaTerracotta);
    esplanadeMesh.position.y = 0.15;
    esplanadeMesh.receiveShadow = true;
    worldGroup.add(esplanadeMesh);

    // 4. Portes d'enceinte traditionnelles soudano-sahéliennes autour de l'esplanade
    const numGates = 6;
    for (let i = 0; i < numGates; i++) {
      const angle = (i * Math.PI * 2) / numGates + Math.PI / 6;
      const radius = 17.5;
      const gateGroup = this.createSahelianGate();
      gateGroup.position.set(Math.cos(angle) * radius, 0.3, Math.sin(angle) * radius);
      gateGroup.rotation.y = -angle + Math.PI / 2;
      worldGroup.add(gateGroup);
    }

    // 5. Palmiers et verdure stylisés
    const palmPositions = [
      { r: 21, a: 0.3 }, { r: 21, a: 1.1 }, { r: 21, a: 2.2 },
      { r: 21, a: 3.4 }, { r: 21, a: 4.5 }, { r: 21, a: 5.6 },
      { r: 16.5, a: 0.8 }, { r: 16.5, a: 2.8 }, { r: 16.5, a: 4.8 }
    ];
    palmPositions.forEach(p => {
      const palm = this.createStylizedPalmTree();
      palm.position.set(Math.cos(p.a) * p.r, 0.3, Math.sin(p.a) * p.r);
      worldGroup.add(palm);
    });

    // 6. Drapeaux Nationaux du Mali (Vert, Jaune, Rouge) dressés sur l'esplanade
    this.flags = [];
    const flagCanvas = document.createElement("canvas");
    flagCanvas.width = 180;
    flagCanvas.height = 120;
    const fCtx = flagCanvas.getContext("2d");
    fCtx.fillStyle = "#009A44"; // Vert
    fCtx.fillRect(0, 0, 60, 120);
    fCtx.fillStyle = "#FFCD00"; // Jaune
    fCtx.fillRect(60, 0, 60, 120);
    fCtx.fillStyle = "#CE1126"; // Rouge
    fCtx.fillRect(120, 0, 60, 120);
    const flagTex = new THREE.CanvasTexture(flagCanvas);

    const flagMat = new THREE.MeshStandardMaterial({
      map: flagTex,
      side: THREE.DoubleSide,
      roughness: 0.65
    });
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      metalness: 0.85,
      roughness: 0.2
    });

    // 6 Mâts de drapeaux alignés sur l'hémicycle d'entrée de l'esplanade
    const flagAngles = [-0.42, -0.25, -0.09, 0.09, 0.25, 0.42];
    flagAngles.forEach((ang) => {
      const poleGroup = new THREE.Group();
      const poleGeo = new THREE.CylinderGeometry(0.04, 0.05, 4.4, 8);
      const poleMesh = new THREE.Mesh(poleGeo, poleMat);
      poleMesh.position.y = 2.2;
      poleMesh.castShadow = true;
      poleGroup.add(poleMesh);

      // Pommeau doré au sommet du mât
      const finialGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const finialMesh = new THREE.Mesh(finialGeo, this.materials.goldAccent);
      finialMesh.position.y = 4.4;
      poleGroup.add(finialMesh);

      // Tissu du drapeau du Mali (avec maillage pour animation d'ondulation au vent)
      const flagGeo = new THREE.PlaneGeometry(1.3, 0.85, 12, 6);
      flagGeo.translate(0.65, 0, 0);
      const flagMesh = new THREE.Mesh(flagGeo, flagMat);
      flagMesh.position.set(0.04, 3.85, 0);
      flagMesh.castShadow = true;
      poleGroup.add(flagMesh);

      const r = 16.2;
      poleGroup.position.set(Math.sin(ang) * r, 0.3, Math.cos(ang) * r);
      poleGroup.rotation.y = -ang + Math.PI / 2;
      worldGroup.add(poleGroup);

      this.flags.push(flagMesh);
    });

    this.scene.add(worldGroup);
  }

  // Création d'une porte monumentale de style soudanais (arches et créneaux comme sur la photo)
  createSahelianGate() {
    const gate = new THREE.Group();

    // Murs latéraux
    const wallGeo = new THREE.BoxGeometry(4.2, 2.2, 0.45);
    const wall = new THREE.Mesh(wallGeo, this.materials.baseStone);
    wall.position.y = 1.1;
    wall.castShadow = true;
    wall.receiveShadow = true;
    gate.add(wall);

    // Arc de passage central
    const archHoleGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 16, 1, false, 0, Math.PI);
    const archHole = new THREE.Mesh(archHoleGeo, this.materials.baseStone);
    archHole.rotation.z = Math.PI;
    archHole.position.y = 1.5;

    // Piliers sommitaux crénelés (style mosquée de Djenné / Tour de l'Afrique)
    for (let x = -1.8; x <= 1.8; x += 0.9) {
      const pinnacleGeo = new THREE.ConeGeometry(0.18, 0.7, 6);
      const pinnacle = new THREE.Mesh(pinnacleGeo, this.materials.baseStone);
      pinnacle.position.set(x, 2.45, 0);
      gate.add(pinnacle);
    }

    return gate;
  }

  // Palmiers stylisés du parvis
  createStylizedPalmTree() {
    const tree = new THREE.Group();

    // Tronc courbé
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.1, 1.2, 0),
      new THREE.Vector3(0.25, 2.4, 0.05),
      new THREE.Vector3(0.4, 3.2, 0.1)
    ]);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 8, 0.12, 6, false);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5e4530, roughness: 0.9 });
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    trunkMesh.castShadow = true;
    tree.add(trunkMesh);

    // Palmes en feuilles
    const palmMat = new THREE.MeshStandardMaterial({
      color: 0x2e6930,
      roughness: 0.7,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < 7; i++) {
      const angle = (i * Math.PI * 2) / 7;
      const leafGeo = new THREE.PlaneGeometry(0.6, 1.8);
      const leaf = new THREE.Mesh(leafGeo, palmMat);
      leaf.position.set(0.4, 3.2, 0.1);
      leaf.rotation.y = angle;
      leaf.rotation.x = 0.55;
      leaf.scale.set(0.6, 1, 1);
      tree.add(leaf);
    }

    return tree;
  }

  buildMonument() {
    // 1. SOCLE CENTRAL & BASE ÉVASÉE DE LA TOUR
    // La Tour de l'Afrique possède une base conique majestueuse qui s'évase jusqu'au sol
    const baseSpline = [];
    // Points de profil (rayon, y)
    baseSpline.push(new THREE.Vector2(0, 0));
    baseSpline.push(new THREE.Vector2(6.8, 0.3));
    baseSpline.push(new THREE.Vector2(6.2, 1.2));
    baseSpline.push(new THREE.Vector2(4.9, 3.5));
    baseSpline.push(new THREE.Vector2(3.6, 7.5));
    baseSpline.push(new THREE.Vector2(2.7, 12.0));
    baseSpline.push(new THREE.Vector2(2.4, 13.8));

    const baseGeo = new THREE.LatheGeometry(baseSpline, 36);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.baseStone);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.monumentGroup.add(baseMesh);

    // CONTREFORTS RADIAUX (Les arcs et nervures arquées caractéristiques de la Tour)
    const numButtresses = 8;
    for (let i = 0; i < numButtresses; i++) {
      const angle = (i * Math.PI * 2) / numButtresses;
      const ribGroup = new THREE.Group();

      // Forme de contrefort arquée
      const ribShape = new THREE.Shape();
      ribShape.moveTo(2.3, 13.5);
      ribShape.lineTo(2.4, 13.5);
      ribShape.bezierCurveTo(3.2, 9.0, 5.2, 4.0, 6.6, 0.3);
      ribShape.lineTo(5.8, 0.3);
      ribShape.bezierCurveTo(4.4, 4.0, 2.7, 8.5, 2.2, 13.5);

      const extrudeSettings = {
        depth: 0.35,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.05,
        bevelThickness: 0.05
      };

      const ribGeo = new THREE.ExtrudeGeometry(ribShape, extrudeSettings);
      const ribMesh = new THREE.Mesh(ribGeo, this.materials.baseStone);
      ribMesh.castShadow = true;
      ribMesh.position.z = -0.175;
      ribGroup.add(ribMesh);
      ribGroup.rotation.y = angle;
      this.monumentGroup.add(ribGroup);

      // Petites fenêtres verticales / fentes traditionnelles entre les contreforts
      const midAngle = angle + Math.PI / numButtresses;
      const windowGeo = new THREE.BoxGeometry(0.2, 1.5, 0.15);
      const windowMesh = new THREE.Mesh(windowGeo, this.materials.windowGlass);
      windowMesh.position.set(Math.cos(midAngle) * 3.4, 6.5, Math.sin(midAngle) * 3.4);
      windowMesh.rotation.y = -midAngle + Math.PI / 2;
      this.monumentGroup.add(windowMesh);
    }

    // 2. BANDEAU / CEINTURE DÉCORATIVE CENTRALE (Anneau vert/or/beige à mi-hauteur)
    // Anneau tore inférieur
    const torusBottomGeo = new THREE.TorusGeometry(2.45, 0.18, 16, 36);
    const torusBottom = new THREE.Mesh(torusBottomGeo, this.materials.goldAccent);
    torusBottom.rotation.x = Math.PI / 2;
    torusBottom.position.y = 13.8;
    torusBottom.castShadow = true;
    this.monumentGroup.add(torusBottom);

    // Cylindre du bandeau décoratif à motifs africains
    const bandGeo = new THREE.CylinderGeometry(2.4, 2.4, 2.4, 36);
    const bandMesh = new THREE.Mesh(bandGeo, this.materials.decorativeBand);
    bandMesh.position.y = 15.0;
    bandMesh.castShadow = true;
    this.monumentGroup.add(bandMesh);

    // Anneau tore supérieur
    const torusTopGeo = new THREE.TorusGeometry(2.45, 0.18, 16, 36);
    const torusTop = new THREE.Mesh(torusTopGeo, this.materials.goldAccent);
    torusTop.rotation.x = Math.PI / 2;
    torusTop.position.y = 16.2;
    torusTop.castShadow = true;
    this.monumentGroup.add(torusTop);

    // 3. FÛT SUPÉRIEUR DE LA TOUR (Section cylindrique élancée)
    const shaftGeo = new THREE.CylinderGeometry(2.15, 2.35, 9.5, 36);
    const shaftMesh = new THREE.Mesh(shaftGeo, this.materials.upperShaft);
    shaftMesh.position.y = 21.0;
    shaftMesh.castShadow = true;
    shaftMesh.receiveShadow = true;
    this.monumentGroup.add(shaftMesh);

    // Rangées de fenêtres élancées sur le fût supérieur
    for (let level = 0; level < 3; level++) {
      const yPos = 18.0 + level * 2.8;
      for (let i = 0; i < 4; i++) {
        const winAngle = (i * Math.PI) / 2 + (level * 0.4);
        const winGeo = new THREE.BoxGeometry(0.24, 1.2, 0.15);
        const win = new THREE.Mesh(winGeo, this.materials.windowGlass);
        win.position.set(Math.cos(winAngle) * 2.22, yPos, Math.sin(winAngle) * 2.22);
        win.rotation.y = -winAngle + Math.PI / 2;
        this.monumentGroup.add(win);
      }
    }

    // 4. BELVÉDÈRE SUPÉRIEUR & LANTERNON (Observatoire circulaire à 360°)
    // Encaissement / Évasement sous la galerie
    const corniceGeo = new THREE.CylinderGeometry(3.2, 2.15, 1.2, 36);
    const corniceMesh = new THREE.Mesh(corniceGeo, this.materials.lanternDeck);
    corniceMesh.position.y = 26.2;
    corniceMesh.castShadow = true;
    this.monumentGroup.add(corniceMesh);

    // Plancher de la galerie
    const galleryDeckGeo = new THREE.CylinderGeometry(3.35, 3.35, 0.35, 36);
    const galleryDeck = new THREE.Mesh(galleryDeckGeo, this.materials.goldAccent);
    galleryDeck.position.y = 26.9;
    this.monumentGroup.add(galleryDeck);

    // Colonnes ouvertes de la galerie panoramique
    const numColumns = 12;
    for (let i = 0; i < numColumns; i++) {
      const colAngle = (i * Math.PI * 2) / numColumns;
      const colGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 12);
      const colMesh = new THREE.Mesh(colGeo, this.materials.lanternDeck);
      colMesh.position.set(Math.cos(colAngle) * 2.9, 28.1, Math.sin(colAngle) * 2.9);
      colMesh.castShadow = true;
      this.monumentGroup.add(colMesh);
    }

    // Noyau central du belvédère avec vitrage
    const coreGeo = new THREE.CylinderGeometry(1.9, 1.9, 2.2, 24);
    const coreMesh = new THREE.Mesh(coreGeo, this.materials.windowGlass);
    coreMesh.position.y = 28.1;
    this.monumentGroup.add(coreMesh);

    // Toit / Couronnement crénelé soudanais du belvédère
    const roofGeo = new THREE.CylinderGeometry(3.3, 3.35, 0.5, 36);
    const roofMesh = new THREE.Mesh(roofGeo, this.materials.lanternDeck);
    roofMesh.position.y = 29.4;
    roofMesh.castShadow = true;
    this.monumentGroup.add(roofMesh);

    // Créneaux architecturaux de la corniche
    for (let i = 0; i < 16; i++) {
      const crenelAngle = (i * Math.PI * 2) / 16;
      const crenelGeo = new THREE.ConeGeometry(0.16, 0.6, 6);
      const crenel = new THREE.Mesh(crenelGeo, this.materials.goldAccent);
      crenel.position.set(Math.cos(crenelAngle) * 3.2, 29.85, Math.sin(crenelAngle) * 3.2);
      this.monumentGroup.add(crenel);
    }

    // 5. CÔNE SOMMITAL ET PIÉDESTAL POUR L'AFRIQUE
    const spireBaseGeo = new THREE.CylinderGeometry(1.4, 2.6, 1.4, 24);
    const spireBase = new THREE.Mesh(spireBaseGeo, this.materials.baseStone);
    spireBase.position.y = 30.3;
    spireBase.castShadow = true;
    this.monumentGroup.add(spireBase);

    const pedestalGeo = new THREE.CylinderGeometry(0.65, 0.95, 1.2, 16);
    const pedestal = new THREE.Mesh(pedestalGeo, this.materials.goldAccent);
    pedestal.position.y = 31.5;
    pedestal.castShadow = true;
    this.monumentGroup.add(pedestal);

    // 6. SCULPTURE MONUMENTALE DU SOMMET : LA CARTE D'AFRIQUE
    this.africaSculpture = this.createAfricaSculpture();
    this.africaSculpture.position.set(0, 32.2, 0);
    this.monumentGroup.add(this.africaSculpture);

    this.scene.add(this.monumentGroup);
  }

  // Modélisation précise et élégante de la silhouette du continent africain
  createAfricaSculpture() {
    const group = new THREE.Group();

    // Dessin vectoriel du contour du continent africain
    const africaShape = new THREE.Shape();
    // Échelle calibrée en coordonnées locales
    africaShape.moveTo(-0.1, 3.2);  // Nord (Tunisie/Cap Blanc)
    africaShape.bezierCurveTo(0.6, 3.15, 1.3, 3.0, 1.6, 2.7); // Libye / Égypte
    africaShape.bezierCurveTo(1.7, 2.4, 2.0, 2.1, 2.5, 1.7); // Corne de l'Afrique (Somalie)
    africaShape.bezierCurveTo(2.1, 1.3, 1.7, 0.8, 1.4, 0.2); // Côte orientale (Kenya, Tanzanie)
    africaShape.bezierCurveTo(1.2, -0.6, 0.8, -1.6, 0.4, -2.5); // Mozambique / Afrique du Sud
    africaShape.bezierCurveTo(0.2, -2.9, -0.1, -3.1, -0.3, -3.1); // Cap de Bonne-Espérance (Sud)
    africaShape.bezierCurveTo(-0.6, -2.6, -0.8, -1.8, -0.9, -1.0); // Namibie / Angola
    africaShape.bezierCurveTo(-1.0, -0.4, -1.3, 0.1, -1.2, 0.5); // Golfe de Guinée
    africaShape.bezierCurveTo(-1.8, 0.6, -2.5, 0.8, -2.9, 1.3); // Afrique de l'Ouest (Sénégal, Mali)
    africaShape.bezierCurveTo(-2.8, 2.0, -2.2, 2.6, -1.6, 3.0); // Mauritanie / Maroc
    africaShape.bezierCurveTo(-1.0, 3.2, -0.5, 3.2, -0.1, 3.2); // Détroit de Gibraltar / Algérie

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08
    };

    const geometry = new THREE.ExtrudeGeometry(africaShape, extrudeSettings);
    geometry.center();

    const africaMesh = new THREE.Mesh(geometry, this.materials.sculptureGold);
    africaMesh.castShadow = true;
    africaMesh.scale.set(0.62, 0.62, 0.62);
    africaMesh.position.y = 1.8;
    group.add(africaMesh);

    // Madagascar stylisé
    const madaShape = new THREE.Shape();
    madaShape.moveTo(0, 0.7);
    madaShape.bezierCurveTo(0.18, 0.4, 0.16, -0.3, 0, -0.6);
    madaShape.bezierCurveTo(-0.14, -0.3, -0.15, 0.4, 0, 0.7);
    const madaGeo = new THREE.ExtrudeGeometry(madaShape, { depth: 0.15, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 });
    madaGeo.center();
    const madaMesh = new THREE.Mesh(madaGeo, this.materials.sculptureGold);
    madaMesh.scale.set(0.65, 0.65, 0.65);
    madaMesh.position.set(1.45, 1.2, 0);
    group.add(madaMesh);

    // Halo d'énergie / anneau lumineux entourant le sommet
    const ringGeo = new THREE.TorusGeometry(2.3, 0.04, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffe066,
      transparent: true,
      opacity: 0.6
    });
    const energyRing = new THREE.Mesh(ringGeo, ringMat);
    energyRing.rotation.x = Math.PI / 2;
    energyRing.position.y = 1.8;
    group.add(energyRing);

    return group;
  }

  // Création des Hotspots 3D interactifs le long du monument
  createHotspots() {
    this.data.monumentLevels.forEach((level, index) => {
      const hotspotGroup = new THREE.Group();
      hotspotGroup.userData = { levelIndex: index, levelData: level };

      // Cœur lumineux
      const coreGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffc107,
        transparent: true,
        opacity: 0.95
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      hotspotGroup.add(core);

      // Anneau ondulant
      const ringGeo = new THREE.RingGeometry(0.65, 0.9, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffd54f,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      hotspotGroup.add(ring);

      // Positionnement à la hauteur du niveau
      hotspotGroup.position.set(0, level.targetPos.y, 0);
      // Déport léger vers l'avant selon l'étage pour visibilité
      const offsetRadius = index === 0 ? 3.5 : (index === 1 ? 4.5 : (index === 2 ? 3.8 : (index === 3 ? 5.8 : 9.5)));
      hotspotGroup.position.x = Math.sin(index * 1.3) * offsetRadius * 0.4;
      hotspotGroup.position.z = offsetRadius;

      this.scene.add(hotspotGroup);
      this.hotspots.push({
        group: hotspotGroup,
        ring: ring,
        core: core,
        baseY: hotspotGroup.position.y,
        level: level,
        index: index
      });
    });
  }

  // Particules d'ambiance dorées flottantes
  createAtmosphereParticles() {
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 3 + Math.random() * 26;
      const angle = Math.random() * Math.PI * 2;
      const y = Math.random() * 42;

      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * r;
      scales[i] = Math.random() * 0.2 + 0.05;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffdd88,
      size: 0.35,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, particleMat);
    this.scene.add(this.particles);
  }

  setupEvents() {
    window.addEventListener("resize", () => this.onResize());

    // Clic / Raycast sur les Hotspots
    this.renderer.domElement.addEventListener("click", (e) => this.onCanvasClick(e));
    this.renderer.domElement.addEventListener("mousemove", (e) => this.onCanvasMouseMove(e));

    // Pause l'autorotation pendant l'interaction utilisateur
    this.controls.addEventListener("start", () => {
      this.controls.autoRotate = false;
    });
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onCanvasMouseMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const targetObjects = this.hotspots.map(h => h.core);
    const intersects = this.raycaster.intersectObjects(targetObjects);

    if (intersects.length > 0) {
      document.body.style.cursor = "pointer";
      if (window.soundManager) soundManager.playHover();
    } else {
      document.body.style.cursor = "default";
    }
  }

  onCanvasClick(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const targetObjects = this.hotspots.map(h => h.core);
    const intersects = this.raycaster.intersectObjects(targetObjects);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const clickedHotspot = this.hotspots.find(h => h.core === clickedMesh);
      if (clickedHotspot) {
        this.selectLevel(clickedHotspot.index);
      }
    }
  }

  // Déplacement cinématique fluide de la caméra vers le niveau choisi
  selectLevel(index) {
    if (index < 0 || index >= this.data.monumentLevels.length) return;
    this.currentLevelIndex = index;
    const level = this.data.monumentLevels[index];

    if (window.soundManager) {
      soundManager.playSelect();
      soundManager.playSwoosh();
    }

    this.isTransitioning = true;
    this.controls.autoRotate = false;

    // Animation GSAP de la position de la caméra
    gsap.to(this.camera.position, {
      x: level.cameraPos.x,
      y: level.cameraPos.y,
      z: level.cameraPos.z,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        this.camera.lookAt(this.controls.target);
      }
    });

    // Animation GSAP du point de mire (target)
    gsap.to(this.controls.target, {
      x: level.targetPos.x,
      y: level.targetPos.y,
      z: level.targetPos.z,
      duration: 1.8,
      ease: "power2.inOut",
      onComplete: () => {
        this.isTransitioning = false;
      }
    });

    // Émettre l'événement pour mettre à jour l'interface HTML
    window.dispatchEvent(new CustomEvent("levelSelected", { detail: { index, level } }));
  }

  // Vue globale de vue d'ensemble du monument
  resetView() {
    this.currentLevelIndex = -1;
    if (window.soundManager) soundManager.playSwoosh();

    gsap.to(this.camera.position, {
      x: 0,
      y: 20,
      z: 52,
      duration: 2.0,
      ease: "power2.inOut"
    });

    gsap.to(this.controls.target, {
      x: 0,
      y: 16,
      z: 0,
      duration: 2.0,
      ease: "power2.inOut",
      onComplete: () => {
        this.controls.autoRotate = true;
      }
    });

    window.dispatchEvent(new CustomEvent("viewReset"));
  }

  // Application des thèmes d'éclairage (Golden Hour de Bamako / Jour / Nuit)
  applyTheme(theme) {
    this.currentTheme = theme;
    const duration = 1.2;

    if (theme === "golden") {
      // Ambiance coucher de soleil sahélien (Tons chauds, ocre, ambre)
      gsap.to(this.scene.background, { r: 0.92, g: 0.72, b: 0.58, duration });
      this.scene.fog.color.set(0xeab894);
      gsap.to(this.lights.ambient, { color: { r: 1.0, g: 0.85, b: 0.7 }, intensity: 0.9, duration });
      gsap.to(this.lights.sun, { color: { r: 1.0, g: 0.78, b: 0.55 }, intensity: 1.6, duration });
      this.lights.sun.position.set(38, 30, 25);
      this.lights.summitSpot.intensity = 1.3;
      this.lights.nightSpots.forEach(s => gsap.to(s, { intensity: 0, duration }));
      this.materials.sculptureGold.emissive.set(0x996515);
      this.materials.sculptureGold.emissiveIntensity = 0.35;
    } else if (theme === "day") {
      // Journée claire et ensoleillée
      gsap.to(this.scene.background, { r: 0.82, g: 0.91, b: 0.98, duration });
      this.scene.fog.color.set(0xd1e8fa);
      gsap.to(this.lights.ambient, { color: { r: 1.0, g: 0.98, b: 0.95 }, intensity: 0.8, duration });
      gsap.to(this.lights.sun, { color: { r: 1.0, g: 1.0, b: 0.95 }, intensity: 1.5, duration });
      this.lights.sun.position.set(25, 60, 30);
      this.lights.summitSpot.intensity = 0.6;
      this.lights.nightSpots.forEach(s => gsap.to(s, { intensity: 0, duration }));
      this.materials.sculptureGold.emissiveIntensity = 0.2;
    } else if (theme === "night") {
      // Nuit cyberpunk étoilée avec projecteurs sur la tour
      gsap.to(this.scene.background, { r: 0.04, g: 0.06, b: 0.12, duration });
      this.scene.fog.color.set(0x0a1020);
      gsap.to(this.lights.ambient, { color: { r: 0.15, g: 0.2, b: 0.35 }, intensity: 0.35, duration });
      gsap.to(this.lights.sun, { color: { r: 0.2, g: 0.3, b: 0.5 }, intensity: 0.2, duration });
      this.lights.summitSpot.intensity = 2.8;
      this.lights.nightSpots.forEach(s => gsap.to(s, { intensity: 3.5, duration }));
      this.materials.sculptureGold.emissive.set(0xffb700);
      this.materials.sculptureGold.emissiveIntensity = 0.85;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    // Rotation douce de la sculpture de l'Afrique au sommet
    if (this.africaSculpture) {
      this.africaSculpture.rotation.y = Math.sin(time * 0.5) * 0.25;
    }

    // Animation de flottaison et ondulation des drapeaux maliens au vent
    if (this.flags && this.flags.length > 0) {
      this.flags.forEach((f, fi) => {
        const pos = f.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          // Le bord attaché au mât (x proche de 0) reste fixe, le bout ondule
          const wave = Math.sin(time * 5 + x * 4 + fi * 0.7) * (x * 0.12);
          pos.setZ(i, wave);
        }
        pos.needsUpdate = true;
      });
    }

    // Animation de pulsation des Hotspots
    this.hotspots.forEach((h, i) => {
      // Flottaison
      h.group.position.y = h.baseY + Math.sin(time * 2 + i) * 0.25;
      // Orientation vers la caméra
      h.ring.lookAt(this.camera.position);
      // Pulsation de l'anneau
      const scale = 1 + Math.sin(time * 3 + i) * 0.15;
      h.ring.scale.set(scale, scale, 1);
    });

    // Mouvement lent des particules dans l'air
    if (this.particles) {
      this.particles.rotation.y = time * 0.03;
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + i) * 0.01;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialisation globale
window.TourAfrique3D = TourAfrique3D;
