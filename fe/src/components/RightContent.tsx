import { Button } from "@/components/ui/button";
import { DotsHIcon } from "./icons/svgIcons";

export default function RightContent() {
  return (
    <aside className="w-87.5 hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto px-4 py-0 shrink-0">
      {/* Search */}
      <div className="sticky top-0 bg-black py-3 z-5">
        <div className="bg-[#202327] rounded-full flex items-center gap-2 px-4 h-11">
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
            placeholder="Cari"
            className="bg-transparent border-none outline-none text-[#e7e9ea] placeholder-[#71767b] text-[15px] flex-1"
          />
        </div>
      </div>

      {/* Premium */}
      <div className="bg-[#16181c] rounded-2xl p-4 mb-4">
        <h2 className="text-xl font-bold text-[#e7e9ea] mb-2">
          Berlangganan Premium
        </h2>
        <p className="text-[15px] text-[#71767b] mb-4 leading-snug">
          Buka kunci fitur baru dan jika memenuhi syarat, dapatkan pembagian
          pendapatan iklan.
        </p>
        <Button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-[15px] rounded-full px-5 h-9 transition-colors">
          Berlangganan
        </Button>
      </div>

      {/* Trending */}
      <div className="bg-[#16181c] rounded-2xl p-4 mb-4">
        <h2 className="text-xl font-bold text-[#e7e9ea] mb-4">
          Trending untuk Anda
        </h2>
        {[
          {
            cat: "Trending · Horror",
            name: "#HorrorShorts",
            count: "24,5 rb postingan",
          },
          {
            cat: "Hiburan · Trending",
            name: "The Conjuring 4",
            count: "18,2 rb postingan",
          },
          {
            cat: "Trending di Indonesia",
            name: "#TikTokHorror",
            count: "9.440 postingan",
          },
          {
            cat: "Teknologi · Trending",
            name: "YouTube Shorts",
            count: "42,1 rb postingan",
          },
        ].map((t) => (
          <div
            key={t.name}
            className="flex items-start justify-between py-3 border-b border-[#2f3336] last:border-0 hover:bg-[#1d1f23] -mx-4 px-4 cursor-pointer transition-colors"
          >
            <div>
              <p className="text-[13px] text-[#71767b]">{t.cat}</p>
              <p className="font-bold text-[15px] text-[#e7e9ea] my-0.5">
                {t.name}
              </p>
              <p className="text-[13px] text-[#71767b]">{t.count}</p>
            </div>
            <Button className="text-[#71767b] p-1 rounded-full hover:bg-[#031018] hover:text-[#1d9bf0] transition-colors">
              <DotsHIcon />
            </Button>
          </div>
        ))}
        <Button className="text-[#1d9bf0] text-[15px] pt-4 hover:underline block">
          Tampilkan lebih banyak
        </Button>
      </div>

      {/* Who to follow */}
      <div className="bg-[#16181c] rounded-2xl p-4 mb-4">
        <h2 className="text-xl font-bold text-[#e7e9ea] mb-4">
          Siapa yang harus diikuti
        </h2>
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
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
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
            <Button className="border border-[#e7e9ea] text-[#e7e9ea] hover:bg-[#e7e9ea] hover:text-black font-bold text-[14px] rounded-full px-4 h-8 transition-colors flex-shrink-0">
              Ikuti
            </Button>
          </div>
        ))}
        <Button className="text-[#1d9bf0] text-[15px] pt-4 hover:underline block">
          Tampilkan lebih banyak
        </Button>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 pb-4 text-[13px] text-[#71767b]">
        {[
          "Persyaratan Layanan",
          "Kebijakan Privasi",
          "Kebijakan Cookie",
          "Aksesibilitas",
          "Iklan info",
          "Lainnya ···",
        ].map((l) => (
          <Button key={l} className="hover:underline">
            {l}
          </Button>
        ))}
        <span>© 2026 X Corp.</span>
      </div>
    </aside>

    // <aside className="w-[350px] hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto px-4 py-0 flex-shrink-0">
    //   <div className="bg-gray-900 rounded-xl p-4">
    //     <h2 className="text-xl font-bold mb-2">Berlangganan X Premium</h2>
    //     <p className="text-sm text-gray-400 mb-3">
    //       Berlangganan untuk membuka badge, monetisasi, dan fitur lain.
    //     </p>
    //     <Button className="bg-blue-500 hover:bg-blue-600 rounded-full">
    //       Berlangganan
    //     </Button>
    //   </div>

    //   {/* Trending */}
    //   <div className="bg-gray-900 rounded-xl p-4">
    //     <h2 className="text-xl font-bold mb-4">Trending untuk Anda</h2>
    //     <div className="flex justify-between items-start mb-4">
    //       <div>
    //         <p className="text-xs text-gray-500">Trending di Indonesia</p>
    //         <p className="font-bold">#Teknologi</p>
    //         <p className="text-xs text-gray-500">12.5rb postingan</p>
    //       </div>
    //       <Button variant="ghost" size="sm">
    //         ...
    //       </Button>
    //     </div>
    //     {/* Tambahkan item trending lainnya */}
    //   </div>
    // </aside>
  );
}
