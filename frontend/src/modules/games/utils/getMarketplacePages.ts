export const getMarketplacePages = () => {
  const pages = import.meta.glob("/src/pages/play/marketplace/*.astro");

  return Object.keys(pages).map((rutes) => {
    const url = rutes
      .replace("/src/pages/play/marketplace/", "play/marketplace/")
      .replace(".astro", "");

    const name = url.replace("play/marketplace/", "");
    return {
      url,
      name,
      path: rutes,
    };
  });
};
