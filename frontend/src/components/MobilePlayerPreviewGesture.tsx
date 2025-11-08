import { useEffect, useState } from "react";
import { X, Users, Radio, Music, Play, Volume2, Shuffle, Crown, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface MobilePlayerPreviewGestureProps {
  onDismiss: () => void;
}

const MobilePlayerPreviewGesture = ({ onDismiss }: MobilePlayerPreviewGestureProps) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-advance through steps
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const steps = [
    {
      title: "Create or Join Room",
      description: "Start a room or join with friends using room code",
      highlight: "top",
    },
    {
      title: "Start Live Jam Session",
      description: "Host enables live sync - everyone hears the same thing",
      highlight: "jam",
    },
    {
      title: "Real-Time Playback Sync",
      description: "When host plays, pauses or seeks - everyone syncs instantly",
      highlight: "player",
    },
    {
      title: "View Live Activity",
      description: "See who's listening and what they're playing in real-time",
      highlight: "activity",
    },
    {
      title: "Share Room Code",
      description: "Copy or share the room code to invite more friends",
      highlight: "share",
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="md:hidden fixed inset-0 z-[200] bg-black/98 backdrop-blur-2xl animate-in fade-in duration-500">
      {/* Close button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onDismiss, 300);
        }}
        className="absolute top-6 right-6 z-10 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Content */}
      <div className="h-full flex flex-col items-center justify-center p-4 relative">
        {/* Mock phone frame - Optimized size for content */}
        <div className="relative w-[320px] h-[640px] bg-black rounded-[2.5rem] border-[2px] border-zinc-800/50 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Mock status bar */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm flex items-center justify-between px-6 text-[10px] text-white/60 z-10">
            <span className="font-medium">9:41</span>
            <div className="flex gap-1.5 items-center">
              <Radio className="w-3 h-3" />
              <div className="flex gap-0.5">
                <div className="w-0.5 h-2 bg-white/80 rounded-full"></div>
                <div className="w-0.5 h-2.5 bg-white/80 rounded-full"></div>
                <div className="w-0.5 h-3 bg-white/60 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Mock room interface */}
          <div className="absolute inset-0 top-8 bg-gradient-to-b from-zinc-950 to-black p-4 flex flex-col overflow-hidden">
            {/* AUDORA Header */}
            <div className="flex items-center justify-between mb-5 animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">AUDORA</h1>
              </div>
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-500",
                step === 0 ? "bg-red-500/20 border border-red-500/50 shadow-lg shadow-red-500/20 animate-pulse" : "bg-zinc-800/30"
              )}>
                <Users className="w-3.5 h-3.5 text-white/70" />
                <span className="text-white/70 text-xs font-medium">1</span>
              </div>
            </div>

            {/* Rooms Header */}
            <div className={cn(
              "flex items-center justify-between mb-4 transition-all duration-500",
              step === 0 && "animate-pulse"
            )}>
              <h2 className="text-xl font-bold text-white">Rooms</h2>
              <span className="text-red-500 font-bold text-base">00</span>
            </div>

            {/* Room/Activity Tabs */}
            <div className={cn(
              "flex gap-2 mb-4 p-1 bg-zinc-900/50 rounded-lg border border-white/5",
              step === 3 && "animate-pulse"
            )}>
              <Button
                className={cn(
                  "flex-1 py-2 rounded-md font-medium text-xs transition-all duration-500",
                  step !== 3
                    ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 text-white shadow-sm"
                    : "bg-transparent text-white/50"
                )}
              >
                <Music className="w-3.5 h-3.5 mr-1.5" />
                Room
              </Button>
              <Button
                className={cn(
                  "flex-1 py-2 rounded-md font-medium text-xs transition-all duration-500",
                  step === 3
                    ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 text-white shadow-sm"
                    : "bg-transparent text-white/50"
                )}
              >
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Activity
              </Button>
            </div>

            {/* Step Content with smooth transitions */}
            <div className="flex-1 overflow-y-auto space-y-2.5 animate-fade-in scrollbar-hide">
              {/* Step 0: Create/Join Room */}
              {step === 0 && (
                <div className="space-y-2.5 animate-slide-up">
                  <div className={cn(
                    "bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-red-500/30 rounded-xl p-3.5",
                    "hover:border-red-500/50 transition-all duration-300 shadow-lg shadow-red-500/10"
                  )}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-white/90 text-xs font-semibold">JAM ROOM</span>
                      </div>
                      <span className="text-red-500 text-xs font-bold">00</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-white/60">Room Code: <span className="text-white font-mono">3528</span></span>
                      <Share2 className="w-3.5 h-3.5 text-white/60" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/60 px-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>Members (1)</span>
                  </div>

                  <div className="bg-zinc-800/30 border border-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                        pE
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">pss Expert.</p>
                        <div className="flex items-center gap-1 text-[10px] text-white/50">
                          <Music className="w-2.5 h-2.5" />
                          <span className="truncate">Can You Feel My Heart</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/40">39s ago</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Live Jam Session */}
              {step === 1 && (
                <div className="space-y-2.5 animate-slide-up">
                  <div className={cn(
                    "bg-gradient-to-br from-red-900/30 to-red-950/30 border-2 border-red-500/50 rounded-xl p-3.5",
                    "shadow-2xl shadow-red-500/30 animate-pulse-slow"
                  )}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-white font-semibold text-xs">LIVE JAM SESSION</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="px-2 py-0.5 bg-red-900/50 border border-red-500/50 rounded-md flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 text-red-400" />
                          <span className="text-red-400 text-[9px] font-medium">HOST</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Radio className="w-3 h-3 text-green-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-xs font-medium transition-all">
                      Stop Jam
                    </button>
                  </div>

                  {/* Currently Playing Preview */}
                  <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">Is There Someone Else?</p>
                        <p className="text-white/60 text-[10px] truncate">The Weeknd</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-white/60" />
                        <span className="text-white/60 text-[10px]">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Real-Time Sync with Player */}
              {step === 2 && (
                <div className="space-y-2.5 animate-slide-up">
                  <div className={cn(
                    "bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-500/50 rounded-xl p-3.5",
                    "shadow-lg shadow-red-500/20"
                  )}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-white font-semibold text-xs">LIVE JAM SESSION</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="px-2 py-0.5 bg-red-900/50 border border-red-500/50 rounded-md flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 text-red-400" />
                          <span className="text-red-400 text-[9px] font-medium">HOST</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                          <Radio className="w-3 h-3 text-green-400" />
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs font-medium">
                      Stop Jam
                    </button>
                  </div>

                  {/* Full Mini Player */}
                  <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/10 rounded-xl p-3.5 animate-pulse-slow">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-13 h-13 rounded-md bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center overflow-hidden">
                        <Music className="w-6 h-6 text-white/80" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">Is There Someone Else?</p>
                        <p className="text-white/60 text-xs truncate">The Weeknd</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-white/60" />
                        <span className="text-white/60 text-xs">0</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="h-1 bg-zinc-700/50 rounded-full overflow-hidden">
                        <div className="h-full w-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-progress"></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/50 mt-1">
                        <span>0:00</span>
                        <span>3:00</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-5">
                      <button className="text-white/60 hover:text-white transition-colors">
                        <Shuffle className="w-4 h-4" />
                      </button>
                      <button className="text-white/80 hover:text-white transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/50 hover:scale-105 transition-transform">
                        <Play className="w-4.5 h-4.5 text-white fill-white ml-0.5" />
                      </button>
                      <button className="text-white/80 hover:text-white transition-colors">
                        <Play className="w-4 h-4 rotate-180" />
                      </button>
                      <button className="text-white/60 hover:text-white transition-colors">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Activity Tab with Song Player */}
              {step === 3 && (
                <div className="space-y-2 animate-slide-up">
                  <div className="flex items-center gap-2 text-xs px-2">
                    <Users className="w-3 h-3 text-white/70" />
                    <span className="text-white/90 font-medium">Activity</span>
                    <span className="ml-auto text-green-500 text-[10px] flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      1 in room
                    </span>
                  </div>

                  {/* Room Info Card */}
                  <div className="bg-zinc-800/30 border border-white/5 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-white/90 text-xs font-semibold">JAM ROOM</span>
                      </div>
                      <span className="text-red-500 text-xs font-bold">00</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-white/60">Room Code:</span>
                      <span className="text-white font-mono">3528</span>
                      <button className="ml-auto p-1 hover:bg-white/5 rounded transition-colors">
                        <Share2 className="w-3 h-3 text-white/60" />
                      </button>
                    </div>
                  </div>

                  {/* Live Jam Session Card */}
                  <div className={cn(
                    "bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-500/50 rounded-xl p-2.5",
                    "shadow-lg shadow-red-500/20"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-white font-semibold text-xs">LIVE JAM SESSION</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="px-2 py-0.5 bg-red-900/50 border border-red-500/50 rounded-md flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 text-red-400" />
                          <span className="text-red-400 text-[9px] font-medium">HOST</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Radio className="w-3 h-3 text-green-400 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* Mini Player */}
                    <div className="bg-black/30 rounded-lg p-2 mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-600 to-purple-700"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">Is There Someone Else?</p>
                          <p className="text-white/60 text-[10px] truncate">The Weeknd</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-white/60" />
                          <span className="text-white/60 text-[10px]">0</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-2">
                        <div className="h-0.5 bg-zinc-700/50 rounded-full overflow-hidden">
                          <div className="h-full w-0 bg-gradient-to-r from-red-500 to-pink-500 animate-progress"></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-white/50 mt-0.5">
                          <span>0:00</span>
                          <span>3:00</span>
                        </div>
                      </div>

                      {/* Mini Controls */}
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-white/60">
                          <Shuffle className="w-3 h-3" />
                        </button>
                        <button className="text-white/80">
                          <Play className="w-3 h-3" />
                        </button>
                        <button className="w-7 h-7 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                          <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                        </button>
                        <button className="text-white/80">
                          <Play className="w-3 h-3 rotate-180" />
                        </button>
                        <button className="text-white/60">
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button className="w-full py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs font-medium">
                      Stop Jam
                    </button>
                  </div>

                  {/* Members List */}
                  <div className="bg-zinc-800/30 border border-white/5 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                        pE
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-medium">pss.</p>
                        <p className="text-white/50 text-[10px]">In your room • now</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-1.5 pl-10">
                      <Music className="w-2.5 h-2.5 text-white/50" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white/70 text-[10px] truncate">Can You Feel My Heart</p>
                        <p className="text-white/50 text-[9px] truncate">by Bring Me The Horizon</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Share Room Code */}
              {step === 4 && (
                <div className="space-y-2 animate-slide-up">
                  <div className={cn(
                    "bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border-2 border-blue-500/50 rounded-lg p-3",
                    "shadow-2xl shadow-blue-500/30 animate-pulse-slow"
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-white/90 text-xs font-semibold">JAM ROOM</span>
                      </div>
                      <span className="text-blue-500 text-xs font-bold">00</span>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-3 mb-3">
                      <div className="text-center mb-2">
                        <p className="text-white/60 text-[10px] mb-1">Room Code</p>
                        <p className="text-white text-2xl font-bold font-mono tracking-wider">3528</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-400 text-xs font-medium transition-all flex items-center justify-center gap-1.5">
                        <Share2 className="w-3 h-3" />
                        Copy
                      </button>
                      <button className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-400 text-xs font-medium transition-all flex items-center justify-center gap-1.5">
                        <Share2 className="w-3 h-3" />
                        Share
                      </button>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-white/60 text-xs mb-1">Invite friends to join!</p>
                    <p className="text-white/40 text-[10px]">Share the code to listen together</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Mini Player (only show on step 0,1,4) */}
          {(step === 0 || step === 1 || step === 4) && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 to-transparent backdrop-blur-sm">
              <div className="bg-zinc-900/90 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="w-11 h-11 rounded bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                  <Music className="w-5 h-5 text-white/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">Is There Someone Else?</p>
                  <p className="text-white/60 text-[10px] truncate">The Weeknd</p>
                </div>
                <button className="w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/50">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </button>
                <button className="text-white/60">
                  <Play className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instruction text - Smaller and cleaner */}
        <div className="mt-6 text-center space-y-2 max-w-[300px] px-4">
          <h3 className="text-lg font-bold text-white animate-fade-in">
            {currentStep.title}
          </h3>
          <p className="text-xs text-zinc-400 animate-fade-in leading-relaxed">
            {currentStep.description}
          </p>
          
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 pt-3">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500 ease-out",
                  idx === step 
                    ? "w-6 bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/50" 
                    : "w-1.5 bg-white/20 hover:bg-white/40 hover:w-3"
                )}
              />
            ))}
          </div>

          {/* Skip button */}
          <Button
            variant="ghost"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="text-zinc-400 hover:text-white hover:bg-white/5 mt-3 text-xs"
          >
            Skip Tutorial
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-progress {
          animation: progress 3s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        /* Hide scrollbar */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default MobilePlayerPreviewGesture;
