import { IExecuteFuncCallback } from '../../core/IExecutable';
import ChainOfResponsibilityStepFactory from '../ChainOfResponsibilityStepFactory';
import ChainOfResponsibilityExecuteFuncAdapter from '../ChainOfResponsibilityExecuteFuncAdapter';
import IChainOfResponsibilityStep from '../IChainOfResponsibilityStep';

describe('ChainOfResponsibilityStepFactory', () => {
    it('should create a ChainOfResponsibilityExecuteFuncAdapter for a function step', () => {
        const funcStep: IExecuteFuncCallback = jest.fn();

        const result = ChainOfResponsibilityStepFactory.createStep(funcStep);

        expect(result).toBeInstanceOf(ChainOfResponsibilityExecuteFuncAdapter);
    });

    it('should return the step itself for a non-function step', () => {
        const nonFuncStep: IChainOfResponsibilityStep = {
            execute: () => Promise.resolve({}),
            setNext: () => nonFuncStep,
        };

        const result = ChainOfResponsibilityStepFactory.createStep(nonFuncStep);

        expect(result).toBe(nonFuncStep);
    });
});
