# Memoria de Diseño y Evolución del Sistema - Data Center desde 0

Este archivo registra los criterios técnicos de desarrollo, la arquitectura del software y las directrices necesarias para futuras ampliaciones y mantenimiento del portal educativo.

## 1. Información General del Despliegue
*   **Ruta Base Obligatoria del Proyecto:** `C:	emp\Datacenter21\`
*   **Nombre Oficial de la Plataforma:** Data center desde 0
*   **Destino de Control de Código:** Repositorio público/privado en GitHub.

## 2. Decisiones Arquitectónicas del Sistema
*   **Interfaz SPA (Single Page Application):** Para asegurar una experiencia de aprendizaje fluida y evitar tiempos de recarga molestos, toda la navegación se gestiona mediante una única estructura HTML estructurada en pestañas lógicas controladas por eventos de visualización en JavaScript.
*   **Diseño Responsivo y Estilos (Modo Oscuro Nativo):** Se configuraron variables de estilos CSS en la raíz (`:root`) para alternar esquemas cromáticos de alto contraste y legibilidad tipográfica. El Modo Oscuro está integrado como la vista predeterminada para reflejar la estética tecnológica de las consolas de operaciones de infraestructura crítica.
*   **Estructuración de Multi-Atributos:** Se prohibió el uso de listas redundantes para comparar especificaciones de ingeniería. Toda la información técnica comparativa (como la comparativa VRLA vs Litio o CRAC vs CRAH) se ha estructurado directamente en tablas Markdown para garantizar un escaneo ágil de la información.
*   **Sistema Integrado de Cuestionarios (Quizzes):** Cada uno de los 10 módulos de aprendizaje cuenta con un motor dinámico local que procesa 3 preguntas de opción múltiple, ofreciendo validación gráfica instantánea del aprendizaje al usuario.

## 3. Especificaciones del Módulo de Inteligencia Artificial
La solapa de **Configuración** permite enlazar la base del portal a modelos de inferencia local o en la nube para responder dudas personalizadas de los estudiantes.

*   **Endpoint de Conexión Predeterminado (OmniRoute):** `http://localhost:20128/v1/chat/completions`
*   **Mapeo de Modelos (Scan Models):** Implementación de una función asíncrona (Fetch) hacia la dirección `http://localhost:20128/v1/models`. El script está diseñado para evaluar la lista de respuestas JSON del proveedor, seleccionar automáticamente el primer identificador de modelo disponible e inyectarlo dinámicamente como la variable de control para todas las consultas que haga el estudiante en los chats de los módulos de aprendizaje.
*   **Restricción de Chat:** La funcionalidad de chat con el modelo de lenguaje estará deshabilitada de forma explícita únicamente dentro de la pestaña de Configuración.

## 4. Historial de Cambios y Registro de Control
*   **v1.0.0 (Octubre 2026):**
    *   Diseño y maquetación base del esqueleto del portal educativo en español, inglés e italiano.
    *   Estructuración de la base de conocimientos utilizando los datos de los 10 videos instructivos de la serie técnica de infraestructura.
    *   Inclusión de enlaces de YouTube directos para cada solapa de componentes, cumpliendo con los lineamientos de verificación e integridad de fuentes de información.
    *   Creación de la lógica para la matriz interactiva de selección de sistemas de enfriamiento para cargas críticas de Inteligencia Artificial (IA).
    *   Redacción formal de los requerimientos funcionales y de conectividad de red de soporte en el documento informativo central.

## 5. Validación del Cumplimiento de Requerimientos (Base Check)
*   **Conectividad de Red Inferencia:** Se ha verificado en el código del controlador (`app.js`) que las llamadas de Chat hagan uso de la URL base en el puerto `:20128` y que el cliente HTTP implemente correctamente el bucle asíncrono para enlazar el chat al elemento `data.models.id` tras invocar el escaneo en la interfaz de configuración.
*   **Exclusión de Canales de Inferencia:** Se validó arquitectónicamente que la pestaña de Configuración carezca de cajas de texto de chat hacia el usuario final, actuando únicamente como un panel de configuración técnica y seteo de idioma/vista.
*   **Estructura Semántica de Contenidos:** Se auditaron todas las explicaciones de la serie de videos técnicos, garantizando la reducción de texto plano mediante tablas comparativas semánticas y la eliminación de hipervínculos externos en el cuerpo informativo del portal web final.
