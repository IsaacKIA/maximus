/**
 * Maximus HealthCare Consult — Interactive 3D Medical Helix & Molecular Particle System
 * Built with Three.js (Hardware Accelerated WebGL with lightweight canvas fallback)
 */

(function init3DHero() {
  const container = document.getElementById("hero-3d-canvas-container");
  if (!container) return;

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  // Load Three.js dynamically if not present
  function loadThree(callback) {
    if (window.THREE) {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = callback;
    script.onerror = fallbackCanvas;
    document.head.appendChild(script);
  }

  function fallbackCanvas() {
    // Elegant animated canvas fallback if Three.js fails or WebGL disabled
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.5';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = container.offsetWidth;
    let height = canvas.height = container.offsetHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    });

    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.5 + 1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(78, 115, 223, 0.4)';
      ctx.strokeStyle = 'rgba(215, 43, 43, 0.15)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  loadThree(() => {
    if (!window.THREE || !isWebGLAvailable()) {
      fallbackCanvas();
      return;
    }

    const THREE = window.THREE;
    let width = container.offsetWidth || window.innerWidth;
    let height = container.offsetHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // Group for all rotating elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Create DNA Helix Strands
    const helixRadius = 14;
    const helixHeight = 110;
    const particleCount = 140;
    const turns = 2.5;

    const geometryStrand1 = new THREE.BufferGeometry();
    const geometryStrand2 = new THREE.BufferGeometry();
    const positions1 = new Float32Array(particleCount * 3);
    const positions2 = new Float32Array(particleCount * 3);

    const bridgeMaterial = new THREE.LineBasicMaterial({
      color: 0x4B6BB8,
      transparent: true,
      opacity: 0.25
    });
    const bridgeGroup = new THREE.Group();
    mainGroup.add(bridgeGroup);

    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 2 * turns;
      const y = ((i / particleCount) - 0.5) * helixHeight;

      const x1 = Math.cos(t) * helixRadius;
      const z1 = Math.sin(t) * helixRadius;

      const x2 = Math.cos(t + Math.PI) * helixRadius;
      const z2 = Math.sin(t + Math.PI) * helixRadius;

      positions1[i * 3] = x1;
      positions1[i * 3 + 1] = y;
      positions1[i * 3 + 2] = z1;

      positions2[i * 3] = x2;
      positions2[i * 3 + 1] = y;
      positions2[i * 3 + 2] = z2;

      // Add rungs connecting strands every 4 particles
      if (i % 4 === 0) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x1, y, z1),
          new THREE.Vector3(x2, y, z2)
        ]);
        const line = new THREE.Line(lineGeo, bridgeMaterial);
        bridgeGroup.add(line);
      }
    }

    geometryStrand1.setAttribute('position', new THREE.BufferAttribute(positions1, 3));
    geometryStrand2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));

    // Particle Material for Strand 1 (Health Cyan/Blue)
    const mat1 = new THREE.PointsMaterial({
      color: 0x5C8BFF,
      size: 1.8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    // Particle Material for Strand 2 (Crimson/Red)
    const mat2 = new THREE.PointsMaterial({
      color: 0xFF5A5A,
      size: 1.8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const strand1 = new THREE.Points(geometryStrand1, mat1);
    const strand2 = new THREE.Points(geometryStrand2, mat2);
    mainGroup.add(strand1);
    mainGroup.add(strand2);

    // 2. Ambient Molecular Cloud Particles
    const cloudCount = 120;
    const cloudGeo = new THREE.BufferGeometry();
    const cloudPositions = new Float32Array(cloudCount * 3);

    for (let i = 0; i < cloudCount * 3; i += 3) {
      cloudPositions[i] = (Math.random() - 0.5) * 120;
      cloudPositions[i + 1] = (Math.random() - 0.5) * 100;
      cloudPositions[i + 2] = (Math.random() - 0.5) * 60;
    }

    cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
    const cloudMat = new THREE.PointsMaterial({
      color: 0x8DA9F7,
      size: 1.2,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const cloud = new THREE.Points(cloudGeo, cloudMat);
    mainGroup.add(cloud);

    // Position the whole 3D group slightly to the right side of the hero
    mainGroup.position.set(24, 0, 0);
    mainGroup.rotation.z = 0.25;
    mainGroup.rotation.x = 0.2;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      mouseX = (e.clientX - halfX) * 0.0006;
      mouseY = (e.clientY - halfY) * 0.0006;
    });

    // Handle Resize
    window.addEventListener('resize', () => {
      width = container.offsetWidth || window.innerWidth;
      height = container.offsetHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Adapt position on mobile
      if (width < 768) {
        mainGroup.position.set(0, 0, -20);
        mainGroup.scale.set(0.75, 0.75, 0.75);
      } else {
        mainGroup.position.set(24, 0, 0);
        mainGroup.scale.set(1, 1, 1);
      }
    });

    if (width < 768) {
      mainGroup.position.set(0, 0, -20);
      mainGroup.scale.set(0.75, 0.75, 0.75);
    }

    // Animation Loop
    let clock = new THREE.Clock();
    let isVisible = true;

    // Intersection Observer to stop rendering when scrolled out of view
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();

      // Constant gentle spin
      mainGroup.rotation.y += delta * 0.35;

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainGroup.rotation.x = 0.2 + targetY;
      mainGroup.rotation.z = 0.25 + targetX;

      renderer.render(scene, camera);
    }
    animate();
  });
})();
