import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  createReply,
  fetchRepliesByThreadId,
  fetchThreads,
} from "../redux/slices/threadSlice";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "../services/api";
import { useParams } from "react-router";

export default function PostReplie() {
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const replies = useAppSelector((state) => state.thread.replies); // ← fix
  const { threadId } = useParams();

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [content]);

  useEffect(() => {
    if (threadId) {
      dispatch(fetchRepliesByThreadId(Number(threadId)));
    }
  }, [dispatch, threadId]);

  useEffect(() => {
    console.log(replies);
  }, [replies]);

  const handleCompose = async () => {
    if (!content.trim() || !threadId) return;
    const formData = new FormData();
    formData.append("content", content.trim());

    if (imageFile) formData.append("image", imageFile);
    await dispatch(
      createReply({ threadId: Number(threadId), payload: formData }),
    );
    dispatch(fetchRepliesByThreadId(Number(threadId)));
    setContent("");
    setImageFile(null);
  };

  return (
    <>
      {/* Input area */}
      <div className="flex gap-3 px-4 py-3 border-b border-[#2f3336]">
        <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center shrink-0 overflow-hidden">
          {user?.photo_profile ? (
            <img
              src={getImageUrl(user.photo_profile) || ""}
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
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="max-w-24 max-h-24 object-contain rounded-lg"
              />
            )}
            <Button
              onClick={handleCompose}
              disabled={!content.trim()}
              className="bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 text-white font-bold text-[15px] rounded-full px-4 h-9"
            >
              Reply
            </Button>
          </div>
        </div>
      </div>

      {/* Replies list */}
      {replies.map((reply) => (
        console.log("reply:", reply),
        <div
          key={reply.id}
          className="flex gap-3 px-4 py-3 border-b border-[#2f3336]"
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
              <span className="text-[#71767b] text-[15px]">
                @{reply.user.username}
              </span>
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
          </div>
        </div>
      ))}
    </>
  );
}
