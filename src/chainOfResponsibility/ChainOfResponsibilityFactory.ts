import IChainOfResponsibilityStep, {
    TChainOfResponsibilityStep, TChainOfResponsibility,
} from './IChainOfResponsibilityStep';
import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import ChainStepFactory from './factory/ChainStepFactory';

export default class ChainOfResponsibilityFactory {
    private chainStepFactory: ChainStepFactory;

    constructor() {
        this.chainStepFactory = new ChainStepFactory(
            (steps: TChainOfResponsibility) => this.createChain(steps),
        );
    }

    private createChainFromArray(steps: TChainOfResponsibilityStep[])
        : IChainOfResponsibilityStep | undefined {
        let step = this.chainStepFactory.create(steps[0]);
        const res = step;

        for (let i = 1; i < steps.length; i++) {
            const nextStep = this.chainStepFactory.create(steps[i]);
            if (step && nextStep) {
                step = this.addLastStep(step, nextStep);
            }
        }
        return res;
    }

    // eslint-disable-next-line class-methods-use-this
    private addLastStep(step: IChainOfResponsibilityStep, nextStep: IChainOfResponsibilityStep) {
        if (step instanceof ChainOfResponsibilityStep) {
            return step.setLast(nextStep);
        }
        return step.setNext(nextStep);
    }

    createChain(steps: TChainOfResponsibility): IChainOfResponsibilityStep | undefined {
        if (Array.isArray(steps)) {
            return this.createChainFromArray(steps);
        }
        return this.createChainFromArray([steps]);
    }
}
