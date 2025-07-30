import React, { useState } from 'react';
import { X, Eye, EyeOff, LogIn, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Swal from 'sweetalert2';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, loading } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#263DBF'
      });
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Has iniciado sesión correctamente',
        confirmButtonColor: '#263DBF',
        timer: 2000,
        showConfirmButton: false
      });
      onClose();
      setFormData({ email: '', password: '' });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: result.error,
        confirmButtonColor: '#263DBF'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-6 animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="input-field pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary group flex items-center justify-center space-x-2 transition-all duration-200 ${
              loading 
                ? 'opacity-75 cursor-not-allowed transform scale-[0.98]' 
                : 'hover:transform hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <div className="relative">
                  <Loader className="h-4 w-4 animate-spin" />
                  <div className="absolute inset-0 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span className="animate-pulse">Iniciando sesión...</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
