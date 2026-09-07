export type TabKey = 'all' | 'graphic_design' | 'video_editing' | 'digital_marketing';

interface FilterTabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Home (All Work)' },
  { key: 'graphic_design', label: 'Graphic Design' },
  { key: 'video_editing', label: 'Video Editing' },
  { key: 'digital_marketing', label: 'Digital Marketing' },
];

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div id="projects" className="scroll-mt-8">
      <div className="flex items-center justify-center mb-8">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
          My <span className="text-gradient-cyan">Work</span>
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === tab.key
                ? 'gradient-cyan text-white glow-cyan'
                : 'glass-light text-slate-400 hover:text-white hover:border-cyan-400/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
