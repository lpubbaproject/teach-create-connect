# SkillSwap — Product Decisions

## Decision Point 1: Rejection

### Decision
When a creator declines a booking, the client sees a clear **“Booking declined”** status and a **“Find Similar Services”** action.

### Rationale
A declined booking should not leave the client at a dead end. Showing similar services gives the client an immediate next step and keeps the marketplace experience moving.

---

## Decision Point 2: Double Booking

### Decision
Multiple booking requests can remain **Pending**. Once a creator accepts a booking for a date/time that conflicts with another pending request, the conflicting request cannot be accepted and is shown as **“Pending • Conflict flagged.”**

### Rationale
This keeps scheduling simple while preventing two conflicting bookings from both being accepted. The creator can decline the conflicting request.

---

## Decision Point 3: Discovery

### Decision
Services are ranked using a combination of **relevance, freshness, and reasonable exposure for newer creators**.

### Rationale
The marketplace should help clients find relevant services while avoiding a system where the same creators always dominate discovery. Newer creators should have a reasonable opportunity to be discovered.
