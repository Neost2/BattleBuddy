export type TripStatus =
  | 'NEW'
  | 'REVIEWING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface SavedLocation {
  id: string;
  name: string;
  type: string;
  encryptedAddress: string;
}

export interface TripRequest {
  id: string;
  userId: string;
  originId: string;
  destinationId: string;
  tripDate: string;
  assistanceRequested: boolean;
  status: TripStatus;
}
