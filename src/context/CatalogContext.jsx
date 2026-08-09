import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import localProducts from "../data/products";
import localCombos from "../data/combos";
import { getCatalogFromApi } from "../services/catalogApi";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [remoteCatalog, setRemoteCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState(null);

  const loadCatalog = async () => {
    try {
      const apiCatalog = await getCatalogFromApi();

      setRemoteCatalog(apiCatalog);
      setCatalogError(null);
    } catch (error) {
      console.error("Error cargando catálogo:", error);

      setCatalogError(error.message);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    loadCatalog();

    const interval = setInterval(() => {
      loadCatalog();
    }, 10000);

    const handleFocus = () => {
      loadCatalog();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadCatalog();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  const remoteMap = useMemo(() => {
    return new Map(
      remoteCatalog.map((item) => [
        item.frontendId,
        item,
      ])
    );
  }, [remoteCatalog]);

  const products = useMemo(() => {
    return localProducts.map((product) => {
      const remote = remoteMap.get(product.id);

      if (!remote) {
        return product;
      }

      return {
        ...product,
        price: remote.price,
        stock: remote.stock,
      };
    });
  }, [remoteMap]);

  const combos = useMemo(() => {
    return localCombos.map((combo) => {
      const remote = remoteMap.get(combo.id);

      if (!remote) {
        return combo;
      }

      return {
        ...combo,
        price: remote.price,
        stock: remote.stock,
      };
    });
  }, [remoteMap]);

  return (
    <CatalogContext.Provider
      value={{
        products,
        combos,
        loadingCatalog,
        catalogError,
        refreshCatalog: loadCatalog,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error(
      "useCatalog debe utilizarse dentro de CatalogProvider"
    );
  }

  return context;
}
