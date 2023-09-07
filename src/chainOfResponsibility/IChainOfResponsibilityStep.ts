import IExecutable, { ICanExecuteFunc, IExecuteFuncCallback } from '../core/IExecutable';

export default interface IChainOfResponsibilityStep extends IExecutable {
    setNext(nextStep?: IChainOfResponsibilityStep): IChainOfResponsibilityStep;
}

export type TChainOfResponsibilityStep = IChainOfResponsibilityStep | IExecuteFuncCallback;
export type TChainOfResponsibility = TChainOfResponsibilityStep[] | TChainOfResponsibilityStep;

export interface IConditionalChainOfResponsibility {
    canExecute: ICanExecuteFunc | boolean,
    steps: TChainOfResponsibility,
}
