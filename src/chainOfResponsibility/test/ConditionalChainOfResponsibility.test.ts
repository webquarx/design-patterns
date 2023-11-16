import { IConditionalChainOfResponsibility } from '../IChainOfResponsibilityStep';
import ChainOfResponsibilityStep from '../ChainOfResponsibilityStep';
import ChainOfResponsibility from '../ChainOfResponsibility';

class ChainStep extends ChainOfResponsibilityStep {}
describe('ConditionalChainOfResponsibility', () => {
    let step1: any;
    let mockStep1: any;
    let step2: any;
    let mockStep2: any;

    beforeEach(() => {
        step1 = new ChainStep();
        mockStep1 = jest.spyOn(step1, 'execute');
        step2 = new ChainStep();
        mockStep2 = jest.spyOn(step2, 'execute');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should execute all steps when canExecute is true', async () => {
        const chain = new ChainOfResponsibility({
            chain: [step1, step2],
            canExecute: true,
        });
        await chain.execute();

        expect(mockStep1).toHaveBeenCalled();
        expect(mockStep2).toHaveBeenCalled();
    });

    it('should execute all steps when canExecute is not set', async () => {
        const chain = new ChainOfResponsibility({
            chain: [step1, step2],
        } as unknown as IConditionalChainOfResponsibility);
        await chain.execute();

        expect(mockStep1).toHaveBeenCalled();
        expect(mockStep2).toHaveBeenCalled();
    });

    it('should not execute any step when canExecute is false', async () => {
        const mockFalseChain: IConditionalChainOfResponsibility = {
            chain: [step1, step2],
            canExecute: false,
        };

        const chain = new ChainOfResponsibility(mockFalseChain);
        await chain.execute();

        expect(mockStep1).not.toHaveBeenCalled();
        expect(mockStep2).not.toHaveBeenCalled();
    });

    it('should execute the last step when canExecute is false', async () => {
        const chain = new ChainOfResponsibility({
            chain: [step1, step2],
            canExecute: false,
        });
        // @ts-expect-error canExecuteRef is private
        const lastStepSpy = jest.spyOn(chain.nextStep.lastStep, 'execute');

        await chain.execute();

        expect(mockStep1).not.toHaveBeenCalled();
        expect(mockStep2).not.toHaveBeenCalled();
        expect(lastStepSpy).toHaveBeenCalled();
    });

    it('should wait for async canExecute', async () => {
        const canExecuteCalls: boolean[] = [];
        const asyncCanExecuteFalseFunc = () => new Promise<boolean>((resolve) => {
            setTimeout(() => {
                canExecuteCalls.push(false);
                resolve(false);
            }, 50);
        });
        const asyncCanExecuteTrueFunc = () => new Promise<boolean>((resolve) => {
            setTimeout(() => {
                canExecuteCalls.push(true);
                resolve(true);
            }, 50);
        });

        const chain = new ChainOfResponsibility([
            {
                chain: step1,
                canExecute: asyncCanExecuteFalseFunc,
            },
            {
                chain: step2,
                canExecute: asyncCanExecuteTrueFunc,
            },
        ]);
        await chain.execute();

        expect(canExecuteCalls).toEqual([false, true]);
        expect(mockStep1).not.toHaveBeenCalled();
        expect(mockStep2).toHaveBeenCalled();
    });
});
