import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAppSelector } from "@/redux/hooks";
import { useNavigate } from "react-router";
import { getImageUrl } from "@/services/api";
import { useEffect } from "react";
import { getProfile } from "@/redux/slices/authSlice";
import { fetchUserThreads } from "@/redux/slices/threadSlice";
import { useAppDispatch } from "@/redux/hooks";

export const CardProfile = () => {
  // const user = useAppSelector((state) => state.auth.user);
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const numericUserId = Number(user?.id);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(fetchUserThreads());
  }, [dispatch, numericUserId]);

  return (
    <div className="cursor-pointer" onClick={() => navigate("/profile")}>
      <Card className="relative mx-auto w-full max-w-sm pt-0 bg-[#16181c] border border-[#484e52]">
        {user?.photo_profile ? (
          <img
            src={getImageUrl(user.photo_profile) || ""}
            alt={user?.full_Name || "User Profile"}
            className="aspect-video w-full object-cover brightness-100"
          />
        ) : (
          <div className="aspect-video w-full bg-gray-700 flex items-center justify-center">
            <span className="font-bold text-4xl text-gray-300">
              {user?.full_Name?.charAt(0) ?? "U"}
            </span>
          </div>
        )}
        <CardHeader>
          <CardTitle className="font-bold text-[15px] text-[#e7e9ea] truncate">
            {user?.full_Name ?? "Unknown User"}
          </CardTitle>
          <CardDescription>{user?.bio || "No bio available."}</CardDescription>
          <div className="flex gap-x-12 text-sm text-gray-400 mt-2">
            <span>
              <strong className="text-white">
                {user?.followingCount ?? 0}
              </strong>{" "}
              Following
            </span>

            <span>
              <strong className="text-white">
                {user?.followersCount ?? 0}
              </strong>{" "}
              Followers
            </span>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
