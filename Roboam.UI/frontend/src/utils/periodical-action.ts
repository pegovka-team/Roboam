import { DEFAULT_POLLING_INTERVAL_MS } from "../constants/constants";

export class PeriodicalAction {
    private readonly action: () => void;
    private readonly period: number;
    private intervalId?: number;
    /**
     * Flag says {@link PeriodicalAction.start} has been called, but {@link PeriodicalAction.stop} hasn't been called yet.
     * @remarks
     * If this flag is `false`, {@link PeriodicalAction.execute} and {@link PeriodicalAction.manualExecute} will not call {@link PeriodicalAction.action}
     */
    public isEnabled: boolean = false;
    /**
     * Flag says {@link PeriodicalAction.action} is executing right now.
     * Flag used to prevent call of {@link PeriodicalAction.execute} when it is running already
     * @remarks
     * This flag doesn't affect {@link PeriodicalAction.manualExecute}
     */
    public isRunning: boolean = false;

    constructor(
        action: () => void,
        period: number = DEFAULT_POLLING_INTERVAL_MS
    ) {
        this.action = action;
        this.period = period;
    }

    public start = async (): Promise<void> => {
        this.isEnabled = true;
        this.startPeriodicalActionExecution();
        return this.execute();
    };

    public stop = () => {
        this.isEnabled = false;
        this.stopPeriodicalActionExecution();
    };

    /**
     * Execute {@link PeriodicalAction.action | action} outside of intervals.
     * This will reset timer to next {@link PeriodicalAction.action | action} call.
     */
    public manualExecute = async () => {
        if (this.isRunning || !this.isEnabled) {
            return;
        }

        this.stopPeriodicalActionExecution();
        try {
            await this.action();
        } catch (error) {
            console.error(error);
        } finally {
            this.startPeriodicalActionExecution();
        }
    };

    private execute = async (): Promise<void> => {
        if (this.isRunning || !this.isEnabled) {
            return;
        }

        this.isRunning = true;
        try {
            await this.action();
        } catch (error) {
            console.error(error);
        } finally {
            this.isRunning = false;
        }
    };

    /** Remove interval. Literally pause periodical action without {@link PeriodicalAction.isEnabled} flag change */
    private stopPeriodicalActionExecution = () => {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    };

    /** return interval. Literally unpause periodical action */
    private startPeriodicalActionExecution = () => {
        if (!this.isEnabled) {
            return;
        }

        // clear possible previously set interval
        this.stopPeriodicalActionExecution();
        this.intervalId = window.setInterval(this.execute, this.period);
    };
}