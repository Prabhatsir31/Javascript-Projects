(function () {
  // Add corner decorations to all animation containers
  function addCornerDecorations() {
    document.querySelectorAll(".animation-container").forEach((container) => {
      const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
      corners.forEach((position) => {
        const corner = document.createElement("div");
        corner.className = `corner ${position}`;
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("viewBox", "0 0 512 512");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        const polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        polygon.setAttribute(
          "points",
          "448,224 288,224 288,64 224,64 224,224 64,224 64,288 224,288 224,448 288,448 288,288 448,288"
        );
        polygon.setAttribute("fill", "currentColor");
        svg.appendChild(polygon);
        corner.appendChild(svg);
        container.appendChild(corner);
      });
    });
  }
  // 1. Radial Pulse (slowed down)
  function setupRadialPulse() {
    const container = document.getElementById("radial-pulse");
    if (!container) return;
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = 75;
    let time = 0;
    let lastTime = 0;
    // Rings of dots that will pulse outward
    const ringCount = 8;
    const dotsPerRing = 12;
    const pulseSpeed = 0.35; // Slowed down from 0.5 to 0.35
    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw central dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
      // Pulse wave effect - creates waves of dots moving outward
      for (let i = 0; i < ringCount; i++) {
        // Calculate current radius for this ring
        // This creates a repeating pulse effect from center to edge
        const pulsePhase = (time * pulseSpeed + i / ringCount) % 1;
        const ringRadius = pulsePhase * maxRadius;
        // Skip rings that are just starting (too close to center)
        if (ringRadius < 5) continue;
        // Opacity decreases as the pulse moves outward
        const opacity = 1 - pulsePhase;
        // Draw dots around the ring
        for (let j = 0; j < dotsPerRing; j++) {
          const angle = (j / dotsPerRing) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * ringRadius;
          const y = centerY + Math.sin(angle) * ringRadius;
          // Dot size decreases as the pulse moves outward
          const dotSize = 2.5 * (1 - pulsePhase * 0.5);
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  // 2. Improved Smooth Orbital Pulse (sped up)
  function setupOrbitalPulse() {
    const container = document.getElementById("orbital-pulse");
    if (!container) return;
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = 75;
    let time = 0;
    let lastTime = 0;
    // Fixed orbital rings with smoother pulse
    const orbits = [
      {
        radius: 15,
        dotCount: 6
      },
      {
        radius: 25,
        dotCount: 10
      },
      {
        radius: 35,
        dotCount: 14
      },
      {
        radius: 45,
        dotCount: 18
      },
      {
        radius: 55,
        dotCount: 22
      },
      {
        radius: 65,
        dotCount: 26
      }
    ];
    // Pulse parameters
    const pulseFrequency = 0.5; // Sped up from 0.2 to 0.35
    const pulseAmplitude = 2; // Maximum displacement of dots
    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
      // Draw orbit circles (very faint)
      orbits.forEach((orbit, orbitIndex) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbit.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
        // Calculate smooth pulse animation
        // Use a sine wave that creates a continuous pulse from center to edge
        const normalizedRadius = orbit.radius / maxRadius; // 0 to 1 value
        const pulseDelay = normalizedRadius * 1.5; // Outer rings pulse later
        // Create a smooth, continuous pulse wave moving outward
        // Time is multiplied by pulseFrequency to control speed
        const pulsePhase = (time * pulseFrequency - pulseDelay) % 1;
        // Create a smooth bell curve for the pulse effect
        // This makes it grow smoothly then shrink smoothly
        const pulseEffect = Math.sin(pulsePhase * Math.PI) * pulseAmplitude;
        // Only apply positive pulse effects (moving outward)
        const finalPulseEffect = pulseEffect > 0 ? pulseEffect : 0;
        // Draw dots around the orbit
        for (let i = 0; i < orbit.dotCount; i++) {
          const angle = (i / orbit.dotCount) * Math.PI * 2;
          // Apply pulse to radius - smooth movement outward
          const pulsedRadius = orbit.radius + finalPulseEffect;
          const x = centerX + Math.cos(angle) * pulsedRadius;
          const y = centerY + Math.sin(angle) * pulsedRadius;
          // Dot size also gently increases with pulse
          const dotSize = 2 + (finalPulseEffect / pulseAmplitude) * 1.5;
          // Opacity also increases with pulse
          const opacity = 0.7 + (finalPulseEffect / pulseAmplitude) * 0.3;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
      });
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  // 3. Fixed Pendulum Wave (unchanged)
  function setupPendulumWave() {
    const container = document.getElementById("pendulum-wave");
    if (!container) return;
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;
    let lastTime = 0;
    // Pendulum parameters
    const pendulumCount = 15;
    const baseFrequency = 0.5; // All pendulums at the same frequency
    const pendulumLength = 90;
    const maxAngle = Math.PI / 12; // 15 degrees max angle
    // Reference line
    const referenceLine = document.createElement("div");
    referenceLine.style.position = "absolute";
    referenceLine.style.width = `${pendulumCount * 8}px`;
    referenceLine.style.height = "1px";
    referenceLine.style.left = `${centerX - (pendulumCount * 8) / 2}px`;
    referenceLine.style.top = `${centerY - pendulumLength}px`;
    referenceLine.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
    container.appendChild(referenceLine);

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Calculate single angle for all pendulums - simple left-right motion
      const angle = Math.sin(time * baseFrequency * Math.PI) * maxAngle;
      // Draw pendulums - all moving in unison
      for (let i = 0; i < pendulumCount; i++) {
        // Calculate pendulum position
        const pendulumX = centerX - pendulumCount * 4 + i * 8;
        const pendulumY = centerY - pendulumLength;
        // Calculate bob position - all with the same angle
        const bobX = pendulumX + Math.sin(angle) * pendulumLength;
        const bobY = pendulumY + Math.cos(angle) * pendulumLength;
        // Draw pendulum line
        ctx.beginPath();
        ctx.moveTo(pendulumX, pendulumY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
        // Draw pendulum bob
        ctx.beginPath();
        ctx.arc(bobX, bobY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        // Draw center
        ctx.beginPath();
        ctx.arc(pendulumX, pendulumY, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  // 4. Pulse Wave (unchanged)
  function setupPulseWave() {
    const container = document.getElementById("pulse-wave");
    if (!container) return;
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;
    let lastTime = 0;
    // Create dots in concentric rings (without visible circles)
    const dotRings = [
      {
        radius: 15,
        count: 6
      },
      {
        radius: 30,
        count: 12
      },
      {
        radius: 45,
        count: 18
      },
      {
        radius: 60,
        count: 24
      },
      {
        radius: 75,
        count: 30
      }
    ];

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
      // Draw dots in concentric circles with wave effect
      dotRings.forEach((ring, ringIndex) => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2;
          // Calculate position with pulsing radius
          const radiusPulse = Math.sin(time * 2 - ringIndex * 0.4) * 3;
          const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
          const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);
          // Calculate opacity with wave effect
          const opacityWave =
            0.4 + Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) * 0.6;
          // Draw dot
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacityWave})`;
          ctx.fill();
        }
      });
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  // 5. Concentric Rings (unchanged)
  function setupConcentricRings() {
    const container = document.getElementById("concentric-rings");
    if (!container) return;
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;
    let lastTime = 0;
    // Ring parameters
    const ringCount = 5;
    const maxRadius = 75;

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
      // Draw concentric rings of dots
      for (let r = 0; r < ringCount; r++) {
        const radius = ((r + 1) / ringCount) * maxRadius;
        const dotCount = 6 + r * 6; // More dots in outer rings
        // Phase offset for rotation based on ring index
        const phaseOffset = r % 2 === 0 ? time * 0.2 : -time * 0.2;
        // Each ring pulses at a different phase
        const ringPhase = time + r * 0.7;
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2 + phaseOffset;
          // Add a pulsing effect to the radius (slight)
          const radiusPulse = Math.sin(ringPhase) * 3;
          const finalRadius = radius + radiusPulse;
          const x = centerX + Math.cos(angle) * finalRadius;
          const y = centerY + Math.sin(angle) * finalRadius;
          // Enhanced dot size pulsing - more pronounced
          // Base size that varies by ring position
          const baseSize = 2 + r / (ringCount - 1);
          // Size pulse effect - make it more dramatic (2x larger)
          const sizePulse = Math.sin(ringPhase) * baseSize * 0.7 + baseSize;
          // Enhanced opacity pulsing
          const opacityPulse = 0.6 + Math.sin(ringPhase) * 0.4;
          ctx.beginPath();
          ctx.arc(x, y, sizePulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacityPulse})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  // 6. Sequential Pulse (unchanged)
  function setupSequentialPulse() {
    const container = document.getElementById("sequential-pulse");
    if (!container) return;
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;
    let lastTime = 0;
    // Dot parameters
    const radius = 70;
    const dotCount = 16;

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
      // Draw reference circle (very faint)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Draw dots with sequential pulsing
      for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2;
        // Sequential pulsing - wave moves around the circle
        const pulsePhase = (time * 0.5 + i / dotCount) % 1;
        const pulseFactor = Math.sin(pulsePhase * Math.PI * 2);
        // Apply pulse to size and radius
        const size = 2 + pulseFactor * 2;
        const finalRadius = radius + pulseFactor * 5;
        const x = centerX + Math.cos(angle) * finalRadius;
        const y = centerY + Math.sin(angle) * finalRadius;
        // Draw connecting line to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + pulseFactor * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        // Draw dot
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  // 7. Oscillating Dots (unchanged)
  function setupOscillatingDots() {
    const container = document.getElementById("oscillating-dots");
    if (!container) return;
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;
    let lastTime = 0;
    // Oscillation parameters
    const dotCount = 20;
    const rowCount = 5;
    const spacing = 15;

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw oscillating dots in rows
      for (let row = 0; row < rowCount; row++) {
        const y = centerY - ((rowCount - 1) / 2) * spacing + row * spacing;
        for (let i = 0; i < dotCount; i++) {
          // Calculate x-position with sine wave offset
          const baseX = centerX - ((dotCount - 1) / 2) * 8 + i * 8;
          // Wave parameters vary by row
          const amplitude = 4 + row * 2;
          const frequency = 1 + row * 0.2;
          const phaseOffset = row * 0.5;
          // Calculate offset
          const offset =
            Math.sin(time * frequency + i * 0.2 + phaseOffset) * amplitude;
          const x = baseX;
          const finalY = y + offset;
          // Draw dot
          ctx.beginPath();
          ctx.arc(x, finalY, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.fill();
        }
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  // 8. Pulsing Grid (unchanged)
  function setupPulsingGrid() {
    const container = document.getElementById("pulsing-grid");
    if (!container) return;
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;
    let lastTime = 0;
    // Grid parameters
    const gridSize = 5; // 5x5 grid
    const spacing = 15;
    // Animation parameters
    const breathingSpeed = 0.5; // Speed of expansion/contraction
    const waveSpeed = 1.2; // Speed of wave patterns
    const colorPulseSpeed = 1.0; // Speed of color pulsing
    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Calculate breathing effect - grid expands and contracts
      const breathingFactor = Math.sin(time * breathingSpeed) * 0.2 + 1.0; // 0.8 to 1.2
      // Draw center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
      // Draw pulsing grid pattern
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          // Skip center point
          if (
            row === Math.floor(gridSize / 2) &&
            col === Math.floor(gridSize / 2)
          )
            continue;
          // Calculate base position
          const baseX = (col - (gridSize - 1) / 2) * spacing;
          const baseY = (row - (gridSize - 1) / 2) * spacing;
          // Calculate distance and angle from center for effects
          const distance = Math.sqrt(baseX * baseX + baseY * baseY);
          const maxDistance = (spacing * Math.sqrt(2) * (gridSize - 1)) / 2;
          const normalizedDistance = distance / maxDistance;
          const angle = Math.atan2(baseY, baseX);
          // Apply complex wave effects
          // 1. Radial wave (expands from center)
          const radialPhase = (time - normalizedDistance) % 1;
          const radialWave = Math.sin(radialPhase * Math.PI * 2) * 4;
          // 2. Spiral wave (rotates around center)
          const spiralPhase = (angle / (Math.PI * 2) + time * 0.3) % 1;
          const spiralWave = Math.sin(spiralPhase * Math.PI * 2) * 3;
          // 3. Breathing effect (entire grid expands/contracts)
          const breathingX = baseX * breathingFactor;
          const breathingY = baseY * breathingFactor;
          // Combine all effects
          const waveX = centerX + breathingX + Math.cos(angle) * radialWave;
          const waveY = centerY + breathingY + Math.sin(angle) * radialWave;
          // Dot size varies with distance and time
          const baseSize = 1.5 + (1 - normalizedDistance) * 1.5;
          // Complex pulsing effect
          const pulseFactor =
            Math.sin(time * 2 + normalizedDistance * 5) * 0.6 + 1;
          const size = baseSize * pulseFactor;
          // Color effects - subtle gradient between white and light blue
          const blueAmount =
            Math.sin(time * colorPulseSpeed + normalizedDistance * 3) * 0.3 +
            0.3;
          const whiteness = 1 - blueAmount;
          // Calculate RGB values
          const r = Math.floor(255 * whiteness + 200 * blueAmount);
          const g = Math.floor(255 * whiteness + 220 * blueAmount);
          const b = 255;
          // Calculate opacity with subtle pulse
          const opacity =
            0.5 +
            Math.sin(time * 1.5 + angle * 3) * 0.2 +
            normalizedDistance * 0.3;
          // Draw connecting lines (create a network effect)
          if (row > 0 && col > 0 && row < gridSize - 1 && col < gridSize - 1) {
            // Connect to adjacent points
            const neighbors = [
              {
                r: row - 1,
                c: col
              }, // top
              {
                r: row,
                c: col + 1
              }, // right
              {
                r: row + 1,
                c: col
              }, // bottom
              {
                r: row,
                c: col - 1
              } // left
            ];
            for (const neighbor of neighbors) {
              // Calculate neighbor position
              const nBaseX = (neighbor.c - (gridSize - 1) / 2) * spacing;
              const nBaseY = (neighbor.r - (gridSize - 1) / 2) * spacing;
              // Apply breathing effect
              const nBreathingX = nBaseX * breathingFactor;
              const nBreathingY = nBaseY * breathingFactor;
              // Skip center point
              if (
                neighbor.r === Math.floor(gridSize / 2) &&
                neighbor.c === Math.floor(gridSize / 2)
              )
                continue;
              // Calculate distance for line opacity
              const lineDistance = Math.sqrt(
                Math.pow(col - neighbor.c, 2) + Math.pow(row - neighbor.r, 2)
              );
              const lineOpacity =
                0.1 + Math.sin(time * 1.5 + lineDistance * 2) * 0.05;
              // Draw line
              ctx.beginPath();
              ctx.moveTo(waveX, waveY);
              ctx.lineTo(centerX + nBreathingX, centerY + nBreathingY);
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
          // Draw dot
          ctx.beginPath();
          ctx.arc(waveX, waveY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  // 9. NEW: Spiral Galaxy Animation
  function setupSpiralGalaxy() {
    const container = document.getElementById("spiral-galaxy");
    if (!container) return;
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;
    let lastTime = 0;
    // Spiral parameters
    const particleCount = 200;
    const maxRadius = 75;
    const spiralArms = 3; // Number of spiral arms
    const rotationSpeed = 0.1; // Base rotation speed
    // Create particles with initial positions
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      // Random distance from center (more particles toward center)
      const distanceFactor = Math.pow(Math.random(), 0.5); // Square root distribution
      const distance = distanceFactor * maxRadius;
      // Random angle with spiral arm offset
      const armIndex = Math.floor(Math.random() * spiralArms);
      const armOffset = (armIndex / spiralArms) * Math.PI * 2;
      // Logarithmic spiral formula: r = a*e^(b*θ)
      // We'll use this to determine the angle offset based on distance
      const spiralTightness = 0.2;
      const spiralAngle = Math.log(distance / 5) / spiralTightness;
      // Initial particle properties
      particles.push({
        distance: distance,
        angle: spiralAngle + armOffset,
        armIndex: armIndex,
        size: 1 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7,
        // Each particle has its own speed variation
        speedFactor: 0.8 + Math.random() * 0.4,
        // Color variation (from white to blue-ish)
        color: {
          r: 220 + Math.floor(Math.random() * 35),
          g: 220 + Math.floor(Math.random() * 35),
          b: 255
        }
      });
    }

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw a simple center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
      // Update and draw particles
      for (const particle of particles) {
        // Rotation speed decreases with distance (Keplerian rotation)
        const rotationFactor = 1 / Math.sqrt(particle.distance / 10);
        // Update angle based on distance from center (closer = faster)
        particle.angle +=
          rotationSpeed *
          rotationFactor *
          particle.speedFactor *
          deltaTime *
          0.05;
        // Calculate position
        const x = centerX + Math.cos(particle.angle) * particle.distance;
        const y = centerY + Math.sin(particle.angle) * particle.distance;
        // Particle size and opacity pulse based on arm position
        const armPhase = (time * 0.5 + particle.armIndex / spiralArms) % 1;
        const pulseFactor = Math.sin(armPhase * Math.PI * 2) * 0.3 + 0.7;
        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, particle.size * pulseFactor, 0, Math.PI * 2);
        // Apply color with opacity
        const finalOpacity = particle.opacity * pulseFactor;
        ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${finalOpacity})`;
        ctx.fill();
        // Draw trail for some particles (only the larger ones)
        if (particle.size > 1.8) {
          const trailLength = particle.distance * 0.15; // Trail length proportional to distance
          const trailAngle = particle.angle - 0.1 * rotationFactor; // Trail points backward
          const trailX =
            centerX + Math.cos(trailAngle) * (particle.distance - trailLength);
          const trailY =
            centerY + Math.sin(trailAngle) * (particle.distance - trailLength);
          // Draw trail
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(trailX, trailY);
          ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${
            particle.color.b
          }, ${finalOpacity * 0.3})`;
          ctx.lineWidth = particle.size * 0.5;
          ctx.stroke();
        }
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  // Initialize all preloaders
  window.addEventListener("load", function () {
    setupRadialPulse();
    setupOrbitalPulse();
    setupPendulumWave();
    setupPulseWave();
    setupConcentricRings();
    setupSequentialPulse();
    setupOscillatingDots();
    setupPulsingGrid();
    setupSpiralGalaxy();
    addCornerDecorations();
  });
})();