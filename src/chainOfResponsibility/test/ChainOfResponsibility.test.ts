import ChainOfResponsibility from '../ChainOfResponsibility';
import ChainOfResponsibilityStep from '../ChainOfResponsibilityStep';

class TestStep extends ChainOfResponsibilityStep {
    processedData: any[] = [];

    async execute(...args: any[]): Promise<any> {
        this.processedData.push(args);
        return await super.execute(...args);
    }
}

describe('ChainOfResponsibility', () => {
    it('should create a chain of responsibility correctly', async () => {
        const step1 = new TestStep();
        const step2 = new TestStep();
        const step3 = new TestStep();

        const chain = new ChainOfResponsibility([step1, step2, step3]);

        await chain.execute(1, 2, 3);

        expect(step1.processedData).toEqual([[1, 2, 3]]);
        expect(step2.processedData).toEqual([[1, 2, 3]]);
        expect(step3.processedData).toEqual([[1, 2, 3]]);
    });

    it('should handle a single step in the chain', async () => {
        const step1 = new TestStep();
        const chain = new ChainOfResponsibility([step1]);

        await chain.execute(1, 2, 3);

        expect(step1.processedData).toEqual([[1, 2, 3]]);
    });

    it('should handle an empty chain', async () => {
        const chain = new ChainOfResponsibility([]);

        const result = await chain.execute(1, 2, 3);

        expect(result).toEqual([1, 2, 3]);
    });

    it('should skip undefined steps in an chain', async () => {
        const step1 = new TestStep();
        const step2 = new TestStep();

        // @ts-expect-error pass undefined
        const chain = new ChainOfResponsibility([step1, undefined, step2]);
        await chain.execute(1);

        expect(step1.processedData).toEqual([[1]]);
        expect(step2.processedData).toEqual([[1]]);
    });

    it('should create chain with step interface correctly without setLast method', async () => {
        class ChainStep {
            private nextStep?: ChainStep;

            setNext(nextStep: ChainStep) {
                this.nextStep = nextStep;
                return nextStep;
            }

            async execute(): Promise<any> {
                if (this.nextStep) {
                    return await this.nextStep.execute();
                }
                return await Promise.resolve('test');
            }
        }
        const chain = new ChainOfResponsibility([
            new ChainStep(),
            new ChainStep(),
        ]);

        const result = await chain.execute();
        expect(result).toEqual('test');
    });
});
