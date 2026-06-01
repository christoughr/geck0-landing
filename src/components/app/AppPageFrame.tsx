type AppPageFrameProps = {
  children: React.ReactNode;
  /** Wider layout for graph / dashboard */
  wide?: boolean;
};

export default function AppPageFrame({ children, wide }: AppPageFrameProps) {
  return (
    <div className={`w-full mx-auto ${wide ? "max-w-6xl" : "max-w-4xl"}`}>{children}</div>
  );
}
