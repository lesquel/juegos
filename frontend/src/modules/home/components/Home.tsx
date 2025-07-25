
import React, { memo } from "react";
import Header from "./Header";
import WelcomeSection from "./WelcomeSection";
import ActionButtons from "./ActionButtons";
import FeatureCards from "./FeatureCards";

export const Home: React.FC = memo(() => {
  return (
    <div className="w-full min-h-full py-8 md:py-0">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-12">
          <Header />
          <WelcomeSection />
          <ActionButtons />
          <div className="w-full md:pb-0">
            <FeatureCards />
          </div>
        </div>
      </div>
    </div>
  );
});

Home.displayName = "Home";
