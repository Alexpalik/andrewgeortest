export async function validateCart(): Promise<void> {
    try {
      const checkoutId = sessionStorage.getItem('checkout_id');
  
      if (!checkoutId) {
        throw new Error('No checkout ID found in localStorage');
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/cart-validate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkout_id: checkoutId }),
      });
  
      if (!response.ok) {
        throw new Error('Cart validation failed');
      }
  
      const data: any = await response.json();
      console.log('Cart validated:', data);
  
    } catch (error) {
      console.error('Error validating cart:', error instanceof Error ? error.message : error);
    }
  }
  