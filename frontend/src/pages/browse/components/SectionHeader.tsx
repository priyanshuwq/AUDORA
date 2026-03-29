interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1 text-white">{title}</h2>
      <p className="text-sm text-zinc-400">{subtitle}</p>
    </div>
  );
};

export default SectionHeader;
