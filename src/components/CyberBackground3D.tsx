import React, { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  originX: number;
  originY: number;
  originZ: number;
  vx: number;
  vy: number;
  vz: number;
}

export const CyberBackground3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);
    ctx.scale(dpr, dpr);
    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;

    const mouse = {
      x: cssWidth / 2,
      y: cssHeight / 2,
      targetX: cssWidth / 2,
      targetY: cssHeight / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      const newDpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = window.innerWidth * newDpr;
      height = canvas.height = window.innerHeight * newDpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(newDpr, newDpr);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // 1. Build a 3D Polyhedron / Cyber Shield Geometry
    const phi = (1 + Math.sqrt(5)) / 2;
    const baseVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    const radius = Math.min(cssWidth, cssHeight) * 0.28;
    const polyNodes: Point3D[] = baseVertices.map(([x, y, z]) => {
      const len = Math.hypot(x, y, z);
      const px = (x / len) * radius;
      const py = (y / len) * radius;
      const pz = (z / len) * radius;
      return {
        x: px, y: py, z: pz,
        originX: px, originY: py, originZ: pz,
        vx: 0, vy: 0, vz: 0,
      };
    });

    const additionalNodes: Point3D[] = [];
    for (let i = 0; i < polyNodes.length; i++) {
      for (let j = i + 1; j < polyNodes.length; j++) {
        const dx = polyNodes[i].x - polyNodes[j].x;
        const dy = polyNodes[i].y - polyNodes[j].y;
        const dz = polyNodes[i].z - polyNodes[j].z;
        const dist = Math.hypot(dx, dy, dz);
        if (dist < radius * 1.2) {
          const midX = (polyNodes[i].x + polyNodes[j].x) * 0.5;
          const midY = (polyNodes[i].y + polyNodes[j].y) * 0.5;
          const midZ = (polyNodes[i].z + polyNodes[j].z) * 0.5;
          const len = Math.hypot(midX, midY, midZ);
          additionalNodes.push({
            x: (midX / len) * radius * 1.05,
            y: (midY / len) * radius * 1.05,
            z: (midZ / len) * radius * 1.05,
            originX: (midX / len) * radius * 1.05,
            originY: (midY / len) * radius * 1.05,
            originZ: (midZ / len) * radius * 1.05,
            vx: 0, vy: 0, vz: 0,
          });
        }
      }
    }
    const allMeshNodes = [...polyNodes, ...additionalNodes.slice(0, 16)];

    // 2. Starfield / Floating 3D Cyber Particles
    const PARTICLE_COUNT = 80;
    const particles: { x: number; y: number; z: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * cssWidth * 2.0,
        y: (Math.random() - 0.5) * cssHeight * 2.0,
        z: Math.random() * 800 - 200,
        size: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.5 + 0.3,
      });
    }

    // 3. Perspective Cyber Grid Horizon
    const gridLinesCount = 18;
    const gridCols = 24;

    let angleX = 0;
    let angleY = 0;
    let scanLine = 0;

    const render = () => {
      const curW = window.innerWidth;
      const curH = window.innerHeight;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Base background: Noticeably rich cyber navy
      ctx.fillStyle = "#0c1527";
      ctx.fillRect(0, 0, curW, curH);

      // Multi-layer ambient radial gradients (vibrant, bright cyber lighting)
      const grad1 = ctx.createRadialGradient(
        mouse.x, mouse.y, 20,
        mouse.x, mouse.y, curW * 0.6
      );
      grad1.addColorStop(0, "rgba(6, 182, 212, 0.45)"); // Electric Cyan Glow
      grad1.addColorStop(0.45, "rgba(59, 130, 246, 0.22)");
      grad1.addColorStop(1, "rgba(12, 21, 39, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, curW, curH);

      const grad2 = ctx.createRadialGradient(
        curW * 0.85, curH * 0.22, 30,
        curW * 0.85, curH * 0.22, curW * 0.5
      );
      grad2.addColorStop(0, "rgba(16, 185, 129, 0.30)"); // Emerald Glow
      grad2.addColorStop(1, "rgba(12, 21, 39, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, curW, curH);

      const focalLength = 480;
      const mouseOffsetX = (mouse.x - curW / 2) * 0.0006;
      const mouseOffsetY = (mouse.y - curH / 2) * 0.0006;

      angleY += 0.004;
      angleX = Math.sin(angleY * 0.8) * 0.25 + mouseOffsetY * 0.8;
      const rotY = angleY + mouseOffsetX * 1.2;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Perspective Ground Grid (Bright, crisp lines)
      ctx.save();
      const horizonY = curH * 0.60;
      ctx.lineWidth = 1.3;
      scanLine = (scanLine + 1.2) % (curH * 0.40);

      for (let i = 0; i < gridLinesCount; i++) {
        const p = Math.pow(i / gridLinesCount, 2.0);
        const y = horizonY + p * (curH - horizonY);
        const alpha = p * 0.55;
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(curW, y);
        ctx.stroke();
      }

      for (let c = 0; c <= gridCols; c++) {
        const xRatio = (c - gridCols / 2) / (gridCols / 2);
        const startX = curW / 2 + xRatio * (curW * 0.15);
        const endX = curW / 2 + xRatio * (curW * 0.90);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
        ctx.beginPath();
        ctx.moveTo(startX, horizonY);
        ctx.lineTo(endX, curH);
        ctx.stroke();
      }

      // Dynamic Laser Scan Sweep
      const laserY = horizonY + scanLine;
      const laserGrad = ctx.createLinearGradient(0, laserY - 18, 0, laserY + 18);
      laserGrad.addColorStop(0, "rgba(6, 182, 212, 0)");
      laserGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.65)");
      laserGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
      ctx.fillStyle = laserGrad;
      ctx.fillRect(0, laserY - 18, curW, 36);
      ctx.restore();

      // 3D Particles (Clear, luminous floating embers)
      for (const p of particles) {
        p.z -= p.speed * 2.2;
        if (p.z < -focalLength + 50) p.z = 700;

        const scale = focalLength / (focalLength + p.z);
        const px = curW / 2 + (p.x + mouseOffsetX * 200) * scale;
        const py = curH / 2 + (p.y + mouseOffsetY * 200) * scale;

        if (px >= 0 && px <= curW && py >= 0 && py <= curH) {
          ctx.beginPath();
          ctx.arc(px, py, Math.max(1.5, p.size * scale * 1.6), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(165, 243, 252, ${Math.min(1, p.alpha * scale * 1.5)})`;
          ctx.fill();
        }
      }

      // 3D Rotating Cyber Shield Sphere (Prominently placed in the upper right quadrant)
      const centerX = curW > 1024 ? curW * 0.82 : curW * 0.5;
      const centerY = curH * 0.36;

      const projected: { sx: number; sy: number; z: number; index: number }[] = [];

      for (let i = 0; i < allMeshNodes.length; i++) {
        const node = allMeshNodes[i];
        const x1 = node.originX * cosY - node.originZ * sinY;
        const z1 = node.originZ * cosY + node.originX * sinY;
        const y2 = node.originY * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.originY * sinX;

        const depth = z2 + focalLength + 150;
        const scale = focalLength / depth;
        const sx = centerX + x1 * scale;
        const sy = centerY + y2 * scale;

        projected.push({ sx, sy, z: z2, index: i });
      }

      projected.sort((a, b) => a.z - b.z);

      // Draw all structural 3D edges between vertices
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const dist2D = Math.hypot(dx, dy);

          const maxLinkDist = radius * 1.15;
          if (dist2D < maxLinkDist) {
            const depthFactor = ((p1.z + p2.z) / 2 + radius) / (2 * radius);
            const edgeAlpha = Math.max(0.18, Math.min(0.95, (1 - dist2D / maxLinkDist) * depthFactor * 1.1));
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.strokeStyle = `rgba(34, 211, 238, ${edgeAlpha})`;
            ctx.lineWidth = depthFactor > 0.6 ? 2.2 : 1.4;
            ctx.stroke();
          }
        }
      }

      // Draw 3D vertex nodes with glowing halos
      for (const p of projected) {
        const depthFactor = (p.z + radius) / (2 * radius);
        const nodeSize = Math.max(2.8, 6.5 * depthFactor);
        const alpha = Math.max(0.45, depthFactor);

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.shadowColor = "rgba(6, 182, 212, 1)";
        ctx.shadowBlur = depthFactor > 0.6 ? 18 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      const corePulse = Math.sin(angleY * 2.5) * 6 + 18;
      const coreGrad = ctx.createRadialGradient(
        centerX, centerY, 2,
        centerX, centerY, corePulse * 3.2
      );
      coreGrad.addColorStop(0, "rgba(34, 211, 238, 0.45)");
      coreGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.20)");
      coreGrad.addColorStop(1, "rgba(12, 21, 39, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, corePulse * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "11px monospace";
      ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
      ctx.fillText(`3D_GRID: ACTIVE // ROT_Y: ${(rotY % (Math.PI * 2)).toFixed(2)} rad`, 24, curH - 36);
      ctx.fillText(`THREAT_PROBE: ONLINE // PIVOT: [${mouse.x.toFixed(0)}, ${mouse.y.toFixed(0)}]`, 24, curH - 20);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full block"
      style={{ display: "block", position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
    />
  );
};