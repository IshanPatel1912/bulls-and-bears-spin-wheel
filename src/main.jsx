
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  TrendingUp,
  Landmark,
  Sparkles,
  Gift,
  ReceiptText,
  ChartNoAxesCombined,
  ShieldAlert,
  Wallet,
  RotateCcw,
  Volume2,
  VolumeX
} from "lucide-react";
import "./styles.css";

const segments = [
  {
    name: "Stock Market",
    icon: TrendingUp,
    color: "#d9e8dc",
    ink: "#315f4b",
    note: "Read the market. Trust your strategy."
  },
  {
    name: "Banking",
    icon: Landmark,
    color: "#e7e1d2",
    ink: "#756347",
    note: "Every good move starts with a strong foundation."
  },
  {
    name: "Lucky Chance",
    icon: Sparkles,
    color: "#f2d9a9",
    ink: "#875a20",
    note: "A little luck can change the game."
  },
  {
    name: "Bonus",
    icon: Gift,
    color: "#dce8d4",
    ink: "#456b42",
    note: "An unexpected reward is on the board."
  },
  {
    name: "Tax",
    icon: ReceiptText,
    color: "#f0d5d1",
    ink: "#9a514b",
    note: "Know the rules before you make your move."
  },
  {
    name: "Investment",
    icon: ChartNoAxesCombined,
    color: "#d6e5e8",
    ink: "#356c78",
    note: "Think long-term. Grow with purpose."
  },
  {
    name: "Scam Alert",
    icon: ShieldAlert,
    color: "#e7d8d5",
    ink: "#8e4943",
    note: "Stay sharp. If it looks too good, look twice."
  },
  {
    name: "Budgeting",
    icon: Wallet,
    color: "#e8e2ef",
    ink: "#6a5686",
    note: "Give every rupee a job."
  }
];

const TAU = Math.PI * 2;
const mod = (n, m) => ((n % m) + m) % m;

const SEG_ANGLE = 360 / segments.length;

const labelLines = (name) => {
  const parts = name.split(" ");
  return parts.length > 1 ? parts : [name];
};

function Wheel({ rotation, spinning, onSpin, disabled, winnerIndex, pointerRef }) {
  const size = 520;
  const center = size / 2;
  const radius = 254;
  const step = TAU / segments.length;

  const polar = (r, angle) => ({
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle)
  });

  const sectorPath = (i) => {
    const start = -Math.PI / 2 + i * step;
    const end = start + step;
    const p1 = polar(radius, start);
    const p2 = polar(radius, end);
    return `M ${center} ${center} L ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 1 ${p2.x} ${p2.y} Z`;
  };

  return (
    <div className="wheel-stage">
      <div className="pointer" aria-hidden="true" ref={pointerRef}>
        <span />
      </div>

      <div className="wheel-frame">
        <div className="wheel-rotor" style={{ transform: `rotate(${rotation}deg)` }}>
          <svg
            className="wheel-svg"
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label="Eight-section Bulls and Bears financial wheel"
          >
            {segments.map((segment, i) => {
  const angle = -Math.PI / 2 + (i + 0.5) * step;
  const anchor = polar(168, angle);
  const Icon = segment.icon;
  const lines = labelLines(segment.name);
  const isWinner = winnerIndex === i;

  const iconSize = 32;
  const lineGap = 16;
  const total = iconSize + 6 + lines.length * lineGap;
  const top = anchor.y - total / 2;

  return (
    <g key={segment.name} opacity={winnerIndex !== null && !isWinner ? 0.55 : 1}>
      <path
        d={sectorPath(i)}
        fill={segment.color}
        stroke="#fffdf8"
        strokeWidth="4"
      />

      {/* icon + name as one upright block */}
      <g transform={`rotate(${-rotation} ${anchor.x} ${anchor.y})`}>
        <foreignObject
          x={anchor.x - iconSize / 2}
          y={top}
          width={iconSize}
          height={iconSize}
        >
          <div
            className="segment-icon"
            xmlns="http://www.w3.org/1999/xhtml"
            style={{ color: segment.ink, width: iconSize, height: iconSize }}
          >
            <Icon size={30} strokeWidth={2.2} />
          </div>
        </foreignObject>

        <text
          x={anchor.x}
          y={top + iconSize + 6 + lineGap / 2}
          fill={segment.ink}
          fontSize="13.5"
          fontWeight="800"
          textAnchor="middle"
          dominantBaseline="middle"
          letterSpacing=".4"
        >
          {lines.map((l, k) => (
            <tspan key={k} x={anchor.x} dy={k === 0 ? 0 : lineGap}>
              {l.toUpperCase()}
            </tspan>
          ))}
        </text>
      </g>
    </g>
  );
})}

            <circle
              cx={center}
              cy={center}
              r="75"
              fill="#fffdf8"
              stroke="#e5ddcf"
              strokeWidth="2"
            />
          </svg>
        </div>

        <button
          className={`spin-button ${spinning ? "is-spinning" : ""}`}
          onClick={onSpin}
          disabled={disabled}
          aria-label="Spin the wheel"
        >
          <span className="spin-button-inner">
            <span className="spin-word">{spinning ? "SPINNING" : "SPIN"}</span>
            <span className="spin-sub">{spinning ? "GOOD LUCK" : "YOUR LUCK"}</span>
          </span>
        </button>
      </div>
    </div>
  );
}
const SPIN_MS = 14000; // total spin time, change freely
const easeOut = (t) => 1 - Math.pow(1 - t, 3.2); // fast start, smooth gradual slow-down
const CONFETTI = ["#547c68", "#b9655b", "#f2d9a9", "#d6e5e8", "#e8e2ef"];

