import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShoppingBag, Shield, Database, BarChart3 } from 'lucide-react';

interface Packet {
  id: number;
  pathId: string;
  delay: number;
  color: string;
  duration: number;
}

interface SystemNode {
  id: string;
  icon: typeof CreditCard;
  label: string;
  color: string;
  x: number;
  y: number;
  w?: number;
}

const nodes: SystemNode[] = [
  { id: 'stripe', icon: CreditCard, label: 'Stripe', color: '#4ADE80', x: 50, y: 50, w: 85 },
  { id: 'hotmart', icon: ShoppingBag, label: 'Hotmart', color: '#FBBF24', x: 50, y: 180, w: 90 },
  { id: 'gateway', icon: Shield, label: 'API Gateway', color: '#22D3EE', x: 280, y: 115, w: 110 },
  { id: 'postgres', icon: Database, label: 'PostgreSQL', color: '#A78BFA', x: 510, y: 115, w: 105 },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', color: '#22D3EE', x: 740, y: 115, w: 95 },
];

const connections = [
  { from: 'stripe', to: 'gateway', id: 'path1', color: '#4ADE80' },
  { from: 'hotmart', to: 'gateway', id: 'path2', color: '#FBBF24' },
  { from: 'gateway', to: 'postgres', id: 'path3', color: '#22D3EE' },
  { from: 'postgres', to: 'analytics', id: 'path4', color: '#A78BFA' },
];

export default function DataFlowVisualization() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [statuses, setStatuses] = useState<Record<string, string>>({
    path1: 'Sincronizando...',
    path2: 'Webhook ativo',
    path3: 'Migrando dados...',
    path4: 'Analisando...',
  });
  const packetIdRef = useRef(0);

  // Generate paths data
  const getPathD = (fromId: string, toId: string) => {
    const from = nodes.find((n) => n.id === fromId)!;
    const to = nodes.find((n) => n.id === toId)!;
    return `M ${from.x + (from.w || 80)} ${from.y + 20} L ${to.x} ${to.y + 20}`;
  };

  // Spawn packets periodically
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      connections.forEach((conn, idx) => {
        const newPacket: Packet = {
          id: packetIdRef.current++,
          pathId: conn.id,
          delay: idx * 0.3,
          color: conn.color,
          duration: 2 + Math.random(),
        };
        setPackets((prev) => [...prev.slice(-20), newPacket]);
      });
    }, 2500);

    // Update statuses
    const statusInterval = setInterval(() => {
      setStatuses({
        path1: ['Sincronizando...', 'Sincronizado ✓', 'Novo evento'][Math.floor(Math.random() * 3)],
        path2: ['Webhook ativo', 'Processando...', 'Fila vazia'][Math.floor(Math.random() * 3)],
        path3: ['Migrando dados...', 'Batch 42/100', 'Indexando...'][Math.floor(Math.random() * 3)],
        path4: ['Analisando...', 'LTV calculado', 'Churn detectado'][Math.floor(Math.random() * 3)],
      });
    }, 4000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full glass-card p-4 sm:p-6 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Fluxo de Dados em Tempo Real</h3>
          <p className="text-xs text-gray-500 mt-1">Pipeline ativo — processando transações</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </div>
          <span className="text-xs text-green-400 font-medium">AO VIVO</span>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox="0 0 820 240"
          className="w-full min-w-[600px]"
          style={{ height: '240px' }}
        >
          <defs>
            {/* Glow filters */}
            <filter id="glow-green">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-cyan">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines */}
          {connections.map((conn) => (
            <g key={conn.id}>
              <path
                d={getPathD(conn.from, conn.to)}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={2}
              />
              <path
                d={getPathD(conn.from, conn.to)}
                fill="none"
                stroke={conn.color}
                strokeWidth={1.5}
                strokeDasharray="4 6"
                opacity={0.4}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-20"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          ))}

          {/* Traveling packets */}
          {packets.map((packet) => {
            const conn = connections.find((c) => c.id === packet.pathId);
            if (!conn) return null;
            const pathD = getPathD(conn.from, conn.to);
            return (
              <circle
                key={packet.id}
                r={4}
                fill={packet.color}
                filter={`url(#glow-${packet.color === '#4ADE80' ? 'green' : 'cyan'})`}
                opacity={0.9}
              >
                <animateMotion
                  dur={`${packet.duration}s`}
                  begin={`${packet.delay}s`}
                  repeatCount="indefinite"
                  path={pathD}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur={`${packet.duration}s`}
                  begin={`${packet.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const Icon = node.icon;
            return (
              <g key={node.id}>
                {/* Node glow */}
                <rect
                  x={node.x - 4}
                  y={node.y - 4}
                  width={(node.w || 80) + 8}
                  height={48}
                  rx={12}
                  fill={node.color}
                  opacity={0.08}
                />
                {/* Node background */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w || 80}
                  height={40}
                  rx={10}
                  fill="#111827"
                  stroke={node.color}
                  strokeWidth={1.5}
                  opacity={0.9}
                />
                {/* Icon */}
                <foreignObject x={node.x + 10} y={node.y + 10} width={20} height={20}>
                  <div style={{ color: node.color }}>
                    <Icon size={18} />
                  </div>
                </foreignObject>
                {/* Label */}
                <text
                  x={node.x + 34}
                  y={node.y + 25}
                  fill="#F9FAFB"
                  fontSize={11}
                  fontWeight={600}
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Status labels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {connections.map((conn) => (
          <div
            key={conn.id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: `${conn.color}08` }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: conn.color }}
            />
            <span className="text-[10px] sm:text-xs" style={{ color: conn.color }}>
              {statuses[conn.id]}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
