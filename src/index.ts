import plugin from "tailwindcss/plugin";

export type EnumAriaAttribute = keyof typeof ENUM_ATTRIBUTES;
export type BoolAriaAttribute = (typeof BOOLEAN_ATTRIBUTES)[number];
export type AriaAttribute = BoolAriaAttribute | EnumAriaAttribute;

/**
 * Options for configuring the Extend ARIA Plugin.
 */
export interface ExtendAriaPluginOptions {
  /**
   * A list of extendable {@link https://www.w3.org/TR/wai-aria-1.2/|WAI-ARIA 1.2} attributes to include in the plugin.
   *
   * Only attributes with boolean or enumerated values are used and accepted.
   * Attributes with custom or free-form values, such as `aria-label`, are not included.
   * Users can still extend these manually using Tailwind's arbitrary value feature `aria-[]`.
   *
   * If not provided, the plugin defaults to including all relevant attributes except deprecated ones (if {@link includeDeprecated|`includeDeprecated`} is `false`).
   *
   * @example
   * attributes: ["aria-checked", "aria-expanded"]
   */
  attributes?: AriaAttribute[];

  /**
   * A flag indicating whether to include deprecated WAI-ARIA attributes.
   *
   * When set to `true`, deprecated attributes like 'aria-grabbed' and 'aria-dropeffect'
   * will be included in the variants. When set to `false`, these attributes will be excluded.
   *
   * @default false
   * @example
   * includeDeprecated: true
   */
  includeDeprecated?: boolean;

  /**
   * Specifies how boolean WAI-ARIA attributes with "false" values should be handled.
   * - `"all"`: Include all boolean attributes with both "true" and "false" values.
   * - `"relevant"`: Only include boolean attributes where "false" has significant meaning (e.g., `aria-expanded="false"`).
   * - `BoolAriaAttribute[]`: An array of specific boolean attributes to include with "false" values.
   * - `false`: Do not include any attributes with "false" values.
   *
   * Variants for these attributes are generated with the `aria-not-*` prefix (e.g., `aria-not-expanded` for `aria-expanded="false"`).
   *
   * @default "relevant"
   * @example
   * negate: "all"
   * @example
   * negate: ["aria-checked", "aria-pressed"]
   */
  negate?: "all" | "relevant" | BoolAriaAttribute[] | false;
}

const ENUM_ATTRIBUTES = {
  "aria-autocomplete": ["both", "inline", "list", "none"],
  "aria-checked": ["mixed"],
  "aria-current": ["date", "location", "page", "step", "time"],
  "aria-dropeffect": ["copy", "execute", "link", "move", "none", "popup"],
  "aria-haspopup": ["dialog", "grid", "listbox", "menu", "tree"],
  "aria-invalid": ["grammar", "spelling"],
  "aria-live": ["off", "assertive", "polite"],
  "aria-orientation": ["horizontal", "vertical"],
  "aria-pressed": ["mixed"],
  "aria-relevant": ["additions", "all", "removals", "text"],
  "aria-sort": ["ascending", "descending", "none", "other"],
} as const;

const BOOLEAN_ATTRIBUTES = [
  "aria-atomic",
  "aria-busy",
  "aria-checked",
  "aria-current",
  "aria-disabled",
  "aria-expanded",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-pressed",
  "aria-readonly",
  "aria-required",
  "aria-selected",
] as const;

const RELEVANT_FALSE_VALUES = [
  "aria-checked",
  "aria-expanded",
  "aria-grabbed",
  "aria-pressed",
  "aria-selected",
] satisfies BoolAriaAttribute[];

const DEPRECATED_ATTRIBUTES = ["aria-grabbed", "aria-dropeffect"] satisfies AriaAttribute[];

const isEnumAttribute = (attr: AriaAttribute): attr is EnumAriaAttribute => attr in ENUM_ATTRIBUTES;

const isBoolAttribute = (attr: AriaAttribute): attr is BoolAriaAttribute =>
  BOOLEAN_ATTRIBUTES.includes(attr);

const addNotPrefix = (attr: BoolAriaAttribute) =>
  attr.startsWith("aria-not-") ? attr : attr.replace(/^aria-/, "aria-not-");

const extendAriaPlugin = plugin.withOptions<ExtendAriaPluginOptions>(
  ({ attributes, includeDeprecated = false, negate = "relevant" } = {}) =>
    ({ matchVariant, addVariant }) => {
      if (!attributes) {
        const combinedAttributes = new Set<AriaAttribute>([
          ...BOOLEAN_ATTRIBUTES,
          ...(Object.keys(ENUM_ATTRIBUTES) as EnumAriaAttribute[]),
        ]);

        if (!includeDeprecated) {
          DEPRECATED_ATTRIBUTES.forEach((attr) => {
            combinedAttributes.delete(attr);
          });
        }

        attributes = [...combinedAttributes];
      }

      if (!Array.isArray(attributes) || attributes.length === 0) return;

      const extendVariant = (variantName: string, selector: string) => {
        addVariant(variantName, `&[${selector}]`);
        matchVariant(
          "group",
          (_, { modifier }) =>
            modifier
              ? String.raw`:merge(.group\/${modifier})[${selector}] &`
              : String.raw`:merge(.group)[${selector}] &`,
          { values: { [variantName]: variantName } },
        );
        matchVariant(
          "peer",
          (_, { modifier }) =>
            modifier
              ? String.raw`:merge(.peer\/${modifier})[${selector}] ~ &`
              : String.raw`:merge(.peer)[${selector}] ~ &`,
          { values: { [variantName]: variantName } },
        );
      };

      for (const attribute of attributes) {
        if (isEnumAttribute(attribute)) {
          for (const value of ENUM_ATTRIBUTES[attribute]) {
            extendVariant(`${attribute}-${value}`, `${attribute}="${value}"`);
          }
        }

        if (isBoolAttribute(attribute)) {
          const shouldNegate =
            negate === "all" ||
            (negate === "relevant" && RELEVANT_FALSE_VALUES.includes(attribute)) ||
            (Array.isArray(negate) && negate.includes(attribute));

          if (shouldNegate) {
            extendVariant(addNotPrefix(attribute), `${attribute}="false"`);
          }

          extendVariant(attribute, `${attribute}="true"`);
        }
      }
    },
);

export default extendAriaPlugin;
