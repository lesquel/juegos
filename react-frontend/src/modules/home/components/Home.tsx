
import React, { memo } from "react";
import Header from "./Header";
import WelcomeSection from "./WelcomeSection";
import ActionButtons from "./ActionButtons";
import FeatureCards from "./FeatureCards";

export const Home: React.FC = memo(() => {
  return (
    <div className="w-full">
      <div className="px-4 py-16">
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
