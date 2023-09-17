import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import IChainOfResponsibilityStep, {
    TChainOfResponsibility,
    TChainOfResponsibilityStep,
} from './IChainOfResponsibilityStep';
import ChainOfResponsibilityStepFactory from './ChainOfResponsibilityStepFactory';

export default class ChainOfResponsibility extends ChainOfResponsibilityStep {
    constructor(steps: TChainOfResponsibility) {
        super();
        this.createChain(steps);
    }

    private createChain(steps: TChainOfResponsibility) {
        if (Array.isArray(steps)) {
            this.createChainFromArray(steps);
            return;
        }
        this.createChainFromArray([steps]);
    }

    private createChainFromArray(steps: TChainOfResponsibilityStep[]) {
        let step: IChainOfResponsibilityStep | null = null;
        for (let i = 0; i < steps.length; i++) {
            const nextStep = ChainOfResponsibilityStepFactory.createStep(steps[i]);
            step = step || this;
            if (step instanceof ChainOfResponsibilityStep) {
                step = step.setLast(nextStep);
            } else {
                step = step.setNext(nextStep);
            }
        }
    }
}
