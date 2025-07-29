# ReservaT - Landing Page

Una plataforma moderna y responsive para servicios turísticos construida con React, que permite a los usuarios descubrir y reservar hoteles, restaurantes, transporte y experiencias únicas.

## 🚀 Características

### ✅ Funcionalidades Implementadas

- **Diseño Responsive**: Adaptado para móvil, tablet y desktop
- **Autenticación JWT**: Login seguro con cookies y manejo de sesiones
- **Carrito de Compras Global**: Agregar, remover y modificar cantidades
- **Búsqueda Avanzada**: Filtros por ciudad, tipo de servicio y relevancia
- **Mapa Interactivo**: Visualización de servicios por ubicación
- **Categorías de Servicios**: Transportes, Hoteles, Restaurantes, Experiencias
- **Modales Detallados**: Información completa de cada servicio
- **Estados de Carga**: Indicadores visuales y manejo de errores

### 🎨 Diseño y UX

- **Tipografía**: Inter como fuente principal
- **Paleta de Colores**: Colores corporativos de ReservaT
- **Iconografía**: Lucide React para consistencia visual
- **Animaciones**: Transiciones suaves y micro-interacciones
- **Accesibilidad**: Contrastes apropiados y navegación por teclado

## 🛠️ Tecnologías Utilizadas

- **React 18**: Framework principal
- **TailwindCSS**: Estilos y diseño responsive
- **Lucide React**: Iconografía
- **React Leaflet**: Mapas interactivos
- **SweetAlert2**: Notificaciones elegantes
- **js-cookie**: Manejo de cookies
- **jwt-decode**: Decodificación de tokens JWT

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd landing_ReservaT
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🔧 Configuración

### Variables de Entorno

El proyecto está configurado para conectarse a las APIs de ReservaT:

- **API de Autenticación**: `https://back-services.api-reservat.com/api/v1/usuarios/login`
- **API de Servicios**: `https://back-services.api-reservat.com/api/v1/servicios/listar/`
- **API de Usuario**: `https://back-services.api-reservat.com/api/v1/mayorista/consultar/{id}`

### Credenciales de Prueba

Para probar la funcionalidad de login:
- **Email**: `quiceno_hotel@email.com`
- **Contraseña**: `12345678`

## 📱 Estructura del Proyecto

```
src/
├── components/
│   ├── Header.js              # Navegación principal
│   ├── SearchBanner.js        # Banner con búsqueda y mapa
│   ├── ServicesList.js        # Lista de servicios
│   ├── ServiceCard.js         # Tarjeta individual de servicio
│   ├── ServiceModal.js        # Modal con detalles del servicio
│   ├── ServiceMap.js          # Mapa interactivo
│   ├── LoginModal.js          # Modal de autenticación
│   └── Cart.js                # Carrito de compras
├── context/
│   └── AppContext.js          # Estado global de la aplicación
├── App.js                     # Componente principal
├── index.js                   # Punto de entrada
└── index.css                  # Estilos globales
```

## 🎯 Funcionalidades Principales

### 1. Autenticación
- Login con JWT y cookies seguras
- Manejo de expiración de tokens
- Información del usuario logueado
- Estados de error personalizados

### 2. Carrito de Compras
- Agregar/remover servicios
- Modificar cantidades
- Cálculo automático de totales
- Persistencia durante la sesión
- Redirección a login antes de comprar

### 3. Búsqueda y Filtros
- Búsqueda por texto libre
- Filtros por ciudad
- Filtros por tipo de servicio
- Filtros por relevancia
- Resultados en tiempo real

### 4. Visualización de Servicios
- Tarjetas con imágenes (carousel)
- Información esencial visible
- Modal con detalles completos
- Categorización automática
- Estados de carga y error

### 5. Mapa Interactivo
- Marcadores por ciudad
- Agrupación de servicios
- Popups informativos
- Integración con filtros

## 🎨 Guía de Estilos

### Colores Principales
- **Primario**: `#263DBF` (Azul corporativo)
- **Secundario**: `#2E3C8C` (Azul oscuro)
- **Terciario**: `#264CBF` (Azul medio)
- **Complementario 1**: `#D9779B` (Rosa)
- **Complementario 2**: `#F2785C` (Naranja)

### Tipografía
- **Fuente**: Inter (Google Fonts)
- **Títulos**: `text-3xl font-bold`
- **Subtítulos**: `text-lg font-medium`
- **Texto normal**: `text-sm font-medium`

### Componentes Reutilizables
- **Botón Primario**: `.btn-primary`
- **Botón Secundario**: `.btn-secondary`
- **Campo de Entrada**: `.input-field`
- **Tarjeta**: `.card`

## 🚀 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm build`: Construye la aplicación para producción
- `npm test`: Ejecuta las pruebas
- `npm eject`: Expone la configuración de webpack

## 📋 Próximas Mejoras

- [ ] Integración completa con API de fotos
- [ ] Sistema de reservas funcional
- [ ] Filtros avanzados adicionales
- [ ] Modo offline básico
- [ ] Optimización de rendimiento
- [ ] Tests automatizados
- [ ] PWA capabilities

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 📞 Contacto

ReservaT Team - info@reservat.com

Enlace del Proyecto: [https://github.com/tu-usuario/landing_ReservaT](https://github.com/tu-usuario/landing_ReservaT)
