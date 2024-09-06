# Tailwind CSS Extend ARIA Plugin

[![npm version](https://badge.fury.io/js/@tw-plugins%2Fextend-aria.svg)](https://badge.fury.io/js/@tw-plugins%2Fextend-aria)

A Tailwind CSS plugin that extends support for [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) attributes, providing utility variants for **boolean** and **enumerated** ARIA states to enhance accessibility styling.

## Installation:

Install the plugin:

```bash
npm install --save-dev @tw-plugins/extend-aria
```

## Usage:

Add the plugin to your Tailwind CSS configuration:

```js
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {},
  plugins: [require("@tw-plugins/extend-aria")],
};
```

or with options:

```ts
// tailwind.config.ts

import type { Config } from "tailwindcss";
import extendAria from "@tw-plugins/extend-aria";

const tailwindConfig: Config = {
  content: [],
  theme: {},
  plugins: [
    extendAria({
      // ExtendAriaPluginOptions
    }),
  ],
};

export default tailwindConfig;
```

## Configuration Options:

### `attributes`

A list of extendable WAI-ARIA 1.2 attributes to include in the plugin. Only attributes with boolean or enumerated values are used and accepted.

Attributes with custom or free-form values, such as `aria-label`, are not included. Users can still extend these manually using Tailwind's arbitrary value feature `aria-[]`.

If not provided, the plugin defaults to including all relevant attributes except deprecated ones (if [`includeDeprecated`](#includedeprecated) is false).

Example:

```ts
const extendAria = require("@tw-plugins/extend-aria");

const tailwindConfig = {
  plugins: [
    extendAria({
      attributes: ["aria-checked", "aria-current", "aria-invalid"],
    }),
  ],
};
```

### `includeDeprecated`

A flag indicating whether to include deprecated ARIA attributes.

Default is `false` and deprecated attributes like `aria-grabbed` and `aria-dropeffect` are excluded from the variants. To include these, explicitly set this option to `true`.

### `negate`

Specifies how boolean ARIA attributes with `"false"` values should be handled.

| Value                  | Description                                                                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `"relevant"` (default) | Only include boolean attributes where `"false"` has significant meaning (e.g., `aria-expanded="false"`). Variants for these attributes are generated with the `aria-not-_` prefix (e.g., `aria-not-expanded` for `aria-expanded="false"`). |
| `"all"`                | Include all boolean attributes with both `"true"` and `"false"` values. Variants for `"false"` values are generated with the `aria-not-_` prefix.                                                                                          |
| `BoolAriaAttribute[]`  | An array of specific boolean attributes to include with `"false"` values. Variants for these attributes are generated with the `aria-not-*` prefix, e.g. `aria-not-current`                                                                |
| `false`                | Do not include any attributes with `"false"` values.                                                                                                                                                                                       |

## Examples

### Default configuration:

```js
// tailwind.config.js

module.exports = {
  plugins: [require("@tw-plugins/extend-aria")],
};
```

This will include all relevant WAI-ARIA 1.2 boolean and enumerated attributes, excluding deprecated ones, and only extend "false" values where meaningful.

### Include deprecated attributes:

```js
// tailwind.config.js

const extendAria = require("@tw-plugins/extend-aria");

module.exports = {
  plugins: [extendAria({ includeDeprecated: true })],
};
```

### Include all boolean negations:

```js
// tailwind.config.js

const extendAria = require("@tw-plugins/extend-aria");

module.exports = {
  plugins: [extendAria({ negate: "all" })],
};
```

### Specific boolean attributes with "false" values:

```js
// tailwind.config.js

const extendAria = require("@tw-plugins/extend-aria");

module.exports = {
  plugins: [extendAria({ negate: ["aria-checked", "aria-pressed"] })],
};
```

## Supported Attributes:

This plugin only supports extendable WAI-ARIA 1.2 attributes that have boolean or enumerated values. Attributes with custom values, such as aria-label, are not included. However, you can still use these with Tailwind CSS's arbitrary value feature.

Here is a list of supported attributes:

| Attribute            | Values                                         | Possible outputs                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aria-atomic          | true, false                                    | `aria-atomic:{utility}`, `aria-not-atomic:{utility}`                                                                                                                                                                          |
| aria-autocomplete    | both, inline, list, none                       | `aria-autocomplete-both:{utility}`, `aria-autocomplete-inline:{utility}`, `aria-autocomplete-list:{utility}`, `aria-autocomplete-none:{utility}`                                                                              |
| aria-busy            | true, false                                    | `aria-busy:{utility}`, `aria-not-busy:{utility}`                                                                                                                                                                              |
| aria-checked         | true, false, mixed                             | `aria-checked:{utility}`, `aria-not-checked:{utility}`, `aria-checked-mixed:{utility}`                                                                                                                                        |
| aria-current         | true, false, date, location, page, step, time  | `aria-current:{utility}`, `aria-not-current:{utility}`, `aria-current-date:{utility}`, `aria-current-location:{utility}`, `aria-current-page:{utility}`, `aria-current-step:{utility}`, `aria-current-time:{utility}`         |
| aria-disabled        | true, false                                    | `aria-disabled:{utility}`, `aria-not-disabled:{utility}`                                                                                                                                                                      |
| aria-dropeffect      | copy, execute, link, move, none, popup         | `aria-dropeffect-copy:{utility}`, `aria-dropeffect-execute:{utility}`, `aria-dropeffect-link:{utility}`, `aria-dropeffect-move:{utility}`, `aria-dropeffect-none:{utility}`, `aria-dropeffect-popup:{utility}`                |
| aria-expanded        | true, false                                    | `aria-expanded:{utility}`, `aria-not-expanded:{utility}`                                                                                                                                                                      |
| aria-grabbed         | true, false                                    | `aria-grabbed:{utility}`, `aria-not-grabbed:{utility}`                                                                                                                                                                        |
| aria-haspopup        | true, false, dialog, grid, listbox, menu, tree | `aria-haspopup:{utility}`, `aria-not-haspopup:{utility}`, `aria-haspopup-dialog:{utility}`, `aria-haspopup-grid:{utility}`, `aria-haspopup-listbox:{utility}`, `aria-haspopup-menu:{utility}`, `aria-haspopup-tree:{utility}` |
| aria-hidden          | true, false                                    | `aria-hidden:{utility}`, `aria-not-hidden:{utility}`                                                                                                                                                                          |
| aria-invalid         | true, false, grammar, spelling                 | `aria-invalid:{utility}`, `aria-not-invalid:{utility}`, `aria-invalid-grammar:{utility}`, `aria-invalid-spelling:{utility}`                                                                                                   |
| aria-live            | off, assertive, polite                         | `aria-live-off:{utility}`, `aria-live-assertive:{utility}`, `aria-live-polite:{utility}`                                                                                                                                      |
| aria-modal           | true, false                                    | `aria-modal:{utility}`, `aria-not-modal:{utility}`                                                                                                                                                                            |
| aria-multiline       | true, false                                    | `aria-multiline:{utility}`, `aria-not-multiline:{utility}`                                                                                                                                                                    |
| aria-multiselectable | true, false                                    | `aria-multiselectable:{utility}`, `aria-not-multiselectable:{utility}`                                                                                                                                                        |
| aria-orientation     | horizontal, vertical                           | `aria-orientation-horizontal:{utility}`, `aria-orientation-vertical:{utility}`                                                                                                                                                |
| aria-pressed         | true, false, mixed                             | `aria-pressed:{utility}`, `aria-not-pressed:{utility}`, `aria-pressed-mixed:{utility}`                                                                                                                                        |
| aria-readonly        | true, false                                    | `aria-readonly:{utility}`, `aria-not-readonly:{utility}`                                                                                                                                                                      |
| aria-relevant        | additions, all, removals, text                 | `aria-relevant-additions:{utility}`, `aria-relevant-all:{utility}`, `aria-relevant-removals:{utility}`, `aria-relevant-text:{utility}`                                                                                        |
| aria-required        | true, false                                    | `aria-required:{utility}`, `aria-not-required:{utility}`                                                                                                                                                                      |
| aria-selected        | true, false                                    | `aria-selected:{utility}`, `aria-not-selected:{utility}`                                                                                                                                                                      |
| aria-sort            | ascending, descending, none, other             | `aria-sort-ascending:{utility}`, `aria-sort-descending:{utility}`, `aria-sort-none:{utility}`, `aria-sort-other:{utility}`                                                                                                    |

All attributes produces variants for styling based on parent and sibling states, e.g. `group-aria-expanded:{utility}`, `peer-aria-invalid-spelling:{utility}`, etc.

## Contributing:

Contributions are welcome! If you have suggestions for improving this plugin or find any bugs, please open an issue or submit a pull request.

## License:

This project is licensed under the MIT License. See the [LICENSE](https://github.com/tw-plugins/extend-aria/blob/main/LICENSE) file for more details.
