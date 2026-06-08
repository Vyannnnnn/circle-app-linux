import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchThreads,
  toggleLike,
  hydrateThreads,
} from "../redux/slices/threadSlice";
import PostCard from "./PostCard";
import { threadAPI } from "@/services/api";
import AddThread from "./AddThread";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function MidContent() {
  useWebSocket();
  const dispatch = useAppDispatch();
  const { threads } = useAppSelector((state) => state.thread);
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");

  useEffect(() => {
    const saved = localStorage.getItem("threads");
    if (saved) {
      dispatch(hydrateThreads(JSON.parse(saved)));
    } else {
      dispatch(fetchThreads());
    }
    dispatch(fetchThreads());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("threads", JSON.stringify(threads));
  }, [threads]);

  const handleLike = async (id: number) => {
    const thread = threads.find((t) => t.id === id);
    if (!thread) return;

    try {
      if (thread.isLiked) {
        await threadAPI.unlikeThread(id);
      } else {
        await threadAPI.likeThread(id);
      }
      dispatch(toggleLike(id));
    } catch (error) {
      console.error("Error occurred while toggling like:", error);
    }
  };

  return (
    <main className="flex-1 border-x border-[#2f3336] min-h-screen max-w-150">
      {/* Sticky header */}
      <div className="sticky top-0 bg-black/85 backdrop-blur-md z-10 border-b border-[#2f3336]">
        <div className="flex items-center px-4 h-13.25">
          <h1 className="text-xl font-bold text-[#e7e9ea]">Home</h1>
        </div>
        <div className="flex border-b border-[#2f3336]">
          {(["foryou", "following"] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center h-13.25 text-[15px] font-medium bg-black relative transition-colors hover:bg-[#080808]
                    ${activeTab === tab ? "text-[#e7e9ea] font-bold" : "text-[#71767b]"}`}
            >
              {tab === "foryou" ? "For You" : "Following"}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* add thread */}
      <AddThread />

      {/* Posts */}
      {threads.map((thread) => (
        <PostCard key={thread.id} thread={thread} onLike={handleLike} />
      ))}
    </main>
  );
}
