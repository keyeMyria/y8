export const fakePromise = async (secs) => (
  await new Promise(async(resolve) => {
    let timeout = 0;
    timeout = await setTimeout(() => {
      clearTimeout(timeout);
      resolve();
    }, secs);
  })
);
