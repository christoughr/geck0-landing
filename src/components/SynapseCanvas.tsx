"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────
//  Brand palette
// ─────────────────────────────────────────────
const COLORS = ["#7F77DD", "#1D9E75", "#D85A30", "#AFA9EC"] as const;
const BG = "#1A1A2E";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface Node {
  x: number; y: number;
  vx: number; vy: number;
  baseX: number; baseY: number;   // resting position for spring return
  r: number;
  color: string;
  colorIdx: number;
  pulse: number;
  pulseSpeed: number;
  hub: boolean;
  tier: 0 | 1 | 2;               // 0 = far-bg, 1 = mid, 2 = near
  flash: number;                  // 0–1, dims fast
  axonLength: number;             // max allowed edge distance
}

interface Edge {
  a: number; b: number;
  cpOffsetX: number;              // stable control-point offset (no rebuild flicker)
  cpOffsetY: number;
  maxAlpha: number;
  width: number;
}

interface Pulse {
  edgeIdx: number;
  t: number;
  speed: number;
  color: string;
  dir: 1 | -1;
  trailLen: number;
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function rgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

function d2(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx, dy = ay - by;
  return dx * dx + dy * dy;
}

/** Quadratic bezier point */
function bezier(
  ax: number, ay: number,
  cpx: number, cpy: number,
  bx: number, by: number,
  t: number
): [number, number] {
  const u = 1 - t;
  return [
    u * u * ax + 2 * u * t * cpx + t * t * bx,
    u * u * ay + 2 * u * t * cpy + t * t * by,
  ];
}

/** Perpendicular normal for a segment */
function perpNormal(ax: number, ay: number, bx: number, by: number): [number, number] {
  const dx = bx - ax, dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return [-dy / len, dx / len];
}

// ─────────────────────────────────────────────
//  Graph builder — stable (built once, never rebuilt)
// ─────────────────────────────────────────────
function buildStableGraph(nodes: Node[], kHub: number, kNormal: number): Edge[] {
  const edges: Edge[] = [];
  const seen = new Set<string>();

  nodes.forEach((n, i) => {
    const k = n.hub ? kHub : kNormal;
    const candidates = nodes
      .map((m, j) => ({ j, dist2: i === j ? Infinity : d2(n.x, n.y, m.x, m.y) }))
      .sort((a, b) => a.dist2 - b.dist2)
      .slice(0, k * 3);                // over-sample then filter by tier

    let connected = 0;
    for (const { j, dist2 } of candidates) {
      if (connected >= k) break;
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
      if (seen.has(key)) continue;
      // avoid connecting two far-bg nodes to each other (keeps it clean)
      if (nodes[i].tier === 0 && nodes[j].tier === 0) continue;

      const dist = Math.sqrt(dist2);
      if (dist > n.axonLength) continue;

      seen.add(key);

      // Control point: stable perpendicular offset (seeded, not random each frame)
      const [nx, ny] = perpNormal(n.x, n.y, nodes[j].x, nodes[j].y);
      const curveMag = (Math.random() - 0.5) * dist * 0.4;

      edges.push({
        a: i, b: j,
        cpOffsetX: nx * curveMag,
        cpOffsetY: ny * curveMag,
        maxAlpha: 0.32 + Math.random() * 0.28,
        width: 0.5 + Math.random() * 1.0,
      });
      connected++;
    }
  });

  return edges;
}

// ─────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────
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

    // ── counts ─────────────────────────────────
    const HUB_COUNT   = prefersReduced ? 3 : isMobile ? 4 : 7;
    const MID_COUNT   = prefersReduced ? 8 : isMobile ? 16 : 28;
    const FAR_COUNT   = prefersReduced ? 5 : isMobile ? 8 : 14;
    const PULSE_COUNT = prefersReduced ? 0 : isMobile ? 6 : 18;

    // ── canvas sizing ──────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;
    const CX = () => W() / 2;
    const CY = () => H() / 2;

