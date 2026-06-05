import { useState, useRef, useEffect } from "react";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../redux/hooks";
import { authAPI } from "../../services/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
const XLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const HomeIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 2}
    className="w-7 h-7"
  >
    <path d="M22.58 7.35L12.475 1.897a1 1 0 00-.95 0L1.425 7.35A2 2 0 00.5 9.057V21a1 1 0 001 1h8a1 1 0 001-1v-4h3v4a1 1 0 001 1h8a1 1 0 001-1V9.057a2 2 0 00-.92-1.707z" />
  </svg>
);
const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const GrokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);
const UsersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ProfileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);
const MoreIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
const DotsHIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);
const VerifyBadge = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4 inline-block text-[#1d9bf0]"
    fill="currentColor"
  >
    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1-2.52-1.26-3.91-.78C14.91 2.86 13.68 2 12.25 2c-1.43 0-2.67.88-3.34 2.19-1.39-.46-2.9-.2-3.91.81-1 1.01-1.26 2.52-.78 3.91C2.86 9.59 2 10.82 2 12.25c0 1.43.88 2.67 2.19 3.34-.46 1.39-.2 2.9.81 3.91 1.01 1 2.52 1.26 3.91.78 .67 1.11 1.9 1.97 3.34 1.97 1.43 0 2.67-.88 3.34-2.19 1.39.46 2.9.2 3.91-.81 1-1.01 1.26-2.52.78-3.91 1.11-.67 1.97-1.9 1.97-3.34z" />
    <path fill="white" d="M9.75 14.75l-2-2-1.5 1.5 3.5 3.5 6-6-1.5-1.5z" />
  </svg>
);

// ─── Action icons ─────────────────────────────────────────────────────────────
const ReplyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    className="w-5 h-5"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const RetweetIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    className="w-5 h-5"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "#f91880" : "none"}
    stroke={filled ? "#f91880" : "currentColor"}
    strokeWidth={1.75}
    className="w-5 h-5"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ViewsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    className="w-5 h-5"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const ShareIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    className="w-5 h-5"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Post {
  id: number;
  name: string;
  handle: string;
  verified?: boolean;
  avatarBg: string;
  avatarColor: string;
  initials: string;
  time: string;
  text: string;
  replies: string;
  retweets: string;
  likes: string;
  views: string;
  liked?: boolean;
  hasImage?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    name: "HorrorClips",
    handle: "horrorclips",
    verified: true,
    avatarBg: "#1a91da",
    avatarColor: "#fff",
    initials: "H",
    time: "2j",
    text: 'Scene ini dari "The Conjuring" adalah salah satu momen paling viral sepanjang masa 🎬 Siapa yang langsung kabur dari bioskop? 👇',
    replies: "284",
    retweets: "1,2rb",
    likes: "8.4rb",
    views: "421rb",
    hasImage: true,
  },
  {
    id: 2,
    name: "ScreamFactory",
    handle: "screamfactory",
    avatarBg: "#8b0000",
    avatarColor: "#fff",
    initials: "S",
    time: "5j",
    text: "Top 5 horror scenes yang WAJIB dijadikan YouTube Shorts bulan ini ⬇️ Thread 🧵\n\n1. Pennywise sewer scene – IT (2017)\n2. Jump scare terakhir The Nun\n3. Paranormal Activity bedroom cam\n4. Hereditary attic scene\n5. Midsommar bear",
    replies: "96",
    retweets: "441",
    likes: "2.1rb",
    views: "89rb",
  },
  {
    id: 3,
    name: "NightmareNiche",
    handle: "nightmareniche",
    avatarBg: "#333",
    avatarColor: "#e7e9ea",
    initials: "N",
    time: "12j",
    text: 'Baru upload 3 Shorts dari "Talk to Me" (2023) — semua udah tembus 500K views dalam 48 jam. Horror niche lagi boom banget rn 🔥',
    replies: "57",
    retweets: "203",
    likes: "3.7rb",
    views: "154rb",
    liked: true,
  },
];

const NAV_ITEMS = [
  { icon: <HomeIcon filled />, label: "Beranda", active: true },
  { icon: <SearchIcon />, label: "Jelajahi" },
  { icon: <BellIcon />, label: "Notifikasi" },
  { icon: <MailIcon />, label: "Pesan" },
  { icon: <GrokIcon />, label: "Grok" },
  { icon: <UsersIcon />, label: "Komunitas" },
  { icon: <ProfileIcon />, label: "Profil" },
  { icon: <MoreIcon />, label: "Lainnya" },
];

