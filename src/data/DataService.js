// src/data/DataService.js

// --- CLAVES PARA EL ALMACENAMIENTO LOCAL (PERSISTENCIA) ---
const PRODUCTS_KEY = 'tienda_products_db';
const USERS_KEY = 'tienda_users_db';
const AUTH_KEY = 'tienda_session_user';

// --- DATOS INICIALES (TUS PRODUCTOS REALES) ---
const initialProducts = [
    { id: 1, name: "Empanada Camarón Queso", price: 2000, stock: 50, category: "Empanadas", imageUrl: "/images/empadas/camaronqueso/camaronqueso.jpg", isOffer: true, description: "Deliciosa masa rellena de camarones salteados y abundante queso derretido." },
    { id: 2, name: "Empanada Pino Casera", price: 1300, stock: 60, category: "Empanadas", imageUrl: "/images/empadas/de pino/de pino.jpg", isOffer: false, description: "La auténtica empanada chilena de pino con carne picada, cebolla, huevo y aceituna." },
    { id: 3, name: "Hand Roll", price: 3000, stock: 40, category: "Sushi", imageUrl: "/images/sushi/hand-roll.jpg", isOffer: false, description: "Alga nori, arroz, pollo, palta y queso crema." },
    { id: 4, name: "Empanada Jamón Queso", price: 1200, stock: 75, category: "Empanadas", imageUrl: "/images/empadas/jamonqueso/jamonqueso.jpg", isOffer: true, description: "La clásica de jamón y queso, perfecta para un snack." },
    { id: 5, name: "Bebida Express (Lata)", price: 1000, stock: 100, category: "Bebidas", imageUrl: "/images/bebidas/bebidas.jpg", isOffer: false, description: "Bebida en lata (350cc), elige tu sabor favorito." },
    { id: 6, name: "Bolitas Crispy (Sushi)", price: 500, stock: 30, category: "Sushi", imageUrl: "/images/sushi/bolitaskryspy.jpg", isOffer: false, description: "Bocados de arroz crujientes rellenos de pollo y queso. Oferta: 4x$2000." },
    { id: 7, name: "Empanada Solo Queso", price: 1000, stock: 80, category: "Empanadas", imageUrl: "/images/empadas/queso/queso.jpg", isOffer: false, description: "La favorita para los amantes del queso. Cremosa y muy sabrosa." },
    { id: 8, name: "Empanada Napolitana", price: 1300, stock: 55, category: "Empanadas", imageUrl: "/images/empadas/napolitana/napolitana.jpg", isOffer: false, description: "Queso, tomate y orégano. El sabor de una pizza en una empanada." },
    { id: 9, name: "Empanada Pollo Queso", price: 1300, stock: 65, category: "Empanadas", imageUrl: "/images/empadas/polloqueso/polloqueso.jpg", isOffer: false, description: "La combinación ganadora: suave pollo desmenuzado con queso derretido." },
    { id: 10, name: "Sopaipillas", price: 350, stock: 120, category: "Frituras", imageUrl: "/images/sopaipillas/sopaipillas.jpg", isOffer: true, description: "Unidad: $350. ¡Oferta: 3 por $1.000! Ideales para el invierno o la lluvia." },
    { id: 11, name: "Churros", price: 350, stock: 90, category: "Frituras", imageUrl: "/images/churros/churros.jpg", isOffer: true, description: "Unidad: $350. ¡Oferta: 3 por $1.000! Crujientes y listos para bañar en salsa." }
];

// --- DATOS INICIALES (USUARIOS REQUERIDOS) ---
const initialUsers = [
    { id: 1, name: "José Vásquez (Admin)", email: "jos.vasquezz@duocuc.cl", password: "123456", role: "ADMIN" },
    { id: 2, name: "Usuario Cliente", email: "usuario1@duocuc.cl", password: "123", role: "CLIENTE" },
    { id: 3, name: "Usuario Gmail", email: "usuario2@gmail.com", password: "123", role: "CLIENTE" }
];

// --- INICIALIZACIÓN DE DATOS ---
const initData = () => {
    if (!localStorage.getItem(PRODUCTS_KEY)) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }
};

// Ejecutamos la inicialización al cargar el archivo
initData();

// Variable auxiliar para compatibilidad
export let products = initialProducts;

// --- FUNCIONES CRUD DE PRODUCTOS (Persistentes) ---

export const getProducts = () => {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
};

export const getProductById = (id) => {
    const prods = getProducts();
    return prods.find(p => p.id === parseInt(id));
};

export const getOfferProducts = () => {
    const prods = getProducts();
    return prods.filter(p => p.isOffer);
};

export const getCategories = () => {
    return ['Empanadas', 'Sushi', 'Bebidas', 'Frituras', 'Promociones', 'Otros'];
};

export const getProductsByCategory = (categoryName) => {
    const prods = getProducts();
    return prods.filter(p => p.category && p.category.toLowerCase() === categoryName.toLowerCase());
};

export const addProduct = (product) => {
    const prods = getProducts();
    const newId = prods.length > 0 ? Math.max(...prods.map(p => p.id)) + 1 : 1;
    const newProduct = { ...product, id: newId };
    
    prods.push(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(prods));
    return newProduct;
};

export const updateProduct = (updatedProduct) => {
    let prods = getProducts();
    const index = prods.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
        prods[index] = { ...updatedProduct };
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(prods));
        return prods[index];
    }
    return null;
};

export const deleteProduct = (id) => {
    let prods = getProducts();
    const newProducts = prods.filter(p => p.id !== parseInt(id));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newProducts));
    return true;
};

// --- FUNCIONES DE AUTENTICACIÓN (LISTO PARA LA RÚBRICA) ---

export const getUsers = () => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

export const registerUser = (newUser) => {
    const users = getUsers();
    
    // Verificar si el correo ya existe
    if (users.some(u => u.email === newUser.email)) {
        throw new Error("El correo ya está registrado");
    }

    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const userToSave = { ...newUser, id, role: newUser.role || 'CLIENTE' };
    
    users.push(userToSave);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return userToSave;
};

export const loginUser = (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        return user;
    } else {
        throw new Error("Credenciales incorrectas");
    }
};

export const logoutUser = () => {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = '/';
};

export const getCurrentUser = () => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
};