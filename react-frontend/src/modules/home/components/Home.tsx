
import React, { memo } from "react";
import Header from "./Header";
import WelcomeSection from "./WelcomeSection";
import ActionButtons from "./ActionButtons";
import FeatureCards from "./FeatureCards";

export const Home: React.FC = memo(() => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col items-center justify-center gap-12 sm:gap-16 text-center">
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
