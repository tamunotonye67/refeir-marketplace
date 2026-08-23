import React, { useEffect, useRef, useState } from 'react';

interface Node3D {
  x: number;
  y: number;
  z: number;
  country: string;
  role: string;
  type: 'country' | 'talent' | 'client' | 'scout';
  color: string;
}

interface Edge {
  a: number;
  b: number;
  flowProgress: number;
  flowSpeed: number;
  color: string;
}

interface Face3D {
  a: number;
  b: number;
  c: number;
  color: string;
}

export const PolygonNetwork3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 440);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 440);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 440;
      height = canvas.height = canvas.parentElement.clientHeight || 440;
    };
    window.addEventListener('resize', handleResize);

    // 3D Polygon Nodes (Relationship between Countries & Global People)
    const R = 145; // Base Radius - Made significantly bigger
    const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio for Icosahedron
    const a = R / Math.sqrt(1 + phi * phi);
    const b = (R * phi) / Math.sqrt(1 + phi * phi);

    const rawNodes: Node3D[] = [
      { x: -a, y: b, z: 0, country: 'Lagos', role: 'Amaka • UI Architect', type: 'talent', color: '#66BB2A' },
      { x: a, y: b, z: 0, country: 'London', role: 'FinTech UK • Client', type: 'client', color: '#38BDF8' },
      { x: -a, y: -b, z: 0, country: 'Nairobi', role: 'Sharon • AI Engineer', type: 'talent', color: '#66BB2A' },
      { x: a, y: -b, z: 0, country: 'New York', role: 'Alpha Capital • Client', type: 'client', color: '#38BDF8' },

      { x: 0, y: -a, z: b, country: 'Accra', role: 'Kwame • Cloud Architect', type: 'talent', color: '#66BB2A' },
      { x: 0, y: a, z: b, country: 'Paris', role: 'Global Scout Network', type: 'scout', color: '#F6B21A' },
      { x: 0, y: -a, z: -b, country: 'Cape Town', role: 'Devin • DevOps Lead', type: 'talent', color: '#66BB2A' },
      { x: 0, y: a, z: -b, country: 'Berlin', role: 'SaaS Foundry • Client', type: 'client', color: '#38BDF8' },

      { x: b, y: 0, z: -a, country: 'San Francisco', role: 'Venture Partner', type: 'client', color: '#38BDF8' },
      { x: b, y: 0, z: a, country: 'Kigali', role: 'David • Tech Scout', type: 'scout', color: '#F6B21A' },
      { x: -b, y: 0, z: -a, country: 'Cairo', role: 'Tarek • Systems Eng', type: 'talent', color: '#66BB2A' },
      { x: -b, y: 0, z: a, country: 'Dubai', role: 'Regional HQ • Client', type: 'client', color: '#38BDF8' }
    ];

    // Polygon Edges (Cross-Border Links)
    const edgePairs: [number, number][] = [
      [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
      [1, 5], [1, 7], [1, 8], [1, 9],
      [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
      [3, 4], [3, 6], [3, 8], [3, 9],
      [4, 5], [4, 9], [4, 11],
      [5, 9], [5, 11],
      [6, 7], [6, 8], [6, 10],
      [7, 8], [7, 10],
      [8, 9], [10, 11],
      // Internal Cross-Diagonal 3D Struts
      [0, 2], [1, 3], [4, 6], [5, 7], [8, 10], [9, 11]
    ];

    const edges: Edge[] = edgePairs.map(([a, b], idx) => ({
      a,
      b,
      flowProgress: (idx * 0.12) % 1,
      flowSpeed: 0.006 + (idx % 3) * 0.003,
      color: idx % 3 === 0 ? '#66BB2A' : idx % 3 === 1 ? '#38BDF8' : '#F6B21A'
    }));

    // 3D Polygon Faces for depth transparency
    const faces: Face3D[] = [
      { a: 0, b: 1, c: 5, color: 'rgba(102, 187, 42, 0.04)' },
      { a: 0, b: 5, c: 11, color: 'rgba(56, 189, 248, 0.04)' },
      { a: 0, b: 11, c: 10, color: 'rgba(102, 187, 42, 0.04)' },
      { a: 0, b: 10, c: 7, color: 'rgba(246, 178, 26, 0.04)' },
      { a: 0, b: 7, c: 1, color: 'rgba(56, 189, 248, 0.04)' },
      { a: 3, b: 4, c: 9, color: 'rgba(102, 187, 42, 0.04)' },
      { a: 3, b: 9, c: 8, color: 'rgba(56, 189, 248, 0.04)' },
      { a: 3, b: 8, c: 6, color: 'rgba(246, 178, 26, 0.04)' },
      { a: 3, b: 6, c: 4, color: 'rgba(102, 187, 42, 0.04)' }
    ];

    let angleX = 0.3;
    let angleY = 0.2;
    let targetAngleX = 0.3;
    let targetAngleY = 0.2;
    let currentScale = 1.0;
    let targetScale = 1.0;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetAngleY = x * 1.5;
      targetAngleX = -y * 1.5;
    };

    const handleMouseEnter = () => {
      isHovering = true;
      targetScale = 1.35;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      targetScale = 1.0;
      targetAngleX = 0.3;
      targetAngleY = 0.2;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const FOV = 400;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Smooth continuous auto-rotation + mouse interaction + scale growth
      currentScale += (targetScale - currentScale) * 0.08;

      if (!isHovering) {
        angleY += 0.008;
        angleX += 0.004;
      } else {
        angleX += (targetAngleX - angleX) * 0.08;
        angleY += (targetAngleY - angleY) * 0.08;
      }

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Project Nodes to 2D Screen Space with 3D Depth and dynamic scale growth
      const projected = rawNodes.map(node => {
        const nx = node.x * currentScale;
        const ny = node.y * currentScale;
        const nz = node.z * currentScale;

        // Rotate Y
        let x1 = nx * cosY + nz * sinY;
        let z1 = -nx * sinY + nz * cosY;

        // Rotate X
        let y2 = ny * cosX - z1 * sinX;
        let z2 = ny * sinX + z1 * cosX;

        // Perspective scale
        const scale = FOV / (FOV + z2 + 80);
        const px = x1 * scale + cx;
        const py = y2 * scale + cy;

        return {
          ...node,
          px,
          py,
          scale,
          z: z2
        };
      });

      // 1. Draw Ambient Center Glow (Expands smoothly on hover)
      const centerGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180 * currentScale);
      centerGlow.addColorStop(0, isHovering ? 'rgba(102, 187, 42, 0.32)' : 'rgba(102, 187, 42, 0.22)');
      centerGlow.addColorStop(0.5, isHovering ? 'rgba(56, 189, 248, 0.14)' : 'rgba(56, 189, 248, 0.09)');
      centerGlow.addColorStop(1, 'rgba(10, 24, 15, 0)');
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 180 * currentScale, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw 3D Polygon Faces (Semi-transparent Glass Facets)
      faces.forEach(face => {
        const p1 = projected[face.a];
        const p2 = projected[face.b];
        const p3 = projected[face.c];

        // Average Z for depth culling
        const avgZ = (p1.z + p2.z + p3.z) / 3;
        if (avgZ < 50) {
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.lineTo(p3.px, p3.py);
          ctx.closePath();
          ctx.fillStyle = face.color;
          ctx.fill();
        }
      });

      // 3. Draw Polygon Edges (Connecting Relationship Lines)
      edges.forEach(edge => {
        const p1 = projected[edge.a];
        const p2 = projected[edge.b];

        // Depth-based line brightness & thickness
        const avgScale = (p1.scale + p2.scale) / 2;
        const alpha = Math.max(0.15, Math.min(0.85, avgScale * 0.75));

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);

        const edgeGrad = ctx.createLinearGradient(p1.px, p1.py, p2.px, p2.py);
        edgeGrad.addColorStop(0, `rgba(102, 187, 42, ${alpha})`);
        edgeGrad.addColorStop(0.5, `rgba(56, 189, 248, ${alpha})`);
        edgeGrad.addColorStop(1, `rgba(246, 178, 26, ${alpha})`);

        ctx.strokeStyle = edgeGrad;
        ctx.lineWidth = Math.max(1, avgScale * 1.6);
        ctx.stroke();

        // 4. Draw Flowing Animated Photons (Active Referral / Payment Link Pulses)
        edge.flowProgress = (edge.flowProgress + edge.flowSpeed) % 1;
        const pulseX = p1.px + (p2.px - p1.px) * edge.flowProgress;
        const pulseY = p1.py + (p2.py - p1.py) * edge.flowProgress;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2.8 * avgScale, 0, Math.PI * 2);
        ctx.fillStyle = '#CEF942';
        ctx.shadowColor = '#66BB2A';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // 5. Draw 3D Nodes (Countries & People Endpoints)
      // Sort nodes back to front for proper 3D rendering
      const sortedNodes = [...projected].sort((a, b) => a.z - b.z);

      sortedNodes.forEach(node => {
        const radius = Math.max(4, 6.5 * node.scale);
        const nodeAlpha = Math.max(0.3, Math.min(1, node.scale * 0.95));

        // Outer glow halo
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = node.color === '#66BB2A'
          ? `rgba(102, 187, 42, ${nodeAlpha * 0.3})`
          : node.color === '#38BDF8'
          ? `rgba(56, 189, 248, ${nodeAlpha * 0.3})`
          : `rgba(246, 178, 26, ${nodeAlpha * 0.3})`;
        ctx.fill();

        // Core Solid Circle Node
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10 * node.scale;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner White Center
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Node Country Tag Label (Front-facing nodes)
        if (node.scale > 0.82) {
          ctx.font = `700 ${Math.round(11 * node.scale)}px sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.textAlign = 'center';
          ctx.fillText(node.country, node.px, node.py - radius - 5);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: 'grab'
        }}
      />
    </div>
  );
};
