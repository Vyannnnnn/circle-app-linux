import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toggleLike } from "../redux/slices/threadSlice";
import { getProfile } from "../redux/slices/authSlice";
import PostCard from "./PostCard";
import { threadAPI, getImageUrl } from "@/services/api";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { Thread } from "../types/thread.types";
import EditProfileModal from "./EditProfileModal";

export default function MidContentProfile() {
  useWebSocket();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { user } = useAppSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState<"posts" | "replies" | "media" | "likes">("posts");
  const [userThreads, setUserThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
    
    const fetchUserThreads = async () => {
      try {
        setIsLoading(true);
        const response = await threadAPI.getUserThreads();
        if (response.data?.data?.formattedThreadLists) {
          setUserThreads(response.data.data.formattedThreadLists);
        }
      } catch (error) {
        console.error("Failed to fetch user threads:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserThreads();
  }, [dispatch]);

  const handleLike = async (id: number) => {
    const threadIndex = userThreads.findIndex((t) => t.id === id);
    if (threadIndex === -1) return;
    
    const thread = userThreads[threadIndex];

    try {
      if (thread.isLiked) {
        await threadAPI.unlikeThread(id);
        setUserThreads(prev => {
          const newThreads = [...prev];
          newThreads[threadIndex] = {
            ...thread,
            isLiked: false,
            like: thread.like - 1
          };
          return newThreads;
        });
      } else {
        await threadAPI.likeThread(id);
        setUserThreads(prev => {
          const newThreads = [...prev];
          newThreads[threadIndex] = {
            ...thread,
            isLiked: true,
            like: thread.like + 1
          };
          return newThreads;
        });
      }
      
      // Update global store as well so it's synced if user goes back to home
      dispatch(toggleLike(id));
    } catch (error) {
      console.error("Error occurred while toggling like:", error);
    }
  };

  return (
    <main className="flex-1 border-x border-[#2f3336] min-h-screen max-w-150">
      {/* Header */}
      <div className="sticky top-0 bg-black/85 backdrop-blur-md z-10 border-b border-[#2f3336] flex items-center gap-6 px-4 h-13.25">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-[#181818] transition-colors cursor-pointer -ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-[#eff3f4]" />
        </button>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-[#e7e9ea] leading-tight">
            {user?.full_Name || "Profile"}
          </h2>
          <span className="text-[13px] text-[#71767b]">
            {userThreads.length} posts
          </span>
        </div>
      </div>

      {/* Profile Cover & Info */}
      <div className="relative border-b border-[#2f3336]">
        {/* Cover Image Placeholder */}
        <div className="h-[200px] bg-[#333639] w-full"></div>

        {/* Profile Details Container */}
        <div className="px-4 pb-0">
          {/* Avatar & Edit Button */}
          <div className="flex justify-between items-start -mt-16 mb-3">
            <div className="w-[133.5px] h-[133.5px] rounded-full border-4 border-black bg-[#16181c] overflow-hidden">
              <img
                src={user?.photo_profile ? getImageUrl(user.photo_profile) || "" : `https://ui-avatars.com/api/?name=${user?.full_Name || "User"}&background=random`}
                alt={user?.full_Name || "User avatar"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pt-3 mt-16">
              <Button
                onClick={() => setIsEditModalOpen(true)}
                variant="outline"
                className="rounded-full border-[#536471] bg-black text-white hover:bg-[#eff3f4]/10 font-bold px-4 h-9 cursor-pointer transition-colors"
              >
                Edit profile
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-1">
            <h1 className="text-xl font-extrabold text-[#e7e9ea] leading-5">
              {user?.full_Name || "Loading..."}
            </h1>
            <p className="text-[15px] text-[#71767b] mb-3">
              @{user?.username || "loading"}
            </p>
            <p className="text-[15px] text-[#e7e9ea] mb-3 whitespace-pre-wrap">
              {user?.bio || "No bio yet."}
            </p>

            <div className="flex gap-4 text-[15px]">
              <div className="hover:underline cursor-pointer">
                <span className="font-bold text-[#e7e9ea]">{user?.followingCount || 0}</span>
                <span className="text-[#71767b] ml-1">Following</span>
              </div>
              <div className="hover:underline cursor-pointer">
                <span className="font-bold text-[#e7e9ea]">{user?.followersCount || 0}</span>
                <span className="text-[#71767b] ml-1">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full mt-2">
          {(["posts", "replies", "media", "likes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex flex-col items-center justify-center pt-4 pb-0 hover:bg-[#181818] transition-colors relative cursor-pointer
                ${activeTab === tab ? "text-[#e7e9ea] font-bold" : "text-[#71767b] font-medium"}`}
            >
              <div className="pb-4 capitalize text-[15px]">{tab}</div>
              {activeTab === tab && (
                <div className="h-1 w-14 bg-[#1d9bf0] rounded-full absolute bottom-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* User Threads List */}
      <div className="min-h-[50vh]">
        {activeTab === "posts" ? (
          userThreads.length > 0 ? (
            userThreads.map((thread) => (
              <PostCard key={thread.id} thread={thread} onLike={handleLike} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <h3 className="text-[31px] font-extrabold text-[#e7e9ea] mb-2">No posts yet</h3>
              <p className="text-[#71767b] text-[15px]">When they post, their threads will show up here.</p>
            </div>
          )
        ) : (
          <div className="flex justify-center py-10 text-[#71767b]">
            Not implemented yet
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          user={user} 
        />
      )}
    </main>
  );
}
