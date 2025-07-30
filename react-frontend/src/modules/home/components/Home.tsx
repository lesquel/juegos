
import React, { memo } from "react";
import Header from "./Header";
import WelcomeSection from "./WelcomeSection";
import ActionButtons from "./ActionButtons";
import FeatureCards from "./FeatureCards";

export const Home: React.FC = memo(() => {
  return (
    <div className="w-full flex justify-center px-6 sm:px-8 lg:px-12 xl:px-16">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col items-center justify-center gap-20 sm:gap-24 lg:gap-32 xl:gap-40 text-center py-12 sm:py-16 lg:py-20 xl:py-24">
          <Header />
          <WelcomeSection />
          <ActionButtons />
          <div className="w-full flex justify-center items-center pt-8 sm:pt-12 lg:pt-16">
            <FeatureCards />
          </div>
        </div>
      </div>
    </div>
  );
});

Home.displayName = "Home";
