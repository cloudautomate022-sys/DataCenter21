# Data Center desde 0

Plataforma educativa interactiva sobre infraestructura de centros de datos. Es una **Single Page Application** construida únicamente con HTML5 semántico, CSS3 y JavaScript nativo: no tiene build, dependencias ni backend.

## Módulos

1. How Data Centers Actually Work
2. Power Flow
3. Cooling Methods
4. Redundancy: N, N+1 and 2N
5. Electrical Systems
6. UPS Deep Dive
7. Hot vs Cold Aisle Containment
8. Chilled Water Systems
9. CRAC vs CRAH Units
10. Air Cooled vs Water Cooled

Cada módulo incluye resumen ejecutivo, tablas de ingeniería, video base, un laboratorio interactivo, un knowledge check de 3 preguntas y un asistente IA contextual.

La solapa **AI Configuration** permite configurar el motor de inferencia, escanear modelos y probar la conexión con un botón dedicado. No contiene chat de estudiante, por diseño. El estado de la IA (conectada, verificando u offline) se muestra en la barra superior de todas las páginas.

## Ejecución local

El proyecto está pensado para abrirse desde `C:\temp\Datacenter21`.

Opción rápida:

```powershell
# Desde C:\temp\Datacenter21
python -m http.server 8080
# Abrir http://localhost:8080
```

También se puede abrir `index.html` directamente en el navegador. Sin embargo, para usar el escaneo de modelos y el chat conviene servirlo por HTTP y habilitar CORS en el servidor de inferencia, porque los navegadores bloquean peticiones `fetch` desde el origen `file://`.

Alternativa con Node.js:

```powershell
npx serve .
```

## Configuración de IA

Valores predeterminados requeridos:

| Parámetro | Valor |
| :--- | :--- |
| Endpoint de chat | `http://localhost:20128/v1/chat/completions` |
| Catálogo de modelos | `http://localhost:20128/v1/models` |
| Persistencia | `localStorage` del navegador |

Flujo:

1. Abrir la solapa **AI Configuration**.
2. Elegir proveedor: **OmniRoute**, **Microsoft Foundry** o un endpoint compatible con OpenAI.
3. Verificar el endpoint y, si aplica, la API key.
4. Pulsar **Scan models**. El sistema consulta `/v1/models`, parsea la respuesta JSON y selecciona automáticamente el primer modelo disponible.
5. Pulsar **Test connection**. El sistema envía una petición mínima al endpoint y confirma si el modelo responde.
6. Guardar la configuración.

Todos los chats de los módulos usan el modelo activo. La solapa de configuración no muestra ninguna caja de chat. Si ya hay un modelo guardado, al cargar el portal se comprueba la conexión automáticamente y la píldora superior pasa de **verificando** a **conectada** u **offline**.

### CORS

Si el navegador muestra un error de conexión, el servidor LLM debe permitir peticiones desde el origen del portal (`http://localhost:8080`, `http://127.0.0.1:8123`, etc.). Para OmniRoute, habilita CORS para el origen local que uses.

## Interfaz

- **Tres idiomas:** inglés, español e italiano, con cambio instantáneo sin recargar.
- **Modo oscuro nativo:** activo por defecto; el interruptor alterna a modo claro.
- **Diseño responsive:** barra lateral en escritorio y navegación horizontal en móvil.
- **Progreso local:** los módulos se marcan como completados al responder correctamente las 3 preguntas del quiz. El avance se guarda en `localStorage`.
- **Estado IA global:** una píldora en la barra superior muestra si el modelo está conectado, verificando u offline en todas las páginas; al pulsarla se abre la configuración.

## Estructura

```text
C:\temp\Datacenter21\
├── index.html
├── assets\
│   ├── css\styles.css
│   ├── favicon.svg
│   └── js\
│       ├── i18n.js          # Diccionario de interfaz EN/ES/IT
│       ├── content.en.js    # Contenido técnico en inglés
│       ├── content.es.js    # Contenido técnico en español
│       ├── content.it.js    # Contenido técnico en italiano
│       ├── activities.js    # 10 laboratorios interactivos
│       └── app.js           # SPA, quizzes, i18n, config y chat
├── datacenter21.md
├── memoria.md
└── README.md
```

## Publicación en GitHub Pages

1. Crear un repositorio y subir el contenido de esta carpeta.
2. En GitHub, abrir **Settings → Pages**.
3. Seleccionar la rama principal y la carpeta raíz.
4. Guardar. La aplicación no requiere compilación.

Las llamadas a `localhost:20128` funcionarán en el navegador que tenga acceso al endpoint local. Si el portal se publica en la nube y el LLM queda en la máquina del usuario, ese endpoint local no será accesible desde el servidor público; usa un endpoint remoto o un túnel seguro.

## Verificación técnica

- Sin frameworks ni dependencias de servidor.
- Interfaz renderizada dinámicamente sobre una sola página.
- Sincronización de idioma y tema en caliente.
- Escaneo asíncrono de `/v1/models` y autoselección del primer modelo.
- Prueba de conexión real contra el endpoint de chat y estado IA visible en todas las páginas.
- Chat contextual por módulo con memoria de sesión.
- Quizzes autocorregibles y progreso persistente.
