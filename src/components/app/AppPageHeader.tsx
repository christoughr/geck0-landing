type AppPageHeaderProps = {
  title: string;
  description: string;
};

export default function AppPageHeader({ title, description }: AppPageHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-2xl">{description}</p>
    </header>
  );
}
