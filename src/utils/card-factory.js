export function createEmptyCard(index) {
  return {
    id: `empty-${index}`,
    code: null,
    image: null,
    images: {
      svg: null,
      png: null,
    },
    value: null,
    suit: null,
    isPlaceholder: true
  }
}