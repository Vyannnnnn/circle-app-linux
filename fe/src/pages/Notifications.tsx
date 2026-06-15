import { useEffect } from "react";
import { AppLayout } from "./AppLayout";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchNotifications, markAsRead } from "@/redux/slices/notificationSlice";
import { getImageUrl } from "@/services/api";

export default function Notifications() {
  const dispatch = useAppDispatch();
  const { notifications, loading } = useAppSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleRead = (id: number, isRead: boolean) => {
    if (!isRead) {
      dispatch(markAsRead(id));
    }
  };

  return (
    <AppLayout>
      <main className="flex-1 border-x border-[#2f3336] min-h-screen max-w-150">
        <div className="sticky top-0 bg-black/85 backdrop-blur-md z-10 border-b border-[#2f3336]">
          <div className="flex items-center px-4 h-13.25">
            <h1 className="text-xl font-bold text-[#e7e9ea]">Notifications</h1>
          </div>
        </div>

        <div className="flex flex-col">
          {loading && notifications.length === 0 ? (
            <div className="p-4 text-center text-[#71767b]">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-[#71767b]">
              <p className="text-xl font-bold text-[#e7e9ea] mb-2">Nothing to see here</p>
              <p>When someone likes or replies to your thread, you'll see it here.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleRead(notif.id, notif.isRead)}
                className={`flex gap-3 px-4 py-4 border-b border-[#2f3336] cursor-pointer transition-colors ${
                  !notif.isRead ? "bg-[#081a26] hover:bg-[#0c2436]" : "hover:bg-[#080808]"
                }`}
              >
                <img
                  src={getImageUrl(notif.sender.photo_profile) || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"}
                  alt={notif.sender.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <div className="text-[15px] text-[#e7e9ea]">
                    <span className="font-bold">{notif.sender.full_Name}</span>
                    {notif.type === "LIKE" && " liked your thread."}
                    {notif.type === "REPLY" && " replied to your thread."}
                    {notif.type === "FOLLOW" && " followed you."}
                  </div>
                  <div className="text-[13px] text-[#71767b] mt-1">
                    {new Date(notif.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </AppLayout>
  );
}
