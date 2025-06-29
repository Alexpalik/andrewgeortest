import { getCheckout } from "./getCart";
import { updateCartItem } from "./updateCartItems";
import { addCartItem } from "./addCartItem";
import { createCheckout } from "./createCheckout";

export async function addToCart(variantId: string, quantity: number = 1) {
  const checkoutId = sessionStorage.getItem("checkout_id");

  if (checkoutId) {
    // Get the existing checkout
    const checkout = await getCheckout();
    if (!checkout) {
      console.error("Checkout not found. Creating a new one.");
      return await createCheckout(variantId, quantity);
    }

    // Check if the item is already in the cart
    const existingLine = checkout.lines.find(
      (line: any) => line.variant.id === variantId
    );

    // If item is already in cart, increase quantity
    if (existingLine) {
      const newQuantity = existingLine.quantity + quantity;
      return await updateCartItem(existingLine.id, newQuantity);
    } else {
      // If item is not in cart, add it as a new line
      return await addCartItem(variantId, quantity);
    }
  } else {
    // If no checkout exists, create a new one
    return await createCheckout(variantId, quantity);
  }
}
