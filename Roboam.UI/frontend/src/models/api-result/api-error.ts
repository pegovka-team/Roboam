export class RoboamApiError extends Error {
    constructor(message?: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RoboamApiError.prototype);
    }
}
