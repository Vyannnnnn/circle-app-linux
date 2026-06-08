import { useEffect } from "react";
import { addThread } from "../redux/slices/threadSlice";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useWebSocket = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => console.log("WebSocket connected");

    ws.onmessage = (event) => {
      const { event: type, data } = JSON.parse(event.data);

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
                <span className="font-bold">{data.user.full_Name}</span> posted a new thread!
              </span>
            </div>
          ));
        }
      }
    };

    ws.onerror = (error) => console.error("WebSocket error", error);
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, [dispatch, currentUser?.id]);
};