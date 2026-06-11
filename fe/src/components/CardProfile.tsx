import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { getProfile } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button } from "@/components/ui/button";

import { useAppSelector } from "@/redux/hooks";
import { useNavigate } from "react-router";
import { getImageUrl } from "@/services/api";

export const CardProfile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => navigate("/profile")}
    >
      <Card className="relative mx-auto w-full max-w-sm pt-0 bg-[#16181c] border border-[#484e52]">
        {user?.photo_profile && (
          <img
            src={getImageUrl(user.photo_profile) || ""}
            alt="Event cover"
            className="aspect-video w-full object-cover brightness-100"
          />
        )}
        <CardHeader>
          <CardTitle className="font-bold text-[15px] text-[#e7e9ea] truncate">
            {user?.full_Name}
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
