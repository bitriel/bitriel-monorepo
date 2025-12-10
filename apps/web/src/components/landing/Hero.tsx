import { motion, type Transition } from 'framer-motion';

const transition: Transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-gradient-hero px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:pt-36 lg:pb-24">
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div
          className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/4 opacity-60 lg:h-[800px] lg:w-[800px]"
          style={{
            background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.08), transparent 60%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="badge mb-6 inline-flex sm:mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-600" />
              </span>
              <span>Now Available on iOS & Android</span>
            </motion.div>

            {/* Heading */}
            <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:mb-6 sm:text-5xl lg:text-[3.5rem]">
              Your Crypto,{' '}
              <span className="text-gradient">Your Control</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-8 text-lg leading-relaxed text-gray-500 sm:mb-10 sm:text-xl lg:pr-8">
              The non-custodial wallet that puts you in charge. Secure, simple, and designed for the modern investor.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <motion.a
                href="#download"
                className="btn-primary w-full justify-center sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Free
              </motion.a>
              <motion.a
                href="#features"
                className="btn-secondary w-full justify-center sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.a>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:mt-12 lg:justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-primary-600 sm:h-9 sm:w-9"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">150K+</p>
                  <p className="text-xs text-gray-500">Active Users</p>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">4.9</p>
                  <p className="text-xs text-gray-500">App Rating</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...transition }}
            className="relative mx-auto flex w-full max-w-[320px] justify-center lg:mx-0 lg:max-w-none"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[300px]">
              {/* Shadow/Glow */}
              <div
                className="absolute inset-0 -m-4 rounded-[50px] sm:-m-6"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(79, 70, 229, 0.15), transparent 70%)',
                }}
              />

              {/* Phone Frame */}
              <div className="card relative overflow-hidden rounded-[36px] border-gray-200 p-2 shadow-elevated sm:rounded-[40px]">
                <div className="overflow-hidden rounded-[28px] bg-gray-950 sm:rounded-[32px]">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-6 py-3">
                    <span className="text-xs font-medium text-white/60">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-2.5 w-0.5 rounded-full bg-white/60" />
                        ))}
                      </div>
                      <div className="ml-1.5 h-3 w-5 rounded-sm border border-white/60">
                        <div className="h-full w-3/4 rounded-sm bg-white/60" />
                      </div>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="p-5">
                    {/* Balance Header */}
                    <div className="mb-7 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/50">Total Balance</p>
                        <p className="text-2xl font-bold text-white">$24,832.50</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1">
                        <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className="text-xs font-semibold text-emerald-400">+12.5%</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mb-7 flex gap-3">
                      {[
                        { icon: 'M5 10l7-7m0 0l7 7m-7-7v18', label: 'Send' },
                        { icon: 'M19 14l-7 7m0 0l-7-7m7 7V3', label: 'Receive' },
                        { icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', label: 'Swap' },
                      ].map((action) => (
                        <button
                          key={action.label}
                          className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-white/5 p-3 transition-colors hover:bg-white/10"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15">
                            <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-white/70">{action.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Asset List */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-medium text-white/40">Your Assets</p>
                      {[
                        { name: 'Bitcoin', symbol: 'BTC', value: '$16,234', change: '+5.2%', color: 'from-orange-400 to-orange-500' },
                        { name: 'Ethereum', symbol: 'ETH', value: '$7,312', change: '+3.8%', color: 'from-blue-400 to-blue-500' },
                        { name: 'USDC', symbol: 'USDC', value: '$1,286', change: '0.0%', color: 'from-sky-400 to-sky-500' },
                      ].map((asset) => (
                        <div
                          key={asset.symbol}
                          className="flex items-center justify-between rounded-2xl bg-white/5 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${asset.color}`}>
                              <span className="text-xs font-bold text-white">{asset.symbol.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{asset.name}</p>
                              <p className="text-xs text-white/40">{asset.symbol}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-white">{asset.value}</p>
                            <p className={`text-xs ${asset.change.startsWith('+') ? 'text-emerald-400' : 'text-white/40'}`}>
                              {asset.change}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards - Desktop Only */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="card absolute -left-6 top-1/4 hidden p-3 shadow-elevated md:block lg:-left-16"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                    <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Transaction</p>
                    <p className="text-sm font-medium text-gray-900">Complete</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="card absolute -right-6 bottom-1/3 hidden p-3 shadow-elevated md:block lg:-right-14"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10">
                    <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Security</p>
                    <p className="text-sm font-medium text-gray-900">256-bit AES</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
