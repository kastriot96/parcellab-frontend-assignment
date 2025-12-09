# Decisions & Notes

## Tasks chosen

1. **DEF-002 — Orders with two tracking numbers show only one tracking timeline**  
   Fixes a critical clarity problem: multi-shipment orders were displayed as if they included only a single parcel. 
   Ensures that users always see a timeline per shipment, matching real-world delivery expectations.

## Design Decisions as bullet points

**DEF-002 — Orders with two tracking numbers show only one tracking timeline**  
- Investigated the root cause of the missing timeline: OrderDetails loaded only one order object, not the full list of shipments belonging to the same order number.
- Introduced a dedicated Shipment[] structure in OrderDetails instead of assuming a single object.
- Updated the fetch logic so that /orders/:id returns all shipments for the given order number.
- Replaced all single-order references with shipment-based rendering:
- The UI now loops over shipments instead of using a single order.
- Each shipment displays its own header, articles, and timeline.

## Notes on e.g. trade-offs and non-functional requirements solved

Use this document to explain any trade-offs you made, especially around:

**DEF-002 — Orders with two tracking numbers show only one tracking timeline**  
- Chose not to refactor the backend or unify shipments, simply adapted the front-end to reflect the real data model.
- Avoided unnecessary API expansion: fetching all shipments through the existing path is sufficient.