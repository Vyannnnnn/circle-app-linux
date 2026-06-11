import LeftSidebar from "../components/LeftContent";
import MidContentFollows from "../components/MidContentFollow";
import RightContent from "@/components/RightContent";

export default function FollowList() {
  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] flex justify-center ">
      <div className="w-full flex max-w-316.25">
        <LeftSidebar />

        <MidContentFollows />

        <RightContent />
      </div>
    </div>
  );
}
