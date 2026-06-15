import { useEffect, useRef } from "react";
import {
  addThread,
  fetchRepliesByThreadId,
  fetchThreadById,
  updateThreadLike,
} from "../redux/slices/threadSlice";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getImageUrl } from "@/services/api";
import {
  addNotification,
  fetchNotifications,
} from "../redux/slices/notificationSlice";

export const useWebSocket = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const selectedThread = useAppSelector((state) => state.thread.selectedThread);
  const selectedThreadRef = useRef(selectedThread);

  useEffect(() => {
    selectedThreadRef.current = selectedThread;
  }, [selectedThread]);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, currentUser?.id]);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
      if (currentUser?.id) {
        ws.send(
          JSON.stringify({
            type: "register",
            userId: currentUser.id,
          }),
        );
      }
    };

    ws.onmessage = (event) => {
      try {
        const { event: type, data } = JSON.parse(event.data);

        if (type === "new_thread") {
          dispatch(addThread(data));

          if (data.user.id !== currentUser?.id) {
            toast.custom(() => (
              <div className="flex items-center gap-3 bg-[#1d1f23] text-[#e7e9ea] px-4 py-3 rounded-xl shadow-lg">
                <img
                  src={getImageUrl(data.user.photo_profile) || ""}
                  alt={data.user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>
                  <span className="font-bold">{data.user.full_Name}</span>{" "}
                  posted a new thread!
                </span>
              </div>
            ));
          }
        }

        if (type === "new_reply") {
          if (selectedThreadRef.current?.id === data.threadId) {
            dispatch(fetchRepliesByThreadId(data.threadId));
            dispatch(fetchThreadById(data.threadId));
          }
          if (data.notification) {
            dispatch(addNotification(data.notification));
          }
          toast.custom(() => (
            <div className="flex items-center gap-3 bg-[#1d1f23] text-[#e7e9ea] px-4 py-3 rounded-xl shadow-lg">
              <img
                src={getImageUrl(data.replier.photo_profile) || ""}
                alt={data.replier.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>
                <span className="font-bold">{data.replier.full_Name}</span>{" "}
                replied to your thread!
              </span>
            </div>
          ));
        }

        if (type === "thread_liked") {
          dispatch(
            updateThreadLike({
              threadId: data.threadId,
              likeCount: data.likeCount,
            }),
          );
          if (data.notification) {
            dispatch(addNotification(data.notification));
          }
          toast.custom(() => (
            <div className="flex items-center gap-3 bg-[#1d1f23] text-[#e7e9ea] px-4 py-3 rounded-xl shadow-lg">
              <img
                src={getImageUrl(data.liker.photo_profile) || ""}
                alt={data.liker.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>
                <span className="font-bold">{data.liker.username}</span> liked
                your thread!
              </span>
            </div>
          ));
        }

        if (type === "thread_unliked") {
          dispatch(
            updateThreadLike({
              threadId: data.threadId,
              likeCount: data.likeCount,
            }),
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error", error);
    ws.onclose = () => console.log("WebSocket disconnected");
  }, [dispatch, currentUser?.id]);
};
