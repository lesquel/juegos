import { ChartArea, Heart, Star } from "lucide-react";
import React, { memo, useMemo } from "react";
import type { ReactNode } from "react";

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = memo(({ icon, title, description }) => {
  return (
    <article className="transform transition-all duration-300 hover:scale-105 h-full rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center hover:bg-white/20 hover:border-white/30 flex flex-col gap-4 shadow-xl">
      <div className="flex justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-gray-300 text-base leading-relaxed">{description}</p>
    </article>
  );
});

Feature.displayName = "Feature";

const FeatureCards: React.FC = memo(() => {
  // Memoizar iconos
  const heartIcon = useMemo(() => <Heart className="h-6 w-6 text-white" />, []);

  const communityIcon = useMemo(
    () => <ChartArea className="h-6 w-6 text-white" />,
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
    <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {features.map((feature, _index) => (
        <Feature
          key={feature.title}
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
