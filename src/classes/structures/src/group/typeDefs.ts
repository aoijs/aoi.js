export type GroupOptions = {
    limit: number;
    sweepOld: boolean;
}

export type sweepOptions = {
    sweepMessages? : boolean;
    afterMethod? : "limitCross" | "time";
    timeout? : number
}

export type LimitGroupOptions = {
    limit : number;
    sweepOptions : sweepOptions;
}