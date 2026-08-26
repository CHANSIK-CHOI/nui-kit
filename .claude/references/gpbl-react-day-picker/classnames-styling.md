---
library: /gpbl/react-day-picker
topic: classnames-styling
query: "classNames prop to replace default CSS class names for all UI elements in v9"
fetched: 2026-08-25
---

### getDefaultClassNames()

Source: https://github.com/gpbl/react-day-picker/blob/main/apps/website/docs/api/react/functions/getDefaultClassNames.md

Returns the default class names for the UI elements. This function generates a mapping of default class names for various UI elements, day flags, selection states, and animations.

```APIDOC
## getDefaultClassNames()

### Description
Returns the default class names for the UI elements. This function generates a mapping of default class names for various UI elements, day flags, selection states, and animations.

### Returns

`ClassNames` - An object containing the default class names.
```

--------------------------------

### Style DayPicker with Tailwind CSS

Source: https://github.com/gpbl/react-day-picker/blob/main/apps/website/versioned_docs/version-9.14.0/docs/styling.mdx

Integrate DayPicker with Tailwind CSS by adding Tailwind classes to the classNames prop and extending default class names.

```tsx
import { DayPicker, getDefaultClassNames } from "react-day-picker";

export function MyCalendar() {
  const defaultClassNames = getDefaultClassNames();
  return (
    <DayPicker
      mode="single"
      classNames={{
        today: `border-amber-500`, // Add a border to today's date
        selected: `bg-amber-500 border-amber-500 text-white`, // Highlight the selected day
        root: `${defaultClassNames.root} shadow-lg p-5`, // Add a shadow to the root element
        chevron: `${defaultClassNames.chevron} fill-amber-500`, // Change the color of the chevron
      }}
    />
  );
}
```

--------------------------------

### Applying Custom CSS Classes

Source: https://github.com/gpbl/react-day-picker/blob/main/apps/website/docs/docs/appearance.mdx

Assign custom CSS classes to the DayPicker component and its elements for fine-grained styling control. This is useful for component-specific overrides.

```jsx
import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

function MyComponent() {
  const customModifiersStyles = {
    outside: { color: 'grey' },
    disabled: { fontStyle: 'italic' },
  };

  return (
    <DayPicker
      className="my-custom-day-picker"
      classNames={{
        container: 'my-day-picker-container',
        months: 'my-months-class',
        month: 'my-month-class',
        weekdays: 'my-weekdays-class',
        weekday: 'my-weekday-class',
        days: 'my-days-class',
        day: 'my-day-class',
        today: 'my-today-class',
        selected: 'my-selected-class',
        disabled: 'my-disabled-class',
        outside: 'my-outside-class',
      }}
      modifiersStyles={customModifiersStyles}
    />
  );
}

export default MyComponent;
```

--------------------------------

### ClassNames Type Alias Definition

Source: https://github.com/gpbl/react-day-picker/blob/main/apps/website/versioned_docs/version-9.14.0/api/type-aliases/ClassNames.md

Defines the structure for mapping UI elements, selection states, and day flags to string class names. This allows users to customize the CSS classes applied to different parts of the day picker.

```APIDOC
## Type Alias: ClassNames

> **ClassNames** = { [key in UI | SelectionState | DayFlag | Animation]: string }

Defined in: [src/types/shared.ts:279](https://github.com/gpbl/react-day-picker/blob/bdd54947a9610ac8d7393f5a4c3b8b0c13ca0d5d/src/types/shared.ts#L279)

The CSS classnames to use for the [UI](../enumerations/UI.md) elements, the
[SelectionState](../enumerations/SelectionState.md) and the [DayFlag](../enumerations/DayFlag.md).

### Example

```ts
const classNames: ClassNames = {
    [UI.Root]: "root",
    [UI.Outside]: "outside",
    [UI.Nav]: "nav",
    // etc.
  };
```
```

### Styling > Custom Class Names

Source: https://github.com/gpbl/react-day-picker/blob/main/apps/website/docs/docs/styling.mdx

You can apply custom class names to DayPicker elements using the `classNames` prop. This prop accepts an object where keys correspond to DayPicker UI elements and values are the desired class names. You can also extend the default class names provided by `getDefaultClassNames`.
