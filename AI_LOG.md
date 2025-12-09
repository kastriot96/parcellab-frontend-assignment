# AI Usage Log (optional)

## DEF-002 — Orders with two tracking numbers show only one tracking timeline
**Purpose:** Ensure the UI displays multiple tracking timelines for orders with more than one shipment.

**AI Prompts & Outputs:** Explained the root cause (UI assumed a single shipment) and suggested mapping over `shipments` array, adding undefined checks, and updating types.

**Outcome:** Order details now display all tracking timelines for multiple shipments.

## DEF-001 — Fix failing test and related type errors
**Purpose:** Resolve failing unit tests and TypeScript type issues.

**AI Prompts & Outputs:** Updated `Checkpoint` interface and test data to match required shape.

**Outcome:** Tests pass, TypeScript errors resolved, codebase is type-safe.

## FR-005 — Enhance the order details page
**Purpose:** Add a visual progress bar to show order timeline in `OrderHeader`.

**AI Prompts & Outputs:** Created `ProgressBar.tsx`, updated `OrderHeader` to integrate it with correct props and styling.

**Outcome:** Users can clearly see completed, current, and upcoming checkpoints. Card-based layout is maintained.

## FR-004 — UX improvement: show articles included in the order
**Purpose:** Display all articles in an order with name, quantity, price, and image.

**AI Prompts & Outputs:** Created `Articles.tsx` and integrated it above the delivery timeline in `OrderDetails`.

**Outcome:** Articles are visible with proper spacing and fallback handling for missing images.

## FR-006 — Clearly show the user the current status and the next action
**Purpose:** Provide actionable guidance by showing current status and next action.

**AI Prompts & Outputs:** Updated `OrderHeader` to map raw checkpoint statuses to friendly labels and explanations, displayed prominently at the top.

**Outcome:** Status and next step are visible immediately; mapping is consistent across carriers.

## FR-003 — Optional ZIP input to disclose additional order and tracking information
**Purpose:** Unlock full order details safely via ZIP code.

**AI Prompts & Outputs:** Created reusable `ZipUnlock` component, handled ZIP validation, errors, and conditional rendering of timeline and articles.

**Outcome:** Full details are shown only after valid ZIP entry; error handling is robust; component is reusable and visually consistent.