function App() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [muted, setMuted] = useState(true);
  const [seconds, setSeconds] = useState(Math.round(SPIN_MS / 1000));

  const rafRef = useRef(null);
  const audioRef = useRef(null);
  const pointerRef = useRef(null);
  const mutedRef = useRef(true);
  const rotationRef = useRef(0);

  mutedRef.current = muted;

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (audioRef.current) audioRef.current.close();
    };
  }, []);

  const playTone = (frequency = 600, duration = 0.08) => {
    if (mutedRef.current) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioRef.current) audioRef.current = new Ctx();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Sound is unavailable:", e);
    }
  };

  const wobblePointer = () => {
    pointerRef.current?.animate(
      [
        { transform: "translateX(-50%) rotate(0deg)" },
        { transform: "translateX(-50%) rotate(-16deg)", offset: 0.35 },
        { transform: "translateX(-50%) rotate(0deg)" }
      ],
      { duration: 110, easing: "ease-out" }
    );
  };

  const spin = () => {
    if (spinning) return;
    cancelAnimationFrame(rafRef.current);

    setWinner(null);
    setWinnerIndex(null);
    setSpinning(true);

    const chosenIndex = Math.floor(Math.random() * segments.length);
    const jitter = (Math.random() - 0.5) * (SEG_ANGLE * 0.6); // lands off-centre, looks natural

    const startRot = rotationRef.current;
    const current = mod(startRot, 360);
    const desired = mod(-(chosenIndex * SEG_ANGLE + SEG_ANGLE / 2 + jitter), 360);
    const extra = mod(desired - current, 360);
    const target = startRot + 360 * 8 + extra;

    const startedAt = performance.now();
    let lastSeg = Math.floor(mod(-startRot, 360) / SEG_ANGLE);

    const frame = (now) => {
      const t = Math.min(1, (now - startedAt) / SPIN_MS);
      const r = startRot + (target - startRot) * easeOut(t);

      rotationRef.current = r;
      setRotation(r);
      setSeconds(Math.max(0, Math.ceil((SPIN_MS - (now - startedAt)) / 1000)));

      const seg = Math.floor(mod(-r, 360) / SEG_ANGLE);
      if (seg !== lastSeg) {
        lastSeg = seg;
        wobblePointer();
        playTone(520 + (1 - t) * 260, 0.03);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setSpinning(false);
        setWinner(segments[chosenIndex]);
        setWinnerIndex(chosenIndex);
        playTone(820, 0.3);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  const reset = () => {
    if (spinning) return;
    setWinner(null);
    setWinnerIndex(null);
  };

  const WinnerIcon = winner?.icon;

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand-lockup">
          <img
            src="/logo.png"
            alt="Bulls and Bears logo"
            className="brand-logo"
          />

          <div className="brand-copy">
            <div className="brand-name">
              BULLS <span>&</span> BEARS
            </div>

            <div className="brand-subtitle">
              PDEU · FINANCE CLUB
            </div>
          </div>
        </div>

        <button
          className="sound-toggle"
          onClick={() => setMuted((value) => !value)}
          title={muted ? "Enable sound" : "Mute sound"}
          aria-label={muted ? "Enable sound" : "Mute sound"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </header>

      <section className="game-layout">
        <div className="wheel-column">
          <div className="wheel-caption">
            <span className="caption-mark">✳</span>
            <span>SPIN THE WHEEL</span>
            <span className="caption-rule" />
          </div>

          <Wheel
  rotation={rotation}
  spinning={spinning}
  onSpin={spin}
  disabled={spinning}
  winnerIndex={winnerIndex}
  pointerRef={pointerRef}
/>

          <div className="spin-status">
            <span
              className={`status-indicator ${
                spinning ? "active" : ""
              }`}
            />

            {spinning ? (
              <>
                Wheel slowing down <strong>· {seconds}s</strong>
              </>
            ) : winner ? (
              "The wheel has spoken"
            ) : (
              "Ready when you are"
            )}
          </div>

          {winner && (
  <div className="confetti">
    {Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2;
      const d = 140 + Math.random() * 160;
      return (
        <i
          key={i}
          style={{
            background: CONFETTI[i % CONFETTI.length],
            "--dx": `${Math.cos(a) * d}px`,
            "--dy": `${Math.sin(a) * d + 80}px`,
            "--rot": `${Math.random() * 720 - 360}deg`
          }}
        />
      );
    })}
  </div>
)}
        </div>
      </section>

      <section className="category-strip">
        <div className="strip-heading">
          <span>ON THE WHEEL</span>
          <span className="strip-count">08 TOPICS</span>
        </div>

        <div className="category-list">
          {segments.map((segment, i) => {
            const Icon = segment.icon;

            return (
              <div
                className={`category-chip ${
                  winner?.name === segment.name ? "selected" : ""
                }`}
                key={segment.name}
              >
                <span
                  className="chip-icon"
                  style={{
                    color: segment.ink,
                    background: segment.color
                  }}
                >
                  <Icon size={16} />
                </span>

                <span>{segment.name}</span>

                <span className="chip-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          BULLS <span>&</span> BEARS
        </div>

        <span>THINK SHARP. PLAY SMART.</span>

        <span className="footer-year">PDEU FINANCE CLUB</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
