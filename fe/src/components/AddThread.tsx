import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createThread } from "../redux/slices/threadSlice";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "../services/api";
import { toast } from "sonner";

export default function AddThread() {
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const {loading} = useAppSelector((state) => state.thread);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
  if (!imageFile) {
    setPreviewUrl("");
    return;
  }

  const url = URL.createObjectURL(imageFile);

  setPreviewUrl(url);

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

  const handleCompose = async () => {
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append("content", content.trim());
    if (imageFile) formData.append("image", imageFile);

    try {
      await dispatch(createThread(formData)).unwrap();

      setContent("");
      setImageFile(null);
    } catch (err) {
      toast.error("Failed to post thread. Please try again.");
      console.error("Error posting thread:", err);
    }
  };
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-[#2f3336]">
      <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center font-bold text-white text-sm shrink-0">
        {user?.photo_profile ? (
          <img
            src={getImageUrl(user.photo_profile) ?? ""}
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
          onChange={(e) => {
            setContent(e.target.value);
          }}
          placeholder="What's happening now?"
          rows={2}
          className="w-full bg-transparent focus:outline-none focus:border-none border-none outline-none text-xl text-[#e7e9ea] placeholder-[#71767b] resize-none font-sans mb-2"
        />
        
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
            <div className="mt-1">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-80 rounded-xl object-contain"
              />
            </div>
          )}
          <Button
            onClick={handleCompose}
            disabled={!content.trim() || loading}
            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-full px-4.5 h-9 transition-colors"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
