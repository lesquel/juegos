
import React, { memo } from "react";
import Header from "./Header";
import WelcomeSection from "./WelcomeSection";
import ActionButtons from "./ActionButtons";
import FeatureCards from "./FeatureCards";

export const Home: React.FC = memo(() => {
  return (
    <div className="w-full bg-gray-900 text-white flex-grow h-screen flex items-center justify-center">
      <div className="h-full mx-auto flex flex-col items-center justify-center gap-12 text-center max-w-4xl">
        <Header />
        <WelcomeSection />
        <ActionButtons />
        <div className="w-full flex justify-center items-center">
          <FeatureCards />
        </div>
      </div>
    </div>
  );
});

Home.displayName = "Home";
