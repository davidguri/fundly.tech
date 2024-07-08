export function createWorker(workerUrl: URL) {
  return new Worker(workerUrl);
}