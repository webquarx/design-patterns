import IChainOfResponsibilityStep, {
    TChainOfResponsibilityStep, TChainOfResponsibility,
} from './IChainOfResponsibilityStep';
import ChainOfResponsibilityExecuteFuncAdapter from './ChainOfResponsibilityExecuteFuncAdapter';
import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import ChainOfResponsibilityConditionalStep from './ChainOfResponsibilityConditionalStep';

export default class ChainOfResponsibilityStepFactory {
    static createStep(step: TChainOfResponsibilityStep): IChainOfResponsibilityStep | null {
        if (typeof step === 'function') {
            return new ChainOfResponsibilityExecuteFuncAdapter(step);
        }
        if (step && 'chain' in step) {
            const lastStep = ChainOfResponsibilityStepFactory.createEmptyStep();
            const newChain = Array.isArray(step.chain)
                ? [...step.chain, lastStep]
                : [step.chain, lastStep];
            const chain = ChainOfResponsibilityStepFactory.createChain(newChain);
            const conditionalStep = new ChainOfResponsibilityConditionalStep(
                step.canExecute,
                lastStep,
            );
            conditionalStep.setNext(chain as IChainOfResponsibilityStep);
            return conditionalStep;
        }
        return step;
    }

    static createEmptyStep(): IChainOfResponsibilityStep {
        return ChainOfResponsibilityStepFactory.createStep(
            (execute, ...args) => execute(...args),
        ) as IChainOfResponsibilityStep;
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
