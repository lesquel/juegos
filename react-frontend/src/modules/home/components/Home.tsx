
import React, { memo } from "react";
import Header from "./Header";
import WelcomeSection from "./WelcomeSection";
import ActionButtons from "./ActionButtons";
import FeatureCards from "./FeatureCards";

export const Home: React.FC = memo(() => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-16 text-center max-w-6xl mx-auto">
          <Header />
          <WelcomeSection />
          <ActionButtons />
          <div className="w-full flex justify-center items-center">
            <FeatureCards />
          </div>
        </div>
      </div>
    </div>
  );
});

Home.displayName = "Home";
