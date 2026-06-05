import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchThreads,
  toggleLike,
  hydrateThreads,
} from "../redux/slices/threadSlice";
import { Textarea } from "@/components/ui/textarea";
import PostCard from "./PostCard";
import { threadAPI } from "@/services/api";


export default function MidContent() {
  const dispatch = useAppDispatch();
  const { threads } = useAppSelector((state) => state.thread);
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [composeText, setComposeText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    // threads.find((t) => t.id === id);
    // console.log("Liked thread with ID:", id);
    // console.log(threads);
  };

  // const handleCompose = () => {
  //   dispatch(addThread(newPost));
  // };

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  return (
    <main className="flex-1 border-x border-[#2f3336] min-h-screen max-w-150">
      {/* Sticky header */}
      <div className="sticky top-0 bg-black/85 backdrop-blur-md z-10 border-b border-[#2f3336]">
        <div className="flex items-center px-4 h-13.25">
          <h1 className="text-xl font-bold text-[#e7e9ea]">Beranda</h1>
        </div>
        <div className="flex border-b border-[#2f3336]">
          {(["foryou", "following"] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center h-13.25 text-[15px] font-medium relative transition-colors hover:bg-[#080808]
                    ${activeTab === tab ? "text-[#e7e9ea] font-bold" : "text-[#71767b]"}`}
            >
              {tab === "foryou" ? "Untuk Anda" : "Mengikuti"}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="flex gap-3 px-4 py-3 border-b border-[#2f3336]">
        <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center font-bold text-white text-sm shrink-0">
          V
        </div>
        <div className="flex-1 min-w-0">
          <Textarea
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
                <Button
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
                </Button>
              ))}
            </div>
            <Button
              // onClick={handleCompose}
              disabled={!composeText.trim()}
              className="bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-full px-4.5 h-9 transition-colors"
            >
              Posting
            </Button>
          </div>
        </div>
      </div>

      {/* Posts */}
      {threads.map((thread) => (
        <PostCard key={thread.id} thread={thread} onLike={handleLike} />
      ))}
    </main>
  );
}
