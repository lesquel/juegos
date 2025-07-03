// src/components/Home.tsx
import React from "react";
import Header from "./Header";
import WelcomeSection from "./WelcomeSection";
import ActionButtons from "./ActionButtons";
import FeatureCards from "./FeatureCards";

export const Home: React.FC = () => {
  return (
    <div className="w-full p-6 flex flex-col flex-1 gap-6 justify-center items-center linear">
      <Header />
      {/* Aca se deberia de poner el svg ese pensado que tengo que es como flotante */}
      <div className="relative w-24 h-24 rounded-full bg-red-500 flex items-center justify-center">
        <img
          src="/placeholder-avatar.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <WelcomeSection />
      <ActionButtons />
      {/* En caso de que las quiera usar, prob si */}
      {/* <FeatureCards /> */}
    </div>
  );
};
