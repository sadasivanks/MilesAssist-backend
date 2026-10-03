import { BookingService } from "../src/service/booking.service";

describe("BookingService", () => {
  it("uses readable booking method names", () => {
    expect(typeof BookingService.prototype.getBookings).toBe("function");
    expect(typeof BookingService.prototype.getBookingById).toBe("function");
    expect(typeof BookingService.prototype.createBooking).toBe("function");
    expect(typeof BookingService.prototype.updateBooking).toBe("function");
  });
});
