import { ChartArea, Heart, Star } from "lucide-react";
import React, { memo, useMemo } from "react";
import type { ReactNode } from "react";

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = memo(({ icon, title, description }) => {
  // Memoizar clases CSS
  const cardClasses = useMemo(
    () =>
      "bg-gray-800 bg-opacity-50 rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-gray-700 w-full",
    []
  );

  const iconContainerClasses = useMemo(
    () =>
      "w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg",
    []
  );

  return (
    <article className={cardClasses}>
      <div className="flex justify-center mb-4">
        <div className={iconContainerClasses}>{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </article>
  );
});

Feature.displayName = "Feature";

const FeatureCards: React.FC = memo(() => {
  // Memoizar iconos SVG
  const heartIcon = useMemo(() => <Heart className="h-8 w-8 text-white" />, []);

  const communityIcon = useMemo(
    () => <ChartArea className="h-8 w-8 text-white" />,
    []
  );

  const starIcon = useMemo(() => <Star className="h-8 w-8 text-white" />, []);

  // Memoizar datos de características
  const features = useMemo(
    () => [
      {
        icon: heartIcon,
        title: "Juega por los Niños",
        description:
          "El 100% de las ganancias se dona a fundaciones contra el cáncer infantil.",
      },
      {
        icon: communityIcon,
        title: "Comunidad ULEAM",
        description:
          "Un proyecto con corazón, desarrollado por estudiantes para la comunidad.",
      },
      {
        icon: starIcon,
        title: "Agradecemos tu Ayuda",
        description:
          "Cada partida, cada contribución, marca una gran diferencia. ¡Gracias por tu apoyo!",
      },
    ],
    [heartIcon, communityIcon, starIcon]
  );

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
