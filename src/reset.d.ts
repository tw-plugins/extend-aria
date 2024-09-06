type WidenLiteral<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends bigint
        ? bigint
        : T extends symbol
          ? symbol
          : T;

interface ReadonlyArray<T> {
  includes(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): boolean;
}

interface Array<T> {
  includes(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): boolean;
}
