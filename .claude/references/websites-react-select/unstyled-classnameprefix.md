---
library: /websites/react-select
topic: unstyled-classnameprefix
query: "unstyled prop with classNamePrefix to remove default emotion styles and use own CSS classes"
fetched: 2026-08-25
---

### Apply custom styles with `unstyled` prop

Source: https://react-select.com/styles

Use the `unstyled` prop to remove all default presentational styles from React Select. This allows for complete control over the component's look using your own `styles` or `classNames`. Functional styles for menu positioning and input width in multi-select are retained.

```jsx
<Select
  {...props}
  className="react-select-container"
  classNamePrefix="react-select"
/>
```

--------------------------------

### `unstyled`

Source: https://react-select.com/props

Removes all default non-essential styles from the select component.

```APIDOC
## `unstyled`

### Description
Remove all non-essential styles.

### Type
boolean
```

--------------------------------

### Apply class names with `classNamePrefix`

Source: https://react-select.com/styles

When the `classNamePrefix` prop is provided, React Select applies a class name with this prefix to all its internal elements. This facilitates consistent styling across the component's structure.

```html
<div class="react-select-container">
  <div class="react-select__control">
    <div class="react-select__value-container">...</div>
    <div class="react-select__indicators">...</div>
  </div>
  <div class="react-select__menu">
    <div class="react-select__menu-list">
      <div class="react-select__option">...</div>
    </div>
  </div>
</div>
```

### Styles

Source: https://react-select.com/styles

The `unstyled` prop can be used to remove all presentational styles from React Select, leaving only essential functional styles for elements like menu positioning and input width in multi-select mode. This allows for complete control over the component's appearance through custom `styles` or `classNames` without needing to override default theme styles.

--------------------------------

### Styles

Source: https://react-select.com/styles

When the `classNamePrefix` prop is applied to React Select, all internal elements receive a CSS class name that starts with the provided prefix. For example, using `classNamePrefix="react-select"` will result in class names like `react-select__control`, `react-select__menu`, and `react-select__option` for the respective DOM elements.
