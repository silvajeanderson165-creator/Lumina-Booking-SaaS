import { motion } from 'framer-motion';

export function GlowOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Cyan Orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(180 100% 50% / 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '-200px',
          left: '-100px',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Purple Orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(260 100% 60% / 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '20%',
          right: '-300px',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Pink Orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(320 100% 60% / 0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
          bottom: '10%',
          left: '20%',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Bottom Cyan Orb */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(180 100% 50% / 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          bottom: '-300px',
          right: '10%',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