    // ── node factory ───────────────────────────
    function makeNode(tier: 0 | 1 | 2, i: number, total: number): Node {
      // Hub: tight cluster around center
      // Mid: mid-radius ring weighted toward upper 60% (headline zone)
      // Far: sparse outer ring
      let x: number, y: number, r: number, speed: number, axonLen: number;

      const shortDim = Math.min(W(), H());

      if (tier === 2) {                             // hub
        const ang = (i / HUB_COUNT) * Math.PI * 2 + Math.random() * 0.4;
        const rad = shortDim * (0.04 + Math.random() * 0.10);
        x = CX() + Math.cos(ang) * rad;
        y = CY() + Math.sin(ang) * rad * 0.75;     // slightly compressed vertically
        r = 3.5 + Math.random() * 2.0;
        speed = 0.08;
        axonLen = shortDim * 0.55;
      } else if (tier === 1) {                      // mid
        const ang = Math.random() * Math.PI * 2;
        const minR = shortDim * 0.10;
        const maxR = shortDim * 0.40;
        const rad  = minR + Math.random() * (maxR - minR);
        x = CX() + Math.cos(ang) * rad;
        y = CY() + Math.sin(ang) * rad * 0.85;
        r = 1.8 + Math.random() * 1.8;
        speed = 0.14 + Math.random() * 0.08;
        axonLen = shortDim * 0.42;
      } else {                                      // far-bg
        x = W() * 0.05 + Math.random() * W() * 0.90;
        y = H() * 0.05 + Math.random() * H() * 0.90;
        r = 1.0 + Math.random() * 1.0;
        speed = 0.06 + Math.random() * 0.06;
        axonLen = shortDim * 0.30;
      }

      const colorIdx = Math.floor(Math.random() * COLORS.length);
      return {
        x, y,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        baseX: x, baseY: y,
        r,
        color: COLORS[colorIdx],
        colorIdx,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.022,
        hub: tier === 2,
        tier,
        flash: 0,
        axonLength: axonLen,
      };
    }

    const nodes: Node[] = [
      ...Array.from({ length: FAR_COUNT },  (_, i) => makeNode(0, i, FAR_COUNT)),
      ...Array.from({ length: MID_COUNT },  (_, i) => makeNode(1, i, MID_COUNT)),
      ...Array.from({ length: HUB_COUNT },  (_, i) => makeNode(2, i, HUB_COUNT)),
    ];

    // ── build graph once ───────────────────────
    const edges = buildStableGraph(nodes, isMobile ? 5 : 6, isMobile ? 3 : 4);

    // ── build adjacency list for BFS-style pulse routing ──
    const adjList: number[][] = nodes.map(() => []);
    edges.forEach((e, idx) => {
      adjList[e.a].push(idx);
      adjList[e.b].push(idx);
    });

    // ── pulse factory ─────────────────────────
    function makePulse(edgeIdx?: number): Pulse {
      const eIdx = edgeIdx ?? Math.floor(Math.random() * edges.length);
      const colorIdx = Math.floor(Math.random() * COLORS.length);
      return {
        edgeIdx: eIdx,
        t: 0,
        speed: 0.0025 + Math.random() * 0.005,
        color: COLORS[colorIdx],
        dir: Math.random() > 0.5 ? 1 : -1,
        trailLen: 0.06 + Math.random() * 0.07,
      };
    }

    /** When a pulse arrives, try to continue along a connected edge */
    function reroute(p: Pulse): void {
      const arrivedAt = p.dir === 1 ? edges[p.edgeIdx].b : edges[p.edgeIdx].a;
      nodes[arrivedAt].flash = 1.0;
      const connected = adjList[arrivedAt].filter(
        (idx) => idx !== p.edgeIdx && edges[idx]
      );
      if (connected.length > 0) {
        const next = connected[Math.floor(Math.random() * connected.length)];
        p.edgeIdx = next;
        // direction: travel away from arrivedAt
        p.dir = edges[next].a === arrivedAt ? 1 : -1;
        p.t = p.dir === 1 ? 0 : 1;
      } else {
        // dead end — restart on random edge
        Object.assign(p, makePulse());
      }
    }

    const pulses: Pulse[] = Array.from({ length: PULSE_COUNT }, (_, i) =>
      makePulse(i % Math.max(1, edges.length))
    );

