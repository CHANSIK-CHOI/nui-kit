---
library: /websites/react-select
topic: components-replacement
query: "components prop to replace IndicatorSeparator with null and customize DropdownIndicator ClearIndicator MultiValueRemove"
fetched: 2026-08-25
---

### Replace Option Component in React Select

Source: https://react-select.com/components

Demonstrates how to use a custom Option component with the Select component by passing it via the `components` prop. The custom component receives props like isDisabled and innerProps.

```jsx
import React from 'react';
import Select from 'react-select';

const CustomOption = ({ innerProps, isDisabled }) =>
  !isDisabled ? (
    <div {...innerProps}>{/* your component internals */}</div>
  ) : null;

class Component extends React.Component {
  render() {
    return <Select components={{ Option: CustomOption }} />;
  }
}
```

### Styles

Source: https://react-select.com/styles

React Select provides a list of keys for its inner components that can be targeted for styling. These include: `clearIndicator`, `container`, `control`, `dropdownIndicator`, `group`, `groupHeading`, `indicatorsContainer`, `indicatorSeparator`, `input`, `loadingIndicator`, `loadingMessage`, `menu`, `menuList`, `menuPortal`, `multiValue`, `multiValueLabel`, `multiValueRemove`, `noOptionsMessage`, `option`, `placeholder`, `singleValue`, and `valueContainer`.

--------------------------------

### Props > DropdownIndicator

Source: https://react-select.com/props

The `DropdownIndicator` component is provided with props including `children`, `innerProps`, `isFocused`, `isDisabled`, `className`, `clearValue`, `cx`, `getStyles`, `getClassNames`, `getValue`, `hasValue`, `isMulti`, `isRtl`, `options`, `selectOption`, `selectProps`, `setValue`, and `theme`.

--------------------------------

### React Select > Components > Replacing Components

Source: https://react-select.com/components

You can augment the layout and functionality of React Select by replacing default components with your own using the `components` property. These custom components receive all current props and state, enabling extensive customization.

--------------------------------

### Props > ClearIndicator

Source: https://react-select.com/props

The `ClearIndicator` component receives several props including `children`, `innerProps`, `isFocused`, `className`, `clearValue`, `cx`, `getStyles`, `getClassNames`, `getValue`, `hasValue`, `isMulti`, `isRtl`, `options`, `selectOption`, `selectProps`, `setValue`, and `theme`.
