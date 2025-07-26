import React, { memo, useMemo } from "react";
import type { ReactNode } from "react";

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = memo(({ icon, title, description }) => {
  // Memoizar clases CSS
  const cardClasses = useMemo(() => 
    "bg-gray-800 bg-opacity-50 rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-gray-700 w-full",
    []
  );

  const iconContainerClasses = useMemo(() => 
    "w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg",
    []
  );

  return (
    <article className={cardClasses}>
      <div className="flex justify-center mb-4">
        <div className={iconContainerClasses}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </article>
  );
});

Feature.displayName = "Feature";

const FeatureCards: React.FC = memo(() => {
  // Memoizar iconos SVG
  const heartIcon = useMemo(() => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-8 w-8 text-white" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
      />
    </svg>
  ), []);

  const communityIcon = useMemo(() => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-8 w-8 text-white" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
      />
    </svg>
  ), []);

  const starIcon = useMemo(() => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-8 w-8 text-white" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.28 9.482c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
      />
    </svg>
  ), []);

  // Memoizar datos de características
  const features = useMemo(() => [
    {
      icon: heartIcon,
      title: "Juega por los Niños",
      description: "El 100% de las ganancias se dona a fundaciones contra el cáncer infantil."
    },
    {
      icon: communityIcon,
      title: "Comunidad ULEAM",
      description: "Un proyecto con corazón, desarrollado por estudiantes para la comunidad."
    },
    {
      icon: starIcon,
      title: "Agradecemos tu Ayuda",
      description: "Cada partida, cada contribución, marca una gran diferencia. ¡Gracias por tu apoyo!"
    }
  ], [heartIcon, communityIcon, starIcon]);

  return (
    <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <Feature
          key={`feature-${index}`}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </section>
  );
});

FeatureCards.displayName = "FeatureCards";

export default FeatureCards;
