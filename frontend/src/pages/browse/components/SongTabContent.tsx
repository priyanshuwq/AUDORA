import { LucideIcon } from "lucide-react";
import { Song } from "@/types";
import SongGridSkeleton from "./SongGridSkeleton";
import EmptyState from "./EmptyState";
import SectionHeader from "./SectionHeader";
import SongGrid from "./SongGrid";
import { ReactNode } from "react";

interface SongTabContentProps {
  title: string;
  subtitle: string;
  songs: Song[];
  isLoading: boolean;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  renderAdditionalInfo?: (song: Song) => ReactNode;
}

const SongTabContent = ({
  title,
  subtitle,
  songs,
  isLoading,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  renderAdditionalInfo,
}: SongTabContentProps) => {
  return (
    <div className="space-y-6">
      <SectionHeader title={title} subtitle={subtitle} />

      {isLoading ? (
        <SongGridSkeleton count={12} />
      ) : songs.length === 0 ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <SongGrid
          songs={songs}
          renderAdditionalInfo={renderAdditionalInfo}
        />
      )}
    </div>
  );
};

export default SongTabContent;
