# Decisions & Notes

## Tasks chosen

1. **DEF-002 — Orders with two tracking numbers show only one tracking timeline**  
   Fixes a critical clarity problem: multi-shipment orders were displayed as if they included only a single parcel. 
   Ensures that users always see a timeline per shipment, matching real-world delivery expectations.

2. **DEF-001 — Fix failing test and related type errors**  
   Critical foundational task. Ensures all other features and tests run correctly.
   Without fixing these, further development could produce unreliable results.

3. **FR-005 — Enhance the order details page**  
   Focused on improving clarity, hierarchy, and usability of the order details page. This is the core experience for end users and has high customer impact.

## Design Decisions as bullet points

**DEF-002 — Orders with two tracking numbers show only one tracking timeline**  
- Investigated the root cause of the missing timeline: OrderDetails loaded only one order object, not the full list of shipments belonging to the same order number.
- Introduced a dedicated Shipment[] structure in OrderDetails instead of assuming a single object.
- Updated the fetch logic so that /orders/:id returns all shipments for the given order number.
- Replaced all single-order references with shipment-based rendering:
- The UI now loops over shipments instead of using a single order.
- Each shipment displays its own header, articles, and timeline.

 **DEF-001 — Fix failing test and related type errors** 
- Investigated failing unit tests and TypeScript errors.
- Updated the Checkpoint type and test data to match interface requirements.
- Ensured all test inputs conform to the Order and Checkpoint interfaces.

**FR-005 — Enhance the order details page**
- Kept OrderHeader component but refactored to simplify layout and make key info more readable.  
- Timeline display improved using ProgressBar with clear indicators for most recent, completed, and last checkpoint.  

## Notes on e.g. trade-offs and non-functional requirements solved

Use this document to explain any trade-offs you made, especially around:

**DEF-002 — Orders with two tracking numbers show only one tracking timeline**  
- Chose not to refactor the backend or unify shipments, simply adapted the front-end to reflect the real data model.
- Avoided unnecessary API expansion: fetching all shipments through the existing path is sufficient.

**DEF-001 — Fix failing test and related type errors** 
- Preserved type safety by strictly adhering to TypeScript interfaces.
- Did not alter business logic only fixed data shape and typings for reliable tests.
- Ensures all subsequent feature development can rely on passing tests.

**FR-005 — Enhance the order details page**
- Preserved original card-based design while improving clarity.  
- Chose readability and maintainability over aggressive DRY in mapping order info fields.  