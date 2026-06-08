import LeftSidebar from "../components/LeftContent";
import RightContent from "@/components/RightContent";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchThreadById,
  toggleLikeSelected,
} from "../redux/slices/threadSlice";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useParams } from "react-router";
import {
  ReplyIcon,
  DotsHIcon,
  HeartIcon,
  VerifyBadge,
} from "../components/icons/svgIcons";
import { getImageUrl, threadAPI } from "../services/api";
import PostReplies from "@/components/PostReplie";
import { clearSelectedThread } from "@/redux/slices/threadSlice";

export default function DetailThread() {
  useWebSocket();
  const dispatch = useAppDispatch();
  //   const { threads } = useAppSelector((state) => state.thread);
  const { threadId } = useParams();
  const { selectedThread: thread } = useAppSelector((state) => state.thread);
  useEffect(() => {
    if (threadId) {
      dispatch(fetchThreadById(Number(threadId)));
    }
  }, [dispatch, threadId]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedThread());
    };
  }, [dispatch]);

  const handleLike = async () => {
    if (!thread) return;
    if (thread.isLiked) {
      await threadAPI.unlikeThread(thread.id);
    } else {
      await threadAPI.likeThread(thread.id);
    }
    dispatch(toggleLikeSelected());
  };

  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] flex justify-center">
      <div className="w-full flex max-w-316.25">
        <LeftSidebar />
        <main className="flex-1 border-x border-[#2f3336] min-h-screen max-w-150">
          <div className="sticky top-0 bg-black/85 backdrop-blur-md z-10 border-b border-[#2f3336]">
            <div className="flex items-center px-4 h-13.25">
              <h1 className="text-xl font-bold text-[#e7e9ea]">
                Detail Thread
              </h1>
            </div>
          </div>

          {thread && (
            <article className="flex gap-3 px-4 py-3 border-b border-[#2f3336]">
              <img
                src={getImageUrl(thread.user.photo_profile) || ""}
                alt={thread.user.full_Name}
                className="object-cover w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-bold text-[15px] text-[#e7e9ea]">
                    {thread.user.full_Name}
                  </span>
                  <VerifyBadge />
                  <span className="text-[#71767b] text-[15px]">
                    @{thread.user.username}
                  </span>
                  <Button className="ml-auto p-1.5 cursor-pointer rounded-full hover:bg-[#031018] hover:text-[#1d9bf0] text-[#71767b]">
                    <DotsHIcon />
                  </Button>
                </div>
                <p className="text-[15px] text-[#e7e9ea] leading-snug mb-3 whitespace-pre-line">
                  {thread.content}
                </p>
                {thread.image && (
                  <div className="w-full h-48 rounded-2xl border border-[#2f3336] bg-[#0f0f0f] mb-3">
                    <img
                      src={getImageUrl(thread.image) || ""}
                      alt={thread.user.username}
                      className="object-cover w-full h-full rounded-2xl"
                    />
                  </div>
                )}
                <div className="flex gap-x-4">
                  <Button className="flex items-center gap-1.5 cursor-pointer text-[#71767b] hover:text-[#1d9bf0] text-[13px]">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center">
                      <ReplyIcon />
                    </span>
                    {thread.replies}
                  </Button>
                  <Button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 text-[13px] cursor-pointer ${thread.isLiked ? "text-[#f91880]" : "text-[#71767b] hover:text-[#f91880]"}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${thread.isLiked ? "bg-[#200014]" : ""}`}
                    >
                      <HeartIcon filled={thread.isLiked} />
                    </span>
                    {thread.like}
                  </Button>
                </div>
              </div>
            </article>
          )}

          <PostReplies />
        </main>
        <RightContent />
      </div>
    </div>
  );
}
