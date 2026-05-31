# geck0 Hero Synapse Animation — Technical Brief

> For Claude / design review. Current implementation: **v3** in `src/components/SynapseCanvas.tsx`

## Goal

Hero background should feel like a **brain neural network / synapse** — matching geck0 copy: *"like synapses in a brain"*. Decorative only, behind headline content.

## Stack

- React client component, HTML5 Canvas 2D
- `requestAnimationFrame` loop
- Lazy-loaded via `next/dynamic` (no SSR)
- No WebGL / Three.js

## Brand palette

| Color | Hex | Role |
|-------|-----|------|
| Purple | `#7F77DD` | Primary brand |
| Teal | `#1D9E75` | Growth / signals |
| Coral | `#D85A30` | Accent |
| Lavender | `#AFA9EC` | Secondary |
| Background | `#1A1A2E` | `bg-navy-900` |

## v3 Architecture (current)

### Graph structure (not random O(n²))

1. **48 nodes** desktop / **32** mobile / **20** reduced-motion
2. **6 hub nodes** (desktop) — larger, center-biased, gentle pull toward viewport center
3. **k-NN adjacency graph** — each node connects to 3–4 nearest neighbors only
4. Graph **rebuilds every 180 frames** as nodes drift

### Visual layers

1. **Bezier edges** — quadratic curves with random perpendicular offset (not straight lines)
2. **Gradient strokes** — node color A → node color B, opacity scales with distance
3. **Synaptic cleft** — small white dot at curve midpoint on hub-connected edges
4. **Signal pulses** — 16 particles travel along real graph edges with comet trail
5. **Arrival flash** — destination node `flash` increases on pulse arrival
6. **Node rendering** — outer halo, hub ring, filled body, white core
7. **Mouse proximity** — edges brighten + nodes gently attracted within 100–120px

### Performance

- O(n × k) edge drawing via adjacency list (not O(n²) all-pairs)
- Mobile: fewer nodes, fewer signals, fewer neighbors
- `prefers-reduced-motion`: no pulses, minimal glow

### Hero context (`Hero.tsx`)

- Full-viewport canvas, `pointer-events-none`, `aria-hidden`
- Two CSS blur orbs overlay canvas (purple top-left, teal bottom-right)
- Content at z-10

## Version history

| Version | Changes |
|---------|---------|
| v0 | 40 nodes, straight purple lines, basic alpha pulse |
| v1 | 55 nodes, O(n²) proximity lines, gradient, 12 random pulses, node glow |
| v3 | Hub nodes, k-NN graph, bezier curves, graph-following pulses, mouse interaction, synaptic cleft, arrival flash |

## Known limitations / review points

1. **Still subtle on some displays** — blur orbs + dark bg compete with animation
2. **Graph rebuild every 3s** can cause subtle edge flicker
3. **No true 3D depth** — flat canvas
4. **Mouse interaction disabled** on canvas (`pointer-events-none`) — uses window mousemove instead
5. **Bezier control points random** — can look messy when nodes cluster
6. **No dendrite/axon asymmetry** — hubs are symmetric, not biologically accurate

## Improvement directions for v4+

- [ ] Precomputed stable graph (no periodic rebuild flicker)
- [ ] Axon → synaptic bulb → dendrite visual language
- [ ] Layered canvases (far/mid/near) with parallax
- [ ] Center cluster density mask — dense behind headline, sparse at edges
- [ ] WebGL fallback for 100+ nodes with bloom post-processing
- [ ] `react-force-graph-2d` or custom force simulation for organic layout
- [ ] Pulse scheduling via BFS through hub nodes (signals propagate network-wide)
- [ ] Touch interaction for mobile (currently mouse-only boost)

## Files

```
src/components/SynapseCanvas.tsx   — animation engine
src/components/Hero.tsx            — layout + dynamic import
src/app/globals.css                — synapse-node keyframes (legacy CSS, mostly unused now)
```

## Revert

```bash
git log --oneline src/components/SynapseCanvas.tsx
git checkout <commit> -- src/components/SynapseCanvas.tsx
```

---

*Last updated: 2026-05-31 · geck0 landing v3*