// ─── PostCard ─────────────────────────────────────────────────────────────────
function PostCard({
  post,
  onLike,
}: {
  post: Post;
  onLike: (id: number) => void;
}) {
  return (
    <article className="flex gap-3 px-4 py-3 border-b border-[#2f3336] hover:bg-[#080808] cursor-pointer transition-colors">
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
        style={{ background: post.avatarBg, color: post.avatarColor }}
      >
        {post.initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="font-bold text-[15px] text-[#e7e9ea]">
            {post.name}
          </span>
          {post.verified && <VerifyBadge />}
          <span className="text-[#71767b] text-[15px]">@{post.handle}</span>
          <span className="text-[#71767b] text-[15px]">·</span>
          <span className="text-[#71767b] text-[15px]">{post.time}</span>
          <button className="ml-auto p-1.5 rounded-full hover:bg-[#031018] hover:text-[#1d9bf0] text-[#71767b] transition-colors">
            <DotsHIcon />
          </button>
        </div>

        <p className="text-[15px] text-[#e7e9ea] leading-snug mb-3 whitespace-pre-line">
          {post.text}
        </p>

        {post.hasImage && (
          <div className="w-full h-48 rounded-2xl border border-[#2f3336] bg-[#0f0f0f] flex items-center justify-center text-[#555] text-sm mb-3">
            🎬 Pratinjau Klip
          </div>
        )}

        <div className="flex justify-between max-w-[425px]">
          <button className="flex items-center gap-1.5 text-[#71767b] hover:text-[#1d9bf0] group transition-colors text-[13px]">
            <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#031018] transition-colors">
              <ReplyIcon />
            </span>
            {post.replies}
          </button>
          <button className="flex items-center gap-1.5 text-[#71767b] hover:text-[#00ba7c] group transition-colors text-[13px]">
            <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#00380f] transition-colors">
              <RetweetIcon />
            </span>
            {post.retweets}
          </button>
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 group transition-colors text-[13px] ${post.liked ? "text-[#f91880]" : "text-[#71767b] hover:text-[#f91880]"}`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${post.liked ? "bg-[#200014]" : "group-hover:bg-[#200014]"}`}
            >
              <HeartIcon filled={post.liked} />
            </span>
            {post.likes}
          </button>
          <button className="flex items-center gap-1.5 text-[#71767b] hover:text-[#1d9bf0] group transition-colors text-[13px]">
            <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#031018] transition-colors">
              <ViewsIcon />
            </span>
            {post.views}
          </button>
          <button className="flex items-center gap-1.5 text-[#71767b] hover:text-[#1d9bf0] group transition-colors text-[13px]">
            <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#031018] transition-colors">
              <ShareIcon />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
export default function Tes() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [composeText, setComposeText] = useState("");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeNav, setActiveNav] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleLogout = async () => {
    await authAPI.logout();
    dispatch(logout());
    navigate("/login");
  };

  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)),
    );
  };

  const handleCompose = () => {
    if (!composeText.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      name: "Vynnn",
      handle: "vynnn_",
      avatarBg: "#1d9bf0",
      avatarColor: "#fff",
      initials: "V",
      time: "sekarang",
      text: composeText.trim(),
      replies: "0",
      retweets: "0",
      likes: "0",
      views: "0",
    };
    setPosts((prev) => [newPost, ...prev]);
    setComposeText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] flex justify-center">
      <div className="w-full flex max-w-[1265px]">
        {/* ── Left sidebar ── */}
        <nav className="w-[275px] hidden sm:flex flex-col sticky top-0 h-screen overflow-y-auto py-0 px-3 flex-shrink-0">
          <button className="w-[52px] h-[52px] flex items-center justify-center rounded-full hover:bg-[#1d1f23] transition-colors mt-0 mb-1">
            <XLogo />
          </button>

          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.label}
                onClick={() => {
                  setActiveNav(i);
                  if (item.label === "Profil") handleLogout();
                }}
                className="flex items-center gap-5 px-3 py-3 rounded-full hover:bg-[#1d1f23] transition-colors w-fit max-w-[250px]"
              >
                <span
                  className={
                    i === activeNav ? "text-[#e7e9ea]" : "text-[#e7e9ea]"
                  }
                >
                  {item.icon}
                </span>
                <span
                  className={`text-xl ${i === activeNav ? "font-bold" : "font-normal"} text-[#e7e9ea]`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {}}
            className="w-[90%] bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-[17px] rounded-full py-4 mt-4 transition-colors"
          >
            Posting
          </button>

          <div className="mt-auto mb-4 flex items-center gap-3 px-3 py-3 rounded-full hover:bg-[#1d1f23] cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center font-bold text-[15px] text-white flex-shrink-0">
              V
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[15px] text-[#e7e9ea] truncate">
                Vynnn
              </p>
              <p className="text-[#71767b] text-[15px] truncate">@vynnn_</p>
            </div>
            <span className="text-[#71767b] text-lg">···</span>
          </div>
        </nav>

        {/* ── Main feed ── */}
        <main className="flex-1 border-x border-[#2f3336] min-h-screen max-w-[600px]">
          {/* Sticky header */}
          <div className="sticky top-0 bg-black/85 backdrop-blur-md z-10 border-b border-[#2f3336]">
            <div className="flex items-center px-4 h-[53px]">
              <h1 className="text-xl font-bold text-[#e7e9ea]">Beranda</h1>
            </div>
            <div className="flex border-b border-[#2f3336]">
              {(["foryou", "following"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center h-[53px] text-[15px] font-medium relative transition-colors hover:bg-[#080808]
                    ${activeTab === tab ? "text-[#e7e9ea] font-bold" : "text-[#71767b]"}`}
                >
                  {tab === "foryou" ? "Untuk Anda" : "Mengikuti"}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="flex gap-3 px-4 py-3 border-b border-[#2f3336]">
            <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
              V
            </div>
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={composeText}
                onChange={(e) => {
                  setComposeText(e.target.value);
                  autoResize();
                }}
                placeholder="Apa yang sedang terjadi?"
                rows={2}
                className="w-full bg-transparent border-none outline-none text-xl text-[#e7e9ea] placeholder-[#71767b] resize-none font-sans mb-2"
              />
              {composeText.length > 0 && (
                <div className="flex items-center gap-2 mb-3 text-[#1d9bf0] text-[14px] cursor-pointer">
                  <svg className="w-4 h-4" fill="#1d9bf0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                  <span>Semua orang dapat membalas</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-[#2f3336]">
                <div className="flex gap-1 text-[#1d9bf0]">
                  {/* Media icons */}
                  {[
                    <path
                      key="img"
                      d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                    />,
                  ].map((_, i) => (
                    <button
                      key={i}
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#031018] transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1d9bf0"
                        strokeWidth={2}
                        className="w-5 h-5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCompose}
                  disabled={!composeText.trim()}
                  className="bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-full px-[18px] h-9 transition-colors"
                >
                  Posting
                </button>
              </div>
            </div>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </main>

        {/* ── Right sidebar ── */}
        <aside className="w-[350px] hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto px-4 py-0 flex-shrink-0">
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
            <button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-[15px] rounded-full px-5 h-9 transition-colors">
              Berlangganan
            </button>
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
                <button className="text-[#71767b] p-1 rounded-full hover:bg-[#031018] hover:text-[#1d9bf0] transition-colors">
                  <DotsHIcon />
                </button>
              </div>
            ))}
            <button className="text-[#1d9bf0] text-[15px] pt-4 hover:underline block">
              Tampilkan lebih banyak
            </button>
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
                  <p className="text-[#71767b] text-[15px] truncate">
                    @{u.handle}
                  </p>
                </div>
                <button className="border border-[#e7e9ea] text-[#e7e9ea] hover:bg-[#e7e9ea] hover:text-black font-bold text-[14px] rounded-full px-4 h-8 transition-colors flex-shrink-0">
                  Ikuti
                </button>
              </div>
            ))}
            <button className="text-[#1d9bf0] text-[15px] pt-4 hover:underline block">
              Tampilkan lebih banyak
            </button>
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
              <button key={l} className="hover:underline">
                {l}
              </button>
            ))}
            <span>© 2026 X Corp.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