    // ── mouse ──────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) mouseRef.current = { x: t.clientX, y: t.clientY, active: true };
    };
    const onLeave = () => { mouseRef.current.active = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    // ── helpers for drawing ────────────────────
    const PAD = 30;

    function cpFor(e: Edge): [number, number] {
      // Control point = midpoint + stable stored offset
      const na = nodes[e.a], nb = nodes[e.b];
      return [
        (na.x + nb.x) / 2 + e.cpOffsetX,
        (na.y + nb.y) / 2 + e.cpOffsetY,
      ];
    }

    // ── draw loop ──────────────────────────────
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());

      const mouse = mouseRef.current;

      // ── LAYER 0: far-bg edges (very subtle) ─
      edges.forEach((e) => {
        const na = nodes[e.a], nb = nodes[e.b];
        if (na.tier !== 0 && nb.tier !== 0) return;   // skip non-far edges here
        if (na.tier + nb.tier > 1) return;             // at least one must be tier-0

        const distSq = d2(na.x, na.y, nb.x, nb.y);
        const maxD = na.axonLength;
        if (distSq > maxD * maxD) return;

        const strength = 1 - Math.sqrt(distSq) / maxD;
        const alpha = strength * e.maxAlpha * 0.35;

        const [cpx, cpy] = cpFor(e);
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.quadraticCurveTo(cpx, cpy, nb.x, nb.y);
        ctx.strokeStyle = rgba(na.color, alpha);
        ctx.lineWidth = e.width * 0.6;
        ctx.stroke();
      });

      // ── LAYER 1+2: mid + hub edges ──────────
      edges.forEach((e) => {
        const na = nodes[e.a], nb = nodes[e.b];
        if (na.tier === 0 && nb.tier === 0) return;   // already drawn above

        const distSq = d2(na.x, na.y, nb.x, nb.y);
        const maxD = Math.max(na.axonLength, nb.axonLength);
        if (distSq > maxD * maxD) return;

        const dist = Math.sqrt(distSq);
        const strength = 1 - dist / maxD;

        // mouse proximity boost
        const [cpx, cpy] = cpFor(e);
        let boost = 0;
        if (mouse.active) {
          const mdx = mouse.x - cpx, mdy = mouse.y - cpy;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 150) boost = (1 - md / 150) * 0.5;
        }

        // depth factor: hubs brightest
        const depthFactor = na.tier === 2 || nb.tier === 2 ? 1.0
                          : na.tier === 1 || nb.tier === 1 ? 0.75
                          : 0.4;

        const alphaA = (strength * e.maxAlpha + boost) * depthFactor;
        const alphaB = (strength * e.maxAlpha + boost) * depthFactor;

        const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
        grad.addColorStop(0, rgba(na.color, alphaA));
        grad.addColorStop(1, rgba(nb.color, alphaB));

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.quadraticCurveTo(cpx, cpy, nb.x, nb.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = e.width * (1 + boost * 1.5) * depthFactor;
        ctx.stroke();

        // synaptic bulb at mid-curve for hub edges
        if (!prefersReduced && (na.hub || nb.hub)) {
          const bulbAlpha = strength * 0.22 + boost * 0.15;
          ctx.beginPath();
          ctx.arc(cpx, cpy, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = rgba("#ffffff", bulbAlpha);
          ctx.fill();
        }
      });

      // ── LAYER: signal pulses ─────────────────
      if (!prefersReduced) {
        pulses.forEach((p) => {
          if (!edges[p.edgeIdx]) { Object.assign(p, makePulse()); return; }
          const e = edges[p.edgeIdx];
          const na = nodes[e.a], nb = nodes[e.b];

          p.t += p.speed * p.dir;

          const done = p.dir === 1 ? p.t >= 1 : p.t <= 0;
          if (done) { reroute(p); return; }

          const [cpx, cpy] = cpFor(e);

          // comet trail (5 samples along path)
          const TRAIL_STEPS = 6;
          const baseT = Math.max(0, Math.min(1, p.t));
          for (let s = 0; s < TRAIL_STEPS; s++) {
            const frac = s / TRAIL_STEPS;
            const trailT = p.dir === 1
              ? Math.max(0, baseT - p.trailLen * frac)
              : Math.min(1, baseT + p.trailLen * frac);
            const [tx, ty] = bezier(na.x, na.y, cpx, cpy, nb.x, nb.y, trailT);
            const trailAlpha = (1 - frac) * 0.35;
            const trailR = (1 - frac) * 2.2;
            if (trailR > 0.3) {
              ctx.beginPath();
              ctx.arc(tx, ty, trailR, 0, Math.PI * 2);
              ctx.fillStyle = rgba(p.color, trailAlpha);
              ctx.fill();
            }
          }

          // pulse head — glow + bright dot
          const [hx, hy] = bezier(na.x, na.y, cpx, cpy, nb.x, nb.y, baseT);

          ctx.beginPath();
          ctx.arc(hx, hy, 7, 0, Math.PI * 2);
          ctx.fillStyle = rgba(p.color, 0.12);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = rgba(p.color, 0.88);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = rgba("#ffffff", 0.9);
          ctx.fill();
        });
      }

      // ── LAYER: nodes ─────────────────────────
      nodes.forEach((n) => {
        n.pulse += n.pulseSpeed;
        n.flash = Math.max(0, n.flash - 0.035);
        const glow = 0.5 + Math.sin(n.pulse) * 0.4 + n.flash * 0.6;

        // mouse attraction (hubs only + nearby mid nodes)
        if (mouse.active) {
          const mdx = mouse.x - n.x;
          const mdy = mouse.y - n.y;
          const md2 = mdx * mdx + mdy * mdy;
          const range = n.hub ? 160 : 90;
          if (md2 < range * range) {
            const md = Math.sqrt(md2);
            const str = (1 - md / range) * (n.hub ? 0.0025 : 0.001);
            n.vx += (mdx / md) * str;
            n.vy += (mdy / md) * str;
          }
        }

        // tier-based rendering
        if (n.tier === 0) {
          // far bg: tiny dim dot
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = rgba(n.color, 0.28 + glow * 0.15);
          ctx.fill();
        } else if (n.tier === 1) {
          // mid: halo + body + core
          if (!prefersReduced) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r + 7, 0, Math.PI * 2);
            ctx.fillStyle = rgba(n.color, glow * 0.08);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = rgba(n.color, 0.55 + glow * 0.30);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = rgba("#ffffff", 0.30 + glow * 0.35);
          ctx.fill();
        } else {
          // hub: double ring + large halo + bright body
          if (!prefersReduced) {
            // outer glow
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r + 18, 0, Math.PI * 2);
            ctx.fillStyle = rgba(n.color, glow * 0.10 + n.flash * 0.08);
            ctx.fill();
            // inner glow
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r + 10, 0, Math.PI * 2);
            ctx.fillStyle = rgba(n.color, glow * 0.18 + n.flash * 0.12);
            ctx.fill();
            // ring
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r + 4.5, 0, Math.PI * 2);
            ctx.strokeStyle = rgba(n.color, 0.30 + n.flash * 0.45);
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = rgba(n.color, 0.75 + glow * 0.20);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 0.42, 0, Math.PI * 2);
          ctx.fillStyle = rgba("#ffffff", 0.45 + glow * 0.45 + n.flash * 0.25);
          ctx.fill();
        }

        // ── physics ──────────────────────────
        n.x += n.vx;
        n.y += n.vy;

        // damping
        const damp = n.tier === 2 ? 0.997 : n.tier === 1 ? 0.996 : 0.999;
        n.vx *= damp;
        n.vy *= damp;

        // gentle spring toward base position (prevents drift, kills rebuild flicker)
        const springK = n.tier === 2 ? 0.00018 : n.tier === 1 ? 0.00010 : 0.00005;
        n.vx += (n.baseX - n.x) * springK;
        n.vy += (n.baseY - n.y) * springK;

        // wall bounce
        if (n.x < PAD || n.x > W() - PAD) n.vx *= -1;
        if (n.y < PAD || n.y > H() - PAD) n.vy *= -1;
        n.x = Math.max(PAD, Math.min(W() - PAD, n.x));
        n.y = Math.max(PAD, Math.min(H() - PAD, n.y));
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
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
