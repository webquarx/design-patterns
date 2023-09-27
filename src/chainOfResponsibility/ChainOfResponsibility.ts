import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import { TChainOfResponsibility } from './IChainOfResponsibilityStep';
import ChainOfResponsibilityStepFactory from './ChainOfResponsibilityStepFactory';

export default class ChainOfResponsibility extends ChainOfResponsibilityStep {
    constructor(steps: TChainOfResponsibility) {
        super();
        this.createChain(steps);
    }

    private createChain(steps: TChainOfResponsibility) {
        const chain = ChainOfResponsibilityStepFactory.createChain(steps);
        if (!chain) {
            return;
        }
        this.setNext(chain);
    }
}
