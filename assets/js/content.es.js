/* Data Center desde 0 — Contenido de módulos en español */
window.CONTENT = window.CONTENT || {};
window.CONTENT.es = {
  modules: [
    {
      id: "m1",
      title: "Cómo funcionan los data centers",
      kicker: "Conversión energética, 24/7",
      video: "https://www.youtube.com/watch?v=cTwvUqLNQrM",
      activity: "layers",
      summary: "Desde la ingeniería, un centro de datos es un edificio de conversión energética: almacena, procesa y distribuye información digital. A diferencia de las computadoras de oficina, los servidores operan 24/7/365 y casi cada vatio que entra se transforma finalmente en calor que debe removerse sin interrupciones. Todo el diseño se apoya en tres pilares concurrentes: energía continua, enfriamiento continuo y mantenimiento concurrente.",
      tables: [
        {
          title: "Edificio de oficinas vs data center",
          headers: ["Atributo", "Edificio comercial", "Centro de datos"],
          rows: [
            ["Perfil de carga", "Variable e intermitente; baja de noche y los fines de semana.", "Constante, masivo y cercano al 100% de la demanda de diseño."],
            ["Objetivo del enfriamiento", "Confort humano, habitualmente 22–24 °C.", "Supervivencia y estabilidad térmica del hardware."],
            ["Tolerancia a cortes", "Alta; un corte genera molestias, no una pérdida crítica inmediata.", "Nula; un corte de milisegundos provoca caídas globales y corrupción."],
            ["Infraestructura base", "Sistemas mecánicos y eléctricos comerciales estándar.", "Capas redundantes pesadas: generadores, UPS, chillers N+1 o 2N."]
          ]
        }
      ],
      quiz: [
        {
          q: "¿Cuál es la función principal de un data center desde la ingeniería?",
          options: ["Alojar terminales de oficina intermitentes.", "Actuar como edificio de conversión energética: entra energía, hay cómputo y sale calor.", "Servir solo como punto de interconexión inalámbrica urbana."],
          answer: 1,
          explain: "La instalación convierte energía eléctrica en cómputo y, finalmente, en calor que debe removerse de forma continua."
        },
        {
          q: "¿Qué ocurre si el enfriamiento se detiene por completo?",
          options: ["Los servidores siguen funcionando indefinidamente.", "El hardware sufre estrés térmico y se apaga por protección.", "La UPS enfría la sala automáticamente con energía de baterías."],
          answer: 1,
          explain: "El calor es continuo. Sin enfriamiento, la temperatura de entrada sube en minutos y el equipo limita su rendimiento o se apaga."
        },
        {
          q: "¿Cuáles son los tres pilares de la infraestructura física?",
          options: ["Sistemas eléctricos, enfriamiento mecánico y monitoreo/control.", "Redes, almacenamiento y máquinas virtuales.", "Firewalls, backups y cuentas de usuario."],
          answer: 0,
          explain: "Energía, climatización y control deben operar de forma concurrente para mantener el sitio en línea."
        }
      ]
    },
    {
      id: "m2",
      title: "Flujo de energía",
      kicker: "De la red al servidor",
      video: "https://www.youtube.com/watch?v=Y_8P3wzxsqY",
      activity: "powerflow",
      summary: "El flujo de energía es el mapa vial eléctrico del centro de datos. Garantiza la transformación controlada desde la red pública de alta tensión hasta la electrónica de cada servidor con continuidad absoluta. La redundancia comienza en la acometida y se repite en cada etapa: switchgear, transformadores, generadores, UPS, tableros, PDU, paneles remotos y regletas inteligentes de rack.",
      tables: [
        {
          title: "Componentes de la arquitectura eléctrica",
          headers: ["Componente", "Función principal e impacto operativo"],
          rows: [
            ["Utility", "Red de suministro de la compañía eléctrica: generación nuclear, gas, hidro o solar."],
            ["Transmission", "Transporte en alta tensión y baja corriente para reducir pérdidas resistivas."],
            ["Switchgear", "Punto de entrada con protección contra sobrecorriente, medición y aislamiento de red."],
            ["Transformer", "Reduce la media tensión exterior (12–34,5 kV) al nivel interno del edificio (480 V)."],
            ["Generator", "Motores diésel de respaldo que asumen la carga total en fallas prolongadas."],
            ["UPS", "Sistema ininterrumpido por baterías: filtra perturbaciones y cubre la transición."],
            ["UPS SB", "Tablero de salida que distribuye los ramales protegidos de la instalación."],
            ["PDU", "Unidad de distribución que transforma 480 V a niveles IT como 208 V o 415 V."],
            ["RPP", "Paneles remotos que extienden circuitos con breakers adicionales en la sala blanca."],
            ["rPDU", "Regletas inteligentes del rack que energizan servidores y miden el consumo por toma."]
          ]
        }
      ],
      quiz: [
        {
          q: "¿Por qué se transmite a alta tensión a largas distancias?",
          options: ["Para aumentar la corriente y calentar los cables.", "Para reducir la corriente y minimizar las pérdidas en la línea.", "Para mejorar la forma de onda de los servidores."],
          answer: 1,
          explain: "A igual potencia, más tensión implica menos corriente y menores pérdidas resistivas."
        },
        {
          q: "¿Cuál es el rol del ATS o del paralleling switchgear?",
          options: ["Detectar fallas de red, arrancar y sincronizar generadores y transferir la carga.", "Convertir AC en DC para las baterías.", "Distribuir energía directo a cada toma de servidor."],
          answer: 0,
          explain: "El ATS o la conmutación en paralelo coordina la planta de generadores y la transferencia de carga."
        },
        {
          q: "¿Qué dispositivo energiza directamente a cada servidor individual?",
          options: ["El chiller.", "El transformador reductor.", "La rPDU o regleta de distribución de rack."],
          answer: 2,
          explain: "La rPDU va dentro del rack, alimenta los servidores y mide cada toma."
        }
      ]
    },
    {
      id: "m3",
      title: "Métodos de enfriamiento",
      kicker: "Aire, líquido y densidad",
      video: "https://www.youtube.com/watch?v=iRLCUWbi0o4",
      activity: "cooling",
      summary: "A medida que crece la densidad de potencia por rack, el enfriamiento evoluciona del aire general de sala hacia soluciones líquidas aplicadas en la fuente de calor. El agua y los fluidos dieléctricos tienen una capacidad calorífica muy superior a la del aire y transportan el calor con mucha más eficiencia. Para clústeres de GPU e IA, la recomendación dominante es el enfriamiento líquido direct-to-chip.",
      tables: [
        {
          title: "Tecnologías de enfriamiento por densidad",
          headers: ["Tecnología", "Densidad típica", "Cómo funciona"],
          rows: [
            ["Aire de sala", "3–5 kW/rack", "Unidades CRAC/CRAH impulsan aire frío por piso técnico hacia pasillos abiertos."],
            ["Aire close-coupled", "10–20 kW/rack", "Unidades in-row o intercambiadores en puerta trasera acercan el frío a los racks."],
            ["Líquido direct-to-chip", "50–100+ kW/rack", "Placas frías sobre CPU y GPU retiran el calor en un circuito líquido cerrado."],
            ["Inmersión", "Muy alta", "Los servidores se sumergen en fluido dieléctrico no conductor, monofásico o bifásico."]
          ]
        }
      ],
      quiz: [
        {
          q: "¿Qué impulsa la transición del enfriamiento por aire al líquido?",
          options: ["El incremento radical de la densidad de calor por rack.", "La caída del precio de los switches de red.", "La necesidad de reducir la cantidad de servidores."],
          answer: 0,
          explain: "El aire no puede transportar con eficiencia el calor de racks muy densos."
        },
        {
          q: "¿Cuál es el método preferido para centros enfocados en IA?",
          options: ["Aire de sala abierta.", "Líquido direct-to-chip.", "Solo ventilación pasiva."],
          answer: 1,
          explain: "El direct-to-chip es el diseño de referencia para clústeres densos de GPU."
        },
        {
          q: "¿Cuál es el principio del confinamiento de pasillos?",
          options: ["Mezclar aire frío y caliente para igualar la temperatura.", "Separar físicamente los flujos de aire frío y caliente para mejorar la eficiencia.", "Enfriar solo las puertas frontales de los racks."],
          answer: 1,
          explain: "El confinamiento evita que el aire frío de impulsión se mezcle con el escape caliente."
        }
      ]
    },
    {
      id: "m4",
      title: "Redundancia: N, N+1 y 2N",
      kicker: "Diseñar para el fallo",
      video: "https://www.youtube.com/watch?v=FWpWU9tiKs4",
      activity: "tiers",
      summary: "La redundancia define la capacidad de reserva que permite al centro de datos sobrevivir fallos o mantenimientos sin interrumpir los servidores. N es la cantidad mínima de componentes para operar a plena carga de diseño. Añadir unidades de respaldo o duplicar rutas completas aumenta la resiliencia y el CapEx. Los Tiers de Uptime Institute traducen estas topologías en clases de disponibilidad.",
      tables: [
        {
          title: "Esquemas de redundancia",
          headers: ["Esquema", "Descripción", "Tolerancia a fallos", "CapEx", "Tier típico"],
          rows: [
            ["N", "Capacidad exacta sin unidades de respaldo.", "Nula; cualquier avería interrumpe el servicio.", "Mínimo", "Tier I"],
            ["N+1", "Un componente adicional de respaldo por sistema.", "Soporta la pérdida de una unidad.", "Moderado", "Tier II / III"],
            ["N+2", "Dos componentes adicionales de reserva.", "Soporta dos fallos simultáneos o sucesivos.", "Medio-alto", "Alta disponibilidad"],
            ["2N", "Dos sistemas independientes al 100% de capacidad.", "Soporta la pérdida de una ruta completa.", "Alto", "Tier IV"],
            ["2(N+1)", "Dos ramas independientes, cada una con un equipo extra.", "Resiliencia total incluso en mantenimiento.", "Muy alto", "Hiperscala / nube crítica"],
            ["3N/2", "Tres sistemas de respaldo protegiendo dos cargas de forma cruzada.", "Alta eficiencia de carga con resiliencia.", "Optimizado", "Colocation"]
          ]
        },
        {
          title: "Clasificación por Tiers (Uptime Institute)",
          headers: ["Tier", "Capacidad", "Disponibilidad"],
          rows: [
            ["Tier I", "Infraestructura básica con una única ruta no redundante.", "99,671%"],
            ["Tier II", "Componentes redundantes sobre una ruta única.", "99,749%"],
            ["Tier III", "Mantenible concurrentemente: varias rutas, una activa y una pasiva.", "99,982%"],
            ["Tier IV", "Tolerante a fallos: topología 2N con rutas activas simultáneas.", "99,995%"]
          ]
        }
      ],
      quiz: [
        {
          q: "¿Qué significa la letra N?",
          options: ["La capacidad mínima de diseño requerida para soportar la carga real.", "El número de generadores del sitio.", "El presupuesto de latencia de red."],
          answer: 0,
          explain: "N es la capacidad base necesaria para operar a plena carga de diseño."
        },
        {
          q: "¿Qué define la certificación Tier III?",
          options: ["Funcionar solo con energía renovable.", "Permitir mantenimiento concurrente sin interrumpir el cómputo.", "No tener UPS."],
          answer: 1,
          explain: "Tier III permite intervenir cualquier componente mientras la carga IT sigue operando."
        },
        {
          q: "Si una sala necesita 4 módulos UPS y se instalan 5 en paralelo, ¿qué esquema es?",
          options: ["N.", "N+1.", "2N."],
          answer: 1,
          explain: "Cuatro requeridos más uno de reserva es N+1."
        }
      ]
    },
    {
      id: "m5",
      title: "Sistemas eléctricos",
      kicker: "Continuidad por diseño",
      video: "https://www.youtube.com/watch?v=x7dxWbNoq8s",
      activity: "ups",
      summary: "Los sistemas eléctricos de misión crítica protegen los procesadores de interrupciones y fluctuaciones de la red externa mediante capas de protección física. La UPS actúa como un amortiguador eléctrico dinámico entre la red y los servidores. La topología estándar es la doble conversión: el rectificador convierte AC inestable en DC para las baterías y el inversor devuelve esa DC limpia como AC perfecta para la carga IT.",
      tables: [
        {
          title: "Etapas de una UPS de doble conversión",
          headers: ["Etapa", "Función"],
          rows: [
            ["Rectificador", "Convierte la AC entrante en DC y mantiene cargado el banco de baterías."],
            ["Baterías", "Almacenan energía y entregan DC al instante cuando falla la red."],
            ["Inversor", "Convierte la DC limpia en AC estable y libre de ruido para los servidores."],
            ["Bypass estático", "Ofrece una ruta alterna de red cruda para mantenimiento o sobrecarga."]
          ]
        }
      ],
      quiz: [
        {
          q: "¿Cuáles son los tres bloques internos principales de una UPS?",
          options: ["Rectificador, baterías e inversor.", "Chiller, torre y bomba.", "Switchgear, PDU y rPDU."],
          answer: 0,
          explain: "La doble conversión se apoya en rectificador, banco de baterías e inversor."
        },
        {
          q: "¿Cuál es el beneficio secundario de la UPS además del respaldo?",
          options: ["Genera combustible diésel.", "Acondiciona y estabiliza la calidad de la energía.", "Elimina la necesidad de enfriamiento."],
          answer: 1,
          explain: "La doble conversión aísla la carga de caídas, picos y ruido."
        },
        {
          q: "¿Qué combustible alimenta el respaldo de largo plazo?",
          options: ["Solo gas natural.", "Diésel para los generadores.", "Ácido de batería."],
          answer: 1,
          explain: "Los generadores diésel sostienen el sitio durante cortes prolongados."
        }
      ]
    },
    {
      id: "m6",
      title: "UPS en profundidad",
      kicker: "Baterías y transferencia",
      video: "https://www.youtube.com/watch?v=uz6unYab6G0",
      activity: "scope",
      summary: "Durante un apagón general, el rectificador de la UPS pierde alimentación. Las baterías entregan DC al inversor de forma instantánea y mantienen los servidores sin un solo milisegundo de parpadeo. Ese puente dura de 15 segundos a 15 minutos, tiempo suficiente para que los generadores arranquen, se estabilicen y asuman la carga. La química de ese puente está cambiando: el litio-ion reemplaza al plomo-ácido.",
      tables: [
        {
          title: "Baterías VRLA vs litio-ion",
          headers: ["Parámetro", "VRLA (plomo-ácido)", "Litio-ion"],
          rows: [
            ["Densidad energética", "Baja; exige salas amplias y refuerzo estructural.", "Muy alta; reduce la huella física hasta un 60%."],
            ["Vida útil", "Corta; reemplazo cada 3–5 años.", "Larga; habitualmente más de 10–15 años."],
            ["Mantenimiento", "Alto; requiere comprobaciones manuales de celdas.", "Bajo; gestión automatizada mediante BMS integrado."],
            ["CapEx inicial", "Bajo y económico a corto plazo.", "Elevado, compensado por un menor costo de ciclo de vida."]
          ]
        }
      ],
      quiz: [
        {
          q: "¿Qué componente de la UPS transforma la DC de las baterías en AC utilizable?",
          options: ["El rectificador.", "El inversor.", "El interruptor estático."],
          answer: 1,
          explain: "El inversor devuelve la DC de baterías o rectificador como AC."
        },
        {
          q: "¿Por qué el litio-ion reemplaza al plomo-ácido VRLA?",
          options: ["Menor espacio, mayor vida útil y menor mantenimiento.", "No necesita gestión de batería.", "Funciona sin inversor."],
          answer: 0,
          explain: "El litio-ion ofrece más densidad, más vida y monitoreo automatizado."
        },
        {
          q: "¿Qué ocurre visualmente en la carga durante la transferencia a baterías?",
          options: ["Nada; el flujo de corriente es continuo y transparente.", "Todos los servidores reinician de inmediato.", "Las luces parpadean un segundo."],
          answer: 0,
          explain: "La doble conversión hace la transferencia transparente para los servidores."
        }
      ]
    },
    {
      id: "m7",
      title: "Confinamiento de pasillos",
      kicker: "Gestión del flujo de aire",
      video: "https://www.youtube.com/watch?v=qzTpqpHnRdU",
      activity: "containment",
      summary: "La gestión del flujo de aire en la sala blanca es crítica para la eficiencia del clima. El objetivo es evitar físicamente que el aire frío de impulsión se mezcle con el escape caliente. Los servidores se organizan frontal contra frontal y trasero contra trasero, creando pasillos fríos en las entradas y pasillos calientes en las salidas. El confinamiento sella uno de esos pasillos con puertas, paneles y techos.",
      tables: [
        {
          title: "Estrategias de confinamiento",
          headers: ["Criterio", "Pasillo frío", "Pasillo caliente"],
          rows: [
            ["Mecánica", "Techos y puertas encierran el pasillo frontal; el aire frío queda en un corredor presurizado.", "Se sella el pasillo trasero y el aire caliente se aspira directo al retorno de techo."],
            ["Ventajas", "Sencillo y económico de implementar en centros existentes.", "Máxima eficiencia termodinámica, retorno caliente y sala confortable."],
            ["Desventajas", "El resto de la sala abierta se vuelve caliente para los técnicos.", "Mayor complejidad de ingeniería e integración estricta con extinción de incendios."],
            ["Uso recomendado", "Retrofit y salas de densidad baja o media.", "Salas de alta densidad e IA."]
          ]
        }
      ],
      quiz: [
        {
          q: "¿Cuál es el principal perjuicio de mezclar los flujos de aire?",
          options: ["Mejora la redundancia.", "Reduce la eficiencia del clima y eleva el consumo de ventilación.", "Baja el PUE automáticamente."],
          answer: 1,
          explain: "La mezcla obliga a chillers y ventiladores a trabajar más para lograr la misma temperatura de entrada."
        },
        {
          q: "¿Qué contención se prefiere en centros de alta densidad e IA?",
          options: ["Confinamiento de pasillo frío.", "Confinamiento de pasillo caliente.", "Sin confinamiento."],
          answer: 1,
          explain: "El pasillo caliente ofrece mejor termodinámica para racks densos."
        },
        {
          q: "¿Qué elementos físicos sellan los extremos de los pasillos?",
          options: ["Puertas corredizas y barreras de flujo o paneles de techo.", "Solo bandejas portacables.", "Solo baldosas del piso técnico."],
          answer: 0,
          explain: "Puertas, paneles de extremo y techo cierran el corredor confinado."
        }
      ]
    },
    {
      id: "m8",
      title: "Sistemas de agua helada",
      kicker: "Tres circuitos hidráulicos",
      video: "https://www.youtube.com/watch?v=rUiYdpODxJI",
      activity: "chilledwater",
      summary: "Los centros de datos a gran escala sustituyen los sistemas directos de refrigerante por circuitos hidráulicos centralizados. El agua helada es el medio físico que transporta y disipa megavatios de carga térmica. Tres bucles cooperan: el circuito interno CRAH absorbe calor de la sala, la planta de chillers lo retira del agua y el circuito de condensación lo rechaza a la atmósfera mediante torres.",
      tables: [
        {
          title: "Los tres circuitos hidráulicos",
          headers: ["Circuito", "Función"],
          rows: [
            ["Circuito interno CRAH", "El aire caliente pasa por los serpentines CRAH; el calor se transfiere al agua, que regresa a la planta."],
            ["Planta de chillers", "El agua tibia entra al evaporador; el ciclo de refrigeración retira el calor y devuelve agua helada."],
            ["Circuito de rechazo", "El chiller transfiere calor al agua de condensación, que viaja a las torres exteriores."]
          ]
        }
      ],
      quiz: [
        {
          q: "¿Cuál es la ventaja del agua frente a los refrigerantes DX a gran escala?",
          options: ["Permite centralizar y controlar eficientemente cargas masivas de calor.", "Elimina la necesidad de torres de enfriamiento.", "Elimina las unidades CRAH."],
          answer: 0,
          explain: "Las plantas de agua centralizan el enfriamiento y escalan eficientemente a megavatios."
        },
        {
          q: "¿Qué equipo absorbe el calor del aire interno de la sala?",
          options: ["La torre de enfriamiento.", "La manejadora CRAH.", "El switchgear."],
          answer: 1,
          explain: "La CRAH intercambia calor entre el aire de sala y el circuito de agua helada."
        },
        {
          q: "¿Para qué se diseñan bucles de tuberías redundantes?",
          options: ["Para garantizar el flujo de agua helada aunque falle una tubería o válvula.", "Para aumentar la temperatura del agua.", "Para reducir las bombas a una sola."],
          answer: 0,
          explain: "La redundancia de tuberías y bombas mantiene el caudal ante fallos o mantenimiento."
        }
      ]
    },
    {
      id: "m9",
      title: "Unidades CRAC vs CRAH",
      kicker: "Mismo gabinete, otra física",
      video: "https://www.youtube.com/watch?v=0h7xFUx4dNU",
      activity: "assembly",
      summary: "A pesar de su estética exterior idéntica —gabinetes perimetrales modulares con grandes ventiladores—, las unidades CRAC y CRAH representan filosofías mecánicas distintas. La CRAC genera el frío dentro del equipo con su propio compresor y circuito de refrigerante. La CRAH solo contiene un serpentín de agua helada, válvulas y ventiladores, y depende de una planta central exterior.",
      tables: [
        {
          title: "Comparativa de ingeniería perimetral",
          headers: ["Atributo", "CRAC", "CRAH"],
          rows: [
            ["Mecánica interna", "Compresores dedicados, válvula de expansión y líneas de refrigerante.", "Solo serpentín de agua helada, ventiladores modulares y válvulas de control."],
            ["Principio de operación", "Expansión directa (DX): genera frío mecánicamente dentro del equipo.", "Intercambio térmico simple: depende del agua helada bombeada desde la planta central."],
            ["Aplicación típica", "Salas de datos pequeñas, salas de telecomunicaciones y nodos edge.", "Centros a gran escala, hiperescala y nube pública."],
            ["Eficiencia energética", "Menor a gran escala por la suma de compresores independientes.", "Muy alta; optimizada con ventiladores EC y control centralizado."]
          ]
        }
      ],
      quiz: [
        {
          q: "¿Qué componente crítico diferencia internamente a una CRAC de una CRAH?",
          options: ["El compresor de refrigerante.", "El filtro de aire.", "El ventilador de impulsión."],
          answer: 0,
          explain: "El compresor es lo que convierte a la CRAC en una máquina de expansión directa."
        },
        {
          q: "¿Qué significan las siglas CRAH?",
          options: ["Computer Room Air Handler (manejadora de aire de sala de cómputo).", "Critical Rack Air Humidifier.", "Cooling Return Air Housing."],
          answer: 0,
          explain: "CRAH significa Computer Room Air Handler."
        },
        {
          q: "¿Por qué las CRAH son comunes en hiperescala?",
          options: ["Ofrecen mayor eficiencia al integrarse con plantas centrales de agua.", "Incluyen su propio generador diésel.", "No necesitan ventiladores."],
          answer: 0,
          explain: "Las plantas centrales de agua helada con CRAH escalan de forma eficiente."
        }
      ]
    },
    {
      id: "m10",
      title: "Aire vs agua",
      kicker: "PUE, WUE y clima",
      video: "https://www.youtube.com/watch?v=4BRcXRfxs1g",
      activity: "eco",
      summary: "La arquitectura de la planta central determina cómo el sitio rechaza su carga térmica al exterior y define el balance ecológico entre energía eléctrica y agua. El PUE compara la energía total del edificio con la del equipamiento IT: 1,2 es excelente y 2,0 indica que el sitio gasta tanto en soporte como en cómputo. El WUE mide los litros de agua consumidos por cada kWh IT.",
      tables: [
        {
          title: "Comparación de plantas centrales",
          headers: ["Variable", "Planta enfriada por aire", "Planta enfriada por agua"],
          rows: [
            ["Equipamiento exterior", "Chillers enfriados por aire con ventiladores axiales o dry coolers.", "Chillers centralizados acoplados a torres de enfriamiento evaporativas."],
            ["Consumo de agua", "Nulo o insignificante; ideal donde el agua escasea.", "Elevado por la evaporación continua en las torres."],
            ["Eficiencia eléctrica", "Menor en veranos muy cálidos, lo que eleva el PUE.", "Muy alta y estable todo el año, manteniendo el PUE bajo."],
            ["Complejidad y mantenimiento", "Baja complejidad mecánica y sin química de agua compleja.", "Alta complejidad operativa con controles químicos diarios contra corrosión."]
          ]
        }
      ],
      quiz: [
        {
          q: "¿Qué valor representa un PUE ideal teórico?",
          options: ["1,0, donde el 100% de la energía llega al IT.", "2,0, donde el soporte iguala al IT.", "0,5, donde el IT usa la mitad de la energía."],
          answer: 0,
          explain: "Un PUE de 1,0 significa que no hay sobrecosto: toda la energía se usa para cómputo."
        },
        {
          q: "¿Cuál es el principal beneficio de las plantas enfriadas por aire?",
          options: ["Conservan el agua porque no la usan para disipar calor.", "Siempre tienen un PUE menor que las de agua.", "Requieren más tratamiento químico."],
          answer: 0,
          explain: "Las plantas de aire evitan el consumo de agua por evaporación."
        },
        {
          q: "¿En qué consiste la operación con economizador o free cooling?",
          options: ["Aprovechar las temperaturas exteriores frías para enfriar agua sin compresores.", "Apagar todo el enfriamiento de noche.", "Usar baterías para alimentar los chillers."],
          answer: 0,
          explain: "Cuando el exterior es suficientemente frío, la planta rechaza calor sin refrigeración mecánica."
        }
      ]
    }
  ]
};
