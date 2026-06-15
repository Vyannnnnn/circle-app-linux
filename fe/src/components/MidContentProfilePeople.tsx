import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  likeThread,
  toggleLike,
  unlikeThread,
  fetchThreadsByUserId,
} from "../redux/slices/threadSlice";
import {
  followUser,
  getProfile,
  getProfileById,
  unfollowUser,
} from "../redux/slices/authSlice";
import PostCard from "./PostCard";
import { getImageUrl } from "@/services/api";
import EditProfileModal from "./EditProfileModal";
import { Link } from "react-router";

export default function MidContentProfilePeople() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const viewedProfile = useAppSelector((state) => state.auth.viewedProfile);
  const { id } = useParams();
  const numericUserId = Number(id);
  const [followingUsers, setFollowingUsers] = useState<number[]>([]);

  const isFollowing = viewedProfile?.id
    ? followingUsers.includes(viewedProfile.id)
    : false;

  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<
    "posts" | "replies" | "media" | "likes"
  >("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { viewedProfileThreads } = useAppSelector((state) => state.thread);
  console.log("STATE THREADS:", viewedProfileThreads);

  useEffect(() => {
    console.log("fetching threads for:", numericUserId);
    dispatch(getProfileById(numericUserId));
    dispatch(fetchThreadsByUserId(numericUserId));
  }, [dispatch, numericUserId]);

  const handleLike = async (id: number) => {
    const thread = viewedProfileThreads.find((t) => t.id === id);
    if (!thread) return;
    dispatch(toggleLike(id));
    try {
      if (thread.isLiked) {
        await dispatch(unlikeThread(id)).unwrap();
      } else {
        await dispatch(likeThread(id)).unwrap();
      }
    } catch (error) {
      dispatch(toggleLike(id));
    }
  };
  
  const handleFollow = async () => {
    if (!viewedProfile?.id) return;
    const userId = viewedProfile.id;

    if (isFollowing) {
      setFollowingUsers((prev) => prev.filter((id) => id !== userId));
      await dispatch(unfollowUser(userId));
    } else {
      setFollowingUsers((prev) => [...prev, userId]);
      await dispatch(followUser(userId));
    }

    dispatch(getProfileById(userId)); // refresh viewed profile
    dispatch(getProfile()); // refresh current user
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
            {viewedProfile?.full_Name || "Loading..."}
          </h2>
          <span className="text-[13px] text-[#71767b]">
            {viewedProfileThreads?.length} posts
          </span>
        </div>
      </div>

      {/* Profile Cover & Info */}
      <div className="relative border-b border-[#2f3336]">
        {/* Cover Image Placeholder */}
        <div className="h-50 bg-[#333639] w-full"></div>

        {/* Profile Details Container */}
        <div className="px-4 pb-0">
          {/* Avatar & Edit Button */}
          <div className="flex justify-between items-start -mt-16 mb-3">
            <div className="w-[133.5px] h-[133.5px] rounded-full border-4 border-black bg-[#16181c] overflow-hidden">
              <img
                src={
                  viewedProfile?.photo_profile
                    ? getImageUrl(viewedProfile.photo_profile) || ""
                    : `https://ui-avatars.com/api/?name=${viewedProfile?.full_Name || "User"}&background=random`
                }
                alt={viewedProfile?.full_Name || "User avatar"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pt-3 mt-16">
              <Button
                disabled={isFollowing}
                onClick={handleFollow}
                className="bg-white border-[#536471] hover:text-white cursor-pointer text-black font-bold py-2 px-4 rounded-full shrink-0"
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-1">
            <h1 className="text-xl font-extrabold text-[#e7e9ea] leading-5">
              {viewedProfile?.full_Name || "Loading..."}
            </h1>
            <p className="text-[15px] text-[#71767b] mb-3">
              @{viewedProfile?.username || "loading"}
            </p>
            <p className="text-[15px] text-[#e7e9ea] mb-3 whitespace-pre-wrap">
              {viewedProfile?.bio || "No bio yet."}
            </p>

            <div className="flex gap-4 text-[15px]">
              <Link
                to={`/follow-list`}
                className="hover:underline cursor-pointer"
              >
                <span className="font-bold text-[#e7e9ea]">
                  {viewedProfile?.followingCount || 0}
                </span>
                <span className="text-[#71767b] ml-1">Following</span>
              </Link>
              <Link
                to={`/follow-list`}
                className="hover:underline cursor-pointer"
              >
                <span className="font-bold text-[#e7e9ea]">
                  {viewedProfile?.followersCount || 0}
                </span>
                <span className="text-[#71767b] ml-1">Followers</span>
              </Link>
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
          viewedProfileThreads.length > 0 ? (
            viewedProfileThreads.map((thread) => (
              <PostCard key={thread.id} thread={thread} onLike={handleLike} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <h3 className="text-[31px] font-extrabold text-[#e7e9ea] mb-2">
                No posts yet
              </h3>
              <p className="text-[#71767b] text-[15px]">
                When they post, their threads will show up here.
              </p>
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
          user={user}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </main>
  );
}
