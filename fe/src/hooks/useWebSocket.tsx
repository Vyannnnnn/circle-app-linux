import { useEffect } from "react";
import { addThread, fetchRepliesByThreadId, fetchThreadById, updateThreadLike } from "../redux/slices/threadSlice";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useWebSocket = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const selectedThread = useAppSelector((state) => state.thread.selectedThread);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

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
      const { event: type, data } = JSON.parse(event.data);
      console.log("WebSocket message received:", type, data);

      if (type === "new_thread") {
        dispatch(addThread(data));

        if (data.user.id !== currentUser?.id) {
          toast.custom(() => (
            <div className="flex items-center gap-3 bg-[#1d1f23] text-[#e7e9ea] px-4 py-3 rounded-xl shadow-lg">
              <img
                src={data.user.photo_profile ?? ""}
                alt={data.user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>
                <span className="font-bold">{data.user.full_Name}</span> posted
                a new thread!
              </span>
            </div>
          ));
        }
      }

      if (type === "new_reply") {
        if (selectedThread?.id === data.threadId) {
          dispatch(fetchRepliesByThreadId(data.threadId));
          dispatch(fetchThreadById(data.threadId));
          // Optionally add the reply to the thread list
        }
        toast.custom(() => (
          <div className="flex items-center gap-3 bg-[#1d1f23] text-[#e7e9ea] px-4 py-3 rounded-xl shadow-lg">
            <img
              src={data.replier.photo_profile ?? ""}
              alt={data.replier.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>
              <span className="font-bold">{data.replier.full_Name}</span>{" "}
              replied to your thread!
            </span>
          </div>
        ));
        console.log(selectedThread?.id, data.threadId);
      }

      if (type === "thread_liked") {
        if (selectedThread?.id === data.threadId) {
          dispatch(updateThreadLike(data.likeCount));
        }
      }
    };

    ws.onerror = (error) => console.error("WebSocket error", error);
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, [dispatch, currentUser?.id, selectedThread?.id]);
};
