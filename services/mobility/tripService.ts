// export type TripStatus =
//  | 'NEW'
//  | 'REVIEWING'
//  | 'ASSIGNED'
//  | 'IN_PROGRESS'
//  | 'COMPLETED';

export interface TripRequest {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  tripDate: string;
  assistanceRequested: boolean;
  status: TripStatus;
}

export type TripStatus = "planned" | "requested";

export interface Trip {
  id: string;

  userId: string;

  destination: string;

  tripDate: string;

  time?: string;

  assistanceRequested: boolean;

  notes?: string;

  status: TripStatus;

  createdAt: number;
}

export function createTripRequest(
  input: Omit<Trip, "id" | "createdAt" | "status">,
): Trip {
  return {
    ...input,
    id: `trip-${Date.now()}`,
    status: input.assistanceRequested ? "requested" : "planned",
    createdAt: Date.now(),
  };
}

export function requestAssistance(trip: Trip): Trip {
  return {
    ...trip,
    assistanceRequested: true,
    status: "requested",
  };
}
