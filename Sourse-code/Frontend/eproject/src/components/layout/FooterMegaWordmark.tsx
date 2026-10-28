import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';

export const FooterMegaWordmark: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <div className="relative w-full py-6 sm:py-12 select-none flex flex-col items-center justify-center cursor-pointer overflow-visible group">
      <motion.div
        animate={{
          y: hovered ? 0 : 3,
          opacity: hovered ? 1 : 0.6,
        }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 mb-2 sm:mb-4 px-4 py-1.5 rounded-full bg-[var(--color-surface-2)]/90 border border-[var(--color-accent)]/50 text-[10px] sm:text-xs font-mono uppercase tracking-[0.28em] text-[var(--color-accent)] font-bold shadow-warm-xs backdrop-blur-xl"
      >
        <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-[var(--color-accent)]" />
        <span>EXECUTIVE CULINARY SIGNATURE</span>
        <Crown className="w-3.5 h-3.5 text-[var(--color-accent)]" />
      </motion.div>
      <div className="w-full max-w-6xl h-36 sm:h-52 md:h-64 flex items-center justify-center relative overflow-visible">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 820 180"
          xmlns="http://www.w3.org/2000/svg"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
          className="select-none overflow-visible w-full h-full"
        >
          <defs>
            <linearGradient id="luxuryGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A67628" />
              <stop offset="25%" stopColor="#E2B35B" />
              <stop offset="50%" stopColor="#FFF8E7" />
              <stop offset="75%" stopColor="#E57A8B" />
              <stop offset="100%" stopColor="#53131B" />
            </linearGradient>

            <radialGradient
              id="revealTextMask"
              gradientUnits="userSpaceOnUse"
              r="30%"
              cx={maskPosition.cx || '50%'}
              cy={maskPosition.cy || '50%'}
            >
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="45%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor="black" stopOpacity="0" />
            </radialGradient>

            <mask id="laserSpotlightMask">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#revealTextMask)" />
            </mask>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            strokeWidth="0.8"
            className="font-serif font-bold tracking-tight text-[115px] sm:text-[125px] fill-transparent stroke-[var(--color-border-strong)] transition-opacity duration-300"
            style={{
              opacity: hovered ? 0.35 : 0.6,
              fontFamily: '"Fraunces", "Cormorant Garamond", Georgia, serif',
            }}
          >
            JAMES THEW
          </text>

          <motion.text
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            strokeWidth="1.2"
            className="font-serif font-bold tracking-tight text-[115px] sm:text-[125px] fill-transparent stroke-[var(--color-accent)]"
            style={{
              fontFamily: '"Fraunces", "Cormorant Garamond", Georgia, serif',
            }}
            initial={{ strokeDashoffset: 1400, strokeDasharray: 1400 }}
            animate={{
              strokeDashoffset: 0,
              strokeDasharray: 1400,
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            JAMES THEW
          </motion.text>

          <text
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="url(#luxuryGoldGradient)"
            stroke="url(#luxuryGoldGradient)"
            strokeWidth="1.5"
            mask="url(#laserSpotlightMask)"
            filter="url(#goldGlow)"
            className="font-serif font-bold tracking-tight text-[115px] sm:text-[125px]"
            style={{
              fontFamily: '"Fraunces", "Cormorant Garamond", Georgia, serif',
            }}
          >
            JAMES THEW
          </text>
        </svg>
      </div>

      <div className="w-full max-w-3xl h-[1.5px] bg-[var(--color-border)]/40 relative overflow-hidden mt-2 rounded-full">
        <motion.div
          animate={{
            scaleX: hovered ? 1 : 0.25,
            opacity: hovered ? 1 : 0.4,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent shadow-[0_0_16px_var(--color-accent)] origin-center"
        />
      </div>

      <motion.div
        animate={{
          opacity: hovered ? 1 : 0.5,
          y: hovered ? 0 : 2,
        }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 mt-4 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[var(--color-text-subtle)] font-bold"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-ping" />
        <span>HAUTE GASTRONOMY CONSERVATORY • LONDON • PARIS • ROME • TOKYO</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
      </motion.div>
    </div>
  );
};

export default FooterMegaWordmark;
