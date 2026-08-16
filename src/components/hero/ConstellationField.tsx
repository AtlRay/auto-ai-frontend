import { useEffect, useRef } from 'react';
import { useViewportWidth } from '@/hooks/useViewport';

/**
 * Constellation field — ported from ThoughtPathCanvas.
 *
 * A sparse graph of nodes, faint edges, and light pulses travelling between
 * them. Enhancements over the reference: nodes drift continuously, each sits
 * at a depth so the field parallaxes against the pointer, and the canvas is
 * scaled to devicePixelRatio so it stays crisp on phones.
 *
 * Pair with mix-blend-mode: screen so it lights up over a photo rather than
 * flattening it.
 */

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulse: number;
  speed: number;
  /** 0 = far (barely parallaxes), 1 = near (moves most). */
  depth: number;
};

type Edge = { a: number; b: number };
type Traveler = { edge: Edge; t: number; speed: number; gold: boolean };

interface Props {
  className?: string;
  /** Omit to let density scale with viewport width. */
  nodeCount?: number;
  travelerCount?: number;
}

export default function ConstellationField({
  className,
  nodeCount,
  travelerCount,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportWidth = useViewportWidth();

  // Density scales down on narrow screens so a Fold cover screen gets a field,
  // not clutter. Bucketed so ordinary resizes don't thrash the re-seed.
  const bucket = viewportWidth < 400 ? 0 : viewportWidth < 700 ? 1 : viewportWidth < 1100 ? 2 : 3;
  const nodes_ = nodeCount ?? [24, 36, 50, 64][bucket];
  const travelers_ = travelerCount ?? [10, 15, 21, 26][bucket];

  // Keyed on `bucket` as well as counts: a foldable opening changes the
  // viewport live, and the node field must re-seed into the new box rather
  // than stay laid out for the old one.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes: Node[] = Array.from({ length: nodes_ }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      // Slow enough to read as depth rather than motion.
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.08,
      pulse: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02,
      depth: 0.25 + Math.random() * 0.75,
    }));

    // Edges are fixed at seeding time; drift then stretches them naturally.
    const edges: Edge[] = [];
    const seen = new Set<string>();
    nodes.forEach((n, i) => {
      const dists = nodes
        .map((m, j) => ({ j, d: Math.hypot(n.x - m.x, n.y - m.y) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d);
      const k = 2 + Math.floor(Math.random() * 2);
      for (let t = 0; t < k; t++) {
        const pair = [i, dists[t].j].sort((a, b) => a - b) as [number, number];
        const key = `${pair[0]}-${pair[1]}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ a: pair[0], b: pair[1] });
        }
      }
    });

    const makeTraveler = (): Traveler => ({
      edge: edges[Math.floor(Math.random() * edges.length)],
      t: 0,
      speed: 0.006 + Math.random() * 0.012,
      gold: Math.random() < 0.3,
    });
    let travelers: Traveler[] = Array.from({ length: travelers_ }, makeTraveler);

    // Pointer parallax, eased so the field glides rather than snaps.
    let targetX = 0;
    let targetY = 0;
    let panX = 0;
    let panY = 0;
    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    const MAX_PAN = 26;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      panX += (targetX * MAX_PAN - panX) * 0.045;
      panY += (targetY * MAX_PAN - panY) * 0.045;

      const px = (n: Node) => n.x + panX * n.depth;
      const py = (n: Node) => n.y + panY * n.depth;

      edges.forEach((e) => {
        const a = nodes[e.a];
        const b = nodes[e.b];
        ctx.strokeStyle = 'rgba(120,190,210,0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px(a), py(a));
        ctx.lineTo(px(b), py(b));
        ctx.stroke();
      });

      nodes.forEach((n) => {
        if (!reduced) {
          n.pulse += n.speed;
          n.x += n.vx;
          n.y += n.vy;
          // Wrap with a margin so nodes don't pop at the edges.
          if (n.x < -40) n.x = width + 40;
          if (n.x > width + 40) n.x = -40;
          if (n.y < -40) n.y = height + 40;
          if (n.y > height + 40) n.y = -40;
        }
        const glow = (Math.sin(n.pulse) + 1) / 2;
        const r = (1.1 + glow * 1.8) * (0.7 + n.depth * 0.5);
        ctx.beginPath();
        ctx.arc(px(n), py(n), r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,230,240,${0.16 + glow * 0.32})`;
        ctx.shadowColor = 'rgba(63,214,255,0.7)';
        ctx.shadowBlur = 5 + glow * 8;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      travelers = travelers.map((tr) => {
        const nt = reduced ? tr.t : tr.t + tr.speed;
        if (nt >= 1) return makeTraveler();
        const a = nodes[tr.edge.a];
        const b = nodes[tr.edge.b];
        const x = px(a) + (px(b) - px(a)) * nt;
        const y = py(a) + (py(b) - py(a)) * nt;
        const col = tr.gold ? '232,193,101' : '63,214,255';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},0.9)`;
        ctx.shadowColor = `rgba(${col},1)`;
        ctx.shadowBlur = 12;
        ctx.fill();
        return { ...tr, t: nt };
      });
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [nodes_, travelers_, bucket]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
