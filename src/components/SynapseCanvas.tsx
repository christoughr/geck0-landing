"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#7F77DD", "#1D9E75", "#D85A30", "#AFA9EC"];

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface Pulse {
  from: number;
  to: number;
  t: number;
  speed: number;
  color: string;
}

export default function SynapseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodeCount = prefersReduced ? 25 : 55;
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2 + 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    const pulses: Pulse[] = Array.from({ length: prefersReduced ? 4 : 12 }, () => ({
      from: Math.floor(Math.random() * nodeCount),
      to: Math.floor(Math.random() * nodeCount),
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.008,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const connectDist = 160;

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw synapse connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const strength = 1 - dist / connectDist;
            const gradient = ctx.createLinearGradient(
              nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y
            );
            gradient.addColorStop(0, hexAlpha(nodes[i].color, strength * 0.35));
            gradient.addColorStop(1, hexAlpha(nodes[j].color, strength * 0.35));

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = strength * 1.2 + 0.3;
            ctx.stroke();
          }
        }
      }

      // Signal pulses traveling along connections
      if (!prefersReduced) {
        pulses.forEach((p) => {
          if (p.from === p.to) return;
          const a = nodes[p.from];
          const b = nodes[p.to];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= connectDist) {
            p.from = Math.floor(Math.random() * nodes.length);
            p.to = Math.floor(Math.random() * nodes.length);
            p.t = 0;
            return;
          }

          p.t += p.speed;
          if (p.t > 1) {
            p.t = 0;
            p.from = p.to;
            p.to = Math.floor(Math.random() * nodes.length);
            p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
          }

          const x = a.x + dx * p.t;
          const y = a.y + dy * p.t;

          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = hexAlpha(p.color, 0.9);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = hexAlpha(p.color, 0.15);
          ctx.fill();
        });
      }

      // Nodes with glow
      nodes.forEach((n) => {
        n.pulse += n.pulseSpeed;
        const glow = 0.5 + Math.sin(n.pulse) * 0.3;

        if (!prefersReduced) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 6, 0, Math.PI * 2);
          ctx.fillStyle = hexAlpha(n.color, glow * 0.12);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(n.color, 0.5 + glow * 0.5);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha("#ffffff", 0.4 + glow * 0.3);
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

function hexAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
