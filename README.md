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

> **Nota para la revisión:** Para facilitar la evaluación de esta prueba, las decisiones técnicas clave han sido documentadas referenciando los requisitos específicos del desafío original. Esto asegura que cada implementación responda directamente a una necesidad del negocio.

El diseño interno del proyecto se rigió estrictamente por los principios de **Separación de Responsabilidades (SoC)**, **escalabilidad** y **bajo acoplamiento**.

---

### 1. Estilos con Tailwind CSS v4
Se optó por el enfoque **Utility-First CSS** debido a su alta velocidad de diseño y desarrollo. Al incorporar la nueva **versión 4 (v4)** de Tailwind, optimizamos significativamente el ecosistema del proyecto:
* **Stack simplificado:** Se eliminó la necesidad del clásico archivo `tailwind.config.js`, centralizando la configuración de manera más nativa.
* **Rendimiento en producción:** Mayor optimización y reducción drástica en el peso final del archivo CSS compilado.

### 2. Buscador Reactivo Optimizado (RxJS)
Para el buscador de episodios, se implementó una arquitectura basada en **programación reactiva**, cumpliendo con el requisito de ofrecer filtros dinámicos y optimizar el consumo de recursos de la API mediante los siguientes operadores:

* **Escritura fluida (`debounceTime(300)`):** Garantiza que la aplicación espere a que el usuario termine de escribir antes de realizar la petición HTTP, evitando saturar el servidor con solicitudes innecesarias por cada pulsación de tecla.
* **Búsqueda inteligente (`distinctUntilChanged()`):** Previene llamadas duplicadas o redundantes a la API en caso de que el término de búsqueda no haya cambiado realmente.
* **Código limpio y seguro (`takeUntilDestroyed`):** Gestiona de manera automática la destrucción y limpieza de las suscripciones al destruirse el componente, previniendo fugas de memoria (*memory leaks*) y garantizando la estabilidad de la app.

### 3. ModalService Desacoplado
Para la "Vista de Detalles", se cubrió el requerimiento de desplegar un modal interactivo con información enriquecida mediante un diseño completamente modular:

* **Patrón Observador:** Se construyó un `ModalService` utilizando `BehaviorSubject` para manejar el estado del modal de forma centralizada y reactiva.
* **Inyección Independiente:** El `EpisodeModalComponent` fue desarrollado como un ente autónomo, inyectado directamente a nivel de página en lugar de estar acoplado al árbol principal.
* **El Beneficio:** Mantenemos la estructura del DOM ultra limpia, aislamos las responsabilidades de la UI y aseguramos un código altamente legible, testeable y fácil de mantener.