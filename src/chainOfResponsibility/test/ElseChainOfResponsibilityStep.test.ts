import ChainOfResponsibility from '../ChainOfResponsibility';
import { IExecuteFunc } from '../../core/IExecutable';
import { TChainOfResponsibility } from '../IChainOfResponsibilityStep';

describe('ConditionalChainOfResponsibility.Else', () => {
    let chains: { chain: TChainOfResponsibility, elseChain: TChainOfResponsibility };

    beforeEach(() => {
        chains = {
            chain: [
                async (execute: IExecuteFunc, data: number[]) => {
                    data.push(1);
                    return await execute(data);
                },
                async (execute: IExecuteFunc, data: number[]) => {
                    data.push(2);
                    return await execute(data);
                },
            ],
            elseChain: [
                async (execute: IExecuteFunc, data: number[]) => {
                    data.push(3);
                    return await execute(data);
                },
                async (execute: IExecuteFunc, data: number[]) => {
                    data.push(4);
                    return await execute(data);
                },
            ],
        };
    });

    it('should execute only chain and not else chain when canExecute is true', async () => {
        const chain = new ChainOfResponsibility({
            ...chains,
            canExecute: () => true,
        });

        // @ts-expect-error canExecuteRef is private
        const lastStepSpy = jest.spyOn(chain.nextStep.lastStep, 'execute');

        const value: number[] = [];
        const res = await chain.execute(value);

        expect(res).toEqual([1, 2]);
        expect(lastStepSpy).toHaveBeenCalled();
    });

    it('should execute else chain when canExecute is false', async () => {
        const chain = new ChainOfResponsibility({
            ...chains,
            canExecute: () => false,
        });

        // @ts-expect-error canExecuteRef is private
        const lastStepSpy = jest.spyOn(chain.nextStep.lastStep, 'execute');

        const value: number[] = [];
        const res = await chain.execute(value);

        expect(res).toEqual([3, 4]);
        expect(lastStepSpy).toHaveBeenCalled();
    });
});
