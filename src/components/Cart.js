import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Swal from 'sweetalert2';

const Cart = ({ isOpen, onClose }) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    getCartTotal, 
    isAuthenticated 
  } = useApp();

  const handleQuantityChange = (serviceId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(serviceId);
    } else {
      updateCartQuantity(serviceId, newQuantity);
    }
  };

  const handleRemoveItem = (serviceId, serviceName) => {
    Swal.fire({
      title: '¿Eliminar servicio?',
      text: `¿Estás seguro de que quieres eliminar "${serviceName}" del carrito?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(serviceId);
        Swal.fire({
          title: 'Eliminado',
          text: 'El servicio ha sido eliminado del carrito',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;

    Swal.fire({
      title: '¿Vaciar carrito?',
      text: '¿Estás seguro de que quieres eliminar todos los servicios del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          title: 'Carrito vaciado',
          text: 'Todos los servicios han sido eliminados',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Inicia sesión requerida',
        text: 'Debes iniciar sesión antes de realizar una compra',
        icon: 'info',
        confirmButtonColor: '#263DBF',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (cart.length === 0) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'Agrega algunos servicios antes de proceder con la compra',
        icon: 'warning',
        confirmButtonColor: '#263DBF'
      });
      return;
    }

    // Here you would integrate with the reservation API
    Swal.fire({
      title: 'Funcionalidad en desarrollo',
      text: 'La integración con la API de reservas está en desarrollo',
      icon: 'info',
      confirmButtonColor: '#263DBF'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end p-4 z-50 animate-fade-in">
      <div className="bg-white h-full max-h-screen w-full max-w-md rounded-l-xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-reservat-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Carrito ({cart.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm">
                Agrega algunos servicios para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id_servicio} className="card p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.nombre}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.ciudad}
                      </p>
                      <p className="text-lg font-bold text-reservat-primary">
                        ${item.precio?.toLocaleString()} {item.moneda}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id_servicio, item.nombre)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id_servicio, item.quantity - 1)}
                        className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id_servicio, item.quantity + 1)}
                        className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="font-bold text-gray-900">
                      ${(item.precio * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-reservat-primary">
                ${getCartTotal().toLocaleString()}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {!isAuthenticated && <LogIn className="h-4 w-4" />}
                <span>
                  {isAuthenticated ? 'Proceder al pago' : 'Inicia sesión para comprar'}
                </span>
              </button>
              
              <button
                onClick={handleClearCart}
                className="w-full btn-secondary"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
