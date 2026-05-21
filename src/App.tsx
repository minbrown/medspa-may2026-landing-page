import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import auraMedspaDemo from './assets/images/aura_medspa_demo_1779310747950.png';
import dermabrasionBefore from './assets/images/dermabrasion_before_1779321010455.png';
import dermabrasionAfter from './assets/images/dermabrasion_after_1779321030371.png';
import instagramAesthetic from './assets/images/instagram_aesthetic.png';
import echoVoiceLabsLogoSteel from './assets/images/echo_voice_labs-logo_steel.png';
import { 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Phone, 
  MessageSquare, 
  Play, 
  Pause, 
  X, 
  Mail, 
  Globe, 
  Clock, 
  Star, 
  Instagram, 
  Facebook, 
  ArrowRight,
  MousePointer,
  HelpCircle,
  TrendingDown,
  Layers,
  HeartHandshake,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

function ScrollReveal({ children, delay = 0, duration = 0.5 }: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  // Global & Section Specific States
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [spotsRemaining, setSpotsRemaining] = useState(7);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [socialAddon, setSocialAddon] = useState(false);
  const [showAuraDemo, setShowAuraDemo] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'managed' | 'onetime'>('managed');
  const [showCheckout, setShowCheckout] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Hero section Video Player States
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(23); // 23 seconds based on user request
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPoster, setVideoPoster] = useState("/claire_video_thumbnail.png");

  // Subtitle synchronization for Claire's pitch video
  const subtitles = [
    { start: 0, end: 4, text: "You just experienced me, an AI agent answering calls, booking appointments..." },
    { start: 4, end: 7, text: "...and never missing a lead. Echo Voice Labs builds that too." },
    { start: 7, end: 12, text: "But first, let's get your website looking like it belongs to a luxury brand." },
    { start: 12, end: 15, text: "5 pages, 1 week, starting at $499." },
    { start: 15, end: 19, text: "Just scroll down, claim your spot." },
    { start: 19, end: 23, text: "Your new site could be live by next week!" }
  ];

  const getActiveSubtitle = () => {
    const subtitle = subtitles.find(s => videoCurrentTime >= s.start && videoCurrentTime < s.end);
    return subtitle ? subtitle.text : "";
  };

  // Video interaction functions
  const toggleVideoPlay = () => {
    if (videoError) {
      setVideoPlaying(!videoPlaying);
      return;
    }
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
        setVideoPlaying(false);
      } else {
        // Explicitly unmute video on play trigger to address missing audio issues
        videoRef.current.muted = false;
        setVideoMuted(false);
        videoRef.current.play()
          .then(() => setVideoPlaying(true))
          .catch((err) => {
            console.log("Browser blocked play context: ", err);
            // Simulated play if actual video doesn't run or is blocked
            setVideoPlaying(true);
          });
      }
    } else {
      setVideoPlaying(!videoPlaying);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoMuted;
      setVideoMuted(!videoMuted);
    } else {
      setVideoMuted(!videoMuted);
    }
  };

  const restartVideo = () => {
    if (videoError) {
      setVideoCurrentTime(0);
      setVideoProgress(0);
      setVideoPlaying(true);
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setVideoPlaying(true));
    } else {
      setVideoCurrentTime(0);
      setVideoProgress(0);
      setVideoPlaying(true);
    }
  };

  // Automated timer effect for fallback mode
  useEffect(() => {
    let interval: any;
    if (videoPlaying && (!videoRef.current || videoError)) {
      interval = setInterval(() => {
        setVideoCurrentTime((prev) => {
          const next = prev + 0.25;
          if (next >= 23) {
            setVideoPlaying(false);
            setVideoProgress(0);
            return 0;
          }
          setVideoProgress((next / 23) * 100);
          return next;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [videoPlaying, videoError]);

  // ROI Calculator States
  const [ticketPrice, setTicketPrice] = useState(250); // average ticket price
  const [lostBookings, setLostBookings] = useState(3);  // bookings lost/week
  const [lostReferrals, setLostReferrals] = useState(2); // referrals lost/month
  const [manualHours, setManualHours] = useState(2);     // hours/week wasted

  // Aura Spa Preview specific state
  const [auraBeforeAfter, setAuraBeforeAfter] = useState(50); // slider percent

  // Simulate Claire's Voice Intro progress
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setVoiceProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1.25; // simulates a 15-second tracking progress
        });
      }, 180);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Testimonial Slider Data
  const testimonials = [
    {
      name: "Dr. Sarah Mercer, DNP",
      title: "Founder, Aura Aesthetics",
      initials: "AA",
      quote: "Echo Voice Labs completely transformed our online presence. Our old Squarespace site felt clinical and slow—now, patients tell us how beautiful the booking flow is before they even set foot in our studio! Truly ready in days."
    },
    {
      name: "Kari Sterling, LME",
      title: "Director, Glow Skin Lounge",
      initials: "GS",
      quote: "I didn't think a redesign in a week was possible, but they exceeded every expectation. Our monthly organic bookings increased by 22% in the first thirty days because our service options are finally clear and mobile-friendly."
    },
    {
      name: "Dr. Marcus Vane",
      title: "Chief Medical Officer, Vane Medical Spa",
      initials: "VM",
      quote: "The premium design matches the luxury experience we deliver. Seamlessly integrated with our booking engine without altering any client schedules. Outstanding service, fast delivery, and clear communication."
    },
    {
      name: "Jessica Ahn",
      title: "Owner, Silk & Lash Bar",
      initials: "SL",
      quote: "We were losing so many potential referrals who couldn't find our service menu or booking buttons properly. This new site makes booking effortless, looks sleek, and runs incredibly fast on mobile."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Calculations for ROI Calculator
  const WEEKS_PER_MONTH = 4.33;
  const lostRegularMonthly = lostBookings * ticketPrice * WEEKS_PER_MONTH;
  const lostReferralMonthly = lostReferrals * ticketPrice;
  const totalMonthlyLost = lostRegularMonthly + lostReferralMonthly;
  const monthlyHoursBack = Math.round(manualHours * WEEKS_PER_MONTH);
  const annualLostNum = totalMonthlyLost * 12;
  const netGain = Math.max(0, totalMonthlyLost - 97); // Managed plan comparison

  // Handle Application Submit (Simulated)
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedApplication(true);
    // Lower the remaining spots as real-time feedback
    if (spotsRemaining > 1) {
      setSpotsRemaining(prev => prev - 1);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-brand-lightgray/30 text-brand-navy antialiased font-sans relative">
      {/* BACKGROUND GRAPHIC SYSTEM */}
      <div className="absolute inset-0 bg-radial-[circle_at_top_right] from-brand-lavender/5 via-transparent to-transparent pointer-events-none z-0" />

      {/* HEADER / NAVIGATION */}
      <nav id="nav-header" className="relative z-50 bg-brand-navy border-b border-white/10 px-6 py-4 md:px-12 flex justify-between items-center">
        <a href="#hero" className="flex items-center">
          <img 
            src={echoVoiceLabsLogoSteel} 
            alt="Echo Voice Labs Logo" 
            className="h-10 md:h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            referrerPolicy="no-referrer"
          />
        </a>
        <div className="flex items-center gap-4">
          <a 
            href="tel:+18882919192" 
            className="flex items-center gap-2 bg-brand-burnt text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-full transition-all duration-300 hover:bg-brand-orange hover:-translate-y-0.5 shadow-md shadow-brand-burnt/20"
          >
            <Phone size={14} className="animate-pulse" />
            <span className="hidden sm:inline">Call us:</span> 888-291-9192
          </a>
        </div>
      </nav>

      {/* SECTION 1 — HERO */}
      <header id="hero" className="relative z-10 px-6 py-12 md:px-12 md:py-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-center">
        {/* Left Column (2/3 width on large) */}
        <motion.div 
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/20 text-brand-burnt text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={12} className="text-brand-orange" />
            <span>Founding Member Offer — Limited to 10 Spots</span>
          </div>
          
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brand-navy leading-[1.08] tracking-tight">
            Your Website Should Look as <span className="text-brand-lavender underline decoration-brand-lavender/30">Good</span> as Your Work Does
          </h1>
          
          <p className="text-lg text-brand-navy/70 border-l-4 border-brand-orange pl-4 max-w-2xl font-light">
            We redesign premium med spa and beauty studio websites that turn first impressions into booked appointments — <span className="font-semibold text-brand-navy">in about a week</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href="#pricing" 
              className="px-8 py-4 rounded-xl bg-brand-burnt text-white font-bold text-center transition-all duration-300 hover:bg-brand-orange hover:-translate-y-0.5 shadow-lg shadow-brand-burnt/15"
            >
              See Pricing & Claim Your Spot
            </a>
            <button 
              onClick={() => {
                setShowAuraDemo(true);
                document.getElementById('aurademo')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl bg-white text-brand-navy border border-brand-navy/15 font-semibold text-center transition-all duration-300 hover:border-brand-lavender hover:bg-brand-lavender/5"
            >
              See a Live Example →
            </button>
          </div>

          <div className="pt-8 border-t border-brand-navy/10 flex flex-wrap gap-x-8 gap-y-3">
            <span className="flex items-center gap-2 text-xs md:text-sm text-brand-navy/70">
              <Check size={16} className="text-brand-orange" /> Beautiful, responsive layouts
            </span>
            <span className="flex items-center gap-2 text-xs md:text-sm text-brand-navy/70">
              <Check size={16} className="text-brand-orange" /> Booking system untouched
            </span>
            <span className="flex items-center gap-2 text-xs md:text-sm text-brand-navy/70">
              <Check size={16} className="text-brand-orange" /> Ready in under 10 days
            </span>
          </div>
        </motion.div>

        {/* Right Column (1/3 width, holding the 9:16 Claire pitch video) */}
        <motion.div 
          className="md:col-span-1 w-full flex justify-center"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative aspect-[9/16] w-full max-w-[320px] md:max-w-[350px] rounded-3xl overflow-hidden bg-brand-navy shadow-2xl border border-brand-navy/10 hover:border-brand-orange/30 transition-all duration-300 group flex flex-col justify-between">
            
            {/* Always display Claire's thumbnail as the ultimate back canvas (even when loading or fallback is active) */}
            <img 
              src={videoPoster} 
              onError={() => {
                setVideoPoster(instagramAesthetic);
              }}
              alt="Claire Representative Video Presentation Poster" 
              className="absolute inset-0 w-full h-full object-cover z-0"
              referrerPolicy="no-referrer"
            />

            {/* The Video Element (Only rendered if no error, but hidden if an error is detected to allow simulation play fallback) */}
            {!videoError && (
              <video
                ref={videoRef}
                src="claire_video.mp4"
                poster={videoPoster}
                playsInline
                muted={videoMuted}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setVideoCurrentTime(videoRef.current.currentTime);
                    setVideoProgress((videoRef.current.currentTime / (videoRef.current.duration || 23)) * 100);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setVideoDuration(videoRef.current.duration || 23);
                  }
                }}
                onEnded={() => {
                  setVideoPlaying(false);
                  setVideoProgress(0);
                  setVideoCurrentTime(0);
                }}
                onError={() => {
                  setVideoError(true);
                }}
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{ display: videoPlaying ? 'block' : 'none' }}
              />
            )}

            {/* Dynamic AI Voice Wave Visualizer Overlay (shown overlaying Claire's image during simulated or regular play) */}
            {videoPlaying && (
              <div className="absolute inset-0 flex flex-col justify-end pb-24 z-10 pointer-events-none transition-all duration-300">
                {/* Visualizer glowing pulse ripple circles */}
                <div className="absolute inset-0 flex items-center justify-center opacity-80 overflow-hidden">
                  <div className="w-[180px] h-[180px] rounded-full border-2 border-brand-orange/20 animate-ping absolute opacity-30" />
                  <div className="w-[120px] h-[120px] rounded-full border border-brand-lavender/30 animate-pulse absolute opacity-45" />
                  <div className="w-[70px] h-[70px] rounded-full bg-brand-orange/10 animate-pulse absolute opacity-20" />
                </div>
                
                {/* Animated vocal frequency bands representation */}
                <div className="relative z-10 w-full flex justify-center items-end gap-1.5 h-16 px-6">
                  <div className="w-1 bg-brand-orange rounded-full origin-bottom animate-wave-1 h-8 opacity-75" />
                  <div className="w-1 bg-white rounded-full origin-bottom animate-wave-4 h-12 opacity-95" />
                  <div className="w-1 bg-brand-lavender rounded-full origin-bottom animate-wave-2 h-6 opacity-85" />
                  <div className="w-1 bg-brand-orange rounded-full origin-bottom animate-wave-5 h-10 opacity-90" />
                  <div className="w-1 bg-white rounded-full origin-bottom animate-wave-3 h-14 opacity-100" />
                  <div className="w-1 bg-brand-lavender rounded-full origin-bottom animate-wave-2 h-7 opacity-85" />
                  <div className="w-1 bg-brand-orange rounded-full origin-bottom animate-wave-4 h-11 opacity-80" />
                  <div className="w-1 bg-white rounded-full origin-bottom animate-wave-1 h-5 opacity-90" />
                  <div className="w-1 bg-brand-lavender rounded-full origin-bottom animate-wave-3 h-9 opacity-75" />
                </div>
                <div className="text-center text-[9px] font-mono tracking-widest text-brand-orange uppercase opacity-85 mt-2">
                  Voice Stream Active
                </div>
              </div>
            )}

            {/* HEADER OVERLAY: Title and Pill Tags (Softened transparent black overlays let video shine clearly) */}
            <div className="relative z-10 p-4 bg-gradient-to-b from-black/75 via-black/15 to-transparent flex justify-between items-start pointer-events-none">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-burnt/35 backdrop-blur-md border border-brand-orange/20 text-white text-[9px] font-mono uppercase tracking-wider font-bold">
                  {/* Changed green to bright blue as requested */}
                  <span className={`w-1.5 h-1.5 rounded-full bg-[#7C8BC4] ${videoPlaying ? 'animate-pulse' : ''}`} />
                  <span>Interactive Pitch</span>
                </span>
                <p className="text-[10px] text-white/70 font-mono ml-0.5">Claire (AI Rep)</p>
              </div>

              <span className="px-2 py-0.5 rounded bg-black/50 text-white/90 font-mono text-[9px] backdrop-blur-md border border-white/5">
                0:23
              </span>
            </div>

            {/* CENTER OVERLAY: Big Play Trigger (visible when video is paused) */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              {!videoPlaying && (
                <button
                  type="button"
                  onClick={toggleVideoPlay}
                  className="pointer-events-auto w-16 h-16 rounded-full bg-white/20 hover:bg-brand-lavender text-white backdrop-blur-lg border border-white/30 hover:border-brand-lavender flex items-center justify-center transition-all duration-300 transform scale-100 hover:scale-110 active:scale-95 shadow-2xl hover:shadow-brand-orange/25"
                  aria-label="Play introduction video"
                >
                  <Play size={28} className="fill-current text-white ml-1" />
                </button>
              )}
            </div>

            {/* BOTTOM CONTROLS & SUBTITLE CONTAINER (Softened transparent black offsets let video shine clearly) */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black/85 via-black/30 to-transparent space-y-3">
              
              {/* Synchronized Subtitle Area (gorgeous translucent ribbon) */}
              {videoPlaying && (
                <div className="px-3 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-center min-h-[50px] flex items-center justify-center">
                  <p className="text-white text-[11px] leading-relaxed font-light tracking-wide italic">
                    "{getActiveSubtitle()}"
                  </p>
                </div>
              )}

              {/* Action row */}
              <div className="space-y-2">
                {/* Progress bar info */}
                <div className="space-y-1">
                  <div className="relative h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                    <div 
                      className="absolute top-0 left-0 h-full bg-brand-lavender transition-all duration-150"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-white/50 font-mono">
                    <span>
                      0:{Math.floor(videoCurrentTime) < 10 ? `0${Math.floor(videoCurrentTime)}` : Math.floor(videoCurrentTime)}
                    </span>
                    <span>0:23</span>
                  </div>
                </div>

                {/* Control bar buttons */}
                <div className="flex justify-between items-center bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/5">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={toggleVideoPlay}
                      className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
                      aria-label={videoPlaying ? "Pause video" : "Play video"}
                    >
                      {videoPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current ml-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={restartVideo}
                      className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Restart video"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-white/60 font-semibold uppercase tracking-wider">
                    Claire AI voice over
                  </span>

                  <button
                    type="button"
                    onClick={toggleVideoMute}
                    className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label={videoMuted ? "Unmute video" : "Mute video"}
                  >
                    {videoMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </header>

      {/* SECTION 2 — SOCIAL PROOF / CREDIBILITY BAR */}
      <section id="credibility" className="relative bg-brand-navy py-16 text-white border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <span className="text-brand-orange font-bold uppercase tracking-widest text-xs md:text-sm">What we build looks like this</span>
            <div className="hidden md:block w-12 h-[1px] bg-white/20" />
            <span className="text-white/60 text-xs sm:text-sm">This is a live demo of our work. Every site we build is designed to this standard.</span>
          </div>

          {/* Clickable Browser Mockup of Aura Spa */}
          <div className="max-w-4xl mx-auto group">
            <div 
              className="w-full text-left block bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative transition-all duration-500 hover:border-brand-lavender/40"
            >
              {/* Browser window top bar decoration */}
              <div className="bg-brand-navy border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <div className="bg-white/10 text-[10px] text-brand-lightblue px-12 py-1 rounded font-mono truncate max-w-xs sm:max-w-md">
                  demo.auramedspa.com
                </div>
                <a 
                  href="https://medspa-g531ky5on-echovoicelabs-projects.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand-orange hover:bg-brand-burnt text-white text-[10px] font-mono px-3 py-1 rounded transition-all flex items-center gap-1.5 cursor-pointer font-bold shadow-sm"
                >
                  <span>Live Site ↗</span>
                </a>
              </div>

              {/* Simulated Aura Spa page image with Ken Burns effect */}
              <div className="aspect-[16/9] bg-brand-navy relative overflow-hidden flex flex-col justify-between">
                
                {/* The Ken Burns Image layer */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img 
                    src={auraMedspaDemo} 
                    alt="Aura MedSpa Premium Website Design Build" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover animate-kenburns scale-100 group-hover:animate-none"
                  />
                  {/* Subtle translucent premium overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/30 to-black/10" />
                </div>

                {/* Overlaid UI components on top of the Ken Burns image */}
                <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy/90 backdrop-blur-md border border-white/15 text-white text-[10px] uppercase tracking-wider font-semibold font-mono shadow-md">
                      {/* Changed green to bright blue as requested */}
                      <span className="w-2 h-2 rounded-full bg-[#7C8BC4] animate-pulse" />
                      Live Custom Demo
                    </span>
                    
                    <span className="px-3 py-1 rounded-full bg-black/60 text-brand-orange text-[10px] font-bold uppercase tracking-wider border border-white/5 shadow-md">
                      ESTHETICS PREMIUM STANDARD
                    </span>
                  </div>

                  {/* Centered Premium Glassmorphic Control Overlay */}
                  <div className="text-center space-y-4 max-w-md mx-auto my-auto py-4 bg-black/25 p-6 rounded-2xl border border-white/5 backdrop-blur-[2px]">
                    <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white drop-shadow-md">
                      Aura Medical Aesthetics
                    </h3>
                    <p className="text-xs text-white/90 leading-relaxed max-w-sm mx-auto drop-shadow-sm font-light">
                      A masterpiece custom medspa layout delivering booking conversions, gorgeous skin treatment galleries, and responsive interactions.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      {/* Direct Live Link Button */}
                      <a 
                        href="https://medspa-g531ky5on-echovoicelabs-projects.vercel.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-brand-orange hover:bg-brand-burnt text-white rounded-full font-display font-bold text-xs tracking-wider uppercase shadow-xl hover:shadow-brand-orange/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer border border-brand-orange"
                      >
                        <span>Launch Live Website ↗</span>
                      </a>

                      {/* Interactive Sandbox Toggle Button */}
                      <button 
                        type="button"
                        onClick={() => {
                          setShowAuraDemo(true);
                          setTimeout(() => {
                            document.getElementById('aurademo')?.scrollIntoView({ behavior: 'smooth' });
                          }, 150);
                        }}
                        className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full font-display font-medium text-xs tracking-wider uppercase backdrop-blur-md border border-white/25 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                      >
                        <span>Open Local Sandbox ✦</span>
                      </button>
                    </div>
                  </div>

                  {/* Footer metadata band */}
                  <div className="text-center text-[10px] tracking-widest font-mono uppercase text-white/50 pt-2 border-t border-white/10 pointer-events-none">
                    Hover image to freeze pan • Click button to operate
                  </div>
                </div>

              </div>
            </div>
            <p className="mt-3 text-xs text-brand-lightblue font-mono italic">
              *Designed specifically for aesthetics practitioners. Click buttons above to open the live standard or expand the local calendar sandbox.
            </p>
          </div>
        </div>
      </section>

      {/* DETAILED SANDBOX VIEW: AURA SPA LIVE EXPERIENCE */}
      <AnimatePresence>
        {showAuraDemo && (
          <motion.section 
            id="aurademo" 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-[#e3e3e3] border-b border-brand-navy/10 py-16 scroll-mt-6 overflow-hidden"
          >
          <div className="max-w-5xl mx-auto px-6 space-y-12">
            <div className="flex justify-between items-end border-b border-brand-navy/10 pb-6">
              <div>
                <span className="text-xs font-mono text-brand-lavender uppercase tracking-widest font-bold">Interactive Sandbox</span>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-navy mt-1">Aura Med Spa — Demo Experience</h2>
                <p className="text-sm text-brand-navy/60 mt-1">This represents the high-fidelity coding speed, aesthetic detail, and booking integrations of the sites we deliver.</p>
              </div>
              <button 
                onClick={() => setShowAuraDemo(false)}
                className="p-2 hover:bg-brand-navy/5 text-brand-navy rounded-full transition-colors"
                title="Minimize Demo"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Demo Section 1: Features & Pricing Menu */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-brand-navy/5 shadow-md">
                  <h3 className="font-display font-bold text-lg text-brand-navy border-b border-brand-navy/5 pb-3">Treatment Selection</h3>
                  <div className="divide-y divide-brand-navy/5 text-sm">
                    <div className="py-3.5 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-brand-navy block">Neuromodulators (Botox & Dysport)</span>
                        <span className="text-xs text-brand-navy/50">Smooths forehead creases, crow's feet, frown lines.</span>
                      </div>
                      <span className="font-mono font-bold text-brand-burnt text-right">$12 / unit</span>
                    </div>
                    <div className="py-3.5 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-brand-navy block">Dermal Lip Fillers (Restylane Kysse)</span>
                        <span className="text-xs text-brand-navy/50">Restores youthful lip cushion volume & clean borders.</span>
                      </div>
                      <span className="font-mono font-bold text-brand-burnt text-right">$650 / syringe</span>
                    </div>
                    <div className="py-3.5 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-brand-navy block">Medical Grade Facial Infusions</span>
                        <span className="text-xs text-brand-navy/50">Hydradermabrasion cleanse, chemical peel extraction.</span>
                      </div>
                      <span className="font-mono font-bold text-brand-burnt text-right">$175 / session</span>
                    </div>
                    <div className="py-3.5 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-brand-navy block">InMode Morpheus8 RF Microneedling</span>
                        <span className="text-xs text-brand-navy/50">Fractional remodeling subcutaneous deep fat layers.</span>
                      </div>
                      <span className="font-mono font-bold text-brand-burnt text-right">$350 / treatment</span>
                    </div>
                  </div>
                </div>

                {/* Demo Section 2: Before & After comparison slider */}
                <div className="bg-white p-6 rounded-2xl border border-brand-navy/5 shadow-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-bold text-md text-brand-navy">Clinical Results Comparison</h3>
                    <span className="text-xs font-mono text-brand-lavender font-bold">Interactive Slider</span>
                  </div>
                  <p className="text-xs text-brand-navy/60">Drag the slider below to contrast real Patient Results before and 14 days after a Clinical Dermabrasion skin resurfacing treatment.</p>
                  
                  {/* Interactive Slider box with real images */}
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-brand-navy/5 select-none shadow-md">
                    {/* Before Image (Background) */}
                    <img 
                      src={dermabrasionBefore} 
                      alt="Skin profile before Clinical Dermabrasion treatment" 
                      className="absolute inset-0 w-full h-full object-cover z-0"
                      referrerPolicy="no-referrer"
                    />

                    {/* After Image with sliding clipPath */}
                    <img 
                      src={dermabrasionAfter} 
                      alt="Skin profile after Clinical Dermabrasion treatment" 
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      referrerPolicy="no-referrer"
                      style={{
                        clipPath: `polygon(0 0, ${auraBeforeAfter}% 0, ${auraBeforeAfter}% 100%, 0 100%)`
                      }}
                    />

                    {/* Dynamic Separator Line with custom drag indicator handle bubble */}
                    <div 
                      className="absolute inset-y-0 w-[3px] bg-brand-orange z-20 pointer-events-none drop-shadow-[0_0_4px_rgba(242,100,25,0.7)]"
                      style={{ left: `${auraBeforeAfter}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-brand-orange shadow-lg flex items-center justify-center">
                        <div className="flex gap-0.5 items-center justify-center">
                          <ChevronLeft size={11} className="text-brand-orange -mr-1" />
                          <ChevronRight size={11} className="text-brand-orange -ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Left/Right floating badges */}
                    <span className="absolute top-3 left-3 bg-black/60 text-white text-[9px] px-2.5 py-1 rounded-md font-mono uppercase tracking-widest z-20 backdrop-blur-sm border border-white/10 select-none">
                      Before
                    </span>
                    <span className="absolute top-3 right-3 bg-brand-navy/85 text-white text-[9px] px-2.5 py-1 rounded-md font-mono uppercase tracking-widest z-20 backdrop-blur-sm border border-white/10 select-none">
                      Dynamic After
                    </span>
                  </div>

                  {/* Range Slider handle */}
                  <input 
                    type="range" 
                    min="5" 
                    max="95" 
                    value={auraBeforeAfter} 
                    onChange={(e) => setAuraBeforeAfter(parseInt(e.target.value))}
                    className="w-full h-2 bg-brand-lightgray rounded-lg appearance-none cursor-pointer accent-brand-orange focus:outline-none" 
                  />
                  <div className="flex justify-between text-[11px] text-brand-navy/55 px-1 font-mono">
                    <span>← Before Treatment</span>
                    <span>After 14 Days →</span>
                  </div>
                </div>
              </div>

              {/* Demo Section 3: Mock booking widget inside Aura */}
              <div className="space-y-6">
                <div className="bg-brand-navy text-white p-6 rounded-2xl border border-white/5 shadow-xl">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange block mb-1">Aura Integration</span>
                  <h3 className="font-display font-medium text-lg text-white">Embed Code Demo</h3>
                  <p className="text-xs text-white/60 leading-relaxed mt-2 mb-4">
                    Your vagaro, Acuity, or Booker link is dropped right into a sleek custom matching wrapper. Guests stay on your site, driving conversions.
                  </p>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3 text-xs">
                    <div className="flex justify-between items-center text-[10px] text-brand-lightblue font-mono border-b border-white/10 pb-2">
                      <span>BOOK APPOINTMENT</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-mono mb-1">Select Practitioner</label>
                      <select className="w-full bg-white/10 border border-white/10 rounded px-2.5 py-1.5 text-white text-xs outline-none focus:border-brand-lavender">
                        <option className="bg-brand-navy text-white">Dr. Sarah Mercer, DNP</option>
                        <option className="bg-brand-navy text-white">Claire Collins, Aesthetician</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-mono mb-1">Clinic Datetime</label>
                      <div className="grid grid-cols-2 gap-2 font-mono">
                        <div className="bg-white/10 border border-white/10 rounded p-1.5 text-center text-[11px]">May 21 (Thu)</div>
                        <div className="bg-white/10 border border-white/10 rounded p-1.5 text-center text-[11px]">2:30 PM</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("This is a simulated demo element! In your actual site, customers will book directly through your custom scheduling link.")}
                      className="w-full bg-brand-orange hover:bg-brand-burnt text-white font-bold py-2 rounded-lg text-xs tracking-wider uppercase mt-2 transition-colors"
                    >
                      Verify Appointment Request
                    </button>
                  </div>
                </div>

                <div className="bg-brand-lavender/10 border-l-4 border-brand-lavender p-4 rounded-r-xl">
                  <h4 className="font-bold text-xs text-brand-navy tracking-tight">The Redesign Strategy</h4>
                  <p className="text-xs text-brand-navy/70 mt-1 leading-relaxed">
                    Echo Voice Labs builds for extreme visual focus. No unnecessary links, no visual clutter—just immediate credibility leading to bookings in under 1 week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>

      {/* SECTION 3 — THE PROBLEM & INTERACTIVE COST CALCULATOR */}
      <section id="problem" className="relative px-6 py-16 md:px-12 bg-white border-b border-brand-navy/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <ScrollReveal>
            <div className="text-center lg:text-left">
              <span className="text-xs font-mono font-bold tracking-widest text-brand-burnt uppercase">Sound Familiar?</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy mt-1">Your Instagram is stunning. Your website is... not.</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Image / Quote side (Left 5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
              <ScrollReveal delay={0.15}>
                <div className="relative rounded-2xl overflow-hidden bg-brand-navy shadow-xl group border border-brand-navy/10 hover:border-brand-orange/20 transition-all duration-300 max-w-sm mx-auto lg:mx-0">
                  {/* Visual practitioner image representing stunning aesthetic */}
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img 
                      src={instagramAesthetic} 
                      alt="Premium clinic practitioner representing your stunning Instagram aesthetic" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/20 to-transparent" />
                    <span className="absolute top-4 left-4 bg-brand-burnt/90 backdrop-blur-md text-brand-orange font-bold font-mono text-[9px] px-3 py-1 rounded-full border border-brand-orange/20 tracking-wider">
                      INSTAGRAM AESTHETIC STANDARD
                    </span>
                  </div>
                
                {/* Quote part */}
                <div className="p-6 text-white space-y-3">
                  <blockquote className="font-display text-sm italic text-white/90 leading-relaxed font-light">
                    "I can't stop treating clients to answer the phone or update the website. So I just don't. And I know I'm losing bookings every day."
                  </blockquote>
                  <cite className="block text-[10px] font-mono text-brand-orange uppercase tracking-widest font-semibold not-italic">
                    — Every beauty clinic owner, ever
                  </cite>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Inclusions / Loss bullets + body (Right 7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <ScrollReveal delay={0.2}>
              <div className="space-y-4 text-base text-brand-navy/70 leading-relaxed">
                <p>
                  Most med spa and beauty studio owners we talk to have the same story. They built their website years ago on Squarespace or Wix, meant to update it, and never did. Meanwhile their Instagram looks incredible — and their website sends potential clients running.
                </p>
                <p className="font-semibold text-brand-navy">
                  Here's what an outdated websitel is actually costing your studio:
                </p>
              </div>

              {/* Losses Grid List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-brand-navy/10">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-brand-burnt flex-shrink-0 font-display font-black">01</div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">Lost bookings</h4>
                    <p className="text-xs text-brand-navy/60 mt-1">Visitors bounce in seconds if the interface looks slow or untrustworthy.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-brand-burnt flex-shrink-0 font-display font-black">02</div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">Lost credibility</h4>
                    <p className="text-xs text-brand-navy/60 mt-1">Your injections are hyper-premium. Your online storefront should match.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-brand-burnt flex-shrink-0 font-display font-black">03</div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">Lost referrals</h4>
                    <p className="text-xs text-brand-navy/60 mt-1">Clients check your domain before recommending you on group chats.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-brand-burnt flex-shrink-0 font-display font-black">04</div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">Lost search ranks</h4>
                    <p className="text-xs text-brand-navy/60 mt-1">Google actively buries sluggish, mobile-unfriendly sites.</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-lavender/5 p-5 rounded-2xl border border-brand-lavender/15 font-light text-brand-navy/80">
                You don't need a new booking system. You don't need a new brand. You just need a website that finally matches the quality of what you do.
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>

      {/* DETAILED DUPLICATION ELEMENT: THE WEBSITE COST CALCULATOR */}
      <section id="math" className="px-6 py-16 md:px-12 bg-brand-lightgray/40 border-b border-brand-navy/10">
        <div className="max-w-7xl mx-auto space-y-8">
          <ScrollReveal>
            <div className="text-center">
              <span className="text-xs font-mono font-bold tracking-widest text-brand-burnt uppercase">The Math</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy mt-1">How much is your outdated website costing you?</h2>
              <p className="text-sm text-brand-navy/60 mt-2 max-w-xl mx-auto">Input your real studio averages below to see what you are currently bleeding in potential beauty bookings.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mt-12">
            {/* Input Sliders side */}
            <div className="bg-white rounded-3xl border border-brand-navy/10 p-6 md:p-8 space-y-6 shadow-md">
              <h3 className="font-display font-bold text-lg text-brand-navy">Your Live Averages</h3>
              
              {/* Slider 1: Ticket price */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-brand-navy">Average Treatment Value</span>
                  <span className="text-xl font-black text-brand-burnt font-mono">${ticketPrice}</span>
                </div>
                <p className="text-xs text-brand-navy/50">Average booking price (ranging from a simple facial injection to premium fillers).</p>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="25" 
                  value={ticketPrice} 
                  onChange={(e) => setTicketPrice(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-lightgray rounded-lg appearance-none cursor-pointer accent-brand-orange" 
                />
              </div>

              {/* Slider 2: Lost regular bookings */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-brand-navy">Bounced Website Visitors / Week</span>
                  <span className="text-xl font-black text-brand-burnt font-mono">{lostBookings}</span>
                </div>
                <p className="text-xs text-brand-navy/50">Clients who navigated to your outdated template and closed the tab without booking.</p>
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  step="1" 
                  value={lostBookings} 
                  onChange={(e) => setLostBookings(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-lightgray rounded-lg appearance-none cursor-pointer accent-brand-orange" 
                />
              </div>

              {/* Slider 3: Lost referrals */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-brand-navy">Lost Referral Prospects / Month</span>
                  <span className="text-xl font-black text-brand-burnt font-mono">{lostReferrals}</span>
                </div>
                <p className="text-xs text-brand-navy/50">Friends told them about you, but custom domains or slow loading killed their trust.</p>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1" 
                  value={lostReferrals} 
                  onChange={(e) => setLostReferrals(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-lightgray rounded-lg appearance-none cursor-pointer accent-brand-orange" 
                />
              </div>

              {/* Slider 4: DIY fighting hours */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-brand-navy">DIY Tech Frustration Hours / Week</span>
                  <span className="text-xl font-black text-brand-burnt font-mono">{manualHours} hrs</span>
                </div>
                <p className="text-xs text-brand-navy/50">Time you spend trying to align Wix blocks, configure DNS, or fix booking widgets.</p>
                <input 
                  type="range" 
                  min="0" 
                  max="15" 
                  step="1" 
                  value={manualHours} 
                  onChange={(e) => setManualHours(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-lightgray rounded-lg appearance-none cursor-pointer accent-brand-orange" 
                />
              </div>
            </div>

            {/* Calculations / Output Card (Deep Navy) */}
            <div className="bg-brand-navy text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-radial-[circle_at_top_right] from-brand-lavender/10 to-transparent pointer-events-none" />
              
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest font-bold">Estimated Cost Matrix</span>
                
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div className="border-r border-white/10 pr-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-brand-lightblue block mb-2">Bleeding / Month</span>
                    {/* Replaced red/green colors with orange/lavender as instructed */}
                    <span className="text-3xl font-black text-brand-orange font-display tracking-tight">${Math.round(totalMonthlyLost).toLocaleString()}</span>
                    <span className="text-[10px] text-white/50 block mt-1">+{monthlyHoursBack} hours lost</span>
                  </div>
                  <div className="pl-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-brand-lightblue block mb-2">Net Benefit w/ Echo Voice Labs</span>
                    <span className="text-3xl font-black text-brand-lavender font-display tracking-tight">${Math.round(netGain).toLocaleString()}</span>
                    <span className="text-[10px] text-white/50 block mt-1">Based on Managed plan</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="text-[10px] text-brand-orange uppercase font-mono font-bold tracking-wider block mb-1">Annual Impact</span>
                  <p className="text-sm font-light text-white/90">
                    Your dated domain is costing you <span className="text-brand-orange font-bold font-mono">${Math.round(annualLostNum).toLocaleString()}</span> every single year.
                  </p>
                  <p className="text-xs text-white/50 mt-1">A design revamp corrects the leakage from day one.</p>
                </div>
              </div>

              {/* Slider CTA */}
              <div className="mt-8 space-y-4">
                <a 
                  href="#pricing" 
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-lavender text-white font-bold py-4 rounded-xl text-center text-sm shadow-lg hover:bg-[#6c7cae] transition-all active:scale-95 z-25"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Stop Losing ${Math.round(totalMonthlyLost).toLocaleString()}/mo — Claim Spot
                </a>
                <p className="text-[10px] text-white/40 italic text-center">
                  Values are conservative estimates. Inquiries and Google maps search rankings vary based on geographic density.
                </p>

                {/* Calculation Methodology Details Accordion */}
                <details className="text-xs bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                  <summary className="p-3 cursor-pointer select-none flex justify-between items-center text-white/80 font-medium font-mono text-[10px] uppercase tracking-wider hover:bg-white/10">
                    <span>How we calculated this</span>
                    <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-4 border-t border-white/10 space-y-3 font-light text-white/70">
                    <div>
                      <h5 className="font-bold text-white text-[10px] uppercase">Lost Bookings Equation</h5>
                      <p className="mt-1">We multiply your bounced weekly traffic by the estimated diagnostic value ($ {ticketPrice} ) under the assumption that 70% of those clients actually had treatment intent but were deterred by interface errors.</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-[10px] uppercase">Lost Referrals Equation</h5>
                      <p className="mt-1">Word-of-mouth conversion averages 40% on prime domains. Bouncing users on DIY hosts results in total loss of organic social circles.</p>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — THE SOLUTION */}
      <section id="solution" className="px-6 py-16 md:px-12 bg-white border-b border-brand-navy/10 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal>
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-mono font-bold tracking-widest text-brand-lavender uppercase block">What We Do</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy">
                A Complete 5-Page Website Redesign. Built in About a Week.
              </h2>
              <p className="text-base text-brand-navy/70 font-light">
                We take your existing brand — your logo, your photos, your colors — and rebuild your website from the ground up on a professional platform. Mobile-optimized, fast-loading, and designed to convert visitors into booked appointments.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Page 1 */}
            <div className="bg-brand-lightgray/25 hover:bg-white p-6 rounded-2xl border border-brand-navy/5 hover:border-brand-lavender/30 transition-all duration-300 shadow-sm space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-lavender group-hover:bg-brand-lavender/10 group-hover:text-brand-burnt transition-colors">
                <Globe size={20} />
              </div>
              <h4 className="font-display font-bold text-sm text-brand-navy">1. Home Page</h4>
              <p className="text-xs text-brand-navy/60 leading-relaxed font-light">
                A cinematic hero section with subtle sliding/zoom pacing, high aesthetic contrast, paired typography, and a laser focus on one singular call-to-action. First impressions done right.
              </p>
            </div>
            {/* Page 2 */}
            <div className="bg-brand-lightgray/25 hover:bg-white p-6 rounded-2xl border border-brand-navy/5 hover:border-brand-lavender/30 transition-all duration-300 shadow-sm space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-lavender group-hover:bg-brand-lavender/10 group-hover:text-brand-burnt transition-colors">
                <Layers size={20} />
              </div>
              <h4 className="font-display font-bold text-sm text-brand-navy">2. Services Page</h4>
              <p className="text-xs text-brand-navy/60 leading-relaxed font-light">
                Your medical treatments (Botox, Kybella, lasers, microneedling) cleanly prioritized with transparent tiers, elegant borders, and responsive Accordion parameters. Easy to browse & book.
              </p>
            </div>
            {/* Page 3 */}
            <div className="bg-brand-lightgray/25 hover:bg-white p-6 rounded-2xl border border-brand-navy/5 hover:border-brand-lavender/30 transition-all duration-300 shadow-sm space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-lavender group-hover:bg-brand-lavender/10 group-hover:text-brand-burnt transition-colors">
                <HeartHandshake size={20} />
              </div>
              <h4 className="font-display font-bold text-sm text-brand-navy">3. About Page</h4>
              <p className="text-xs text-brand-navy/60 leading-relaxed font-light">
                Your personal story, clinical nursing credentials, license credentials, and practitioner gallery. The key building block that converts cold traffic into warm believers.
              </p>
            </div>
            {/* Page 4 */}
            <div className="bg-brand-lightgray/25 hover:bg-white p-6 rounded-2xl border border-brand-navy/5 hover:border-brand-lavender/30 transition-all duration-300 shadow-sm space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-lavender group-hover:bg-brand-lavender/10 group-hover:text-brand-burnt transition-colors">
                <Star size={20} />
              </div>
              <h4 className="font-display font-bold text-sm text-brand-navy">4. Gallery / Results Page</h4>
              <p className="text-xs text-brand-navy/60 leading-relaxed font-light">
                Your before-and-after results, dermal contours, and client reviews beautifully cataloged in a crisp, interactive gallery grid. This is your number-one selling asset.
              </p>
            </div>
            {/* Page 5 */}
            <div className="bg-brand-lightgray/25 hover:bg-white p-6 rounded-2xl border border-brand-navy/5 hover:border-brand-lavender/30 transition-all duration-300 shadow-sm space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-lavender group-hover:bg-brand-lavender/10 group-hover:text-brand-burnt transition-colors">
                <Clock size={20} />
              </div>
              <h4 className="font-display font-bold text-sm text-brand-navy">5. Contact / Book Page</h4>
              <p className="text-xs text-brand-navy/60 leading-relaxed font-light">
                Beautiful custom embedded wrapper linking directly to Acuity, Vagaro, Jane, or Mindbody. No disruptions. They experience native flows inside of a site that finally looks elite.
              </p>
            </div>

            {/* Inclusions Card */}
            <div className="bg-gradient-to-br from-brand-navy to-brand-navy/95 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-brand-orange uppercase font-bold tracking-widest block mb-2">ADDITIONAL BENEFITS INCLUDED:</span>
                <ul className="text-xs space-y-2 text-white/80">
                  <li className="flex items-center gap-2"><Check size={12} className="text-brand-orange" /> Mobile-responsive fluidity</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-brand-orange" /> Google Business Profile redirection setup</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-brand-orange" /> Social link config (Facebook / Instagram update)</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-brand-orange" /> Up to 2 rounds of revisions</li>
                </ul>
              </div>
              <a href="#pricing" className="text-brand-orange hover:text-white font-bold text-xs inline-flex items-center gap-1 mt-4 transition-colors">
                Configure Yours →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FOUNDING MEMBER OFFER */}
      <section id="offer" className="px-6 py-16 md:px-12 bg-white/50 border-b border-brand-navy/10 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-white border border-brand-navy/10 p-8 md:p-12 rounded-3xl shadow-xl shadow-brand-navy/5">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-burnt uppercase block">Why the Founding Member Price?</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-navy">We're Launching. You Benefit.</h2>
          </div>

          <div className="space-y-4 text-base text-brand-navy/70 font-light leading-relaxed max-w-2xl mx-auto">
            <p>
              Echo Voice Labs is a new premium design branch, and we're aggressively building out our core portfolio. We're offering a strictly limited number of website redesign slots at a significantly reduced rate — in exchange for an honest review once your domain goes live.
            </p>
            <p>
              That's it. No complicated contract. We design exceptional clinical pages, you enjoy massive client conversions and leave a review, and everyone wins.
            </p>
          </div>

          {/* Interactive Spot Counter Control with Manual Increments (Adhering to literal update request) */}
          <div className="border bg-brand-lightgray/40 border-brand-navy/10 py-6 px-8 rounded-2xl max-w-lg mx-auto space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-brand-navy">Spot Counter (Update Manually):</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSpotsRemaining(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-brand-navy/10 flex items-center justify-center font-bold font-mono text-brand-navy text-sm hover:border-brand-burnt hover:text-brand-burnt focus:outline-none"
                  title="Claim Spot"
                >
                  -
                </button>
                <button 
                  onClick={() => setSpotsRemaining(prev => Math.min(10, prev + 1))}
                  className="w-10 h-10 rounded-full bg-white border border-brand-navy/10 flex items-center justify-center font-bold font-mono text-brand-navy text-sm hover:border-brand-burnt hover:text-brand-burnt focus:outline-none"
                  title="Unclaim Spot"
                >
                  +
                </button>
              </div>
            </div>

            {/* Simulated Live bar display representing spots remaining */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-brand-navy">
                <span>AVAILABILITY STATUS</span>
                <span className="text-brand-burnt font-mono">{spotsRemaining} of 10 spots remaining</span>
              </div>
              <div className="h-2.5 bg-brand-navy/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-orange to-brand-burnt transition-all duration-300" 
                  style={{ width: `${(spotsRemaining / 10) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] text-brand-navy/50 italic leading-snug">
              Spots lock upon initial application evaluation. Click the - or + keys above to test availability live.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — PRICING */}
      <section id="pricing" className="px-6 py-16 md:px-12 bg-white border-b border-brand-navy/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-burnt uppercase block">Choose Your Plan</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy mt-1">Two Ways to Work With Us</h2>
            <p className="text-sm text-brand-navy/60 mt-2">Transparent pricing backed by high-speed deployment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* PLAN 1 — MANAGED CODES */}
            <div className="bg-white rounded-3xl border-2 border-brand-burnt/30 p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
              {/* Most Popular Badge (No green/red, using elegant lavender/navy/orange) */}
              <div className="absolute top-4 right-4 bg-brand-navy text-white text-[10px] font-mono tracking-widest py-1.5 px-4 rounded-full font-bold shadow-md">
                RECOMMENDED
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-brand-lavender font-bold uppercase tracking-widest block mb-2">PLAN 1 — MANAGED</span>
                  <h3 className="font-display font-black text-2xl text-brand-navy">Website Redesign + Hosting</h3>
                  <span className="text-xs text-brand-navy/50 font-light block">Managed Subscription Model</span>
                </div>

                <div className="py-4 border-y border-brand-navy/5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-mono font-black text-brand-navy">$499</span>
                    <span className="text-xs text-brand-navy/60 font-semibold uppercase tracking-wider">today</span>
                  </div>
                  <div className="text-brand-lavender text-xs font-bold font-mono mt-1">
                    then $97 / month
                  </div>
                  <p className="text-xs text-brand-navy/60 font-light leading-relaxed mt-3">
                    Your beauty domain completely refactored, hosted on our hyper-fast private servers, and updated month-to-month by our design desk. Cancel with 30 days notice.
                  </p>
                </div>

                <ul className="text-xs space-y-3 text-brand-navy/80 font-light">
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Complete 5-page custom redesign</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Fully mobile-responsive layout</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Booking calendar system hook</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Monthly hosting & tech maintenance</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Minor content updates included monthly</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Cancel anytime — no locking contracts</li>
                </ul>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => {
                    setSelectedPlan('managed');
                    setShowCheckout(true);
                  }}
                  className="w-full py-4 text-center rounded-xl bg-brand-lavender text-white font-bold text-sm tracking-wider uppercase transition-all hover:bg-[#6c7cae] shadow-md active:scale-95"
                >
                  Claim This Plan — $499
                </button>
              </div>
            </div>

            {/* PLAN 2 — ONE-TIME CODE */}
            <div className="bg-white rounded-3xl border border-brand-navy/10 p-8 shadow-lg flex flex-col justify-between hover:border-brand-lavender/30 transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-brand-lavender font-bold uppercase tracking-widest block mb-2">PLAN 2 — BUILD</span>
                  <h3 className="font-display font-black text-2xl text-brand-navy">Website Redesign Only</h3>
                  <span className="text-xs text-brand-navy/50 font-light block">One-Time Handover Model</span>
                </div>

                <div className="py-4 border-y border-brand-navy/5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-mono font-black text-brand-navy">$699</span>
                    <span className="text-xs text-brand-navy/60 font-semibold uppercase tracking-wider">one time</span>
                  </div>
                  <div className="text-brand-lightblue text-xs font-bold font-mono mt-1">
                    No ongoing monthly fees
                  </div>
                  <p className="text-xs text-brand-navy/60 font-light leading-relaxed mt-3">
                    The premium build handed directly over to you with clean documentation upon signoff. You host, update, and manage your servers completely.
                  </p>
                </div>

                <ul className="text-xs space-y-3 text-brand-navy/80 font-light">
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Complete 5-page custom redesign</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Fully mobile-responsive layout</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Booking calendar system hook</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Full DNS domain configuration support</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> Complete static code assets handover</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-brand-orange" /> You own 100% of the site files</li>
                </ul>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => {
                    setSelectedPlan('onetime');
                    setShowCheckout(true);
                  }}
                  className="w-full py-4 text-center rounded-xl bg-brand-navy text-white font-bold text-sm tracking-wider uppercase transition-all hover:bg-brand-navy/90 shadow-md active:scale-95 animate-none"
                >
                  Claim This Plan — $699
                </button>
              </div>
            </div>
          </div>

          <div className="text-center pt-6 space-y-2 max-w-sm mx-auto">
            <p className="text-xs text-brand-navy/60 font-light">
              Not sure which plan matches your aesthetic workflow? Call or text our engineers and we'll advise you.
            </p>
            <a href="tel:+18882919192" className="text-brand-lavender text-sm font-black tracking-normal inline-flex items-center gap-1 hover:underline">
              <Phone size={14} /> (888) 291-9192
            </a>
          </div>
        </div>
      </section>

      {/* INTERACTIVE COMPONENT: COLLAPSIBLE CHECKOUT MODAL DRAWER */}
      {showCheckout && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-brand-navy/15 max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => {
                setShowCheckout(false);
                setSubmittedApplication(false);
              }}
              className="absolute top-4 right-4 p-2 bg-brand-lightgray hover:bg-brand-lavender/10 rounded-full text-brand-navy transition-colors"
            >
              <X size={18} />
            </button>

            {!submittedApplication ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-lavender font-bold">APPLICATION EVALUATION</span>
                  <h3 className="font-display font-black text-xl text-brand-navy">Apply for Founding Member Spot</h3>
                  <p className="text-xs text-brand-navy/50 mt-1">Review the order summary below and input your studio parameters.</p>
                </div>

                {/* Selected Plan Details box */}
                <div className="bg-brand-lightgray/40 border border-brand-navy/10 p-4 rounded-xl space-y-3 text-xs">
                  <div className="flex justify-between items-baseline font-bold text-brand-navy">
                    <span>
                      {selectedPlan === 'managed' ? 'Website Redesign + Hosting (Managed)' : 'Website Redesign (One-Time)'}
                    </span>
                    <span className="font-mono text-brand-burnt">
                      {selectedPlan === 'managed' ? '$499' : '$699'}
                    </span>
                  </div>
                  {selectedPlan === 'managed' && (
                    <div className="text-[11px] text-brand-lavender font-mono font-bold">
                      +$97 / month starting next week
                    </div>
                  )}

                  {/* SECTION 9 INTEGRATION: SOCIAL MEDIA ADD-ON */}
                  <div className="pt-3 border-t border-brand-navy/5 flex justify-between items-center bg-white/50 p-2 rounded-lg">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[11px] block text-brand-navy">Include Social Media Add-On</span>
                      <span className="text-[10px] text-brand-navy/60 block leading-tight">12-15 branded static posts ready to publish</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={socialAddon}
                        onChange={() => setSocialAddon(!socialAddon)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-brand-lightgray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-orange" />
                    </label>
                  </div>

                  {socialAddon && (
                    <div className="flex justify-between items-center text-[11px] font-mono text-brand-burnt bg-brand-orange/5 p-2 rounded border border-brand-orange/10">
                      <span>Add-on Total:</span>
                      <span>+$97.00</span>
                    </div>
                  )}

                  {/* Summary math */}
                  <div className="pt-3 border-t border-brand-navy/10 flex justify-between items-baseline font-black text-sm text-brand-navy">
                    <span>Initial Amount Due:</span>
                    <span className="font-mono text-brand-burnt">
                      ${(selectedPlan === 'managed' ? 499 : 699) + (socialAddon ? 97 : 0)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-brand-navy mb-1 uppercase tracking-wider text-[10px]">Studio Owner Name</label>
                      <input required type="text" placeholder="Sarah Mercer" className="w-full border border-brand-navy/10 rounded-lg p-2.5 outline-none focus:border-brand-lavender" />
                    </div>
                    <div>
                      <label className="block font-bold text-brand-navy mb-1 uppercase tracking-wider text-[10px]">Medspa Name</label>
                      <input required type="text" placeholder="Aura Skin Studio" className="w-full border border-brand-navy/10 rounded-lg p-2.5 outline-none focus:border-brand-lavender" />
                    </div>
                  </div>
                  <div className="text-xs">
                    <label className="block font-bold text-brand-navy mb-1 uppercase tracking-wider text-[10px]">E-mail Address</label>
                    <input required type="email" placeholder="sarah@auramedspa.com" className="w-full border border-brand-navy/10 rounded-lg p-2.5 outline-none focus:border-brand-lavender" />
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    type="submit" 
                    className="w-full bg-brand-burnt hover:bg-brand-orange text-white text-sm font-bold tracking-wider uppercase py-4 rounded-xl shadow-lg transition-colors"
                  >
                    Claim Founding Spot
                  </button>
                  <p className="text-[10px] text-center text-brand-navy/40">
                    No charge occurs now. Spot represents prioritized calendar queue hold.
                  </p>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-lavender/10 text-brand-lavender flex items-center justify-center mx-auto">
                  <Sparkles size={32} />
                </div>
                <h3 className="font-display font-black text-xl text-brand-navy">Application Received!</h3>
                <p className="text-xs text-brand-navy/60 max-w-sm mx-auto leading-relaxed">
                  We've initialized a placeholder on the design calendar for your aesthetic workspace. Our chief UI architect will write back at your email within 6-12 hours.
                </p>
                <div className="pt-4">
                  <button 
                    onClick={() => {
                      setShowCheckout(false);
                      setSubmittedApplication(false);
                    }}
                    className="px-6 py-2 border border-brand-navy/10 rounded-lg text-xs font-semibold hover:border-brand-burnt"
                  >
                    Return to Main Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 7 — HOW IT WORKS */}
      <section id="process" className="px-6 py-16 md:px-12 bg-brand-lightgray/40 border-b border-brand-navy/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal>
            <div className="text-center">
              <span className="text-xs font-mono font-bold tracking-widest text-brand-burnt uppercase block">The Process</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy mt-1">From Payment to Live Site in About a Week</h2>
              <p className="text-sm text-brand-navy/60 mt-2">Zero technical bottlenecks. We assume all engineering responsibilities.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-12 items-stretch">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-brand-navy/10 flex flex-col justify-between shadow-sm hover:border-brand-lavender/30 transition-all">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-brand-lavender hover:text-brand-burnt font-black block">01 / CONTRACT</span>
                <h4 className="font-display font-bold text-sm text-brand-navy leading-snug">01. You Say Yes</h4>
                <p className="text-xs text-brand-navy/60 leading-relaxed font-light">
                  Choose your plan and complete payment. You'll receive a confirmation and onboarding package within minutes.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-lightgray text-brand-navy/70 flex items-center justify-center font-bold text-xs mt-4">1</div>
            </div>
            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-brand-navy/10 flex flex-col justify-between shadow-sm hover:border-brand-lavender/30 transition-all">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-brand-lavender hover:text-brand-burnt font-black block">02 / ONBOARD</span>
                <h4 className="font-display font-bold text-sm text-brand-navy leading-snug">02. You Send Assets</h4>
                <p className="text-xs text-brand-navy/60 leading-relaxed font-light">
                  Logo, treatments, photo vault, and a few quick answers about your vibe. Takes 10 minutes.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-lightgray text-brand-navy/70 flex items-center justify-center font-bold text-xs mt-4">2</div>
            </div>
            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-brand-navy/10 flex flex-col justify-between shadow-sm hover:border-brand-lavender/30 transition-all">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-brand-lavender hover:text-brand-burnt font-black block">03 / FABRICATE</span>
                <h4 className="font-display font-bold text-sm text-brand-navy leading-snug">03. We Build</h4>
                <p className="text-xs text-brand-navy/60 leading-relaxed font-light">
                  We design and script your fully compliant 5-page layout. Private preview URL in 3-4 days.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-lightgray text-brand-navy/70 flex items-center justify-center font-bold text-xs mt-4">3</div>
            </div>
            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-brand-navy/10 flex flex-col justify-between shadow-sm hover:border-brand-lavender/30 transition-all">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-brand-lavender hover:text-brand-burnt font-black block">04 / REVISE</span>
                <h4 className="font-display font-bold text-sm text-brand-navy leading-snug">04. You Review</h4>
                <p className="text-xs text-brand-navy/60 leading-relaxed font-light">
                  Up to 2 full rounds of aesthetic modifications. Pinpoint blocks you want changed.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-lightgray text-brand-navy/70 flex items-center justify-center font-bold text-xs mt-4">4</div>
            </div>
            {/* Step 5 */}
            <div className="bg-white p-6 rounded-2xl border border-brand-navy/10 flex flex-col justify-between shadow-sm hover:border-brand-lavender/30 transition-all">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-brand-lavender hover:text-brand-burnt font-black block">05 / DEPLOY</span>
                <h4 className="font-display font-bold text-sm text-brand-navy leading-snug">05. You Go Live</h4>
                <p className="text-xs text-brand-navy/60 leading-relaxed font-light">
                  Approval, DNS switch configuration, live domains, Google maps, and Facebook/Instagram updates initiated.
                </p>
              </div>
              <div className="w-8 h-8 bg-brand-burnt text-white flex items-center justify-center rounded-full font-bold text-xs mt-4">✓</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7.5 — TESTIMONIALS */}
      <section id="testimonials" className="px-6 py-16 md:px-12 bg-white border-b border-brand-navy/10 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <span className="text-xs font-mono font-bold tracking-widest text-[#e8853d] uppercase block">Success Stories</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-navy mt-1">What Our Clients Say</h2>
            <p className="text-sm text-brand-navy/60 mt-2 max-w-lg mx-auto">
              Real medspa and beauty studio owners who upgraded to a premium website and increased their booking rate.
            </p>
          </div>

          {/* Testimonial Card Slider */}
          <div className="relative bg-brand-lightgray/20 rounded-3xl border border-brand-navy/10 p-8 md:p-12 shadow-sm overflow-hidden">
            {/* Background decorative shadows/elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-[circle_at_top_right] from-brand-lavender/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-radial-[circle_at_bottom_left] from-brand-orange/5 to-transparent pointer-events-none" />

            <div className="relative min-h-[200px] flex flex-col justify-between">
              {/* Star ratings */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#e8853d] text-[#e8853d]" />
                ))}
              </div>

              {/* Quotes & Commentary - No text gradients */}
              <div className="space-y-6">
                <blockquote className="text-lg md:text-xl font-light text-brand-navy/80 italic leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-brand-navy/10">
                  {/* Circle monogram avatar to match "Bespoke initials, editorial styling" */}
                  <div className="w-12 h-12 rounded-full bg-brand-navy text-white flex items-center justify-center font-display font-bold text-sm tracking-widest shadow-md">
                    {testimonials[currentTestimonial].initials}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-brand-navy">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-xs text-brand-navy/60">
                      {testimonials[currentTestimonial].title}
                    </p>
                  </div>
                  {/* Mini Client Verified Badge */}
                  <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-brand-navy/5 text-brand-burnt text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles size={10} className="text-[#e8853d]" />
                    <span>Verified Spot Partner</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation & Controls */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-brand-navy/10">
              {/* Pagination Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentTestimonial === index 
                        ? 'bg-[#c8591a] w-6' 
                        : 'bg-brand-navy/20 hover:bg-brand-navy/40'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrow Keys */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prevTestimonial}
                  className="p-2.5 rounded-full border border-brand-navy/15 text-brand-navy bg-white hover:border-brand-lavender hover:bg-brand-lavender/5 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextTestimonial}
                  className="p-2.5 rounded-full border border-brand-navy/15 text-brand-navy bg-white hover:border-brand-lavender hover:bg-brand-lavender/5 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — OBJECTION HANDLING / FAQ */}
      <section id="faq" className="px-6 py-16 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-burnt uppercase block">Questions</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-navy">Everything You're Wondering</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Do I have to give up my current website or domain?",
                a: "Not at all. We work with your existing domain and point it to your new site. Your old booking system stays exactly as it is — we just build beautiful pages around it."
              },
              {
                q: "What if I'm on Squarespace or Wix?",
                a: "No problem. We build your new site on our platform and handle the technical transition for you. You don't need to do anything technical."
              },
              {
                q: "What do I need to provide?",
                a: "Your logo, a handful of photos, your booking link, and answers to about 10 short questions. That's it. We handle everything else."
              },
              {
                q: "What if I don't have good photos?",
                a: "We can work with what you have. Stock photos are also an option for certain sections. We'll let you know what we need during onboarding."
              },
              {
                q: "Is my booking system going to change?",
                a: "No. We keep your existing Acuity, Vagaro, Mindbody, or other booking system exactly as it is. We just embed it into a page that looks great."
              },
              {
                q: "What happens if I want to cancel the monthly plan?",
                a: "Send us a written cancellation request with 30 days notice. Your site stays live during that period and we'll deliver all your files within 48-72 hours of your cancellation date."
              },
              {
                q: "How is this different from hiring a web designer on Fiverr?",
                a: "We specialize in med spas and beauty studios. We know your industry, your clientele, and what converts in your space. You're not getting a generic template — you're getting a site designed specifically for the way your business works."
              }
            ].map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-brand-navy/10 rounded-2xl overflow-hidden hover:border-brand-lavender/30 transition-all duration-300">
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex justify-between items-center bg-brand-lightgray/10 hover:bg-brand-lavender/5 focus:outline-none"
                  >
                    <span className="font-display font-bold text-sm text-brand-navy pr-4">{item.q}</span>
                    <span className="text-brand-lavender">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-5 border-t border-brand-navy/10 text-xs text-brand-navy/70 leading-relaxed font-light bg-white">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9 — SOCIAL MEDIA ADD-ON */}
      <section id="social-addon" className="relative px-6 py-16 md:px-12 bg-brand-lightgray/20 border-y border-brand-navy/10">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-brand-navy/10 p-6 md:p-10 shadow-xl shadow-brand-navy/5 flex flex-col md:flex-row gap-8 items-center">
          <div className="space-y-4 flex-1">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-burnt uppercase block">While We're At It</span>
            <h3 className="font-display font-black text-2xl text-brand-navy">Add a Month of Social Content for $97</h3>
            <p className="text-xs md:text-sm text-brand-navy/70 leading-relaxed font-light">
              We'll design 12-15 branded static social media posts — ready to publish on Instagram and Facebook. Consistent, on-brand, and done for you.
            </p>
            <div className="text-xs space-y-1 block font-mono text-brand-lavender font-bold">
              <div>• $97 one-time payment</div>
              <div>• $79/month when added to any Managed Plan</div>
            </div>
          </div>

          <div className="text-center w-full md:w-auto">
            <button 
              onClick={() => {
                setSocialAddon(true);
                setShowCheckout(true);
              }}
              className="px-8 py-4 w-full md:w-auto rounded-xl bg-brand-navy text-white text-xs font-bold uppercase tracking-wider transition-colors hover:bg-brand-burnt shadow-md active:scale-95"
            >
              Add Social Content to My Order
            </button>
            <p className="text-[10px] text-brand-navy/40 italic mt-3">
              Included statically on checkout calculation drawer above.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 10 — FINAL CTA */}
      <section id="final-cta" className="relative bg-brand-navy text-white py-24 px-6 md:px-12 overflow-hidden text-center">
        {/* Background ambient shine */}
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-brand-orange/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none">
            Your New Website Is a Week Away
          </h2>
          
          <p className="text-base sm:text-lg text-brand-lightblue font-light leading-relaxed max-w-xl mx-auto">
            You've been meaning to fix your website for a while now. This is the easiest it's ever going to be — and at the lowest price we'll ever offer. Founding member spots are limited and going fast.
          </p>

          <div className="pt-4">
            <button 
              onClick={() => {
                setSelectedPlan('managed');
                setShowCheckout(true);
              }}
              className="px-10 py-5 rounded-xl bg-brand-lavender text-white font-black text-sm uppercase tracking-widest hover:bg-[#6c7cae] hover:-translate-y-0.5 active:scale-95 transition-all shadow-xl shadow-brand-lavender/30"
            >
              Claim Your Founding Member Spot
            </button>
          </div>

          <div className="pt-4 text-xs font-light text-brand-lightblue">
            Still have questions? Text us first at <a href="tel:+18882919192" className="text-brand-lavender font-bold font-mono hover:underline">(888) 291-9192</a> — we'll get back to you fast.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-brand-navy text-white/50 border-t border-white/5 px-6 py-12 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-center md:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start">
            <img 
              src={echoVoiceLabsLogoSteel} 
              alt="Echo Voice Labs Logo" 
              className="h-8 md:h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-center md:justify-end gap-x-4 gap-y-2 text-xs">
            <span className="hover:text-brand-orange cursor-pointer tracking-wider">Instagram</span>
            <span className="hover:text-brand-orange cursor-pointer tracking-wider">Facebook</span>
          </div>
          <p className="text-[10px] text-white/30">
            © 2026 Echo Voice Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
