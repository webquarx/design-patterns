import IChainOfResponsibilityStep, {
    TChainOfResponsibilityStep, TChainOfResponsibility,
} from './IChainOfResponsibilityStep';
import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import ChainStepFactory from './factory/ChainStepFactory';

export default class ChainOfResponsibilityFactory {
    private chainStepFactory: ChainStepFactory;

    constructor() {
        this.chainStepFactory = new ChainStepFactory(
            (steps: TChainOfResponsibility) => this.create(steps),
        );
    }

    create(steps: TChainOfResponsibility): IChainOfResponsibilityStep | undefined {
        if (Array.isArray(steps)) {
            return this.createChainFromArray(steps);
        }
        return this.createChainFromArray([steps]);
    }

    private createChainFromArray(steps: TChainOfResponsibilityStep[])
        : IChainOfResponsibilityStep | undefined {
        const firstStep = this.chainStepFactory.create(steps[0]);

        steps.slice(1).reduce((chain, step) => {
            const currentStep = this.chainStepFactory.create(step);
            return chain && currentStep ? this.addLastStep(chain, currentStep) : chain;
        }, firstStep);

        return firstStep;
    }

    // eslint-disable-next-line class-methods-use-this
    private addLastStep(step: IChainOfResponsibilityStep, nextStep: IChainOfResponsibilityStep) {
        if (step instanceof ChainOfResponsibilityStep) {
            return step.setLast(nextStep);
        }
        return step.setNext(nextStep);
    }
}
