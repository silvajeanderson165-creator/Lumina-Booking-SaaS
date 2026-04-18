import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface LogEntry {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  source: string;
}

const logMessages = [
  { message: 'Nova assinatura #8291 criada no plano Pro', type: 'success' as const, source: 'Stripe' },
  { message: 'Pagamento confirmado #102 — R$ 297,00', type: 'success' as const, source: 'Hotmart' },
  { message: 'Falha no cartão #44 — cartão expirado', type: 'warning' as const, source: 'Stripe' },
  { message: 'Webhook recebido: invoice.payment_succeeded', type: 'info' as const, source: 'Stripe' },
  { message: 'Celery task sync_transactions concluído', type: 'success' as const, source: 'Celery' },
  { message: 'Análise de churn: 3 assinaturas classificadas', type: 'info' as const, source: 'Analytics' },
  { message: 'Batch 42/100 processado — 1.2K transações', type: 'info' as const, source: 'PostgreSQL' },
  { message: 'Token JWT renovado para tenant #88', type: 'success' as const, source: 'Auth' },
  { message: 'Alerta: Churn rate 15% acima do esperado', type: 'warning' as const, source: 'Analytics' },
  { message: 'Backup automático concluído — 2.4GB', type: 'success' as const, source: 'PostgreSQL' },
  { message: 'Nova integração Hotmart conectada', type: 'success' as const, source: 'Hotmart' },
  { message: 'Cache Redis invalidado para tenant #12', type: 'info' as const, source: 'Redis' },
];

const typeColors = {
  success: '#4ADE80',
  warning: '#FBBF24',
  info: '#22D3EE',
  error: '#F87171',
};

const typeIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: AlertTriangle,
};

export default function LiveLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  // Initialize with some logs
  useEffect(() => {
    const initial: LogEntry[] = logMessages.slice(0, 5).map((msg, i) => ({
      id: i,
      ...msg,
      timestamp: new Date(Date.now() - (5 - i) * 30000).toLocaleTimeString('pt-BR'),
    }));
    setLogs(initial);
    idRef.current = 5;
  }, []);

  // Add new logs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
      const newEntry: LogEntry = {
        id: idRef.current++,
        ...msg,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
      };
      setLogs((prev) => [...prev.slice(-8), newEntry]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-4 sm:p-5 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">Atividade ao Vivo</h3>
          <p className="text-[10px] sm:text-xs text-gray-500">Logs do sistema em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </div>
          <span className="text-[10px] text-cyan-400 font-medium">LIVE</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="space-y-2 max-h-[280px] overflow-y-auto pr-1"
      >
        {logs.map((log) => {
          const Icon = typeIcons[log.type];
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors"
              style={{ borderLeft: `2px solid ${typeColors[log.type]}40` }}
            >
              <Icon size={14} style={{ color: typeColors[log.type] }} className="mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">{log.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono-code text-gray-600">{log.timestamp}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                    {log.source}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
