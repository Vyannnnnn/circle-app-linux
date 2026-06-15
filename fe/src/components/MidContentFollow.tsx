import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getFollows } from "@/redux/slices/authSlice";
import { getImageUrl } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function MidContentFollow() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );
  const { follows, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFollows(activeTab));
  }, [activeTab, dispatch]);

  return (
    <main className="flex-1 border-x border-[#2f3336] min-h-screen max-w-150">
      {/* Sticky header */}
      <div className="sticky top-0 bg-black/85 backdrop-blur-md z-10 border-b border-[#2f3336]">
        <div className="flex items-center px-4 h-13.25">
          <h1 className="text-xl font-bold text-[#e7e9ea]">Follows</h1>
        </div>
        <div className="flex border-b border-[#2f3336]">
          {(["followers", "following"] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center h-13.25 text-[15px] font-medium bg-black relative transition-colors hover:bg-[#080808]
                    ${activeTab === tab ? "text-[#e7e9ea] font-bold" : "text-[#71767b]"}`}
            >
              {tab === "followers" ? "Followers" : "Following"}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </div>

      <>
        {loading && (
          <Loader2 className="animate-spin h-6 w-6 text-gray-500 mx-auto mt-10">
            Loading...
          </Loader2>
        )}
        {follows.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <p className="text-gray-500 text-lg">No {activeTab} yet</p>
          </div>
        )}
        {follows.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-4 border-b border-[#2f3336]"
          >
            {user.photo_profile ? (
              <img
                src={
                  getImageUrl(user.photo_profile) ||
                  "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                }
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <img
                src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                alt={user.username}
                className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white font-bold"
              />
            )}

            <div>
              <p className="font-bold text-white">{user.full_Name}</p>

              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>
        ))}
      </>
    </main>
  );
}
