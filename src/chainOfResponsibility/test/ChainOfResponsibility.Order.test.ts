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

    it('should handle chain inside another chain', async () => {
        const chain = new ChainOfResponsibility([
            new ChainOfResponsibility([
                new TestStep(1),
                new TestStep(2),
                new ChainOfResponsibility([
                    new TestStep(3),
                    new TestStep(4),
                ]),
            ]),
        ]);

        const order: number[] = [];
        await chain.execute(order);

        expect(order).toEqual([1, 2, 3, 4]);
    });

    it('should merge chain with another chain', async () => {
        const subChain1 = new TestStep(1);
        subChain1.setNext(new TestStep(2));
        const subChain2 = new TestStep(3);
        subChain2.setNext(new TestStep(4));

        subChain1.setNext(subChain2);

        const order: number[] = [];
        await subChain1.execute(order);

        expect(order).toEqual([1, 2, 3, 4]);
    });

    it('should merge chains with sub chains and sub steps', async () => {
        const subChain1 = new TestStep(1);
        subChain1.setNext(new TestStep(2));
        const subChain2 = new TestStep(3);
        subChain2.setNext(new TestStep(4));
        subChain1.setNext(subChain2);

        const chain = new ChainOfResponsibility([
            new ChainOfResponsibility([
                new ChainOfResponsibility([
                    subChain1,
                ]),
                new TestStep(5),
            ]),
            new TestStep(6),
        ]);

        const order: number[] = [];
        await chain.execute(order);

        expect(order).toEqual([1, 2, 3, 4, 5, 6]);
    });
});
