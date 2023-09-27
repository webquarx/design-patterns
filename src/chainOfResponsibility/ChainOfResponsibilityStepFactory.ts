import IChainOfResponsibilityStep, {
    TChainOfResponsibility,
    TChainOfResponsibilityStep,
} from './IChainOfResponsibilityStep';
import ChainOfResponsibilityExecuteFuncAdapter from './ChainOfResponsibilityExecuteFuncAdapter';
import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';

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

    static createChainFromArray(steps: TChainOfResponsibilityStep[])
        : IChainOfResponsibilityStep | null {
        let step = ChainOfResponsibilityStepFactory.createStep(steps[0]);
        if (!step) {
            return null;
        }
        const res = step;

        for (let i = 1; i < steps.length; i++) {
            const nextStep = ChainOfResponsibilityStepFactory.createStep(steps[i]);
            if (nextStep) {
                if (step instanceof ChainOfResponsibilityStep) {
                    step = step.setLast(nextStep);
                } else {
                    step = step.setNext(nextStep);
                }
            }
        }
        return res;
    }

    static createChain(steps: TChainOfResponsibility): IChainOfResponsibilityStep | null {
        if (Array.isArray(steps)) {
            return ChainOfResponsibilityStepFactory.createChainFromArray(steps);
        }
        return ChainOfResponsibilityStepFactory.createChainFromArray([steps]);
    }
}
