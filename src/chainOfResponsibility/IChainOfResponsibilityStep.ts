import IExecutable, { ICanExecutable, IExecuteFuncCallback } from '../core/IExecutable';
import ICommand from '../command/ICommand';

export default interface IChainOfResponsibilityStep extends IExecutable {
    setNext(nextStep?: IChainOfResponsibilityStep): IChainOfResponsibilityStep;
}

export interface IConditionalChainOfResponsibility extends ICanExecutable {
    chain: TChainOfResponsibility,
    elseChain?: TChainOfResponsibility,
}

export type TChainOfResponsibilityStep =
    IChainOfResponsibilityStep
    | IExecuteFuncCallback
    | IConditionalChainOfResponsibility
    | ICommand;

export type TChainOfResponsibility =
    TChainOfResponsibilityStep
    | TChainOfResponsibilityStep[];
