export type LocationType =
  | 'HOME'
  | 'VA_MEDICAL'
  | 'PHARMACY'
  | 'OTHER';

export interface SavedLocation {
  id: string;
  label: string;
  type: LocationType;
  encryptedAddress: string;
}

export function createSavedLocation(
  label: string,
  type: LocationType,
  encryptedAddress: string
): SavedLocation {
  return {
    id: `location-${Date.now()}`,
    label,
    type,
    encryptedAddress,
  };
}
