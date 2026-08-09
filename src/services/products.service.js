import products from "../data/products";

export const getProducts = () => products;

export const getFeaturedProducts = () =>
  products.filter(product => product.featured);

export const getProductsByCategory = (category) =>
  products.filter(product => product.category === category);

export const getProductById = (id) =>
  products.find(product => product.id === id);
