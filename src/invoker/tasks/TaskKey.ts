import createUUID from '../../core/tools/createUUID';

export default class TaskKey {
    static generate(): string {
        return createUUID();
    }
}
