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
  hub: boolean;
  layer: number;
  flash: number;
}

interface Edge {
  a: number;
  b: number;
  curve: number;
}

interface Signal {
  edgeIdx: number;
  t: number;
  speed: number;
  color: string;
}

function hexAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function dist(a: Node, b: Node) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function buildGraph(nodes: Node[], k: number): Edge[] {
  const edges: Edge[] = [];
  const seen = new Set<string>();

  nodes.forEach((node, i) => {
    const neighbors = nodes
      .map((other, j) => ({ j, d: i === j ? Infinity : dist(node, other) }))
      .sort((x, y) => x.d - y.d)
      .slice(0, k);

    neighbors.forEach(({ j, d }) => {
      if (j < i) return;
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
      if (seen.has(key)) return;
      seen.add(key);
      const curve = (Math.random() - 0.5) * d * 0.35;
      edges.push({ a: i, b: j, curve });
    });
  });

  return edges;
}

function pointOnEdge(a: Node, b: Node, curve: number, t: number) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * curve;
  const cy = my + ny * curve;

  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * cx + t * t * b.x,
    y: u * u * a.y + 2 * u * t * cy + t * t * b.y,
  };
}

export default function SynapseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const nodeCount = prefersReduced ? 20 : isMobile ? 32 : 48;
    const hubCount = prefersReduced ? 2 : isMobile ? 4 : 6;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cx = () => canvas.width / 2;
    const cy = () => canvas.height / 2;

    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => {
      const hub = i < hubCount;
      const angle = Math.random() * Math.PI * 2;
      const radius = hub
        ? Math.random() * Math.min(canvas.width, canvas.height) * 0.12
        : Math.random() * Math.min(canvas.width, canvas.height) * 0.42 + 40;
      return {
        x: cx() + Math.cos(angle) * radius,
        y: cy() + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * (hub ? 0.12 : 0.22),
        vy: (Math.random() - 0.5) * (hub ? 0.12 : 0.22),
        r: hub ? 3.5 + Math.random() * 1.5 : 1.5 + Math.random() * 1.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        hub,
        layer: hub ? 1 : Math.random() > 0.5 ? 0 : 2,
        flash: 0,
      };
    });

    let edges = buildGraph(nodes, isMobile ? 3 : 4);
    const signals: Signal[] = Array.from(
      { length: prefersReduced ? 3 : isMobile ? 8 : 16 },
      (_, i) => ({
        edgeIdx: i % edges.length,
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    );

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    let frame = 0;
    let raf: number;

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frame % 180 === 0) {
        edges = buildGraph(nodes, isMobile ? 3 : 4);
      }

      const mouse = mouseRef.current;

      // Edges — back layer first
      edges.forEach(({ a, b, curve }) => {
        const na = nodes[a];
        const nb = nodes[b];
        const d = dist(na, nb);
        const maxDist = Math.min(canvas.width, canvas.height) * 0.45;
        if (d > maxDist) return;

        const strength = 1 - d / maxDist;
        const mx = (na.x + nb.x) / 2;
        const my = (na.y + nb.y) / 2;
        const dx = nb.x - na.x;
        const dy = nb.y - na.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        let boost = 0;
        if (mouse.active) {
          const mdx = mouse.x - mx;
          const mdy = mouse.y - my;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 120) boost = (1 - md / 120) * 0.35;
        }
        const cpx = mx + nx * curve;
        const cpy = my + ny * curve;

        const gradient = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
        gradient.addColorStop(0, hexAlpha(na.color, (strength * 0.45 + boost) * (na.layer === 0 ? 0.6 : 1)));
        gradient.addColorStop(1, hexAlpha(nb.color, (strength * 0.45 + boost) * (nb.layer === 0 ? 0.6 : 1)));

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.quadraticCurveTo(cpx, cpy, nb.x, nb.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = strength * 1.8 + 0.4 + boost;
        ctx.stroke();

        // Synaptic cleft dots at midpoint
        if (!prefersReduced && (na.hub || nb.hub)) {
          ctx.beginPath();
          ctx.arc(cpx, cpy, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = hexAlpha("#ffffff", strength * 0.15);
          ctx.fill();
        }
      });

      // Signals along edges
      if (!prefersReduced) {
        signals.forEach((sig) => {
          if (!edges[sig.edgeIdx]) {
            sig.edgeIdx = 0;
            return;
          }
          const { a, b, curve } = edges[sig.edgeIdx];
          sig.t += sig.speed;

          if (sig.t >= 1) {
            nodes[b].flash = 1;
            sig.t = 0;
            sig.edgeIdx = Math.floor(Math.random() * edges.length);
            sig.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const edge = edges[sig.edgeIdx];
            if (Math.random() > 0.5) {
              edges[sig.edgeIdx] = { ...edge, a: edge.b, b: edge.a };
            }
          }

          const pos = pointOnEdge(nodes[a], nodes[b], curve, sig.t);
          const trailT = Math.max(0, sig.t - 0.08);
          const trail = pointOnEdge(nodes[a], nodes[b], curve, trailT);

          ctx.beginPath();
          ctx.moveTo(trail.x, trail.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.strokeStyle = hexAlpha(sig.color, 0.5);
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = hexAlpha(sig.color, 0.95);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = hexAlpha(sig.color, 0.12);
          ctx.fill();
        });
      }

      // Nodes
      nodes.forEach((n) => {
        n.pulse += n.pulseSpeed;
        n.flash = Math.max(0, n.flash - 0.04);
        const glow = 0.55 + Math.sin(n.pulse) * 0.35 + n.flash * 0.5;

        if (mouse.active) {
          const mdx = mouse.x - n.x;
          const mdy = mouse.y - n.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 100) {
            n.vx += (mdx / md) * 0.002;
            n.vy += (mdy / md) * 0.002;
          }
        }

        const haloR = n.r + (n.hub ? 14 : 8);
        if (!prefersReduced) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2);
          ctx.fillStyle = hexAlpha(n.color, glow * (n.hub ? 0.18 : 0.1));
          ctx.fill();
        }

        if (n.hub && !prefersReduced) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
          ctx.strokeStyle = hexAlpha(n.color, 0.25 + n.flash * 0.4);
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(n.color, 0.65 + glow * 0.35);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha("#ffffff", 0.35 + glow * 0.45 + n.flash * 0.3);
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.998;
        n.vy *= 0.998;

        const pad = 20;
        if (n.x < pad || n.x > canvas.width - pad) n.vx *= -1;
        if (n.y < pad || n.y > canvas.height - pad) n.vy *= -1;
        n.x = Math.max(pad, Math.min(canvas.width - pad, n.x));
        n.y = Math.max(pad, Math.min(canvas.height - pad, n.y));

        // Gentle pull toward center for hub nodes
        if (n.hub) {
          n.vx += (cx() - n.x) * 0.00002;
          n.vy += (cy() - n.y) * 0.00002;
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
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
