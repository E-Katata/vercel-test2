"use client";
import { useEffect, useState } from "react";

type Props = {
  name: string;
  level: number;
  capacity: number;
};

export default function TankDetails({ name, level, capacity }: Props) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const p = Math.round((level / capacity) * 100);
    // 小さな遅延でアニメーション感を出す
    const t = setTimeout(() => setPercent(p), 200);
    return () => clearTimeout(t);
  }, [level, capacity]);

  // 残量に応じて色変化
  const waterColor =
    percent <= 20 ? "#ff4d4d" : // 赤
    percent <= 50 ? "#ffd53b" : // 黄
    "#4db8ff";                  // 通常

  const showAlert = percent <= 20;

  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      <h2 style={{ marginBottom: "10px", fontSize: "20px", textAlign: "center" }}>{name}</h2>

      {/* 既存のテキスト警告 */}
      {showAlert && (
        <p style={{ color: "#b91c1c", fontWeight: 700, marginBottom: 8 }}>
          ⚠ 水位が非常に低いです！
        </p>
      )}
        {/* ⚠ 警告背景はここ（bucket の中）に入れるのが重要 */}
        {showAlert && (
          <div className="piece">
          <div className="label -blink -bordered --danger">Approaching Limits</div>
          <div className="separator"></div>
          <div className="label -blink -bordered -short --danger">Danger</div>
        </div>
        )}
      <div className="bucket">
        {/* 波（水） */}
        <div className="wave" style={{ height: `${percent}%`, background: waterColor }}>
          <span className="percent-text">{percent}%</span>
        </div>
      </div>

      <style jsx>{`
        .bucket {
          width: 220px;
          height: 260px;
          border: 6px solid #666;
          border-radius: 12px;
          margin: 0 auto;
          overflow: hidden;
          position: relative; /* ここに対して子の絶対配置が効く */
          background: #eee;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.08);
        }

        /* ---------------------------
           EVA 警告背景（bucket内に設置）
           --------------------------- */
        .eva-warning-bg {
          position: absolute;
          inset: 0;               /* bucket 全体に広げる */
          pointer-events: none;
          overflow: hidden;
          z-index: 0;             /* 波より下に置く（波は z-index: 2） */
        }

        .eva-warning-text {
          position: absolute;
          top: 40%;
          left: -120%;
          width: 340%;
          font-size: 42px;
          font-weight: 900;
          letter-spacing: 6px;
          color: #ff2e2e;
          opacity: 0.18;
          transform: rotate(-18deg);
          animation: evaScroll 2.2s linear infinite;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.6);
          white-space: nowrap;
        }

        @keyframes evaScroll {
          0%   { transform: translateX(0)    rotate(-18deg); }
          50%  { transform: translateX(40%)  rotate(-18deg); }
          100% { transform: translateX(0)    rotate(-18deg); }
        }

        /* ---------------------------
           波（water） — 表示とアニメーション
           --------------------------- */
        .wave {
          width: 100%;
          position: absolute;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: height 2.2s ease;
          z-index: 2; /* 警告背景の上に表示される（文字が読みやすく） */
        }

        /* パーセントの文字は波の上に出す */
        .percent-text {
          color: #fff;
          font-size: 22px;
          font-weight: 700;
          text-shadow: 0 0 6px rgba(0,0,0,0.6);
          z-index: 3;
          position: relative;
        }

        /* 波の色変化のゆらぎ（控えめ） */
        @keyframes waveMotion {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(8deg); }
          100% { filter: hue-rotate(0deg); }
        }

        .wave { animation: waveMotion 4s linear infinite; }



.board {
  --glow-rgb: 255, 102, 0;
  --text-color: #fa0;
  --danger-fill-color: #f23;
  --danger-glow-rgb: 255, 0, 0;
  --danger-text-color: #f30;
  --gutter-size: 8px;
  padding-left: 1rem;
  padding-top: 1rem;
}

.piece {
  float: left;
  margin-bottom: 1rem;
  margin-right: 1rem;
}

/* attributes */

.-bordered {
  --border-glow-color: rgba(var(--glow-rgb), .7);
  border-radius: var(--gutter-size);
  border-style: solid;
  border-width: 3px;
  box-shadow:
    inset 0 0 0 1px var(--border-glow-color),
    0 0 0 1px var(--border-glow-color);
}
.-bordered.--danger {
  --border-glow-color: rgba(var(--danger-glow-rgb), .7);
}

.-striped {
  --stripe-color: var(--danger-fill-color);
  --stripe-size: 15px;
  --glow-color: rgba(var(--danger-glow-rgb), .8);
  --glow-size: 3px;
  background-image: repeating-linear-gradient(
    -45deg,
    /* glow boundary */
    var(--glow-color) calc(-1 * var(--glow-size)),
    /* fade into foreground */
    var(--stripe-color) 0,
    /* fade from foreground */
    var(--stripe-color) calc(var(--stripe-size) - var(--glow-size) / 2),
    /* glow boundary */
    var(--glow-color) calc(var(--stripe-size) + var(--glow-size) / 2),
    /* fade to background */
    transparent calc(var(--stripe-size) + var(--glow-size) / 2),
    /* fade from background */
    transparent calc(2 * var(--stripe-size)),
    /* glow boundary */
    var(--glow-color) calc(2 * var(--stripe-size) - var(--glow-size))
  );
  box-shadow: inset 0 0 1px calc(var(--glow-size) / 2) var(--shade-3);
}

/* components */

.label {
  display: inline-block;
  font: 400 32px 'Roboto Condensed';
  letter-spacing: -1px;
  line-height: 1;
  padding: 1px calc(var(--gutter-size) - 3px);
  text-transform: uppercase;
  user-select: none;
  white-space: nowrap;
  /* skin */
  --text-glow-color: rgba(var(--glow-rgb), .5);
  color: var(--text-color);
  text-shadow:
    -1px 1px 0 var(--text-glow-color),
    1px -1px 0 var(--text-glow-color),
    -1px -1px 0 var(--text-glow-color),
    1px 1px 0 var(--text-glow-color);
}
.label.-short {
  font-size: 40px;
}
.label.--danger {
  --text-glow-color: rgba(var(--danger-glow-rgb), .5);
  color: var(--danger-text-color);
}
.label + .separator {
  height: var(--gutter-size);
}
.label .text.-characters {
  font-weight: 600;
}
.label#internal {
  --decal-width: 50px;
  --label-corner-size: 3px;
  --label-gutter-size: 5px;
  display: grid;
  column-gap: var(--label-gutter-size);
  grid-template-columns: auto var(--decal-width);
  padding: var(--label-corner-size);
}
.label#internal .text {
  text-align: right;
}
.label#internal .text.-characters {
  font-size: 64px;
  padding-top: var(--label-gutter-size);
}
.label#internal .decal {
  border-radius: calc(var(--label-corner-size) - 1px);
  grid-area: 1 / 2 / span 2 / 2;
}

.hex {
  --edge-size: 20px;
  --diagonal-size: calc(var(--edge-size) * 2);
  --diagonal-s-size: calc(var(--edge-size) * 1.75); /* diagonal */
  --gutter-ratio: .85;
  --gutter-size: calc(var(--edge-size) * .35);
  --gutter-d-size: calc(var(--edge-size) / 2);
  float: left;
  height: var(--diagonal-s-size);
  margin-bottom: var(--gutter-size);
  margin-left: calc(var(--gutter-ratio) * var(--edge-size) / 2);
  margin-right: calc(var(--gutter-ratio) * var(--edge-size) / 2);
  position: relative;
  width: var(--edge-size);
  /* skin */
  --fill-color: var(--danger-text-color);
  --glow-color: rgba(var(--danger-glow-rgb), .5);
  background: var(--fill-color);
  box-shadow:
    0 0 var(--gutter-d-size) var(--glow-color),
    0 0 calc(var(--gutter-d-size) / 2) var(--glow-color);
  /* animation */
  --blink-duration: 3s;
  animation-delay: .1s;
}
.hex::before, .hex::after { content: ''; display: block; position: absolute; }
.hex:nth-child(odd) {
  top: calc((var(--diagonal-s-size) + var(--gutter-size)) / 2);
}
.hex:nth-child(2n) { animation-delay: .2s; }
.hex:nth-child(3n) { animation-delay: .3s; }
.hex-row:nth-child(even) > .hex { animation-delay: .3s; }
.hex-row:nth-child(even) > .hex:nth-child(2n) { animation-delay: .2s; }
.hex-row:nth-child(even) > .hex:nth-child(3n) { animation-delay: .1s; }

.-border-method .hex {
  --tip-height: var(--diagonal-s-size);
  --tip-width: calc(var(--edge-size) * 2);
}
.-border-method .hex::before, .-border-method .hex::after {
  border-color: transparent var(--fill-color);
  border-style: solid;
  border-width: calc(var(--tip-height) / 2) var(--tip-width);
}
.-border-method .hex::before { border-left: 0; left: calc(-1 * var(--tip-width)); }
.-border-method .hex::after { border-right: 0; right: calc(-1 * var(--tip-width)); }

.-rotate-method .hex::before, .-rotate-method .hex::after {
  background: var(--fill-color);
  box-shadow: inherit;
  height: var(--diagonal-s-size);
  width: var(--edge-size);
}
.-rotate-method .hex::before { transform: rotate(60deg); }
.-rotate-method .hex::after { transform: rotate(-60deg); }
      `}</style>
    </div>
  );
}
