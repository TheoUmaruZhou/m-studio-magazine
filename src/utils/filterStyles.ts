export const getFilterCss = (filter: string) => {
  switch (filter) {
    case 'bw':
      return 'grayscale(100%) contrast(125%) brightness(95%)';
    case 'high-contrast':
      return 'contrast(160%) brightness(90%) saturate(110%)';
    case 'vintage':
      return 'sepia(40%) contrast(115%) saturate(85%) hue-rotate(-10deg)';
    case 'soft-warm':
      return 'sepia(15%) saturate(115%) brightness(102%) contrast(98%)';
    case 'cold-film':
      return 'hue-rotate(15deg) contrast(110%) saturate(90%) brightness(98%)';
    case 'normal':
    default:
      return 'none';
  }
};
