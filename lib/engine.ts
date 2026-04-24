export interface WardrobeItem {
  id: string;
  name: string;
  type: "top" | "bottom" | "shoes" | "accessory";
  color: string;
  material: string;
  formality: "casual" | "smart-casual" | "formal";
  weatherRange: [number, number];
  tags: string[];
}

export interface Outfit {
  top: WardrobeItem;
  bottom: WardrobeItem;
  shoes: WardrobeItem;
  accessory: WardrobeItem;
}

// Seeded PRNG (mulberry32) — deterministic per-call
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne(items: WardrobeItem[], rand: () => number): WardrobeItem | null {
  if (items.length === 0) return null;
  return items[Math.floor(rand() * items.length)];
}

export function generateOutfit(
  wardrobe: WardrobeItem[],
  formality: string,
  weather: number,
  history: string[] // item IDs worn in last 3 days
): Outfit | null {
  const historySet = new Set(history);

  const eligible = wardrobe.filter(
    (item) =>
      item.formality === formality &&
      weather >= item.weatherRange[0] &&
      weather <= item.weatherRange[1] &&
      !historySet.has(item.id)
  );

  const tops = eligible.filter((i) => i.type === "top");
  const bottoms = eligible.filter((i) => i.type === "bottom");
  const shoes = eligible.filter((i) => i.type === "shoes");
  const accessories = eligible.filter((i) => i.type === "accessory");

  // Seed from timestamp for fresh results on each generate
  const seed = Date.now() ^ ([...formality].reduce((a, c) => a + c.charCodeAt(0), 0));
  const rand = mulberry32(seed);

  const top = pickOne(tops, rand);
  const bottom = pickOne(bottoms, rand);
  const shoe = pickOne(shoes, rand);
  const accessory = pickOne(accessories, rand);

  if (!top || !bottom || !shoe || !accessory) return null;

  return { top, bottom, shoes: shoe, accessory };
}
