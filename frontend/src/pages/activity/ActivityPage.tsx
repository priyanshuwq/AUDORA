import Topbar from "@/components/Topbar";
import ActivityBar from "@/components/ActivityBar";

const ActivityPage = () => {
  return (
    <main className="rounded-none sm:rounded-xl overflow-hidden h-full bg-zinc-950/90 backdrop-blur-sm flex flex-col mb-32 md:mb-0">
      <Topbar />
      <div className="flex-1 min-h-0">
        <ActivityBar />
      </div>
    </main>
  );
};

export default ActivityPage;
