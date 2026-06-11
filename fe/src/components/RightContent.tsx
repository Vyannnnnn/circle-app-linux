import "../App.css";
import { Button } from "@/components/ui/button";
import { CardProfile } from "./CardProfile";
import { getSuggestions } from "@/redux/slices/authSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function RightContent() {
  const dispatch = useAppDispatch();
  const { suggestions } = useAppSelector((state) => state.auth);

  console.log("Suggestions from Redux:", suggestions);
  useEffect(() => {
    dispatch(getSuggestions());
  }, [dispatch]);
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
      {location.pathname !== "/profile" && <CardProfile />}

      {/* Who to follow */}
      <div className="bg-[#16181c] rounded-2xl p-4 border border-[#484e52]">
        <h2 className="text-xl font-bold text-[#e7e9ea] mb-4">Who to follow</h2>

        {suggestions.map((user) => (
          <div className="flex items-center gap-3 py-3 hover:bg-[#1d1f23] -mx-4 px-4">
            <img
              src={user.photo_profile}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />

            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{user.full_Name}</p>

              <p className="text-gray-500 truncate">@{user.username}</p>
            </div>

            <Button className="bg-white border-[#536471] hover:text-white cursor-pointer text-black font-bold py-2 px-4 rounded-full shrink-0">
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
          <Button key={l} className="hover:underline bg-[#16181c] cursor-pointer">
            {l}
          </Button>
        ))}
        <span>© 2026 X Corp.</span>
      </div>
    </aside>
  );
}
