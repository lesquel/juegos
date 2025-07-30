import React from "react";

type GameTab = "offline" | "online" | "luck";

interface GamesTabSelectorProps {
  activeTab: GameTab;
  setActiveTab: (tab: GameTab) => void;
}

const GamesTabSelector = ({ activeTab, setActiveTab }: GamesTabSelectorProps) => {
  const tabs = [
    { id: "offline", label: "🎮 Juegos Offline", icon: "🎯" },
    { id: "online", label: "🌐 Juegos Online", icon: "👥" },
    { id: "luck", label: "🎰 Juegos de Azar", icon: "🍀" }
  ];

  const tabClass = (tab: GameTab) =>
    `relative px-8 py-4 rounded-2xl font-bold transition-all duration-300 focus:outline-none transform hover:scale-105 ${
      activeTab === tab
        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-2xl shadow-purple-500/25 border-2 border-white/20"
        : "bg-white/10 backdrop-blur-sm text-gray-300 hover:text-white hover:bg-white/20 border-2 border-white/10 hover:border-white/30"
    }`;

  return (
    <div className="flex justify-center mb-12">
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-2 border border-white/10 shadow-2xl">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={tabClass(tab.id as GameTab)}
              onClick={() => setActiveTab(tab.id as GameTab)}
              type="button"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">{tab.icon}</span>
                <span className="text-lg">{tab.label}</span>
              </span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesTabSelector;
