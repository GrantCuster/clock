export function getTargetDimensions(digit: string) {
  const targetWidth = digit === ":" ? 220 : 440;
  const targetHeight = digit === "AM" || digit === "PM" ? 400 : 800;
  return { targetWidth, targetHeight };
}
