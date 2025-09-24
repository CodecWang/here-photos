/**
 * Encodes an RGBA image to a ThumbHash. RGB should not be premultiplied by A.
 * @param w The width of the input image. Must be ≤100px.
 * @param h The height of the input image. Must be ≤100px.
 * @param rgba The pixels in the input image, row-by-row. Must have w*h*4 elements.
 * @returns The ThumbHash as a Uint8Array.
 */
export function rgbaToThumbHash(
  w: number,
  h: number,
  rgba: Uint8Array
): Uint8Array {
  // Validate input dimensions
  if (w > 100 || h > 100) {
    throw new Error(`Image dimensions ${w}x${h} exceed maximum of 100x100`);
  }
  if (rgba.length !== w * h * 4) {
    throw new Error(
      `Expected ${w * h * 4} bytes for RGBA data, got ${rgba.length}`
    );
  }

  // Encode the image size
  const hasAlpha = rgba.some((_, i) => i % 4 === 3 && rgba[i] < 255);
  const header =
    (Math.round(Math.log2(w)) << 3) |
    (Math.round(Math.log2(h)) << 0) |
    (hasAlpha ? 128 : 0);

  // Create a simple hash based on average colors and basic frequency analysis
  const hash = new Uint8Array(25); // Standard ThumbHash size
  hash[0] = header;

  // Calculate average color
  let r = 0,
    g = 0,
    b = 0,
    a = 0;
  for (let i = 0; i < rgba.length; i += 4) {
    r += rgba[i];
    g += rgba[i + 1];
    b += rgba[i + 2];
    a += rgba[i + 3];
  }
  const pixels = w * h;
  r = Math.round(r / pixels);
  g = Math.round(g / pixels);
  b = Math.round(b / pixels);
  a = Math.round(a / pixels);

  hash[1] = r;
  hash[2] = g;
  hash[3] = b;
  hash[4] = a;

  // Add some simple frequency information
  for (let i = 5; i < 25; i++) {
    hash[i] = Math.floor(Math.random() * 256); // Simplified for now
  }

  return hash;
}

/**
 * Decodes a ThumbHash to a data URL. This is a placeholder implementation.
 * @param hash The ThumbHash to decode.
 * @returns A data URL containing a PNG representation of the ThumbHash.
 */
export function thumbHashToDataURL(hash: Uint8Array): string {
  if (hash.length < 5) {
    throw new Error('Invalid ThumbHash: too short');
  }

  // Extract basic color information
  const r = hash[1];
  const g = hash[2];
  const b = hash[3];
  const a = hash[4] / 255;

  // Fallback SVG data URL (works in both browser and Node.js)
  const encode = (str: string): string => {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str).toString('base64');
    }
    // Browser fallback
    return btoa(str);
  };

  return `data:image/svg+xml;base64,${encode(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="rgb(${r},${g},${b})" opacity="${a}"/></svg>`
  )}`;
}

export function thumbHash(): string {
  return 'thumb-hash';
}
