// Inline SVG fallback images as data URLs to prevent loading issues
const SVG_PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30,40 L70,40 L70,60 L30,60 Z' fill='%23cccccc'/%3E%3Cpath d='M40,30 L60,30 L60,70 L40,70 Z' fill='%23cccccc'/%3E%3C/svg%3E`;

// Constants for fallback images (all using the same SVG with different sizes)
export const FALLBACK_IMAGE_SMALL = SVG_PLACEHOLDER;
export const FALLBACK_IMAGE_MEDIUM = SVG_PLACEHOLDER;
export const FALLBACK_IMAGE_LARGE = SVG_PLACEHOLDER;

// Fallback image based on size
export const getFallbackImage = (size = 'medium') => {
  // All sizes use the same SVG, the browser will scale it
  return SVG_PLACEHOLDER;
}; 