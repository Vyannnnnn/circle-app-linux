import LeftSidebar from "../components/LeftContent";
import MidContent from "../components/MidContent";
import RightContent from "@/components/RightContent";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] flex justify-center ">
      <div className="w-full flex max-w-316.25">
        <LeftSidebar />

        <MidContent />

        <RightContent />
      </div>
    </div>
  );
}
