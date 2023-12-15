import executeCommand from '../executeCommand';

interface MockCommand {
    canExecute: jest.Mock<Promise<boolean>>;
    execute: jest.Mock<Promise<any>>;
}

describe('executeCommand', () => {
    let mockCommand: MockCommand;

    beforeEach(() => {
        mockCommand = {
            canExecute: jest.fn(),
            execute: jest.fn(),
        };
    });

    it('should call execute if canExecute returns true', async () => {
        mockCommand.canExecute.mockResolvedValue(true);
        await executeCommand(mockCommand, 'arg1', 'arg2');

        expect(mockCommand.canExecute).toHaveBeenCalledWith('arg1', 'arg2');
        expect(mockCommand.execute).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should not call execute if canExecute returns false', async () => {
        mockCommand.canExecute.mockResolvedValue(false);
        await executeCommand(mockCommand, 'arg1', 'arg2');

        expect(mockCommand.canExecute).toHaveBeenCalledWith('arg1', 'arg2');
        expect(mockCommand.execute).not.toHaveBeenCalled();
    });

    it('should return a resolved promise if canExecute returns true', async () => {
        mockCommand.canExecute.mockResolvedValue(true);
        const result = await executeCommand(mockCommand, 'arg1', 'arg2');

        expect(result).toEqual(undefined);
    });

    it('should return a resolved promise if canExecute returns false', async () => {
        mockCommand.canExecute.mockResolvedValue(false);
        const result = await executeCommand(mockCommand, 'arg1', 'arg2');

        expect(result).toEqual(undefined);
    });
});
