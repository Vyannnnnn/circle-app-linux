import LeftContent from "@/components/LeftContent";
import RightContent from "@/components/RightContent";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] flex justify-center">
      <div className="w-full flex max-w-316.25">
        <LeftContent />
        {children}
        <RightContent />
      </div>
    </div>
  );
}
