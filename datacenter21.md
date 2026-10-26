# Data Center desde 0 - Especificación Técnica Completa

Este documento constituye la base de conocimiento oficial y la guía de arquitectura de contenidos para la plataforma educativa interactiva "Data center desde 0".

---

## 1. Solapa 1: How Data Centers Actually Work
*   **Referencia de Video:** [Ver video base en YouTube](https://www.youtube.com/watch?v=cTwvUqLNQrM)

### Resumen Conceptual
Un centro de datos es, desde la perspectiva de la ingeniería, un **edificio de conversión energética**. Su propósito fundamental es almacenar, procesar y distribuir información digital. A diferencia de las computadoras de oficina intermitentes, los servidores operan de forma continua las 24 horas del día. Toda la energía eléctrica que entra a la instalación se transforma finalmente en calor térmico masivo, el cual debe ser removido de inmediato y sin interrupciones (24/7/365) para evitar el colapso del hardware.

### Matriz de Diferencias Operacionales

| Atributo Técnico | Edificio de Oficinas Comercial | Centro de Datos (Data Center) |
| :--- | :--- | :--- |
| **Comportamiento de Carga** | Variable e intermitente. Baja por las noches y fines de semana. | Completamente constante, masiva y al 100% de demanda continua. |
| **Objetivo del Enfriamiento** | Confort humano y habitabilidad térmica (22°C - 24°C). | Supervivencia crítica y estabilidad del hardware IT. |
| **Tolerancia a Cortes** | Alta. Un corte genera molestias, pero no pérdida crítica inmediata. | Nula. Un corte de milisegundos provoca caídas globales y corrupción. |
| **Infraestructura Base** | Sistemas mecánicos y eléctricos estándar comerciales. | Capas redundantes pesadas (Generadores, UPS, Chillers N+1 o 2N). |

*   **Actividad Interactiva:** Infografía interactiva "Inside the Box" que revela las capas del centro de datos (Mecánica, Eléctrica y Control) al pasar el cursor.
*   **Knowledge Check (Quiz):**
    1. ¿Cuál es la función principal de un data center en ingeniería? (*Conversión energética y procesamiento*).
    2. ¿Qué ocurre si el enfriamiento se detiene por completo? (*El hardware sufre choque térmico y se apaga por protección*).
    3. ¿Cuáles son los tres pilares de la infraestructura física? (*Sistemas eléctricos, mecánicos de enfriamiento y monitoreo/control*).

---

## 2. Solapa 2: Power Flow
*   **Referencia de Video:** [Ver video base en YouTube](https://www.youtube.com/watch?v=Y_8P3wzxsqY)

### Resumen Conceptual
El flujo de energía (*Power Flow*) es el mapa vial eléctrico del centro de datos. Garantiza la transformación controlada del voltaje desde la red de alta tensión pública hasta los componentes electrónicos de los servidores, asegurando una continuidad absoluta a prueba de fallos.

### Workflow del Flujo Eléctrico
```text
[ INFRAESTRUCTURA DE ALTA Y MEDIA TENSIÓN - FILA SUPERIOR ]
Utility Grid ──> Transmission Lines ──> Entrance Switchgear ──> Step-Down Transformer
                                                                          │
  ┌───────────────────────────────────────────────────────────────────────┘
  │
[ INFRAESTRUCTURA DE RESPALDO Y DISTRIBUCIÓN - FILA INFERIOR ]
└─> Generator (Parallel Gear/ATS) ──> UPS Systems ──> UPS SB ──> PDU ──> RPP ──> rPDU ──> Servers
```

### Componentes de la Arquitectura Eléctrica

| Componente | Función Principal e Impacto Operativo |
| :--- | :--- |
| **Utility** | Red de suministro de la compañía eléctrica (Generación Nuclear, Gas, Hidro, Solar). |
| **Transmission** | Transporte a alta tensión y baja corriente para mitigar las pérdidas por resistencia física. |
| **Switchgear** | Punto de entrada. Provee protección contra sobrecorriente, medición y aislamiento de red. |
| **Transformer** | Reduce el voltaje medio exterior (12kV - 34.5kV) a voltaje interno del edificio (480V). |
| **Generator** | Motores diésel de respaldo que asumen la carga total en fallas de red prolongadas. |
| **UPS** | Sistema de energía ininterrumpida por baterías. Filtra fluctuaciones y cubre la transición. |
| **UPS SB** | Tablero de conmutación de salida (Switchboard) que distribuye los ramales protegidos. |
| **PDU** | Unidad de Distribución de Potencia. Transforma el voltaje de 480V a niveles IT (208V o 415V). |
| **RPP** | Paneles Remotos de Potencia. Extienden circuitos con breakers adicionales en la sala blanca. |
| **rPDU** | Regletas inteligentes en los racks que energizan los servidores y miden consumos por toma. |

*   **Actividad Interactiva:** Animación digital de transferencia eléctrica. Permite simular un corte en "Utility" y observar el flujo inmediato de baterías (UPS) mientras el generador realiza su rampa de arranque de 60 segundos.
*   **Knowledge Check (Quiz):**
    1. ¿Por qué se transmite la electricidad a alta tensión a largas distancias? (*Para reducir la corriente y minimizar pérdidas en la línea*).
    2. ¿Cuál es el rol del ATS o Paralleling Switchgear? (*Detectar fallas de red, arrancar/sincronizar generadores y transferir la carga*).
    3. ¿Qué dispositivo energiza directamente a cada servidor individual? (*La rPDU o Rack Power Distribution Unit*).

---

## 3. Solapa 3: Cooling Methods
*   **Referencia de Video:** [Ver video base en YouTube](https://www.youtube.com/watch?v=iRLCUWbi0o4)

### Resumen Conceptual
A medida que aumenta la densidad de potencia en los racks debido al hardware moderno, los métodos de enfriamiento deben evolucionar desde el enfriamiento general de salas hacia soluciones líquidas dirigidas a la fuente de calor.

### Desglose de Tecnologías de Enfriamiento
*   **Room-based air cooling:** Tradicional. Las unidades CRAC/CRAH impulsan aire frío debajo de un piso técnico elevado hacia pasillos abiertos. Recomendado solo para bajas densidades (3-5 kW por rack).
*   **Close-coupled air cooling:** Trae el frío cerca de la fuente de calor mediante manejadoras *In-Row* intercaladas entre racks o puertas traseras con intercambiadores de líquido (*Rear-Door Heat Exchangers*). Soporta entre 10-20 kW por rack.
*   **Direct-to-chip liquid cooling:** Placas frías con refrigerante líquido se montan directamente sobre CPUs/GPUs en circuito cerrado. Ideal para densidades extremas de Inteligencia Artificial (50-100+ kW por rack).
*   **Immersion cooling:** Los servidores se sumergen completamente en tanques con fluido dieléctrico no conductor (monofásico o bifásico). Elimina el uso de aire.
*   **Capacidad Térmica:** La transición del aire al líquido está motivada por principios termodinámicos: el agua y los fluidos dieléctricos tienen una capacidad calorífica drásticamente superior al aire, transportando el calor de forma mucho más eficiente.

### Disposición Arquitectónica y Recomendación para IA
*   **Pasillos Calientes y Fríos:** Los servidores se organizan de forma que sus frontales se miren entre si (Pasillo Frío, entrada de aire) y sus partes traseras expulsen el calor hacia corredores cerrados (Pasillo Caliente), evitando la mezcla de aire.
*   **Recomendación IA:** Para clústeres de GPU/IA de alta densidad, la tecnología dominante y recomendada es **Direct-to-Chip Liquid Cooling**, permitiendo trabajar a temperaturas de agua más elevadas y prescindir de compresores gran parte del año.
*   **Proveedores de Referencia:** Schneider Electric, Vertiv, Stulz, Munters, Rittal, ZutaCore, LiquidStack.

*   **Actividad Interactiva:** Matriz de Conveniencia Inteligente en JavaScript. El usuario introduce datos como cantidad de racks, kW por rack y zona climática, y el script devuelve la recomendación de enfriamiento óptima.
*   **Knowledge Check (Quiz):**
    1. ¿Qué impulsa la transición de enfriamiento por aire hacia líquido? (*El incremento radical de la densidad de calor por rack*).
    2. ¿Cuál es el método preferido para centros de datos enfocados en IA? (*Direct-to-chip liquid cooling*).
    3. ¿Cuál es el principio del confinamiento de pasillos? (*Separar físicamente los flujos de aire frío y caliente para mejorar la eficiencia*).

---

## 4. Solapa 4: Redundancy Explained: N, N+1, and 2N Systems
*   **Referencia de Video:** [Ver video base en YouTube](https://www.youtube.com/watch?v=FWpWU9tiKs4)

### Resumen Conceptual
La redundancia define la capacidad de reserva del centro de datos para soportar fallos o mantenimientos sin interrumpir los servidores. "N" es el número mínimo de componentes requeridos para operar bajo carga completa de diseño.

### Configuraciones de Redundancia en Infraestructura

| Esquema | Descripción General | Tolerancia a Fallos | CapEx | Nivel Tier / Aplicación Típica |
| :--- | :--- | :--- | :--- | :--- |
| **N** | Capacidad básica exacta sin unidades de respaldo. | Nula. Cualquier avería interrumpe el servicio. | Mínimo | Tier I - Entornos corporativos no críticos. |
| **N+1** | Añade un componente adicional de respaldo al sistema. | Soporta la pérdida de una única unidad operativa. | Moderado | Tier II / Tier III - Centros Enterprise comunes. |
| **N+2** | Dispone de dos componentes adicionales de reserva. | Soporta dos fallos simultáneos o sucesivos. | Medio-Alto | Instalaciones de alta disponibilidad. |
| **2N** | Dos sistemas completos independientes al 100% de capacidad. | Soporta la pérdida total de una ruta de distribución. | Alto | Tier IV - Entornos financieros y misión crítica. |
| **2(N+1)** | Dos ramas independientes (2N), con un equipo +1 en cada rama. | Resiliencia total incluso durante periodos de mantenimiento. | Muy Alto | Centros de datos de Hiperescala / Cloud Crítico. |
| **3N/2** | Tres sistemas de respaldo que protegen cruzadamente a dos cargas. | Alta eficiencia de carga con resiliencia optimizada. | Optimizado | Proveedores de Colocación (Colocation Centers). |

### Clasificación por Tiers (Uptime Institute)
*   **Tier I (Infraestructura Básica):** Ruta única no redundante. 99.671% de disponibilidad.
*   **Tier II (Componentes Redundantes):** Ruta única con equipos de capacidad N+1. 99.749% de disponibilidad.
*   **Tier III (Mantenible Concurrentemente):** Múltiples rutas de distribución (una activa, una pasiva). Permite retirar cualquier componente para mantenimiento sin apagar los servidores. 99.982% de disponibilidad.
*   **Tier IV (Tolerante a Fallos):** Topología 2N con rutas activas simultáneas. Un fallo imprevisto en cualquier punto no afecta a la carga IT. 99.995% de disponibilidad.

*   **Actividad Interactiva:** Simulador visual de Tiers. El usuario selecciona un esquema (N, N+1, 2N) y genera un fallo en un componente (ej. bomba o UPS) para verificar si el sistema sobrevive o cae en *downtime*.
*   **Knowledge Check (Quiz):**
    1. ¿Qué significa la letra "N"? (*La capacidad mínima de diseño requerida para soportar la carga real*).
    2. ¿Qué define la certificación Tier III? (*La capacidad de realizar mantenimiento concurrente sin interrumpir el cómputo*).
    3. Si una sala necesita 4 módulos UPS y se instalan 5 en paralelo, ¿cuál es el esquema? (*N+1*).

---

## 5. Solapa 5: Electrical Systems
*   **Referencia de Video:** [Ver video base en YouTube](https://www.youtube.com/watch?v=x7dxWbNoq8s)

### Resumen Conceptual
Los sistemas eléctricos de misión crítica protegen los microprocesadores informáticos contra interrupciones y fluctuaciones de la red comercial externa mediante capas de protección física.

### Conceptos Clave de Continuidad
*   **¿Qué es un sistema UPS?:** Un Sistema de Alimentación Ininterrumpida que actúa como un amortiguador térmico/eléctrico dinámico entre la red externa y los servidores.
*   **Por qué no puede perderse energía:** Un corte de milisegundos apaga instantáneamente los servidores, corrompe bases de datos y desconecta servicios globales, generando pérdidas millonarias.
*   **UPS de Doble Conversión (Double Conversion):** Es la topología estándar de los grandes centros de datos. Opera purificando la energía de forma continua:
    1. El **Rectificador** toma la corriente alterna (AC) inestable de la red y la convierte en corriente continua (DC), alimentando las baterías.
    2. El **Inversor** toma esa corriente continua (DC) limpia de las baterías/rectificador y la transforma nuevamente en corriente alterna (AC) perfecta, libre de ruidos y variaciones para los servidores.

*   **Actividad Interactiva:** Panel interactivo del circuito eléctrico de Doble Conversión, permitiendo abrir y cerrar interruptores de bypass estático para comprender la ruta de la corriente.
*   **Knowledge Check (Quiz):**
    1. ¿Cuáles son los 3 bloques internos principales de un UPS? (*Rectificador, Baterías e Inversor*).
    2. ¿Cuál es el beneficio secundario del UPS además del respaldo? (*Acondicionar y estabilizar la calidad de la energía*).
    3. ¿Qué combustible alimenta al sistema de respaldo de largo plazo? (*Diésel para los generadores*).

---

## 6. Solapa 6: UPS Deep Dive
*   **Referencia de Video:** [Ver video base en YouTube](https://www.youtube.com/watch?v=uz6unYab6G0)

### Resumen Conceptual
Análisis técnico en profundidad del comportamiento electrónico del UPS durante eventos críticos de conmutación y la evolución química del almacenamiento de energía.

### Interacción con Generadores
Cuando ocurre un apagón general de la red pública, el rectificador del UPS se queda sin alimentación. De forma automática e instantánea, las baterías asumen el suministro en DC hacia el inversor, manteniendo los servidores encendidos sin un solo milisegundo de parpadeo. Las baterías cubren este periodo de transición (de 15 segundos a 15 minutos) brindando el tiempo necesario para que los generadores mecánicos arranquen, estabilicen su velocidad y asuman la carga completa de la instalación.

### Comparativa: Baterías VRLA vs. Litio-Ion

| Parámetro Técnico | Baterías Tradicionales VRLA (Plomo-Ácido) | Baterías Modernas de Litio-Ion |
| :--- | :--- | :--- |
| **Densidad Energética** | Baja. Demandan amplias salas y refuerzos estructurales. | Muy Alta. Reducen la huella física hasta en un 60%. |
| **Vida Útil Operativa** | Corta. Reemplazo requerido cada 3-5 años. | Larga. Expectativa de vida útil superior a los 10-15 años. |
| **Mantenimiento** | Alto. Requiere comprobaciones manuales de celdas. | Bajo. Gestión automática por software integrado (BMS). |
| **Inversión Inicial (CapEx)** | Baja y económica a corto plazo. | Elevada, balanceada por un menor costo de ciclo de vida. |

*   **Actividad Interactiva:** Simulador de osciloscopio. Muestra una onda AC distorsionada de la red eléctrica y cómo se convierte en una onda senoidal pura tras pasar por los filtros lógicos del UPS.
*   **Knowledge Check (Quiz):**
    1. ¿Qué componente del UPS transforma la energía de las baterías (DC) en energía utilizable por el rack (AC)? (*El inversor*).
    2. ¿Por qué el Litio-Ion está reemplazando al Plomo-Ácido (VRLA)? (*Por su menor espacio físico, mayor vida útil y bajo mantenimiento*).
    3. ¿Qué ocurre en el UPS durante la conmutación a baterías? (*Nada visual, el flujo de corriente es continuo y transparente*).

---

## 7. Solapa 7: Hot Aisle vs Cold Aisle Containment
*   **Referencia de Video:** [Ver video base en YouTube](https://www.youtube.com/watch?v=qzTpqpHnRdU)

### Resumen Conceptual
La gestión del flujo de aire dentro de la sala blanca es crítica para mejorar la eficiencia del sistema de climatización. Su objetivo fundamental es evitar físicamente que el aire frío de inyección se mezcle con el aire caliente de escape de los racks.

### Comparativa de Estrategias de Confinamiento
*   **Cold Aisle Containment (Confinamiento de Pasillo Frío):**
    *   *Mecánica:* Se instalan techos y puertas en el pasillo frontal de los servidores. El aire frío queda atrapado exclusivamente en este corredor presurizado.
    *   *Ventajas:* Sencillo y económico de implementar en centros de datos existentes (Retrofit).
    *   *Desventajas:* Todo el espacio abierto restante del cuarto se convierte en un área caliente, disminuyendo el confort del personal técnico en la sala.
*   **Hot Aisle Containment (Confinamiento de Pasillo Caliente):**
    *   *Mecánica:* Se encierra de forma estante el pasillo posterior de expulsión de calor. El flujo térmico se succiona directamente hacia el techo técnico de retorno.
    *   *Ventajas:* Máxima eficiencia termodinámica. Permite temperaturas de retorno elevadas y mantiene el cuarto general a una temperatura agradable.
    *   *Desventajas:* Mayor complejidad de ingeniería y requiere integración estricta con los sistemas de extinción de incendios.

*   **Actividad Interactiva:** Simulador aerodinámico en tiempo real. Abre y cierra compuertas virtuales de confinamiento para observar cómo varía la temperatura de los servidores y el consumo de los ventiladores.
*   **Knowledge Check (Quiz):**
    1. ¿Cuál es el principal perjuicio de la mezcla de flujos de aire? (*Reduce la eficiencia del clima y eleva el consumo eléctrico de ventilación*).
    2. ¿Qué contención es la preferida en centros de alta densidad e IA? (*Hot Aisle Containment / Pasillo Caliente*).
    3. ¿Qué elementos físicos se usan para sellar los extremos de los pasillos? (*Puertas corredizas y barreras de flujo o paneles de techo*).

---

## 8. Solapa 8: Chilled Water Systems Explained
*   **Referencia de Video:** [Ver video base en YouTube](https://www.youtube.com/watch?v=rUiYdpODxJI)

### Resumen Conceptual
Los centros de datos a gran escala sustituyen los sistemas directos basados en gas refrigerante por circuitos hidráulicos centralizados. Utilizan el agua helada como el medio físico óptimo para transportar y disipar megavatios de carga térmica.

### Los Tres Circuitos del Sistema Hidráulico
1.  **Circuito Interno (Edificio - CRAH):** El aire caliente de la sala IT pasa a través de los serpentines de agua de las manejadoras CRAH. El calor se transfiere al fluido hidráulico. El agua resultante, ahora tibia, se bombea hacia la planta exterior.
2.  **Circuito de Refrigeración (Chiller Plant):** El agua tibia entra al evaporador de una máquina enfriadora (Chiller). El ciclo de refrigeración interno remueve el calor y vuelve a enfriar el agua para enviarla de regreso a las salas informáticas.
3.  **Circuito de Rechazo Exterior (Torres):** El chiller transfiere el calor extraído a un bucle secundario de agua de condensación, el cual viaja a las torres de enfriamiento exteriores para disipar la energía en la atmósfera mediante evaporación controlada.

*   **Actividad Interactiva:** Animación interactiva de la planta hidráulica. Permite modificar la demanda térmica de los racks y visualizar cómo se reconfiguran las válvulas motorizadas y el encendido de bombas redundantes.
*   **Knowledge Check (Quiz):**
    1. ¿Cuál es la ventaja del agua sobre los gases refrigerantes DX a gran escala? (*Permite una centralización y control eficientes de cargas masivas de calor*).
    2. ¿Qué equipo absorbe el calor del aire interno de la sala de servidores en este sistema? (*La manejadora CRAH*).
    3. ¿Para qué se diseñan bucles de tuberías redundantes en el circuito hidráulico? (*Para garantizar el flujo de agua helada incluso ante la rotura de una tubería o válvula*).

---

## 9. Solapa 9: CRAC vs CRAH Units
*   **Referencia de Video:** [Ver video base en YouTube](https://www.youtube.com/watch?v=0h7xFUx4dNU)

### Resumen Conceptual
A pesar de compartir una estética exterior idéntica basada en gabinetes modulares perimetrales con grandes ventiladores de impulsión, los equipos CRAC y CRAH representan filosofías mecánicas completamente distintas.

### Tabla Compartiva de Ingeniería Perimetral

| Atributo Técnico | Unidad CRAC (Computer Room Air Conditioner) | Unidad CRAH (Computer Room Air Handler) |
| :--- | :--- | :--- |
| **Mecánica Interna** | Incorpora compresores dedicados, válvula de expansión y líneas de gas refrigerante. | Contiene únicamente un serpentín de agua helada, ventiladores modulares y válvulas de control. |
| **Principio de Operación** | Expansión Directa (DX). Genera el frío de forma mecánica dentro del propio equipo. | Intercambio térmico simple. Depende de agua helada bombeada desde una planta central exterior. |
| **Ámbito de Aplicación** | Salas de datos pequeñas, salas de telecomunicaciones o nodos de borde (Edge). | Centros de datos a gran escala, hiperescala e instalaciones de nube pública. |
| **Eficiencia Energética** | Menor a gran escala debido a la suma de múltiples compresores independientes. | Muy alta. Optimiza el consumo al utilizar ventiladores EC y control centralizado. |

*   **Actividad Interactiva:** Taller virtual de ensamblaje mecánico. El usuario debe arrastrar componentes (compresor de gas vs. válvulas de paso de agua helada) para construir correctamente una unidad CRAC o una unidad CRAH.
*   **Knowledge Check (Quiz):**
    1. ¿Qué componente crítico diferencia internamente a una unidad CRAC de una CRAH? (*El compresor de refrigerante*).
    2. ¿Qué significan las siglas CRAH? (*Computer Room Air Handler / Manejadora de Aire de Sala de Cómputo*).
    3. ¿Por qué las unidades CRAH son comunes en hiperescala? (*Porque ofrecen una eficiencia superior al integrarse con plantas centrales de agua*).

---

## 10. Solapa 10: Air Cooled vs Water Cooled
*   **Referencia de Video:** [Ver video base en YouTube](https://www.youtube.com/watch?v=4BRcXRfxs1g)

### Resumen Conceptual
La selección de la arquitectura de la planta central del centro de datos determina cómo se disipa la carga térmica total del sitio hacia el exterior y define el balance ecológico entre el consumo de energía eléctrica y el recurso hídrico.

### Métricas de Sostenibilidad e Infraestructura
*   **PUE (Power Usage Effectiveness):** Mide la eficiencia energética del centro de datos.
    $$	ext{PUE} = rac{	ext{Energía Total Entrante al Edificio}}{	ext{Energía Consumida por el Equipamiento IT}}$$
    *Un PUE de 1.2 es excelente; un PUE de 2.0 indica deficiencias graves, gastando tanta energía en soporte como en procesamiento.*
*   **WUE (Water Usage Effectiveness):** Mide la eficiencia en el uso del agua, calculando los litros evaporados o consumidos anualmente por cada kWh entregado a la carga IT.

### Comparación de Plantas Centrales de Enfriamiento

| Variable Operativa | Planta Enfriada por Aire (Air-Cooled) | Planta Enfriada por Agua (Water-Cooled) |
| :--- | :--- | :--- |
| **Equipamiento Exterior** | Chillers enfriados por aire con ventiladores axiales masivos o Dry Coolers. | Chillers centralizados acoplados a Torres de Enfriamiento evaporativas. |
| **Consumo de Agua** | Nulo o insignificante. Ideal para zonas con escasez o restricciones de agua. | Elevado debido al proceso de evaporación térmica continua en las torres. |
| **Eficiencia Eléctrica** | Menor en climas muy cálidos de verano, aumentando el PUE del sitio. | Muy alta y constante durante todo el año, manteniendo un PUE bajo. |
| **Complejidad y Mantenimiento** | Baja complejidad mecánica; no requiere tratamientos químicos complejos de agua. | Alta complejidad operacional; demanda controles químicos diarios contra la corrosión. |

*   **Actividad Interactiva:** Simulador eco-financiero global. El usuario posiciona un centro de datos en diferentes ubicaciones geográficas del mundo (ej. Islandia vs. Dubái) y ajusta los costes locales de electricidad y agua para evaluar las métricas resultantes de PUE y WUE.
*   **Knowledge Check (Quiz):**
    1. ¿Qué valor representa un PUE ideal teórico? (*1.0, donde el 100% de la energía se destina a procesar datos*).
    2. ¿Cuál es el principal beneficio de las plantas enfriadas por aire? (*La conservación del recurso hídrico al no consumir agua para disipar calor*).
    3. ¿En qué consiste la operación con economizador o Free Cooling? (*Aprovechar las temperaturas bajas exteriores del invierno para enfriar el agua sin activar compresores mecánicos*).

---

## 11. Requerimientos Técnicos y de Desarrollo del Sistema

Para garantizar la correcta ejecución, portabilidad y escalabilidad de la plataforma "Data center desde 0", el sistema desarrollado debe cumplir estrictamente con las siguientes especificaciones:

### A. Entorno de Desarrollo y Despliegue
*   **Aislamiento Local Estricto:** Todo el sistema debe estructurarse y ejecutarse localmente desde el directorio raíz obligatorio `C:	emp\Datacenter21`.
*   **Arquitectura de Software:** Desarrollo basado en tecnologías web estándar sin dependencias de frameworks del lado del servidor (HTML5 semántico, CSS3 y JavaScript nativo). El portal debe operar como una **Single Page Application (SPA)** mediante la manipulación dinámica del DOM para el intercambio de solapas, asegurando la compatibilidad directa al abrirse localmente desde cualquier navegador web.
*   **Compatibilidad con Control de Versiones:** El código fuente debe estar optimizado y estructurado de forma limpia para ser cargado y estar disponible en un repositorio público o privado de **GitHub**.

### B. Especificaciones de Idioma y Accesibilidad Visual
*   **Arquitectura Multilingüe Nativa:** El sistema debe contar con un motor de internacionalización dinámico en JavaScript que permita alternar la interfaz completa en tres idiomas en tiempo real: **Inglés, Italiano y Español**.
*   **Diseño y Confort Visual (Modo Oscuro):** La interfaz debe utilizar tipografías sans-serif claras, limpias y altamente legibles. Debe incluir de forma nativa e integrada un interruptor para alternar entre la vista de **Modo Claro** y **Modo Oscuro** (estableciendo el Modo Oscuro como la visualización por defecto de la aplicación).

### C. Dinámicas Educativas e Interactivas (Por Módulo)
*   **Actividades de Aprendizaje:** Cada una de las solapas técnicas debe integrar una actividad interactiva visual (tales como simuladores de cortes de energía, matrices lógicas de cálculo de kW o diagramas de Tiers) para hacer la explicación amigable al usuario.
*   **Knowledge Checks (Quizzes):** Al final de cada solapa técnica, se debe incluir un cuestionario autocorregible obligatorio de **3 preguntas rápidas** para validar la comprensión del módulo antes de avanzar.

### D. Requerimientos de Conectividad con Inteligencia Artificial
*   **Solapa dedicada de Configuración:** Pestaña administrativa exclusiva para la gestión del motor de inferencia. Esta solapa no debe incluir ventanas de chat orientadas al estudiante.
*   **Integración con Motores LLM:** El portal debe proveer conectividad con modelos de IA avanzados, permitiendo al administrador configurar y conectar endpoints locales o remotos como **OmniRoute** o **Microsoft Foundry**.
*   **Parámetros de Red OmniRoute:** Para las conexiones con la API de OmniRoute, el portal web debe establecer de manera fija la dirección por defecto: `http://localhost:20128/v1/chat/completions`.
*   **Función de Escaneo Automático (Scan Models):** La solapa de configuración debe proveer un botón interactivo para consultar el catálogo de modelos disponibles a través de una petición asíncrona a `http://localhost:20128/v1/models`. La lógica interna del sistema debe realizar un parseo del vector de respuesta, identificar los IDs disponibles y **conectarse de forma automática al primer modelo que se encuentre listado y disponible**.
*   **Asistente de Chat Modular:** Cada solapa técnica debe incluir un resumen ejecutivo del tema y una sección de chat interactiva contextual para realizar preguntas sobre ese componente específico, enlazada directamente con el modelo de IA seleccionado en la solapa de configuración.
