import IChainOfResponsibilityStep from '../IChainOfResponsibilityStep';

export interface IChainOfResponsibilityStepFactory {
    create: () => IChainOfResponsibilityStep,
}
