import "../App.css";
import { Button } from "@/components/ui/button";
import { CardProfile } from "./CardProfile";

export default function RightContent() {
  return (
    <aside className="hide-scrollbar w-87.5 hidden lg:flex flex-col sticky top-0 h-screen gap-y-4 overflow-y-auto px-4 shrink-0">
      {/* Search */}
      <div className="sticky top-0 bg-black pt-3 z-5">
        <div className="bg-[#202327] rounded-full flex items-center gap-2 px-4 h-11 border border-[#484e52]">
          <svg
            className="w-5 h-5 text-[#71767b]"
            fill="none"
            stroke="#71767b"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none outline-none text-[#e7e9ea] placeholder-[#71767b] text-[15px] flex-1"
          />
        </div>
      </div>
      {location.pathname !== "/profile" && (
          <CardProfile />
      )}

      {/* Who to follow */}
      <div className="bg-[#16181c] rounded-2xl p-4 border border-[#484e52]">
        <h2 className="text-xl font-bold text-[#e7e9ea] mb-4">Who to follow</h2>
        {[
          {
            initials: "FK",
            bg: "#1a3a5c",
            color: "#7ec8e3",
            name: "FilmKillers",
            handle: "filmkillers",
          },
          {
            initials: "DK",
            bg: "#3a0a0a",
            color: "#e07070",
            name: "DarkKino",
            handle: "darkkino",
          },
          {
            initials: "SC",
            bg: "#0a2a0a",
            color: "#70e070",
            name: "ScareClips",
            handle: "scareclips",
          },
        ].map((u) => (
          <div
            key={u.handle}
            className="flex items-center gap-3 py-3 hover:bg-[#1d1f23] -mx-4 px-4 cursor-pointer transition-colors"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
              style={{ background: u.bg, color: u.color }}
            >
              {u.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[15px] text-[#e7e9ea] truncate">
                {u.name}
              </p>
              <p className="text-[#71767b] text-[15px] truncate">@{u.handle}</p>
            </div>
            <Button className="border border-[#e7e9ea] text-[#e7e9ea] hover:bg-[#e7e9ea] hover:text-black font-bold text-[14px] rounded-full px-4 h-8 transition-colors shrink-0">
              Follow
            </Button>
          </div>
        ))}
        <Button className="text-[#1d9bf0] text-[15px] pt-4 hover:underline block">
          Show more
        </Button>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 pb-4 text-[13px] text-[#71767b]">
        {[
          "Terms of Service",
          "Privacy Policy",
          "Cookie Policy",
          "Accessibility",
          "Ad info",
          "More ···",
        ].map((l) => (
          <Button key={l} className="hover:underline">
            {l}
          </Button>
        ))}
        <span>© 2026 X Corp.</span>
      </div>
    </aside>
  );
}
