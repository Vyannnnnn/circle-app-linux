import type { Thread } from "../types/thread.types";
import { ReplyIcon, DotsHIcon, HeartIcon, VerifyBadge } from "./icons/svgIcons";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "../services/api";

export default function PostCard({
  thread,
  onLike,
}: {
  thread: Thread;
  onLike: (id: number) => void;
}) {
  return (
    <article className="flex gap-3 px-4 py-3 border-b border-[#2f3336] hover:bg-[#080808] transition-colors">
      <img
        src={getImageUrl(thread.user.photo_profile) || ""}
        alt={thread.user.full_Name}
        className=" object-cover w-10 h-10 rounded-full flex items-center justify-center"
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
          {/* <span className="text-[#71767b] text-[15px]">·</span>
          <span className="text-[#71767b] text-[15px]">{thread.createdAt}</span> */}
          <Button className="ml-auto p-1.5 cursor-pointer rounded-full hover:bg-[#031018] hover:text-[#1d9bf0] text-[#71767b] transition-colors">
            <DotsHIcon />
          </Button>
        </div>

        <p className="text-[15px] text-[#e7e9ea] leading-snug mb-3 whitespace-pre-line">
          {thread.content}
        </p>

        {thread.image && (
          <div className="w-full cursor-pointer h-48 rounded-2xl border border-[#2f3336] bg-[#0f0f0f] flex items-center justify-center text-[#555] text-sm mb-3">
            <img
              src={getImageUrl(thread.image) || ""}
              alt={thread.user.username}
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        )}
        <div className="flex gap-x-4 max-w-106.25">
          <Button className="flex  items-center gap-1.5 cursor-pointer text-[#71767b] hover:text-[#1d9bf0] group transition-colors text-[13px]">
            <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#031018] transition-colors">
              <ReplyIcon />
            </span>
            {thread.replies}
          </Button>

          <Button
            onClick={() => onLike(thread.id)}
            className={`flex items-center gap-1.5 text-[13px] transition-colors cursor-pointer ${
              thread.isLiked
                ? "text-[#f91880]"
                : "text-[#71767b] hover:text-[#f91880]"
            }`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${thread.isLiked ? "bg-[#200014]" : "group-hover:bg-[#200014]"}`}
            >
              <HeartIcon filled={thread.isLiked} />
            </span>
            {thread.like}
          </Button>
        </div>
      </div>
    </article>
  );
}
