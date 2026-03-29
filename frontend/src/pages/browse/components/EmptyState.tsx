import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  iconClassName = "text-zinc-600",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Icon className={`w-16 h-16 ${iconClassName}`} />
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-zinc-400">{description}</p>
      </div>
    </div>
  );
};

export default EmptyState;
