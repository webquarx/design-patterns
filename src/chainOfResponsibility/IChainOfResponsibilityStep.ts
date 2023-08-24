import IExecutable from '../core/IExecutable';

export default interface IChainOfResponsibilityStep extends IExecutable {
    setNext(nextStep: IChainOfResponsibilityStep): void;
}
