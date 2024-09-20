/**
 * Encodes an RGBA image to a ThumbHash. RGB should not be premultiplied by A.
 *
 * @param w The width of the input image. Must be ≤100px.
 * @param h The height of the input image. Must be ≤100px.
 * @param rgba The pixels in the input image, row-by-row. Must have w*h*4 elements.
 * @returns The ThumbHash as a Uint8Array.
 */
export function rgbaToThumbHash(w: number, h: number, rgba: ArrayLike<number>) {
  // Encoding an image larger than 100x100 is slow with no benefit
  if (w > 100 || h > 100) throw new Error(`${w}x${h} doesn't fit in 100x100`);
  const { PI, round, max, cos, abs } = Math;

  // Determine the average color
  let avg_r = 0,
    avg_g = 0,
    avg_b = 0,
    avg_a = 0;
  for (let i = 0, j = 0; i < w * h; i++, j += 4) {
    const alpha = rgba[j + 3] / 255;
    avg_r += (alpha / 255) * rgba[j];
    avg_g += (alpha / 255) * rgba[j + 1];
    avg_b += (alpha / 255) * rgba[j + 2];
    avg_a += alpha;
  }
  if (avg_a) {
    avg_r /= avg_a;
    avg_g /= avg_a;
    avg_b /= avg_a;
  }

  const hasAlpha = avg_a < w * h;
  const l_limit = hasAlpha ? 5 : 7; // Use fewer luminance bits if there's alpha
  const lx = max(1, round((l_limit * w) / max(w, h)));
  const ly = max(1, round((l_limit * h) / max(w, h)));
  const l = []; // luminance
  const p = []; // yellow - blue
  const q = []; // red - green
  const a = []; // alpha

  // Convert the image from RGBA to LPQA (composite atop the average color)
  for (let i = 0, j = 0; i < w * h; i++, j += 4) {
    const alpha = rgba[j + 3] / 255;
    const r = avg_r * (1 - alpha) + (alpha / 255) * rgba[j];
    const g = avg_g * (1 - alpha) + (alpha / 255) * rgba[j + 1];
    const b = avg_b * (1 - alpha) + (alpha / 255) * rgba[j + 2];
    l[i] = (r + g + b) / 3;
    p[i] = (r + g) / 2 - b;
    q[i] = r - g;
    a[i] = alpha;
  }

  // Encode using the DCT into DC (constant) and normalized AC (varying) terms
  const encodeChannel = (channel, nx, ny) => {
    const ac = [];
    const fx = [];
    let dc = 0,
      scale = 0;
    for (let cy = 0; cy < ny; cy++) {
      for (let cx = 0; cx * ny < nx * (ny - cy); cx++) {
        let f = 0;
        for (let x = 0; x < w; x++) fx[x] = cos((PI / w) * cx * (x + 0.5));
        for (let y = 0; y < h; y++)
          for (let x = 0, fy = cos((PI / h) * cy * (y + 0.5)); x < w; x++)
            f += channel[x + y * w] * fx[x] * fy;
        f /= w * h;
        if (cx || cy) {
          ac.push(f);
          scale = max(scale, abs(f));
        } else {
          dc = f;
        }
      }
    }
    if (scale)
      for (let i = 0; i < ac.length; i++) ac[i] = 0.5 + (0.5 / scale) * ac[i];
    return [dc, ac, scale];
  };
  const [l_dc, l_ac, l_scale] = encodeChannel(l, max(3, lx), max(3, ly));
  const [p_dc, p_ac, p_scale] = encodeChannel(p, 3, 3);
  const [q_dc, q_ac, q_scale] = encodeChannel(q, 3, 3);
  const [a_dc, a_ac, a_scale] = hasAlpha ? encodeChannel(a, 5, 5) : [];

  // Write the constants
  const isLandscape = w > h;
  const header24 =
    round(63 * (l_dc as number)) |
    (round(31.5 + 31.5 * (p_dc as number)) << 6) |
    (round(31.5 + 31.5 * (q_dc as number)) << 12) |
    (round(31 * (l_scale as number)) << 18) |
    ((hasAlpha ? 1 : 0) << 23);
  const header16 =
    (isLandscape ? ly : lx) |
    (round(63 * (p_scale as number)) << 3) |
    (round(63 * (q_scale as number)) << 9) |
    ((isLandscape ? 1 : 0) << 15);
  const hash = [
    header24 & 255,
    (header24 >> 8) & 255,
    header24 >> 16,
    header16 & 255,
    header16 >> 8,
  ];
  const ac_start = hasAlpha ? 6 : 5;
  let ac_index = 0;
  if (hasAlpha)
    hash.push(
      round(15 * (a_dc as number)) | (round(15 * (a_scale as number)) << 4)
    );

  // Write the varying factors
  for (const ac of hasAlpha ? [l_ac, p_ac, q_ac, a_ac] : [l_ac, p_ac, q_ac])
    for (const f of ac as number[])
      hash[ac_start + (ac_index >> 1)] |=
        round(15 * f) << ((ac_index++ & 1) << 2);
  return new Uint8Array(hash);
}
