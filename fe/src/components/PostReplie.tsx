import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  createReply,
  fetchRepliesByThreadId,
} from "../redux/slices/threadSlice";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "../services/api";
import { useParams } from "react-router";
import { BadgeCheck, Ellipsis, Heart, MessageSquareQuote } from "lucide-react";

export default function PostReplie() {
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const replies = useAppSelector((state) => state.thread.replies);
  const { threadId } = useParams();
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const numericThreadId = Number(threadId);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [content]);

  useEffect(() => {
    if (threadId) {
      dispatch(fetchRepliesByThreadId(numericThreadId));
    }
  }, [dispatch, numericThreadId]);

  const handleCompose = async () => {
    if (!content.trim() || !threadId) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append("content", content.trim());

    if (imageFile) formData.append("image", imageFile);
    await dispatch(
      createReply({ threadId: numericThreadId, payload: formData }),
    ).unwrap();
    setContent("");
    setImageFile(null);
    setSubmitting(false);
  };

  return (
    <>
      {/* Input area */}
      <div className="flex gap-3 px-4 py-3 border-b border-[#2f3336]">
        <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center shrink-0 overflow-hidden">
          {user?.photo_profile ? (
            <img
              src={
                getImageUrl(user.photo_profile) ||
                "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
              }
              alt={user.full_Name}
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <span className="font-bold text-white text-sm">
              {user?.full_Name?.charAt(0) || "U"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post your reply"
            rows={2}
            className="w-full bg-transparent focus:outline-none focus:border-none border-none outline-none text-xl text-[#e7e9ea] placeholder-[#71767b] resize-none font-sans mb-2"
          />
          <div className="flex items-center justify-between pt-3 border-t border-[#2f3336]">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="cursor-pointer text-[#e7e9ea] border-none outline-none focus:outline-none"
            />
            {imageFile && (
              <img
                src={preview || ""}
                alt="Preview"
                className="max-w-24 max-h-24 object-contain rounded-lg"
              />
            )}
            <Button
              onClick={handleCompose}
              disabled={!content.trim() || submitting}
              className="bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 text-white font-bold text-[15px] rounded-full px-4 h-9"
            >
              {submitting ? "Sending..." : "Reply"}
            </Button>
          </div>
        </div>
      </div>

      {/* Replies list */}
      {replies.map((reply) => (
        <div
          key={reply.id}
          className="flex gap-3 px-4 py-3 border-b  border-[#2f3336]"
        >
          <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center shrink-0 overflow-hidden">
            {reply.user.photo_profile ? (
              <img
                src={getImageUrl(reply.user?.photo_profile) ?? ""}
                alt={reply.user?.full_Name ?? ""}
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <span className="font-bold text-white text-sm">
                {reply.user.full_Name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="font-bold text-[15px] text-[#e7e9ea]">
                {reply.user.full_Name}
              </span>
              <BadgeCheck />

              <span className="text-[#71767b] text-[15px]">
                @{reply.user.username}
              </span>
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="ml-auto p-1.5 cursor-pointer rounded-full hover:bg-[#031018] hover:text-[#1d9bf0] text-[#71767b] transition-colors"
              >
                <Ellipsis />
              </Button>
            </div>
            <p className="text-[15px] text-[#e7e9ea] leading-snug">
              {reply.content}
            </p>
            {reply.image && (
              <img
                src={getImageUrl(reply.image) || ""}
                alt="reply image"
                className="mt-2 rounded-2xl max-h-48 object-cover w-full"
              />
            )}
            <div className="flex gap-x-4 max-w-106.25 mt-3.5">
              <Button
                onClick={() => {
                  // navigate(`/threads/${thread.id}`);
                }}
                type="button"
                className="flex  items-center gap-1.5 cursor-pointer text-[#71767b] hover:text-[#1d9bf0] group transition-colors text-[13px]"
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#031018] transition-colors">
                  <MessageSquareQuote />
                </span>
                {/* {thread.replies} */}
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  // onLike(thread.id);
                }}
                className="flex items-center gap-1.5 text-[13px] transition-colors cursor-pointer text-[#71767b] hover:text-[#f91880]"
                // className={`flex items-center gap-1.5 text-[13px] transition-colors cursor-pointer ${
                //   thread.isLiked
                //     ? "text-[#f91880]"
                //     : "text-[#71767b] hover:text-[#f91880]"
                // }`}
              >
                <span
                // className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${thread.isLiked ? "bg-[#200014]" : "hover:bg-[#200014]"}`}
                >
                  <Heart />
                </span>
                {/* {thread.like} */}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
