export interface AppointmentResource {
  id: string;
  start: string;
  location?: string;
}

export function mapAppointmentToTrip(appointment: AppointmentResource) {
  return {
    externalId: appointment.id,
    tripDate: appointment.start,
    destination: appointment.location ?? 'VA Facility',
  };
}
