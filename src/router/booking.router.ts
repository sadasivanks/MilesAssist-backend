// Route definitions for BookingController.
// API prefix: /api/bookings

export const BOOKING_ROUTES = {
  BASE: "bookings",

  GET_BOOKINGS: {
    method: "GET",
    path: "",
    handler: "getBookings",
  },

  GET_BOOKING_STATS: {
    method: "GET",
    path: "stats",
    handler: "getBookingStats",
  },

  GET_BOOKING_BY_ID: {
    method: "GET",
    path: ":id",
    handler: "getBookingById",
  },

  CREATE_BOOKING: {
    method: "POST",
    path: "",
    handler: "createBooking",
  },

  UPDATE_BOOKING: {
    method: "PATCH",
    path: ":id",
    handler: "updateBooking",
  },
} as const;
