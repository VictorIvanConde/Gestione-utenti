export const apiHelper = {
    delay: (ms: number = 800): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    simulateRequest: async <T>(request: () => Promise<T>, ms: number = 800): Promise<T> => {
        await apiHelper.delay(ms);
        return await request();
    }
};
