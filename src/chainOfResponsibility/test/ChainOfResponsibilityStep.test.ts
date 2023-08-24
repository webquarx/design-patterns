import IChainOfResponsibilityStep from '../IChainOfResponsibilityStep';
import ChainOfResponsibilityStep from '../ChainOfResponsibilityStep';

class FirstStep extends ChainOfResponsibilityStep {}
class SecondStep extends ChainOfResponsibilityStep {}

describe('ChainOfResponsibilityStep', () => {
    let step1: IChainOfResponsibilityStep;
    let step2: IChainOfResponsibilityStep;

    beforeEach(() => {
        step1 = new FirstStep();
        step2 = new SecondStep();
        step1.setNext(step2);
    });

    it('should pass arguments down the chain', async () => {
        const result = await step1.execute(1, 2, 3);
        expect(result).toEqual([1, 2, 3]);
    });

    it('should execute next step in the chain', async () => {
        const step2ExecuteSpy = jest.spyOn(step2, 'execute');
        await step1.execute();
        expect(step2ExecuteSpy).toHaveBeenCalled();
    });

    it('should return the result of the last step', async () => {
        const expectedResult = 'final result';
        step2.execute = jest.fn().mockResolvedValue(expectedResult);
        const result = await step1.execute();
        expect(result).toBe(expectedResult);
    });

    it('should not execute next step if it is not set', async () => {
        step1.setNext(undefined as unknown as IChainOfResponsibilityStep);
        const step2ExecuteSpy = jest.spyOn(step2, 'execute');
        await step1.execute();
        expect(step2ExecuteSpy).not.toHaveBeenCalled();
    });
});
