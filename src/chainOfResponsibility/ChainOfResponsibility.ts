import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import IChainOfResponsibilityStep, { TChainOfResponsibilityStep } from './IChainOfResponsibilityStep';
import ChainOfResponsibilityStepFactory from './ChainOfResponsibilityStepFactory';

export default class ChainOfResponsibility extends ChainOfResponsibilityStep {
    constructor(steps: TChainOfResponsibilityStep[]) {
        super();
        this.createChain(steps);
    }

    private createChain(steps: TChainOfResponsibilityStep[]) {
        let step: IChainOfResponsibilityStep | null = null;
        for (let i = 0; i < steps.length; i++) {
            const nextStep = ChainOfResponsibilityStepFactory.createStep(steps[i]);
            step = (step || this).setNext(nextStep);
        }
    }
}
