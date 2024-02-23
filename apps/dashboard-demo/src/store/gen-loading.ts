import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

async function getJobStatus(jobId: string) {
  try {
    const responseJobStatus = await fetch(
      `https://weev-ai.fly.dev/job-status/${jobId}`,
      {
        method: "get"
      }
    );

    return await responseJobStatus.json();
  } catch (error) {
    console.log(`Error when running [jobStatus]`);
    return null;
  }
}

async function generateProducts() {
  try {
    const responseGenProducts = await fetch(
      `https://weev-ai.fly.dev/generate-alycia-products`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        credentials: "include",
        mode: "cors"
      }
    );

    return await responseGenProducts.json();
  } catch (error) {
    return null;
  }
}

type JobStatusIdAtomParams = {
  jobId: string
  status: string
}

export const productsQueuedListAtom = atom<JobStatusIdAtomParams | null>(null);

export const useProductsQueuedListAtom = () =>
  useAtomValue(productsQueuedListAtom);

const statusAtom = atom("");

export const useStatusAtom = () =>
  useAtomValue(statusAtom);

export const addQueueProductsAtom = atom(null, async (get, set) => {
  const products = await generateProducts();

  if (products && products.success) {
    const jobId = products["job_id"];
    const status = products["status"];
    const newJob = { jobId, status };

    set(statusAtom, status);
    set(productsQueuedListAtom, newJob);
  }
});

export const readQueueProductsAtom = atom(null, async (get, set, {
  currentJobId
}: { currentJobId: string | null }) => {
  const currentQueue = get(productsQueuedListAtom);

  if (!currentQueue?.jobId) {
    throw new Error("Nothing in the queue");
  }

  if (!currentJobId) {
    throw new Error("No job id found");
  }

  const jobStatus = await getJobStatus(currentJobId);

  if (!jobStatus) {
    throw new Error("No job status found!");
  }

  const updatedJobs = currentQueue.jobId === currentJobId ? {
    ...currentQueue,
    status: currentQueue.status
  } : currentQueue;

  set(productsQueuedListAtom, updatedJobs);
});

export const useReadQueueProductsAtom = () =>
  useAtom(readQueueProductsAtom);

export const useAddQueueProductsAtom = () =>
  useSetAtom(addQueueProductsAtom);