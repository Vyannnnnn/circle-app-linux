import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  toggleLikeSelected,
  likeThread,
  unlikeThread,
  fetchThreadById,
  clearSelectedThread,
} from "@/redux/slices/threadSlice";
import { getImageUrl } from "../services/api";
import PostReplies from "@/components/PostReplie";
import { useParams } from "react-router";
import { useEffect } from "react";
import { BadgeCheck, Ellipsis, Heart, Loader2, MessageSquareQuote } from "lucide-react";

export default function MidContentDetail() {
  const dispatch = useAppDispatch();
  const { threadId } = useParams<{ threadId: string }>();
  const numericThreadId = Number(threadId);
  const { selectedThread: thread, loading } = useAppSelector(
    (state) => state.thread,
  );

  useEffect(() => {
    if (!threadId) return;
    dispatch(fetchThreadById(numericThreadId));
  }, [dispatch, numericThreadId]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedThread());
    };
  }, [dispatch]);

  const handleLike = async () => {
    if (!thread) return;
    const wasLiked = thread?.isLiked;
    dispatch(toggleLikeSelected());

    try {
      if (wasLiked) {
        await dispatch(unlikeThread(thread.id)).unwrap();
      } else {
        await dispatch(likeThread(thread.id)).unwrap();
      }
    } catch {
      dispatch(toggleLikeSelected());
    }
  };
  return (
    <main className="flex-1 border-x border-[#2f3336] min-h-screen max-w-150">
      <div className="sticky top-0 bg-black/85 backdrop-blur-md z-10 border-b border-[#2f3336]">
        <div className="flex items-center px-4 h-13.25">
          <h1 className="text-xl font-bold text-[#e7e9ea]">Detail Thread</h1>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin">
            <title>Loading...</title>
          </Loader2>
        </div>
      ) : (
        thread && (
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
                <span className="bg-red-400 text-[15px]">
                <BadgeCheck />
                </span>
                <span className="text-[#71767b] text-[15px]">
                  @{thread.user.username}
                </span>
                <Button
                  aria-label="More"
                  className="ml-auto p-1.5 cursor-pointer rounded-full hover:bg-[#031018] hover:text-[#1d9bf0] text-[#71767b]"
                >
                  <Ellipsis />
                </Button>
              </div>
              <p className="text-[15px] text-[#e7e9ea] leading-snug mb-3 whitespace-pre-line">
                {thread.content}
              </p>
              {thread.image && (
                <div className="w-full h-48 rounded-2xl border border-[#2f3336] bg-[#0f0f0f] mb-3">
                  <img
                    src={
                      getImageUrl(thread.image) || "https://i.pravatar.cc/300"
                    }
                    alt={thread.user.username}
                    className="object-cover w-full h-full rounded-2xl"
                  />
                </div>
              )}
              <div className="flex gap-x-4">
                <Button
                  aria-label="Reply"
                  className="flex items-center gap-1.5 cursor-pointer text-[#71767b] hover:text-[#1d9bf0] text-[13px]"
                >
                  <span className="w-8 h-8 rounded-full flex items-center justify-center">
                    <MessageSquareQuote />
                  </span>
                  {thread.replies}
                </Button>
                <Button
                  aria-label="Like"
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 text-[13px] cursor-pointer ${thread.isLiked ? "text-[#f91880]" : "text-[#71767b] hover:text-[#f91880]"}`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${thread.isLiked ? "bg-[#200014]" : ""}`}
                  >
                    <Heart />
                  </span>
                  {thread.like}
                </Button>
              </div>
            </div>
          </article>
        )
      )}

      <PostReplies />
    </main>
  );
}
