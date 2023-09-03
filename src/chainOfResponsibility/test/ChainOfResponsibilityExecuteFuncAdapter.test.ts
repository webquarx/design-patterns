import ChainOfResponsibilityExecuteFuncAdapter from '../ChainOfResponsibilityExecuteFuncAdapter';

describe('ChainOfResponsibilityExecuteFuncAdapter', () => {
    it('should execute the executeFunc with the correct arguments', async () => {
        const executeFuncMock: jest.Mock = jest.fn();
        const adapter = new ChainOfResponsibilityExecuteFuncAdapter(executeFuncMock);

        await adapter.execute(1, 2, 3);

        expect(executeFuncMock).toHaveBeenCalledWith(expect.any(Function), 1, 2, 3);
    });

    it('should await the execution of the async executeFunc', async () => {
        const asyncExecuteFunc = () => new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve('result');
            }, 100);
        });

        const adapter = new ChainOfResponsibilityExecuteFuncAdapter(asyncExecuteFunc);

        const result = await adapter.execute();

        expect(result).toBe('result');
    });
});
