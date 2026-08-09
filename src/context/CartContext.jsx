import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useCatalog } from "./CatalogContext";

const CartContext = createContext(null);

function getInitialCart() {
  try {
    const savedCart = localStorage.getItem("fullDrinksCart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { products, combos } = useCatalog();

  const [cart, setCart] = useState(getInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const catalog = useMemo(
    () => [
      ...products,
      ...combos.map((combo) => ({
        ...combo,
        category: "combo",
      })),
    ],
    [products, combos]
  );

  useEffect(() => {
    setCart((currentCart) =>
      currentCart
        .map((savedItem) => {
          const currentItem = catalog.find(
            (item) => item.id === savedItem.id
          );

          if (!currentItem) {
            return null;
          }

          if (
            typeof currentItem.stock === "number" &&
            currentItem.stock <= 0
          ) {
            return null;
          }

          const quantity =
            typeof currentItem.stock === "number"
              ? Math.min(
                  savedItem.quantity || 1,
                  currentItem.stock
                )
              : savedItem.quantity || 1;

          return {
            ...savedItem,
            ...currentItem,
            quantity,
          };
        })
        .filter(Boolean)
    );
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem(
      "fullDrinksCart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const showToast = (
    title,
    message,
    type = "warning"
  ) => {
    setToast({
      title,
      message,
      type,
    });

    window.clearTimeout(
      window.fullDrinksToastTimer
    );

    window.fullDrinksToastTimer =
      window.setTimeout(() => {
        setToast(null);
      }, 3000);
  };

  const showStockToast = (product) => {
    const stock = product.stock ?? 0;

    if (stock <= 0) {
      showToast(
        "Sin stock",
        `${product.name} no tiene unidades disponibles en este momento.`,
        "error"
      );

      return;
    }

    const message =
      stock === 1
        ? `Solo queda 1 unidad disponible de ${product.name}.`
        : `Solo hay ${stock} unidades disponibles de ${product.name}.`;

    showToast(
      "Stock insuficiente",
      message,
      "warning"
    );
  };

  const addToCart = (product, quantity = 1) => {
    const currentProduct =
      catalog.find(
        (item) => item.id === product.id
      ) || product;

    if (
      typeof currentProduct.stock === "number" &&
      currentProduct.stock <= 0
    ) {
      showStockToast(currentProduct);
      return;
    }

    const existingProduct = cart.find(
      (item) => item.id === currentProduct.id
    );

    const currentQuantity =
      existingProduct?.quantity || 0;

    if (
      typeof currentProduct.stock === "number" &&
      currentQuantity + quantity >
        currentProduct.stock
    ) {
      showStockToast(currentProduct);
      return;
    }

    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item.id === currentProduct.id
        );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === currentProduct.id
            ? {
                ...item,
                ...currentProduct,
                quantity:
                  item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...currentProduct,
          quantity,
        },
      ];
    });

    showToast(
      "Agregado al carrito",
      `${currentProduct.name} se agregó correctamente.`,
      "success"
    );

    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  };

  const increaseQuantity = (productId) => {
    const item = cart.find(
      (cartItem) =>
        cartItem.id === productId
    );

    if (!item) return;

    const currentProduct =
      catalog.find(
        (product) =>
          product.id === productId
      ) || item;

    if (
      typeof currentProduct.stock === "number" &&
      item.quantity >= currentProduct.stock
    ) {
      showStockToast(currentProduct);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((cartItem) =>
        cartItem.id === productId
          ? {
              ...cartItem,
              ...currentProduct,
              quantity:
                cartItem.quantity + 1,
            }
          : cartItem
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce((total, item) => {
        if (
          typeof item.price !== "number"
        ) {
          return total;
        }

        return (
          total +
          item.price * item.quantity
        );
      }, 0),
    [cart]
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    toast,
    setToast,
    showToast,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider"
    );
  }

  return context;
}
