export enum TravelPassengerStatusEnum {
  PENDING = 'Pending',
  DRIVER_ACCEPT = 'Driver Accept',
  DRIVER_REJECT = 'Driver Reject',
  CANCELLED_BEFORE_PAID = 'Passenger Cancelled Before Pay',
  PAID = 'Paid',
  CANCELLED_AFTER_PAID = 'Passenger Cancelled After Pay',

  STARTED = 'Started',
  IN_PROGRESS = 'In Progress',
  ACCIDENT = 'Accident',
  MALFUNCTION = 'Malfunction',
  FINISHED = 'Finished',
}
