import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TrendingUp, Users, Activity, Clock } from 'lucide-react';

interface Metric {
  value: string;
  numericValue: number;
  prefix: string;
  suffix: string;
  label: string;
  sublabel: string;
  icon: typeof TrendingUp;
  color: string;
}

const metrics: Metric[] = [
  {
    value: '1.2M',
    numericValue: 1.2,
    prefix: 'R$ ',
    suffix: 'M',
    label: 'Receita Processada',
    sublabel: '+12% este mês',
    icon: TrendingUp,
    color: '#22D3EE',
  },
  {
    value: '4.2%',
    numericValue: 4.2,
    prefix: '',
    suffix: '%',
    label: 'Taxa de Churn',
    sublabel: 'Meta: < 5%',
    icon: Activity,
    color: '#FBBF24',
  },
  {
    value: '450',
    numericValue: 450,
    prefix: 'R$ ',
    suffix: '',
    label: 'LTV Médio',
    sublabel: 'Por assinante',
    icon: Users,
    color: '#A78BFA',
  },
  {
    value: '99.9%',
    numericValue: 99.9,
    prefix: '',
    suffix: '%',
    label: 'Uptime SLA',
    sublabel: 'Últimos 30 dias',
    icon: Clock,
    color: '#4ADE80',
  },
];

function AnimatedNumber({ value, prefix, suffix, color }: { value: number; prefix: string; suffix: string; color: string }) {
  const [display, setDisplay] = useState('0');
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (value >= 100) {
          setDisplay(Math.round(latest).toString());
        } else {
          setDisplay(latest.toFixed(1));
        }
      },
    });
    return controls.stop;
  }, [value, motionValue]);

  return (
    <span className="text-2xl sm:text-3xl font-bold" style={{ color }}>
      {prefix}{display}{suffix}
    </span>
  );
}

export default function MetricsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.1,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="glass-card glass-card-hover p-4 sm:p-5 relative overflow-hidden"
          >
            {/* Background icon */}
            <Icon
              size={48}
              className="absolute -right-2 -bottom-2 opacity-[0.04]"
              style={{ color: metric.color }}
            />

            <div className="relative z-10">
              <AnimatedNumber
                value={metric.numericValue}
                prefix={metric.prefix}
                suffix={metric.suffix}
                color={metric.color}
              />
              <p className="text-xs sm:text-sm text-gray-400 mt-1">{metric.label}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={12} style={{ color: metric.color }} />
                <span className="text-[10px] sm:text-xs" style={{ color: metric.color }}>
                  {metric.sublabel}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
