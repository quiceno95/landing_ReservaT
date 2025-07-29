import React, { useEffect } from 'react';
import { Loader, AlertCircle, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ServiceCard from './ServiceCard';

const ServicesList = () => {
  const { 
    services, 
    loading, 
    error, 
    currentCategory, 
    fetchServices, 
    getFilteredServices 
  } = useApp();

  useEffect(() => {
    if (services.length === 0) {
      fetchServices();
    }
  }, [services.length, fetchServices]);

  const filteredServices = getFilteredServices();

  const getCategoryTitle = (category) => {
    const titles = {
      'all': 'Todos los servicios',
      'transportes': 'Servicios de Transporte',
      'hoteles': 'Hoteles y Alojamientos',
      'restaurantes': 'Restaurantes',
      'experiencias': 'Experiencias y Tours'
    };
    return titles[category] || 'Servicios';
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      'all': 'Descubre todos nuestros servicios turísticos disponibles',
      'transportes': 'Encuentra las mejores opciones de transporte para tu viaje',
      'hoteles': 'Alójate en los mejores hoteles y hospedajes',
      'restaurantes': 'Disfruta de la mejor gastronomía local',
      'experiencias': 'Vive experiencias únicas e inolvidables'
    };
    return descriptions[category] || 'Servicios disponibles';
  };

  if (loading && services.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader className="h-12 w-12 text-reservat-primary animate-spin mb-4" />
          <p className="text-lg text-gray-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-lg text-gray-900 mb-2">Error al cargar servicios</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchServices}
            className="btn-primary"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {getCategoryTitle(currentCategory)}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getCategoryDescription(currentCategory)}
        </p>
        
        {/* Results Count */}
        <div className="mt-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-reservat-primary bg-opacity-10 text-reservat-primary font-medium">
            <Package className="w-4 h-4 mr-2" />
            {filteredServices.length} servicio{filteredServices.length !== 1 ? 's' : ''} encontrado{filteredServices.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No se encontraron servicios
          </h3>
          <p className="text-gray-600 mb-6">
            {currentCategory === 'all' 
              ? 'No hay servicios disponibles en este momento'
              : `No hay servicios de ${getCategoryTitle(currentCategory).toLowerCase()} disponibles`
            }
          </p>
          {currentCategory !== 'all' && (
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Ver todos los servicios
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id_servicio} service={service} />
          ))}
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && services.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader className="h-5 w-5 animate-spin" />
            <span>Cargando más servicios...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
