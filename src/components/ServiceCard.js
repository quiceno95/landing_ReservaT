import React, { useState } from 'react';
import { Eye, ShoppingCart, MapPin, Star, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ServiceModal from './ServiceModal';
import Swal from 'sweetalert2';

const ServiceCard = ({ service }) => {
  const { addToCart } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock images for demonstration (you would get these from the photos API)
  const mockImages = [
    'https://via.placeholder.com/400x300/263DBF/FFFFFF?text=Imagen+1',
    'https://via.placeholder.com/400x300/2E3C8C/FFFFFF?text=Imagen+2',
    'https://via.placeholder.com/400x300/264CBF/FFFFFF?text=Imagen+3',
    'https://via.placeholder.com/400x300/D9779B/FFFFFF?text=Imagen+4'
  ];

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
    setCurrentImageIndex((prev) => (prev + 1) % mockImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockImages.length) % mockImages.length);
  };

  const getServiceTypeIcon = (type) => {
    switch (type) {
      case 'alojamiento':
        return '🏨';
      case 'restaurante':
        return '🍽️';
      case 'Transporte':
        return '🚗';
      case 'Experiencia':
        return '🎯';
      default:
        return '📍';
    }
  };

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
    <>
      <div className="card overflow-hidden group">
        {/* Image Carousel */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={mockImages[currentImageIndex]}
            alt={service.nombre}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Image Navigation */}
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={prevImage}
              className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Image Indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {mockImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>

          {/* Service Type Badge */}
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getServiceTypeColor(service.tipo_servicio)}`}>
              <span className="mr-1">{getServiceTypeIcon(service.tipo_servicio)}</span>
              {service.tipo_servicio}
            </span>
          </div>

          {/* Relevance Badge */}
          {service.relevancia && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                {service.relevancia}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
              {service.nombre}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{service.ciudad}, {service.departamento}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {service.descripcion}
          </p>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-reservat-primary">
                  ${service.precio?.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {service.moneda}
                </span>
              </div>
              {service.fecha_creacion && (
                <div className="flex items-center text-xs text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>
                    {new Date(service.fecha_creacion).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 btn-secondary flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Ver más detalles</span>
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Agregar al carrito</span>
            </button>
          </div>
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        service={service}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default ServiceCard;
