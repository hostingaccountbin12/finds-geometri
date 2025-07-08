// itemUtils.ts
// Utility functions for handling game inventory items

// Define the item interface to match your GameContext structure
export interface InventoryItem {
  id: string;
  name: string;
  image: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  };
  price: number;
  type: "toy" | "food" | "decor";
  allowedCurrencies?: string[];
}

/**
 * Filters inventory items by type and purchase status
 * @param inventory The full inventory array
 * @param purchasedIds Array of purchased item IDs
 * @param type The type of items to filter ('toy', 'food', 'decor')
 * @returns Filtered items
 */
export const getItemsByType = (
  inventory: InventoryItem[],
  purchasedIds: string[],
  type: "toy" | "food" | "decor"
): InventoryItem[] => {
  return inventory.filter(
    (item) => item.type === type && purchasedIds.includes(item.id)
  );
};

/**
 * Checks if player has a specific item
 * @param purchasedIds Array of purchased item IDs
 * @param itemId The item ID to check
 * @returns boolean indicating if the item is owned
 */
export const hasItem = (purchasedIds: string[], itemId: string): boolean => {
  return purchasedIds.includes(itemId);
};

/**
 * Gets specific item data from inventory
 * @param inventory The full inventory array
 * @param itemId Item ID to find
 * @returns The item object or undefined if not found
 */
export const getItemById = (
  inventory: InventoryItem[],
  itemId: string
): InventoryItem | undefined => {
  return inventory.find((item) => item.id === itemId);
};

/**
 * Gets counts of each item type owned
 * @param inventory The full inventory array
 * @param purchasedIds Array of purchased item IDs
 * @returns Object with counts for each item type
 */
export const getItemCounts = (
  inventory: InventoryItem[],
  purchasedIds: string[]
): { toys: number; food: number; decor: number } => {
  return {
    toys: getItemsByType(inventory, purchasedIds, "toy").length,
    food: getItemsByType(inventory, purchasedIds, "food").length,
    decor: getItemsByType(inventory, purchasedIds, "decor").length,
  };
};
