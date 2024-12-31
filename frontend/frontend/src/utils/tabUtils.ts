// src/utils/tabUtils.ts
export const getTabClass = (currentPath: string, path: string) => {
  return currentPath === path
    ? "bg-blue-200 border-blue-500 text-blue-700" // Classe ativa
    : "bg-white-A700 border-gray-700 text-gray-500"; // Classe inativa
};
