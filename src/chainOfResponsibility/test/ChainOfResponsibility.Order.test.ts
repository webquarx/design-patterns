import ChainOfResponsibility from '../ChainOfResponsibility';
import ChainOfResponsibilityStep from '../ChainOfResponsibilityStep';

class TestStep extends ChainOfResponsibilityStep {
    constructedData: number;

    constructor(data: number) {
        super();
        this.constructedData = data;
    }

    async execute(data: number[]) {
        data.push(this.constructedData);
        return super.execute(data);
    }
}

describe('ChainOfResponsibility Order', () => {
    it('should execute the chain in order', async () => {
        const step1 = new TestStep(1);
        const step2 = new TestStep(2);
        const step3 = new TestStep(3);

        const chain = new ChainOfResponsibility([step1, step2, step3]);

        const order: number[] = [];
        await chain.execute(order);

        expect(order).toEqual([1, 2, 3]);
    });
});
