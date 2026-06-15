import "../App.css";
import { Button } from "@/components/ui/button";
import { CardProfile } from "./CardProfile";
import {
  followUser,
  getProfile,
  getSuggestions,
  searchUsers,
} from "@/redux/slices/authSlice";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLocation } from "react-router";
import { getImageUrl } from "@/services/api";

export default function RightContent() {
  const dispatch = useAppDispatch();
  const { suggestions, searchResults } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const location = useLocation();
  const [followingUsers, setFollowingUsers] = useState<number[]>([]);

  useEffect(() => {
    dispatch(getSuggestions());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!debounced.trim()) {
      return;
    }

    dispatch(searchUsers(debounced));
  }, [debounced, dispatch]);

  const handleFollow = async (userId: number) => {
    setFollowingUsers((prev) => [...prev, userId]);
    try {
      await dispatch(followUser(userId)).unwrap();

      dispatch(getProfile());

      setTimeout(() => {
        dispatch(getSuggestions());
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <aside className="hide-scrollbar w-87.5 hidden lg:flex flex-col sticky top-0 h-screen gap-y-4 overflow-y-auto px-4 shrink-0">
      {/* Search */}
      <div className="sticky top-0 bg-black pt-3 z-50">
        <div className="relative">
          <div className="bg-[#202327] rounded-full flex items-center gap-2 px-4 h-11 border border-[#484e52]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="bg-transparent border-none outline-none text-[#e7e9ea] flex-1"
            />
          </div>

          {debounced.trim() && (
            <div className="absolute top-13 left-0 right-0 bg-[#16181c] rounded-xl border border-[#2f3336] overflow-hidden shadow-lg">
              {searchResults?.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-[#1d1f23] cursor-pointer"
                  >
                    <img
                      src={
                        getImageUrl(user.photo_profile) ||
                        "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                      }
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">
                        {user.full_Name}
                      </p>

                      <p className="text-gray-500 truncate">@{user.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">No users found</div>
              )}
            </div>
          )}
        </div>
      </div>
     {(location.pathname === "/profile" || location.pathname === "/threads/user/:id") && <CardProfile />}

      {/* Who to follow */}
      <div className="bg-[#16181c] rounded-2xl p-4 border border-[#484e52]">
        <h2 className="text-xl font-bold text-[#e7e9ea] mb-4">Who to follow</h2>

        {suggestions.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 py-3 hover:bg-[#1d1f23] -mx-4 px-4"
          >
            <img
              src={
                getImageUrl(user.photo_profile) ||
                "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
              }
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />

            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{user.full_Name}</p>

              <p className="text-gray-500 truncate">@{user.username}</p>
            </div>

            <Button
              disabled={followingUsers.includes(user.id)}
              onClick={() => handleFollow(user.id)}
              className="bg-white border-[#536471] hover:text-white cursor-pointer text-black font-bold py-2 px-4 rounded-full shrink-0"
            >
              {followingUsers.includes(user.id) ? "Following" : "Follow"}
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
          <Button
            key={l}
            className="hover:underline bg-[#16181c] cursor-pointer"
          >
            {l}
          </Button>
        ))}
        <span className="self-end">© 2026 Triple</span>
      </div>
    </aside>
  );
}
