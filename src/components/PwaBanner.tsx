import React, { useState } from 'react';

export const PwaBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ai.studio/build';

  return (
    <section className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-lg p-6 mt-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="flex flex-col items-center text-center shrink-0 space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="bg-white p-2.5 rounded-lg inline-block">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}`}
              alt="iOS Safari QR Code"
              className="w-[130px] h-[130px]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
            Scan with iOS Camera
          </span>
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-500/30">
                iOS Web App
              </span>
              <span className="text-[11px] text-slate-400">PWA Icon Protocol Active</span>
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              📱 Safari Add-to-Home-Screen Setup
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              This applet is fully optimized for standalone PWA execution on Apple devices. Launching from your home screen gives you a fullscreen, notch-fit experience with high-fidelity, vector-compiled graphics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <span className="bg-teal-950 text-teal-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-teal-800">
                  1
                </span>
                Scan or Copy
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Scan the QR code with your iPhone, or copy the link to send to your device.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <span className="bg-teal-950 text-teal-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-teal-800">
                  2
                </span>
                Open in Safari
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Ensure the app is loaded in native <strong>iOS Safari</strong> (not Chrome/webview).
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <span className="bg-teal-950 text-teal-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-teal-800">
                  3
                </span>
                Add to Home
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Tap <strong>Share</strong>, scroll down and select <strong>"Add to Home Screen"</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleCopy}
              className={`font-semibold px-4 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-teal-950 ${
                copied
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-teal-600 hover:bg-teal-500 text-white'
              }`}
            >
              {copied ? '✔ Link Copied!' : 'Copy App URL'}
            </button>
            <span className="text-[10px] text-slate-400 italic">
              Note: iOS touch icon requires a Safari page bookmark to refresh properly.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
