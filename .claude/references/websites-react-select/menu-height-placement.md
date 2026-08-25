---
library: /websites/react-select
topic: menu-height-placement
query: "maxMenuHeight and minMenuHeight props controlling menu placement and scrolling"
fetched: 2026-08-25
---

### `maxMenuHeight`

Source: https://react-select.com/props

Sets the maximum height of the menu before scrolling is enabled.

```APIDOC
## `maxMenuHeight`

### Description
Maximum height of the menu before scrolling.

### Type
number
```

--------------------------------

### `minMenuHeight`

Source: https://react-select.com/props

Sets the minimum height of the menu before it flips to the opposite placement.

```APIDOC
## `minMenuHeight`

### Description
Minimum height of the menu before flipping.

### Type
number
```

--------------------------------

### Menu Props

Source: https://react-select.com/props

Props specifically related to the menu display and behavior.

```APIDOC
## Menu Props

### `innerRef`

Reference to the internal menu element, used by the MenuPlacer component.

### `innerProps`

Props to be passed to the inner menu element.

### `isLoading`

Indicates if the menu is currently in a loading state.

### `placement`

The placement of the menu (e.g., 'top', 'bottom').

### `children`

The content to be rendered within the menu.

### `className`

Custom class name for the menu.

### `minMenuHeight`

Sets the minimum height of the menu.

### `maxMenuHeight`

Sets the maximum height of the menu.

### `menuPlacement`

Determines where the menu is placed relative to the input (e.g., 'bottom', 'auto', 'top').

### `menuPosition`

Specifies the CSS position of the menu (e.g., 'absolute', 'fixed').

### `menuShouldScrollIntoView`

Determines if the page should scroll to bring the menu into view.
```

--------------------------------

### `menuPlacement`

Source: https://react-select.com/props

Determines the default placement of the menu relative to the control. 'auto' allows flipping.

```APIDOC
## `menuPlacement`

### Description
Default placement of the menu in relation to the control. 'auto' will flip when there isn't enough space below the control.

### Type
One of <
"bottom", 
"auto", 
"top"
>
```

### react-select Props > maxMenuHeight

Source: https://react-select.com/props

The `maxMenuHeight` prop sets the maximum height of the menu before scrolling is required.
