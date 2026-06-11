import LeftSidebar from "@/components/LeftContent";
import RightContent from "@/components/RightContent";
import MidContentProfile from "@/components/MidContentProfile";

export default function Profile() {
  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] flex justify-center ">
      <div className="w-full flex max-w-316.25">
        <LeftSidebar />

        <MidContentProfile />

        <RightContent />
      </div>
    </div>
  );
}
