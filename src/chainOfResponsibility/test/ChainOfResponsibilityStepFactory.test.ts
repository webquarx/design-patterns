import { IExecuteFuncCallback } from '../../core/IExecutable';
import ChainOfResponsibilityExecuteFuncAdapter from '../ChainOfResponsibilityExecuteFuncAdapter';
import IChainOfResponsibilityStep from '../IChainOfResponsibilityStep';
import ChainStepFactory from '../factory/ChainStepFactory';

describe('ChainOfResponsibilityStepFactory', () => {
    it('should create a ChainOfResponsibilityExecuteFuncAdapter for a function step', () => {
        const funcStep: IExecuteFuncCallback = jest.fn();

        const result = new ChainStepFactory().create(funcStep);

        expect(result).toBeInstanceOf(ChainOfResponsibilityExecuteFuncAdapter);
    });

    it('should return the step itself for a non-function step', () => {
        const nonFuncStep: IChainOfResponsibilityStep = {
            execute: () => Promise.resolve({}),
            setNext: () => nonFuncStep,
        };

        const result = new ChainStepFactory().create(nonFuncStep);

        expect(result).toBe(nonFuncStep);
    });
});
