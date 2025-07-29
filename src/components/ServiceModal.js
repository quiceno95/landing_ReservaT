import React, { useState } from 'react';
import { X, MapPin, Calendar, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Swal from 'sweetalert2';

const ServiceModal = ({ service, images = [], isOpen, onClose }) => {
  const { addToCart } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Usar las imágenes reales o una imagen por defecto
  const modalImages = images.length > 0 ? images : [
    'https://via.placeholder.com/600x400/263DBF/FFFFFF?text=Sin+Imagen'
  ];

  if (!isOpen || !service) return null;

  const handleAddToCart = () => {
    addToCart(service);
    Swal.fire({
      title: '¡Agregado al carrito!',
      text: `${service.nombre} ha sido agregado a tu carrito`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % modalImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
  };

  const parseServiceDetails = (detailsString) => {
    try {
      return JSON.parse(detailsString || '{}');
    } catch {
      return {};
    }
  };

  const serviceDetails = parseServiceDetails(service.detalles_del_servicio);

  const getServiceTypeColor = (type) => {
    switch (type) {
      case 'alojamiento':
        return 'bg-reservat-primary';
      case 'restaurante':
        return 'bg-reservat-orange';
      case 'Transporte':
        return 'bg-reservat-pink';
      case 'Experiencia':
        return 'bg-success';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.nombre}</h2>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getServiceTypeColor(service.tipo_servicio)}`}>
                {service.tipo_servicio}
              </span>
              {service.relevancia && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <Star className="w-4 h-4 mr-1" />
                  {service.relevancia}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Image Gallery */}
          <div className="mb-6">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-4">
              <img
                src={modalImages[currentImageIndex]}
                alt={service.nombre}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {modalImages.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {modalImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'border-reservat-primary' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">{service.descripcion}</p>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Ubicación</h3>
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin className="w-5 h-5 mt-0.5 text-reservat-primary" />
                  <div>
                    <p className="font-medium">{service.ciudad}, {service.departamento}</p>
                    {service.ubicacion && (
                      <p className="text-sm text-gray-500">{service.ubicacion}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Details */}
              {Object.keys(serviceDetails).length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Detalles del servicio</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(serviceDetails).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="card p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-reservat-primary mb-1">
                    ${service.precio?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">{service.moneda}</div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Agregar al carrito</span>
                </button>
              </div>

              {/* Service Info */}
              <div className="card p-6">
                <h4 className="font-bold text-gray-900 mb-4">Información del servicio</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Proveedor ID:</span>
                    <span className="font-medium text-gray-900 truncate ml-2">
                      {service.proveedor_id?.slice(0, 8)}...
                    </span>
                  </div>
                  
                  {service.fecha_creacion && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fecha de creación:</span>
                      <div className="flex items-center text-gray-900">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(service.fecha_creacion).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
