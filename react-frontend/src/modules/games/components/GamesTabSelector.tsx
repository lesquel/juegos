import React from "react";

type GameTab = "offline" | "online" | "luck";

interface GamesTabSelectorProps {
  activeTab: GameTab;
  setActiveTab: (tab: GameTab) => void;
}

const GamesTabSelector = ({ activeTab, setActiveTab }: GamesTabSelectorProps) => {
  const tabClass = (tab: GameTab) =>
    `px-6 py-2 rounded-b-lg font-semibold transition-colors duration-200 focus:outline-none ${activeTab === tab
      ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-white shadow-lg"
      : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
    }`;
  return (
    <div className="flex justify-center mb-8">
      <button className={tabClass("offline")} onClick={() => setActiveTab("offline")} type="button">
        Juegos Offline
      </button>
      <button className={tabClass("online")} onClick={() => setActiveTab("online")} type="button">
        Juegos Online
      </button>
      <button className={tabClass("luck")} onClick={() => setActiveTab("luck")} type="button">
        Juegos de Azar
      </button>
    </div>
  );
};

export default GamesTabSelector;
