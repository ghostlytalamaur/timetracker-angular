export function clustering<T>(items: T[], idProvider: (item: T) => string): T[][] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const id = idProvider(item);
    if (!map.has(id)) {
      map.set(id, []);
    }
    const group = map.get(id);
    if (group) {
      group.push(item);
    }
  }

  return new Array(...map.values());
}
