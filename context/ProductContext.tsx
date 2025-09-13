import React, { createContext, useState, useContext, ReactNode } from 'react';

// Définissez la structure de votre produit si elle n'existe pas déjà
export interface Product {
    nom: string;
    ref_produit: string;
    prix: number;
    date_creation: string;
    stock: number;
    status?: 'Actif' | 'Inactif';
    specs: Spec[];
}

export interface Spec {
    cle: string;
    valeur: number;
    unit: string;
}

// Définissez le type de votre contexte
interface ProductContextType {
    installedProducts: Product[];
    addInstalledProduct: (product: Product) => void;
}

// Créez le contexte avec une valeur par défaut
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Créez un hook personnalisé pour utiliser le contexte plus facilement
export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext doit être utilisé à l\'intérieur d\'un ProductProvider');
    }
    return context;
};

// Créez le fournisseur de contexte
interface ProductProviderProps {
    children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
    const [installedProducts, setInstalledProducts] = useState<Product[]>([]);

    const addInstalledProduct = (product: Product) => {
        setInstalledProducts(prevProducts => [...prevProducts, product]);
    };

    return (
        <ProductContext.Provider value={{ installedProducts, addInstalledProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
