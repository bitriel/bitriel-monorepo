import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedNumber({ value, suffix = '', prefix = '' }: AnimatedNumberProps) {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let frame: number;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * value));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}{current.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  {
    label: 'Active Users',
    value: 150000,
    suffix: '+',
    prefix: '',
    description: 'Trust Bitriel daily',
  },
  {
    label: 'Transaction Volume',
    value: 500,
    suffix: 'M+',
    prefix: '$',
    description: 'Processed securely',
  },
  {
    label: 'Uptime',
    value: 99.9,
    suffix: '%',
    prefix: '',
    isDecimal: true,
    description: 'Always available',
  },
  {
    label: 'Avg. Transaction',
    value: 3,
    suffix: 's',
    prefix: '<',
    description: 'Lightning fast',
  },
];

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="card overflow-hidden rounded-3xl border-gray-100 bg-gradient-to-br from-primary-600 to-primary-700 p-8 shadow-elevated sm:p-10 lg:p-14"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="text-center lg:text-left"
              >
                <div className="mb-2 text-4xl font-bold text-white sm:text-5xl">
                  {stat.isDecimal ? (
                    <span>{stat.prefix}{stat.value}{stat.suffix}</span>
                  ) : stat.value < 10 ? (
                    <span>{stat.prefix}{stat.value}{stat.suffix}</span>
                  ) : (
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  )}
                </div>
                <p className="mb-1 text-base font-medium text-white/90">{stat.label}</p>
                <p className="text-sm text-white/60">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
