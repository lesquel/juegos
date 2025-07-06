
import React from "react";
import Header from "./Header";
import WelcomeSection from "./WelcomeSection";
import ActionButtons from "./ActionButtons";
import FeatureCards from "./FeatureCards";

export const Home: React.FC = () => {
  return (
    <div className="w-full min-h-full">
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center gap-12">
          <Header />
          <WelcomeSection />
          <ActionButtons />
          <div className="w-full pt-12">
            <FeatureCards />
          </div>
        </div>
      </div>
    </div>
  );
};
