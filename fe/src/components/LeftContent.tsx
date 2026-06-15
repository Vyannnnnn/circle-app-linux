import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/services/api";
import { logoutUser } from "@/redux/slices/authSlice";
import { Link, useLocation } from "react-router";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import "../App.css";
import { House, Search, Bell, Mail, UserPen, Ellipsis } from "lucide-react";

export default function LeftSidebar() {
  const user = useAppSelector((state) => state.auth.user);
  const notifications = useAppSelector((state) => state.notification.notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const dispatch = useAppDispatch();
  const location = useLocation();
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const menus = [
    {
      label: "Home",
      icon: <House className="w-5 h-5" />,
      path: "/",
    },
    {
      label: "Explore",
      icon: <Search className="w-5 h-5" />,
      path: "/explore",
    },
    {
      label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      path: "/notifications",
    },
    {
      label: "Messages",
      
      icon: <Mail className="w-5 h-5" />,
      path: "/messages",
    },
    {
      label: "Profile",
      icon: <UserPen className="w-5 h-5" />,
      path: "/profile",
    },
    {
      label: "More",
      icon: <Ellipsis className="w-5 h-5" />  ,
      path: "/more",
    },
  ];

  return (
    <nav className="w-68.75 hide-scrollbar mt-2 hidden sm:flex flex-col sticky top-0 h-screen overflow-y-auto py-0 px-3 shrink-0">
      <Link
        to="/"
        className="cursor-pointer w-13 mt-10 mb-5 h-13 flex items-center justify-center transition-colors "
      >
        <h1 className="text-2xl font-extrabold text-white">Triple</h1>
      </Link>

      <div className="flex flex-col gap-y-4 mt-3">
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path;

          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`
        flex items-center gap-5 px-3.5 py-2.5 rounded-full
        transition-colors w-fit max-w-64
        ${
          isActive
            ? "bg-[#1d1f23] font-bold"
            : "bg-[#16181c] hover:bg-[#1d1f23]"
        }
      `}
            >
              <span className="text-lg">{menu.icon}</span>
              <span className="text-lg flex-1">{menu.label}</span>
              {menu.path === "/notifications" && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto bg-[#16181c] mb-3.5 flex items-center gap-3 px-3 py-3 rounded-full hover:bg-[#1d1f23] cursor-pointer transition-colors border border-[#484e52]">
        <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center font-bold text-[15px] text-white shrink-0">
          {user?.photo_profile ? (
            <img
              src={getImageUrl(user.photo_profile) || ""}
              alt={user.full_Name}
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <span>{user?.full_Name?.charAt(0).toUpperCase() || "U"}</span>
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
      <Button
        onClick={handleLogout}
        className="w-full mb-16 bg-red-500 hover:bg-red-600 text-white font-bold text-[17px] rounded-full py-4 mt-2 transition-colors"
      >
        Logout
      </Button>
    </nav>
  );
}
