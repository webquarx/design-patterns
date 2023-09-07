import IChainOfResponsibilityStep, { TChainOfResponsibilityStep } from './IChainOfResponsibilityStep';
import ChainOfResponsibilityExecuteFuncAdapter from './ChainOfResponsibilityExecuteFuncAdapter';

export default class ChainOfResponsibilityStepFactory {
    static createStep(step: TChainOfResponsibilityStep): IChainOfResponsibilityStep {
        if (typeof step === 'function') {
            return new ChainOfResponsibilityExecuteFuncAdapter(step);
        }
        return step;
    }

    static createEmptyStep(): IChainOfResponsibilityStep {
        return ChainOfResponsibilityStepFactory.createStep(
            (execute, ...args) => execute(...args),
        );
    }
}
