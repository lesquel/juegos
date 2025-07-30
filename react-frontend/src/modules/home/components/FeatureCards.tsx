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
    <article className="group relative transform transition-all duration-500 hover:scale-105 h-full rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-10 sm:p-12 lg:p-16 xl:p-20 text-center hover:bg-white/15 hover:border-white/30 flex flex-col gap-8 sm:gap-10 lg:gap-12 shadow-2xl overflow-hidden min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative space-y-6 sm:space-y-8 lg:space-y-10 flex-grow flex flex-col justify-center">
        <div className="flex justify-center items-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl p-1 group-hover:scale-110 transition-transform duration-500">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              {icon}
            </div>
          </div>
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight px-4 sm:px-6">
          {title}
        </h3>
        <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-200 leading-relaxed px-4 sm:px-6 lg:px-8 font-medium">
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
  const heartIcon = useMemo(() => <Heart className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />, []);

  const communityIcon = useMemo(
    () => <ChartArea className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />,
    []
  );

  const starIcon = useMemo(() => <Star className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-white" />, []);

  // Memoizar datos de características
  const features = useMemo(
    () => [
      {
        icon: communityIcon,
        title: "Comunidad ULEAM",
        description:
          "Un proyecto con corazón, desarrollado por estudiantes para la comunidad.",
      },
      {
        icon: heartIcon,
        title: "Proyecto Educativo",
        description:
          "Enfocado en el aprendizaje y desarrollo de habilidades tecnológicas.",
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
    <section className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 xl:gap-20 max-w-7xl mx-auto">
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
