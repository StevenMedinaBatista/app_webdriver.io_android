declare class Timer {
    private _delay;
    private _timeout;
    private _fn;
    private _leading;
    private _conditionExecutedCnt;
    private _resolve;
    private _reject;
    private _startTime?;
    private _ticks;
    private _timeoutId?;
    private _mainTimeoutId?;
    private _lastError?;
    constructor(_delay: number, _timeout: number, _fn: Function, _leading?: boolean);
    private _start;
    private _stop;
    private _stopMain;
    private _tick;
    private _checkCondition;
    private _hasTime;
    private _wasConditionExecuted;
}
export default Timer;
//# sourceMappingURL=Timer.d.ts.map