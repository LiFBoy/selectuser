export const action = (callbackName: string) => (...args: any[]) => {
  console.log(`[Demo Action Called - ${callbackName}]`, ...args);
};
