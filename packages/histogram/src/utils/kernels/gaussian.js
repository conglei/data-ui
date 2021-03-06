/*
 * Returns an Epanechnikov (parabolic) kernel function which takes a
 * free smoothing parameter as input.
 * code from https://gist.github.com/mbostock/4341954
 * kernel info https://en.wikipedia.org/wiki/Kernel_(statistics)
 */
export default function kernelGaussian() {
  return val => (
    (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * (val * val))
  );
}
