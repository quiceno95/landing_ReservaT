import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  services: [],
  servicePhotos: {}, // Almacenar fotos por servicio ID
  loading: false,
  error: null,
  currentCategory: 'all',
  searchFilters: {
    ciudad: '',
    relevancia: '',
    tipo_servicio: '',
    query: ''
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false 
      };
    
    case 'LOGOUT':
      Cookies.remove('access_token');
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false 
      };
    
    case 'SET_SERVICES':
      return { ...state, services: action.payload, loading: false };
    
    case 'SET_SERVICE_PHOTOS':
      return { 
        ...state, 
        servicePhotos: { 
          ...state.servicePhotos, 
          [action.payload.serviceId]: action.payload.photos 
        } 
      };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id_servicio === action.payload.id_servicio);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id_servicio === action.payload.id_servicio
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id_servicio !== action.payload)
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id_servicio === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'SET_CATEGORY':
      return { ...state, currentCategory: action.payload };
    
    case 'SET_SEARCH_FILTERS':
      return { 
        ...state, 
        searchFilters: { ...state.searchFilters, ...action.payload } 
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          fetchUserData(decoded.id);
        } else {
          Cookies.remove('access_token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        Cookies.remove('access_token');
      }
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`https://back-services.api-reservat.com/api/v1/mayorista/consultar/${userId}`);
      
      if (response.ok) {
        const userData = await response.json();
        dispatch({ type: 'SET_USER', payload: userData });
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar datos del usuario' });
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await fetch('https://back-services.api-reservat.com/api/v1/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          contraseña: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const decoded = jwtDecode(data.access_token);
        
        // Set cookie with expiration
        Cookies.set('access_token', data.access_token, {
          expires: new Date(decoded.exp * 1000),
          secure: true,
          sameSite: 'strict'
        });

        await fetchUserData(decoded.id);
        return { success: true };
      } else {
        let errorMessage = 'Error de autenticación';
        switch (response.status) {
          case 404:
            errorMessage = 'El usuario no existe';
            break;
          case 401:
            errorMessage = 'Credenciales incorrectas';
            break;
          case 403:
            errorMessage = 'El usuario no está activo, comunícate con el administrador';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          default:
            errorMessage = data.detail || 'Error de autenticación';
        }
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = 'Error de conexión';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const fetchServices = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch('https://back-services.api-reservat.com/api/v1/servicios/listar/');
      
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'SET_SERVICES', payload: data.servicios || [] });
      } else {
        throw new Error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar servicios' });
    }
  }, [dispatch]);

  // Control robusto de peticiones de fotos para evitar bucles infinitos
  const photosRequestsInProgress = useRef(new Set());
  const photosCache = useRef(new Map());

  const fetchServicePhotos = useCallback(async (serviceId) => {
    try {
      // Si ya tenemos las fotos en caché, devolverlas inmediatamente
      if (photosCache.current.has(serviceId)) {
        return photosCache.current.get(serviceId);
      }

      // Si ya hay una petición en progreso para este servicio, no hacer otra
      if (photosRequestsInProgress.current.has(serviceId)) {
        return [];
      }

      // Marcar que estamos haciendo una petición para este servicio
      photosRequestsInProgress.current.add(serviceId);

      const response = await fetch(`https://back-services.api-reservat.com/api/v1/fotos/servicios/${serviceId}`);
      
      if (response.ok) {
        const data = await response.json();
        // Extraer solo las URLs de las fotos como solicitaste
        const photoUrls = data.fotos.map(foto => foto.url);
        
        // Guardar en caché local para evitar peticiones duplicadas
        photosCache.current.set(serviceId, photoUrls);
        
        // También guardar en el estado global para sincronización
        dispatch({ 
          type: 'SET_SERVICE_PHOTOS', 
          payload: { serviceId, photos: photoUrls } 
        });
        
        return photoUrls;
      } else {
        console.warn(`No se pudieron cargar las fotos para el servicio ${serviceId}`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching photos for service ${serviceId}:`, error);
      return [];
    } finally {
      // Remover de las peticiones en progreso
      photosRequestsInProgress.current.delete(serviceId);
    }
  }, [dispatch]);

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getFilteredServices = () => {
    let filtered = state.services;

    // Filter by category
    if (state.currentCategory !== 'all') {
      const categoryMap = {
        'transportes': 'transporte',
        'hoteles': 'alojamiento',
        'restaurantes': 'restaurante',
        'experiencias': 'experiencias'
      };
      filtered = filtered.filter(service => 
        service.tipo_servicio === categoryMap[state.currentCategory]
      );
    }

    // Apply search filters
    if (state.searchFilters.query) {
      filtered = filtered.filter(service =>
        service.nombre.toLowerCase().includes(state.searchFilters.query.toLowerCase()) ||
        service.descripcion.toLowerCase().includes(state.searchFilters.query.toLowerCase())
      );
    }

    if (state.searchFilters.ciudad) {
      filtered = filtered.filter(service =>
        service.ciudad.toLowerCase().includes(state.searchFilters.ciudad.toLowerCase())
      );
    }

    if (state.searchFilters.tipo_servicio) {
      filtered = filtered.filter(service =>
        service.tipo_servicio === state.searchFilters.tipo_servicio
      );
    }

    return filtered;
  };

  const value = {
    ...state,
    dispatch,
    login,
    fetchServices,
    fetchServicePhotos,
    getCartTotal,
    getCartItemsCount,
    getFilteredServices,
    logout: () => dispatch({ type: 'LOGOUT' }),
    addToCart: (service) => dispatch({ type: 'ADD_TO_CART', payload: service }),
    removeFromCart: (serviceId) => dispatch({ type: 'REMOVE_FROM_CART', payload: serviceId }),
    updateCartQuantity: (id, quantity) => dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    setCategory: (category) => dispatch({ type: 'SET_CATEGORY', payload: category }),
    setSearchFilters: (filters) => dispatch({ type: 'SET_SEARCH_FILTERS', payload: filters }),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
