export interface SummaryData {
	startTime: Date;
	endTime: Date;
	time: string;
	distance: string;
	maxSpeed: string;
}

export interface TCXData {
    TrainingCenterDatabase: any;
}

export type Laps = Lap[];

export interface Lap {
    Track: Track[];
    TotalTimeSeconds: number[];
    DistanceMeters: number[];
    Extensions: any;
}

export interface Track {
    Trackpoint: Trackpoint[];
}

export interface Trackpoint {
    DistanceMeters: string[];
    AltitudeMeters: string[];
    Position: Position[];
}

interface Position {
    LatitudeDegrees: string[];
    LongitudeDegrees: string[];
}

export type TpSelectionEvent = {
    tp: number;
    lap: number;
    shift: boolean;
}
