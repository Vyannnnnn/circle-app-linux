import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createThread, fetchThreads } from "../redux/slices/threadSlice";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "../services/api";

export default function AddThread() {
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;

    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [content]);

  const handleCompose = async () => {
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append("content", content.trim());
    if (imageFile) formData.append("image", imageFile);

    await dispatch(createThread(formData));
    dispatch(fetchThreads());
    setContent("");
    setImageFile(null);
  };
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-[#2f3336]">
      <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center font-bold text-white text-sm shrink-0">
        {user?.photo_profile ? (
          <img
            src={getImageUrl(user?.photo_profile) || ""}
            alt={user?.full_Name}
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
          onChange={(e) => {
            setContent(e.target.value);
          }}
          placeholder="What's happening now?"
          rows={2}
          className="w-full bg-transparent focus:outline-none focus:border-none border-none outline-none text-xl text-[#e7e9ea] placeholder-[#71767b] resize-none font-sans mb-2"
        />
        {content.trim().length > 0 && (
          <div className="flex items-center gap-2 mb-3 text-[#1d9bf0] text-[14px] cursor-pointer">
            <svg className="w-4 h-4" fill="#1d9bf0" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            <span>Everyone can reply</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-[#2f3336]">
          <div className="flex gap-1 text-[#1d9bf0]">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              placeholder="Image URL"
              className="bg-zinc-gray-100 cursor-pointer text-[#e7e9ea] placeholder:text-[#71767b] border-none outline-none focus:outline-none"
            />
          </div>
          {imageFile && (
            <div className="w-full h-full flex items-center justify-center p-2">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          <Button
            onClick={handleCompose}
            disabled={!content.trim()}
            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-full px-4.5 h-9 transition-colors"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
