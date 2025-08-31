// Loading Skeleton Component
const LoadingSkeleton = () => {
  return (
    <div className="h-[85vh] relative overflow-hidden">
      {/* Background tech grid */}
      <div className="absolute inset-0 opacity-20">
        <TechGrid className="absolute top-0 left-0 w-full h-full" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-2 left-2 sm:top-6 sm:left-6 lg:top-10 lg:left-10 w-12 h-12 sm:w-20 sm:h-20 lg:w-32 lg:h-32 opacity-30">
          <CircuitPattern className="w-full h-full animate-pulse" />
        </div>
        <div className="absolute bottom-2 right-2 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-40 lg:h-40 opacity-20">
          <CircuitPattern
            className="w-full h-full animate-spin"
            style={{ animationDuration: "30s" }}
          />
        </div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center p-1 sm:p-2 lg:p-4">
        {/* Main holographic container */}
        <div className="relative w-full max-w-7xl h-full">
          {/* Background holographic frame */}
          <HexagonalFrame className="absolute inset-0 w-full h-full opacity-60" />

          {/* Main content container */}
          <div className="relative bg-gradient-to-br opacity-90 from-black/90 via-gray-900/80 to-black/90 backdrop-blur-sm border border-teal-500/50 rounded-lg overflow-hidden h-full flex flex-col">
            {/* Top header skeleton */}
            <div className="relative h-10 sm:h-12 lg:h-16 bg-gradient-to-r from-teal-500/10 to-teal-600/20 border-b border-teal-500/50 flex-shrink-0">
              <div className="relative z-10 flex items-center justify-between px-2 sm:px-4 lg:px-6 h-full">
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                  <div className="h-4 w-20 bg-teal-300/20 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 bg-teal-300/20 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left panel skeleton */}
              <div className="relative w-48 sm:w-56 lg:w-80 p-2 sm:p-4 lg:p-6 border-r border-teal-500/30 hidden md:flex md:flex-col">
                {/* Hints Section Skeleton */}
                <div className="relative flex-1 flex flex-col mb-3">
                  <div className="text-center mb-4 flex-shrink-0">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 animate-pulse" />
                      <div className="text-lg sm:text-xl font-bold text-teal-400">
                        Hints
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1">
                    <div className="space-y-2">
                      {[1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className="relative p-3 border border-gray-600/30 bg-gray-800/20 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-gray-500/30 rounded animate-pulse"></div>
                              <div className="h-4 w-16 bg-gray-500/30 rounded animate-pulse"></div>
                            </div>
                            <div className="h-3 w-12 bg-gray-500/30 rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
                  <div className="flex justify-center items-center gap-2 text-xs sm:text-sm">
                    <Coins className="w-3 h-3 text-yellow-400 animate-pulse" />
                    <span className="text-gray-300">Score:</span>
                    <div className="h-4 w-12 bg-teal-400/20 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-xs sm:text-sm">
                    <span className="text-gray-300">Attempts:</span>
                    <div className="h-4 w-8 bg-teal-400/20 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Center main display skeleton */}
              <div className="flex-1 p-2 sm:p-4 lg:p-8 overflow-hidden flex flex-col">
                {/* Main title skeleton */}
                <div className="relative mb-3 sm:mb-4 lg:mb-6 flex-shrink-0">
                  <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 via-teal-400/20 to-teal-500/10 rounded-lg blur-lg"></div>
                  <div className="relative">
                    <div className="h-8 sm:h-10 md:h-12 lg:h-16 w-3/4 mx-auto bg-teal-400/20 rounded animate-pulse mb-1 sm:mb-2"></div>
                    <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-transparent rounded-full animate-pulse"></div>
                    <div className="h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent mt-1 animate-pulse"></div>
                  </div>
                </div>

                <div className="h-4 w-24 bg-teal-400/20 rounded animate-pulse mb-1 sm:mb-2"></div>

                <div className="flex-1 overflow-hidden">
                  <div className="rounded-md border border-teal-300/20 backdrop-blur-md bg-teal-300/5 h-full p-4">
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-teal-300/20 rounded animate-pulse"></div>
                      <div className="h-4 w-5/6 bg-teal-300/20 rounded animate-pulse"></div>
                      <div className="h-4 w-4/5 bg-teal-300/20 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-teal-300/20 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-teal-300/20 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right panel skeleton */}
              <div className="w-40 sm:w-48 lg:w-64 p-2 sm:p-3 lg:p-6 border-l border-teal-500/30 bg-gradient-to-b from-teal-500/10 to-black/50">
                <div className="relative space-y-3 sm:space-y-4 lg:space-y-6 h-full flex flex-col">
                  {/* Attachments Section Skeleton */}
                  <div className="relative flex-1 flex flex-col">
                    <div className="text-center mb-4 flex-shrink-0">
                      <div className="flex items-center justify-center gap-2">
                        <Paperclip className="w-5 h-5 text-teal-400 animate-pulse" />
                        <div className="text-lg sm:text-xl font-semibold tracking-wide text-teal-300">
                          Attachments
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1">
                      <div className="text-center p-6 border border-gray-700 rounded-lg bg-gray-900/40">
                        <div className="text-gray-500 font-mono text-sm animate-pulse">
                          Loading attachments...
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Control buttons skeleton */}
                  <div className="space-y-2 sm:space-y-3 flex-shrink-0">
                    <div className="flex justify-center mt-4">
                      <div className="w-full max-w-xs">
                        <div className="w-full p-1 sm:p-1.5 lg:p-2 border border-teal-500/30 rounded bg-black/30">
                          <div className="h-4 w-20 bg-teal-300/20 rounded animate-pulse mx-auto"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-around items-center w-full p-1.5 sm:p-2 lg:p-3 rounded-lg backdrop-blur-md border border-gray-600/30 bg-white/5">
                      <div className="h-4 w-24 bg-gray-500/30 rounded animate-pulse"></div>
                      <div className="w-4 h-4 bg-gray-500/30 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating holographic elements skeleton */}
          <div className="absolute -top-6 sm:-top-8 lg:-top-16 left-1/2 transform -translate-x-1/2">
            <div className="text-teal-400/60 font-mono text-xs sm:text-sm text-center">
              <div className="h-3 w-32 bg-teal-400/20 rounded animate-pulse mx-auto"></div>
              <div className="mt-1 flex justify-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-teal-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 sm:-bottom-8 lg:-bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="text-teal-400/60 font-mono text-xs sm:text-sm text-center">
              <div className="flex justify-center gap-1 mb-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-2 sm:h-3 bg-teal-400 animate-pulse ${
                      i === 3 ? "opacity-100" : "opacity-30"
                    }`}
                  ></div>
                ))}
              </div>
              <div className="h-3 w-40 bg-teal-400/20 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoadingSkeleton;
