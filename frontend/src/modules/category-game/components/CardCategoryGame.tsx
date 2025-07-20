import type { CategoryGame } from "../models/category-game.model";

export const CardCategoryGame = ({ category }: { category: CategoryGame }) => {
  const { category_id, category_name, category_img, category_description } = category;

  return (
    <a
      href={`/category-games/${category_id}`}
      className="relative block rounded-2xl overflow-hidden group transform transition-all duration-300 ease-in-out hover:scale-105 shadow-lg"
    >
      <div className="absolute inset-0 bg-black opacity-50 z-10 group-hover:opacity-60 transition-opacity duration-300"></div>
      <div
        className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-500 transition-all duration-300 z-20"
        style={{ boxShadow: '0 0 15px rgba(128, 90, 213, 0), 0 0 25px rgba(128, 90, 213, 0)' }}
      ></div>
      <img
        src={category_img}
        alt={category_name}
        className="w-full h-64 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{category_name}</h2>
        <p className="text-gray-300 text-sm mb-4 h-10 overflow-hidden">{category_description}</p>
        <div className="flex items-center text-purple-400 font-semibold group-hover:text-purple-300 transition-colors duration-300">
          <span>Explorar Juegos</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </a>
  );
};
