import { Button } from "@/components/ui/button";
import { authAPI, getImageUrl } from "@/services/api";
import { logout } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  BellIcon,
  HomeIcon,
  MailIcon,
  MoreIcon,
  ProfileIcon,
  SearchIcon,
} from "./icons/svgIcons";

const NAV_ITEMS = [
  { icon: <HomeIcon filled />, label: "Home", active: true },
  { icon: <SearchIcon />, label: "Explore" },
  { icon: <BellIcon />, label: "Notifications" },
  { icon: <MailIcon />, label: "Messages" },
  { icon: <ProfileIcon />, label: "Profile" },
  { icon: <MoreIcon />, label: "More" },
];

export default function LeftSidebar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await authAPI.logout();
    dispatch(logout());
    navigate("/login");
  };
  const [activeNav, setActiveNav] = useState(0);

  return (
    <nav className="w-68.75 mt-2 hidden sm:flex flex-col sticky top-0 h-screen overflow-y-auto py-0 px-3 shrink-0">
      <Button className="w-13 h-13 flex items-center justify-center rounded-full hover:bg-[#1d1f23] transition-colors mt-0 mb-1">
        <h1 className="font-bold text-xl">Circle</h1>
      </Button>

      <div className="flex flex-col gap-y-3 mt-3">
        {NAV_ITEMS.map((item, i) => (
          <Button
            key={item.label}
            onClick={() => {
              setActiveNav(i);
            }}
            className="flex items-center gap-5 px-3 py-3 rounded-full hover:bg-[#1d1f23] transition-colors w-fit max-w-62.5"
          >
            <span
              className={i === activeNav ? "text-[#e7e9ea]" : "text-[#e7e9ea]"}
            >
              {item.icon}
            </span>
            <span
              className={`text-xl ${i === activeNav ? "font-bold" : "font-normal"} text-[#e7e9ea]`}
            >
              {item.label}
            </span>
          </Button>
        ))}
      </div>

      <Button
        onClick={() => {}}
        className="w-[90%] bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-[17px] rounded-full py-4 mt-4 transition-colors"
      >
        Post
      </Button>

      <Button
        onClick={handleLogout}
        className="w-[90%] bg-red-500 hover:bg-red-600 text-white font-bold text-[17px] rounded-full py-4 mt-3 transition-colors"
      >
        Logout
      </Button>

      <div className="mt-auto mb-4 flex items-center gap-3 px-3 py-3 rounded-full hover:bg-[#1d1f23] cursor-pointer transition-colors">
        <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center font-bold text-[15px] text-white shrink-0">
          {user?.photo_profile && (
            <img
              src={getImageUrl(user.photo_profile) || ""}
              alt={user.full_Name}
              className="object-cover w-full h-full rounded-full"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[15px] text-[#e7e9ea] truncate">
            {user?.full_Name || "User"}
          </p>
          <p className="text-[#71767b] text-[15px] truncate">
            @{user?.username || "username"}
          </p>
        </div>
        <span className="text-[#71767b] text-lg">···</span>
      </div>
    </nav>
  );
}
