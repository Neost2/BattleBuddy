export type TripStatus =
 | 'NEW'
 | 'REVIEWING'
 | 'ASSIGNED'
 | 'IN_PROGRESS'
 | 'COMPLETED';

export interface TripRequest {
 id:string;
 userId:string;
 origin:string;
 destination:string;
 date:string;
 time:string;
 assistanceRequested:boolean;
 status:TripStatus;
}
