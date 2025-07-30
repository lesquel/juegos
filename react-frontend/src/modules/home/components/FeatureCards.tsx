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
    <article className="group relative transform transition-all duration-500 hover:scale-105 h-full rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 text-center hover:bg-white/15 hover:border-white/30 flex flex-col gap-4 sm:gap-6 shadow-2xl overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative">
        <div className="flex justify-center items-center mb-2">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl p-1 group-hover:scale-110 transition-transform duration-500">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              {icon}
            </div>
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 sm:mb-4">
          {title}
        </h3>
        <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
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
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-6">
        {features.map((feature, _index) => (
          <Feature
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
});

FeatureCards.displayName = "FeatureCards";

export default FeatureCards;
