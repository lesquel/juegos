// src/components/FeatureCards.tsx
import React from "react";

const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: "❤️", // Placeholder para SVG
      text: "Juega por lo niños",
      bgColor: "bg-red-50", // Color de fondo claro
      textColor: "text-red-700", // Color de texto oscuro
    },
    {
      icon: "👥", // Placeholder para SVG
      text: "Creado por la comunidad de la ULEAM",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      icon: "🏆", // Placeholder para SVG
      text: "Agradecemos tu ayuda",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
  ];

  return (
    <div
      className="flex flex-col justify-center items-center gap-2 w-full"
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 p-2 w-full rounded-lg flex-1 max-w-xs text-sm ${feature.bgColor} ${feature.textColor} font-medium`}
        >
          <span className="text-2xl">{feature.icon}</span>
          <p className="m-0">{feature.text}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;