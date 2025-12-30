import { useState, useEffect } from "react";
import { RandomSquiggle } from "~/components/RandomSquiggle";
import { DigitalWall } from "~/components/DigitalWall";
import { supabase } from "~/lib/supabase";

export function meta() {
  return [
    { title: "MathemaTech" },
    { 
      name: "description", 
      content: "Learning is an active, involved process. Join our mailing list to discover a better way to learn." 
    },
  ];
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAssets = async () => {
      // Wait for all fonts to be ready
      await document.fonts.ready;
      
      // Wait for key images
      const logo = new Image();
      logo.src = "/mathematechwhite.png";
      
      await new Promise((resolve) => {
        if (logo.complete) resolve(null);
        else {
          logo.onload = () => resolve(null);
          logo.onerror = () => resolve(null);
        }
      });

      // Small additional delay to ensure layout has settled
      setTimeout(() => setIsReady(true), 100);
    };

    if (document.readyState === 'complete') {
      checkAssets();
    } else {
      window.addEventListener('load', checkAssets);
      return () => window.removeEventListener('load', checkAssets);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error: dbError } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (dbError) {
        if (dbError.code === '23505') {
          setError("You're already on the list!");
        } else {
          setError("Something went wrong. Please try again.");
          console.error("Supabase error:", dbError);
        }
        setIsSubmitting(false);
        return;
      }
      
      setIsSubmitted(true);
      setEmail("");
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const anim = (delayClass: string, isSimple = false) => {
    if (!isReady) return "opacity-0";
    return `${isSimple ? 'animate-simple-fade' : 'animate-fade-up'} ${delayClass}`;
  };

  return (
    <main className="gradient-bg min-h-screen flex flex-col px-6 py-12">
      {/* Logo in top right */}
      <header className={`absolute top-6 right-6 z-20 ${anim('delay-1', true)}`}>
        <img src="/mathematechwhite.png" alt="MathemaTech" className="h-8 w-auto opacity-80" />
      </header>

      <div className="flex-1 flex items-center">
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
      </div>

      {/* Noise overlay for dithering blobs */}
      <div className="noise-overlay" />

      <div className="perspective-grid">
        <div className="perspective-grid-inner" />
      </div>

      <div className="noise-overlay" />

      {isReady && <RandomSquiggle />}
      {isReady && <DigitalWall />}

      <div className={`relative z-10 max-w-3xl w-full px-6 mx-auto md:mx-0 md:ml-[15rem] lg:ml-[20rem] xl:ml-[24rem] font-serif transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <div className="space-y-4 md:space-y-6">
          <p 
            className={`text-lg md:text-xl xl:text-2xl xl:leading-relaxed leading-normal text-slate-300 opacity-0 ${anim('delay-2')}`}
            style={{ animationFillMode: 'forwards' }}
          >
            Learning shouldn't be{" "}
            <br className="hidden sm:block" />
            reading a regurgitated wall of notes from ChatGPT{" "}
            <br className="hidden sm:block" /> or mindlessly generating multiple choice questions.
          </p>

          <div className="space-y-1 md:space-y-2">
            <p 
              className={`text-xl md:text-2xl xl:text-3xl font-semibold text-teal-100 opacity-0 ${anim('delay-3')}`}
              style={{ animationFillMode: 'forwards' }}
            >
              Learning is an active, involved process.
            </p>
            
            <p 
              className={`text-xl md:text-2xl xl:text-3xl font-semibold text-teal-100 opacity-0 ${anim('delay-4')}`}
              style={{ animationFillMode: 'forwards' }}
            >
              Learning happens with, and from, others.
            </p>

            {/* Horizontal divider */}
            <div 
              className={`w-24 h-px bg-gradient-to-r from-teal-500/60 to-transparent mt-4 opacity-0 ${anim('delay-5')}`}
              style={{ animationFillMode: 'forwards' }}
            />
          </div>

          {/* Mailing list form */}
          <div 
            className={`opacity-0 ${anim('delay-7')}`}
            style={{ animationFillMode: 'forwards' }}
          >
            {isSubmitted ? (
              <div className="flex items-center gap-3 text-emerald-400">
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-lg">You're on the list. We'll be in touch.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <form onSubmit={handleSubmit} className="flex flex-row gap-2 sm:gap-3">
                  <div className="gradient-input-wrapper">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-5 py-3.5 rounded-md bg-transparent text-white placeholder-slate-500 focus:outline-none transition-all duration-300 font-serif text-sm tracking-wide"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 sm:px-6 py-3.5 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 font-space flex items-center justify-center min-w-[50px] sm:min-w-0"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle 
                          className="opacity-25" 
                          cx="12" cy="12" r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                          fill="none"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Join the List</span>
                        <svg 
                          className="w-5 h-5 sm:hidden" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2.5" 
                            d="M14 5l7 7m0 0l-7 7m7-7H3" 
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
                {error && (
                  <p className="text-sm text-teal-400 font-sans italic ml-1">{error}</p>
                )}
              </div>
            )}
          </div>

          {/* Closing statement */}
          <p 
            className={`text-2xl md:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 opacity-0 ${anim('delay-6')}`}
            style={{ animationFillMode: 'forwards' }}
          >
            Let's learn a better way.
          </p>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className={`hidden md:block absolute bottom-4 left-0 right-0 text-center z-20 ${anim('delay-8', true)}`}>
        <p className="text-sm text-slate-500">© 2026 MathemaTech</p>
      </footer>
    </main>
  );
}
