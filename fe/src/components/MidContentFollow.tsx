import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getFollows } from "@/redux/slices/authSlice";

export default function MidContentFollow() {
  useWebSocket();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );
  const { follows } = useAppSelector((state) => state.auth);
  console.log("REDUX FOLLOWS:", follows);
  const users = follows;

  useEffect(() => {
    dispatch(getFollows(activeTab));
  }, [activeTab, dispatch]);
  console.log(activeTab);
  console.log(follows);
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
        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <p className="text-gray-500 text-lg">No {activeTab} yet</p>
          </div>
        )}
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-4 border-b border-[#2f3336]"
          >
            <img
              src={user.photo_profile}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />

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
