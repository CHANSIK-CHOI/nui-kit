---
library: /gpbl/react-day-picker
topic: selection-modes
query: "DayPicker v9 selection modes single multiple range with onSelect and required prop"
fetched: 2026-08-25
---

### Add onSelect when using selected for range mode

Source: https://github.com/gpbl/react-day-picker/blob/main/apps/website/versioned_docs/version-9.14.0/upgrading.mdx

For range selection mode, similar to single mode, an `onSelect` prop is required when `selected` is provided. This example demonstrates managing a date range state and passing the state setter to `onSelect`.

```tsx
const [range, setRange] = useState<DateRange | undefined>();

<DayPicker mode="range" selected={range} onSelect={setRange} />
```

--------------------------------

### Add onSelect for Single Mode Selection

Source: https://github.com/gpbl/react-day-picker/blob/main/apps/website/docs/upgrading-v8-to-v10.mdx

When using the `selected` prop in single selection mode, you must also provide an `onSelect` handler to manage selection changes. This typically involves using React's `useState` hook.

```diff
+ const [selected, setSelected] = useState<Date | undefined>(undefined);

  <DayPicker
    mode="single"
    selected={selected}
+   onSelect={setSelected}
  />
```

--------------------------------

### Multiple Date Selection Mode

Source: https://github.com/gpbl/react-day-picker/blob/main/apps/website/versioned_docs/version-9.14.0/selections/selection-modes.mdx

This example demonstrates how to configure the DayPicker component to allow multiple individual date selections. It uses the `useState` hook to manage the selected dates and an `onSelect` handler to update the state.

```tsx
import { useState } from "react";

import { DayPicker } from "react-day-picker";

export function App() {
  const [selected, setSelected] = useState<Date[] | undefined>();
  const handleSelect = (newSelected) => {
    // Update the selected dates
    setSelected(newSelected);
  };
  return (
    <DayPicker mode="multiple" selected={selected} onSelect={handleSelect} />
  );
}
```

--------------------------------

### Required Single Date Selection

Source: https://github.com/gpbl/react-day-picker/blob/main/apps/website/docs/selections/single-mode.mdx

Enforce a required selection in single mode by setting the `required` prop. This prevents the user from unselecting the currently chosen date.

```tsx
<DayPicker mode="single" required />
```

--------------------------------

### Make Range Selection Required

Source: https://github.com/gpbl/react-day-picker/blob/main/apps/website/docs/selections/range-mode.mdx

Set the `required` prop to `true` to prevent users from deselecting a range once it has been selected. The range will always remain visible.

```tsx
<DayPicker mode="range" required />
```
