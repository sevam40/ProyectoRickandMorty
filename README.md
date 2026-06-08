# 🌌 Rick and Morty API - Explorador de Episodios

## 🛠️ Instrucciones de Ejecución

Sigue estos pasos para instalar dependencias y levantar el entorno de desarrollo local.

1.  **Clona o descarga el repositorio** y abre una terminal dentro de la carpeta `RickAndMortyApp`.
2.  **Instala las dependencias principales:**
    ```bash
    npm install
    ```
3.  **Inicia el servidor de desarrollo local:**
    ```bash
    npm start
    ```
4.  **Abre tu navegador web** y visita la URL: `http://localhost:4200/`.

> **Nota de compilación:** Para asegurar compatibilidad del entorno experimental de Angular v22-nightly con Tailwind v4, los estilos se pre-compilaron directamente en `tailwind.css` usando el CLI oficial. Si decides modificar el HTML para agregar clases nuevas de Tailwind, solo debes abrir otra terminal y correr `npm run tailwind:watch` para sincronizarlas en vivo.

## 🧪 Cómo Probar la Aplicación (Testing)

El proyecto cuenta con un entorno de pruebas unitarias enfocado en la fiabilidad de la lógica de negocio y las peticiones a la API utilizando _mocks_.

Para correr la suite de tests unitarios (que por defecto abrirá una instancia de Chrome), ejecuta:

```bash
npm run test
```

## 📐 Decisiones Técnicas y Arquitectura

El diseño interno del proyecto se rigió por el principio de **Separación de Responsabilidades** (SoC), escalabilidad y bajo acoplamiento.

### 1. Estilos con Tailwind CSS v4
Se optó por el enfoque de *Utility-First CSS* por su incomparable velocidad de diseño y porque asegura que el archivo final de CSS pese lo menos posible en producción. Al usar la v4, simplificamos el stack eliminando el clásico archivo `tailwind.config.js`.

### 2. Buscador Reactivo Optimizado (RxJS)
Para el buscador de episodios, se uso una solución basada en programación reactiva que garantiza una experiencia 
fluida para el usuario y eficiencia para el servidor:
*   **`Escritura fluida`:**Se Utilizo debounceTime(300) para que la aplicación espere a que el usuario termine de escribir antes de realizar la búsqueda. Esto evita saturar la API con peticiones innecesarias tras cada tecla pulsada.
*   **`Búsqueda inteligente`:** Se implemeto distinctUntilChanged() para asegurar que, si el usuario escribe y borra rápidamente volviendo al mismo texto, el sistema no realice búsquedas repetidas e innecesarias.
*   **`Código limpio y seguro`:** Se empleo takeUntilDestroyed para gestionar automáticamente la limpieza de recursos. Esto elimina la necesidad de código repetitivo para cerrar suscripciones y previene errores de memoria, manteniendo la aplicación estable durante toda la sesión del usuario..

### 3. ModalService Desacoplado
Para la "Vista de Detalles", no se integró la lógica HTML condicional pesada dentro de las tarjetas individuales. En su lugar:
*   Se construyó un `ModalService` con patrón observador (`BehaviorSubject`).
*   Se desarrolló el `EpisodeModalComponent` como un ente independiente inyectado directamente a nivel de página (fuera del bucle de tarjetas).
*   **El Beneficio:** Mantenemos la estructura DOM ultra limpia y las responsabilidades separadas. Al hacer clic en un episodio, la tarjeta simplemente le "avisa" al servicio, y el modal reacciona automáticamente a este cambio global para mostrar la información enriquecida.
