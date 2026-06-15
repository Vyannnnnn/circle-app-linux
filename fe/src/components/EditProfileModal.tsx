import { useState, useRef, useEffect } from "react";
import { X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authAPI, getImageUrl } from "@/services/api";
import { useAppDispatch } from "../redux/hooks";
import { getProfile } from "../redux/slices/authSlice";
import type { EditProfileModalProps } from "../types/auth.types";
import { toast } from "sonner";
import { fetchUserThreads } from "@/redux/slices/threadSlice";

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
}: EditProfileModalProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.full_Name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.photo_profile ? getImageUrl(user.photo_profile) : null,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFullName(user?.full_Name || "");
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setImagePreview(
      user?.photo_profile ? getImageUrl(user.photo_profile) : null,
    );
  }, [user]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("full_Name", fullName);
      formData.append("username", username);
      formData.append("bio", bio);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await authAPI.editProfile(formData);

      await dispatch(getProfile()).unwrap();
      dispatch(fetchUserThreads());
      // await onProfileUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm p-4">
      <div className="bg-black border border-[#2f3336] rounded-2xl w-full max-w-150 overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2f3336]">
          <div className="flex items-center gap-6">
            <Button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#181818] transition-colors -ml-2"
            >
              <X className="w-5 h-5 text-[#eff3f4]" />
            </Button>
            <h2 className="text-xl font-bold text-[#e7e9ea]">Edit profile</h2>
          </div>
          <Button
            type="submit"
            form="edit-profile-form"
            disabled={isLoading}
            className="rounded-full bg-[#eff3f4] text-black hover:bg-[#d7dbdc] font-bold px-4 h-8 text-sm disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[80vh] pb-8">
          {/* Cover Placeholder */}
          <div className="h-50 bg-[#333639] w-full relative">
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="p-3 bg-black/50 rounded-full cursor-not-allowed hover:bg-black/60 transition-colors">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <form id="edit-profile-form" onSubmit={handleSubmit} className="px-4">
            {/* Avatar Edit */}
            <div className="relative -mt-16 mb-4 w-30 h-30">
              <div className="w-full h-full rounded-full border-4 border-black bg-[#16181c] overflow-hidden relative group">
                <img
                  src={
                    imagePreview ||
                    `${user?.full_Name}`
                  }
                  alt="Profile Preview"
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-50 transition-all"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="p-2 bg-black/50 rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* Inputs */}
            <div className="space-y-6 mt-6">
              <div className="relative border border-[#2f3336] rounded-md px-2 pt-6 pb-2 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-colors">
                <label className="absolute top-2 left-2 text-[13px] text-[#71767b]">
                  Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent text-[#e7e9ea] text-[17px] focus:outline-none"
                  required
                />
              </div>

              <div className="relative border border-[#2f3336] rounded-md px-2 pt-6 pb-2 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-colors">
                <label className="absolute top-2 left-2 text-[13px] text-[#71767b]">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent text-[#e7e9ea] text-[17px] focus:outline-none"
                  required
                />
              </div>

              <div className="relative border border-[#2f3336] rounded-md px-2 pt-6 pb-2 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-colors">
                <label className="absolute top-2 left-2 text-[13px] text-[#71767b]">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-transparent text-[#e7e9ea] text-[17px] focus:outline-none resize-none min-h-20"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
