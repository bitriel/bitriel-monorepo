import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';

export function Download() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  // Generate QR pattern once
  const qrPattern = useMemo(() => {
    return Array.from({ length: 49 }).map((_, i) => {
      const row = Math.floor(i / 7);
      const col = i % 7;
      const isCorner = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
      const isPattern = (row === 3 && col > 0 && col < 6) || (col === 3 && row > 0 && row < 6);
      const isRandom = Math.random() > 0.5;
      return { isCorner, isPattern, isRandom };
    });
  }, []);

  return (
    <section id="download" className="relative px-4 py-20 sm:px-6 sm:py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="card overflow-hidden rounded-3xl border-gray-100 p-8 text-center shadow-elevated sm:p-12 lg:p-16"
        >
          {/* Background Gradient */}
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background: 'radial-gradient(ellipse at top center, rgba(79, 70, 229, 0.05), transparent 60%)',
            }}
          />

          <div className="relative">
            <div className="badge mb-6 inline-flex">
              <span>Download Now</span>
            </div>

            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem]">
              Ready to Take Control?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-gray-500">
              Join over 150,000 users who trust Bitriel to manage their digital assets securely.
            </p>

            {/* App Store Buttons */}
            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 transition-colors hover:bg-gray-800 sm:w-auto"
              >
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <p className="text-xs text-white/60">Download on the</p>
                  <p className="text-base font-semibold text-white">App Store</p>
                </div>
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 transition-colors hover:bg-gray-800 sm:w-auto"
              >
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.56.69.56 1.19 0 .5-.22.92-.56 1.19l-2.17 1.26-2.48-2.48 2.48-2.48 2.17 1.32zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
                </svg>
                <div className="text-left">
                  <p className="text-xs text-white/60">Get it on</p>
                  <p className="text-base font-semibold text-white">Google Play</p>
                </div>
              </motion.a>
            </div>

            {/* QR Code */}
            <div className="mb-8 flex justify-center">
              <div className="card rounded-2xl p-4">
                <div className="grid h-28 w-28 grid-cols-7 grid-rows-7 gap-1 rounded-xl bg-white p-2">
                  {qrPattern.map((cell, i) => (
                    <div
                      key={i}
                      className={`rounded-[2px] ${
                        cell.isCorner
                          ? 'bg-primary-600'
                          : cell.isPattern
                          ? 'bg-gray-900'
                          : cell.isRandom
                          ? 'bg-gray-700'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-400">Scan to download</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">4.9 Rating</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span className="text-sm font-medium">150K+ Downloads</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="text-sm font-medium">Security Audited</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
