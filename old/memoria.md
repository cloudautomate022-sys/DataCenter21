# Memoria de Diseño y Evolución del Sistema: Data Center desde 0

## 1. Registro de Control de Cambios Iniciales
*   **Estructuración Base:** Creación del árbol de directorios del sitio web bajo la arquitectura estricta solicitada.
*   **UI/UX:** Implementación de variables CSS de diseño moderno con soporte nativo para Cambio de Modo (Light/Dark) y fuentes sans-serif de alta legibilidad.
*   **Interactividad:** Integración de actividades interactivas específicas por cada módulo para maximizar la asimilación conceptual.
*   **Validación:** Inclusión de módulos de Quiz autónomos de 3 preguntas de opción múltiple por pestaña para la validación de conocimientos.
*   **Modularidad de IA:** Configuración del módulo de orquestación de Chat asíncrono preparado para integrarse con Omniroute y Microsoft Foundry.

## 2. Parámetros de Conectividad de IA
*   **Omniroute Endpoint:** Establecido por defecto en `http://localhost:20128/v1/chat/completions`.
*   **Mecanismo de Escaneo:** Implementación de función JavaScript de sondeo dinámico de modelos (`/v1/models`) para conectarse de manera automatizada al primer descriptor disponible del pool.

## 3. Hoja de Ruta para Ampliaciones Futuras
*   **Métricas de Sustentabilidad:** Desarrollo de una futura solapa de cálculo avanzado de PUE (Power Usage Effectiveness) y WUE (Water Usage Effectiveness).
*   **Internacionalización (i18n):** Extensión dinámica del mapeo de diccionarios JSON locales para soportar el cambio inmediato y fluido de idiomas entre Inglés, Español e Italiano sin recargar la página.
