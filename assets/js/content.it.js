/* Data Center desde 0 — Contenuti dei moduli in italiano */
window.CONTENT = window.CONTENT || {};
window.CONTENT.it = {
  modules: [
    {
      id: "m1",
      title: "Come funzionano i data center",
      kicker: "Conversione energetica, 24/7",
      video: "https://www.youtube.com/watch?v=cTwvUqLNQrM",
      activity: "layers",
      summary: "Dal punto di vista ingegneristico un data center è un edificio di conversione energetica: immagazzina, elabora e distribuisce informazioni digitali. A differenza dei computer da ufficio, i server funzionano 24/7/365 e quasi ogni watt che entra viene alla fine convertito in calore che deve essere rimosso senza interruzioni. L'intero progetto si basa su tre pilastri simultanei: energia continua, raffreddamento continuo e manutenibilità concorrente.",
      tables: [
        {
          title: "Edificio per uffici vs data center",
          headers: ["Attributo", "Edificio commerciale", "Data center"],
          rows: [
            ["Profilo di carico", "Variabile e intermittente; cala di notte e nei fine settimana.", "Costante, massiccio e vicino al 100% della domanda di progetto."],
            ["Obiettivo del raffreddamento", "Comfort umano, tipicamente 22–24 °C.", "Sopravvivenza e stabilità termica dell'hardware."],
            ["Tolleranza alle interruzioni", "Alta; un blackout crea disagio, non una perdita critica immediata.", "Nulla; un'interruzione di millisecondi provoca down globali e corruzione."],
            ["Infrastruttura di base", "Sistemi meccanici ed elettrici commerciali standard.", "Strati ridondanti pesanti: generatori, UPS, chiller N+1 o 2N."]
          ]
        }
      ],
      quiz: [
        {
          q: "Qual è la funzione principale di un data center dal punto di vista ingegneristico?",
          options: ["Ospitare terminali da ufficio intermittenti.", "Agire come edificio di conversione energetica: entra energia, si calcola, esce calore.", "Servire solo come punto di interconnessione wireless urbano."],
          answer: 1,
          explain: "L'impianto converte energia elettrica in calcolo e, alla fine, in calore da rimuovere continuamente."
        },
        {
          q: "Cosa succede se il raffreddamento si ferma completamente?",
          options: ["I server continuano a funzionare all'infinito.", "L'hardware subisce stress termico e si spegne per protezione.", "L'UPS raffredda automaticamente la sala con le batterie."],
          answer: 1,
          explain: "Il calore è continuo. Senza raffreddamento la temperatura in ingresso sale in pochi minuti e le apparecchiature riducono le prestazioni o si spengono."
        },
        {
          q: "Quali sono i tre pilastri dell'infrastruttura fisica?",
          options: ["Sistemi elettrici, raffreddamento meccanico e monitoraggio/controllo.", "Rete, storage e macchine virtuali.", "Firewall, backup e account utente."],
          answer: 0,
          explain: "Energia, raffreddamento e controllo devono funzionare contemporaneamente per mantenere il sito online."
        }
      ]
    },
    {
      id: "m2",
      title: "Flusso di alimentazione",
      kicker: "Dalla rete al server",
      video: "https://www.youtube.com/watch?v=Y_8P3wzxsqY",
      activity: "powerflow",
      summary: "Il flusso di alimentazione è la mappa stradale elettrica del data center. Garantisce la trasformazione controllata dalla rete pubblica ad alta tensione fino all'elettronica di ogni server, con continuità assoluta. La ridondanza inizia dall'ingresso e si ripete in ogni fase: switchgear, trasformatori, generatori, UPS, quadri, PDU, pannelli remoti e rPDU intelligenti.",
      tables: [
        {
          title: "Componenti dell'architettura elettrica",
          headers: ["Componente", "Funzione principale e impatto operativo"],
          rows: [
            ["Utility", "Rete di fornitura elettrica: generazione nucleare, gas, idroelettrica o solare."],
            ["Transmission", "Trasporto ad alta tensione e bassa corrente per ridurre le perdite resistive."],
            ["Switchgear", "Punto di ingresso con protezione da sovracorrente, misurazione e isolamento dalla rete."],
            ["Transformer", "Riduce la media tensione esterna (12–34,5 kV) al livello interno dell'edificio (480 V)."],
            ["Generator", "Motori diesel di backup che assumono il carico totale durante guasti prolungati."],
            ["UPS", "Sistema di alimentazione ininterrotta a batteria: filtra le perturbazioni e copre il transitorio."],
            ["UPS SB", "Quadro di uscita che distribuisce le linee protette dell'impianto."],
            ["PDU", "Unità di distribuzione che trasforma 480 V ai livelli IT come 208 V o 415 V."],
            ["RPP", "Pannelli remoti che estendono i circuiti con interruttori aggiuntivi nella sala bianca."],
            ["rPDU", "Ciabatte intelligenti nel rack che alimentano i server e misurano i consumi per presa."]
          ]
        }
      ],
      quiz: [
        {
          q: "Perché l'elettricità viene trasmessa ad alta tensione sulle lunghe distanze?",
          options: ["Per aumentare la corrente e scaldare i cavi.", "Per ridurre la corrente e minimizzare le perdite di linea.", "Per rendere l'onda più pulita per i server."],
          answer: 1,
          explain: "A parità di potenza, una tensione più alta significa meno corrente e quindi minori perdite resistive."
        },
        {
          q: "Qual è il ruolo dell'ATS o del paralleling switchgear?",
          options: ["Rilevare i guasti di rete, avviare e sincronizzare i generatori e trasferire il carico.", "Convertire AC in DC per le batterie.", "Distribuire energia direttamente a ogni presa dei server."],
          answer: 0,
          explain: "L'ATS o il paralleling gear coordina la centrale dei generatori e il trasferimento del carico."
        },
        {
          q: "Quale dispositivo alimenta direttamente ogni singolo server?",
          options: ["Il chiller.", "Il trasformatore di riduzione.", "La rPDU, o rack power distribution unit."],
          answer: 2,
          explain: "La rPDU è nel rack, alimenta i server e misura ogni presa."
        }
      ]
    },
    {
      id: "m3",
      title: "Metodi di raffreddamento",
      kicker: "Aria, liquido e densità",
      video: "https://www.youtube.com/watch?v=iRLCUWbi0o4",
      activity: "cooling",
      summary: "Con l'aumento della densità di potenza per rack, il raffreddamento evolve dall'aria di sala verso soluzioni liquide applicate direttamente alla fonte di calore. Acqua e fluidi dielettrici hanno una capacità termica molto superiore all'aria e trasportano il calore in modo più efficiente. Per i cluster GPU e IA la raccomandazione dominante è il raffreddamento liquido direct-to-chip.",
      tables: [
        {
          title: "Tecnologie di raffreddamento per densità",
          headers: ["Tecnologia", "Densità tipica", "Come funziona"],
          rows: [
            ["Aria di sala", "3–5 kW/rack", "Unità CRAC/CRAH spingono aria fredda attraverso il pavimento tecnico verso corridoi aperti."],
            ["Aria close-coupled", "10–20 kW/rack", "Unità in-row o scambiatori a porta posteriore avvicinano il freddo ai rack."],
            ["Liquido direct-to-chip", "50–100+ kW/rack", "Piastre fredde su CPU e GPU portano via il calore in un circuito liquido chiuso."],
            ["Immersione", "Molto alta", "I server sono immersi in fluido dielettrico non conduttivo, monofase o bifase."]
          ]
        }
      ],
      quiz: [
        {
          q: "Cosa spinge la transizione dal raffreddamento ad aria a quello liquido?",
          options: ["L'aumento radicale della densità di calore per rack.", "Il calo del prezzo degli switch di rete.", "La necessità di ridurre il numero di server."],
          answer: 0,
          explain: "L'aria non riesce a trasportare in modo efficiente il calore di rack molto densi."
        },
        {
          q: "Qual è il metodo preferito per i data center orientati all'IA?",
          options: ["Aria di sala aperta.", "Raffreddamento liquido direct-to-chip.", "Solo ventilazione passiva."],
          answer: 1,
          explain: "Il direct-to-chip è il progetto di riferimento per i cluster GPU ad alta densità."
        },
        {
          q: "Qual è il principio del contenimento dei corridoi?",
          options: ["Mescolare aria fredda e calda per uniformare la temperatura.", "Separare fisicamente i flussi di aria fredda e calda per migliorare l'efficienza.", "Raffreddare solo le porte frontali dei rack."],
          answer: 1,
          explain: "Il contenimento impedisce all'aria fredda di mandata di mescolarsi con lo scarico caldo."
        }
      ]
    },
    {
      id: "m4",
      title: "Ridondanza: N, N+1 e 2N",
      kicker: "Progettare per il guasto",
      video: "https://www.youtube.com/watch?v=FWpWU9tiKs4",
      activity: "tiers",
      summary: "La ridondanza definisce la capacità di riserva che consente al data center di sopravvivere a guasti o manutenzioni senza interrompere i server. N è il numero minimo di componenti necessari per operare a pieno carico di progetto. Aggiungere unità di riserva o duplicare interi percorsi aumenta la resilienza e il CapEx. I Tier di Uptime Institute traducono queste topologie in classi di disponibilità.",
      tables: [
        {
          title: "Schemi di ridondanza",
          headers: ["Schema", "Descrizione", "Tolleranza ai guasti", "CapEx", "Tier tipico"],
          rows: [
            ["N", "Capacità esatta senza unità di riserva.", "Nessuna; qualsiasi guasto interrompe il servizio.", "Minimo", "Tier I"],
            ["N+1", "Un componente di backup aggiuntivo per sistema.", "Sopravvive alla perdita di un'unità.", "Moderato", "Tier II / III"],
            ["N+2", "Due componenti di backup aggiuntivi.", "Sopravvive a due guasti simultanei o successivi.", "Medio-alto", "Alta disponibilità"],
            ["2N", "Due sistemi indipendenti al 100% della capacità.", "Sopravvive alla perdita di un percorso completo.", "Alto", "Tier IV"],
            ["2(N+1)", "Due rami indipendenti, ciascuno con un'unità extra.", "Resilienza totale anche in manutenzione.", "Molto alto", "Hyperscale / cloud critico"],
            ["3N/2", "Tre sistemi di riserva che proteggono due carichi in modo incrociato.", "Alta efficienza di carico con resilienza.", "Ottimizzato", "Colocation"]
          ]
        },
        {
          title: "Classificazione per Tier (Uptime Institute)",
          headers: ["Tier", "Capacità", "Disponibilità"],
          rows: [
            ["Tier I", "Infrastruttura di base con un unico percorso non ridondante.", "99,671%"],
            ["Tier II", "Componenti ridondanti su un unico percorso.", "99,749%"],
            ["Tier III", "Manutenibile in modo concorrente: più percorsi, uno attivo e uno passivo.", "99,982%"],
            ["Tier IV", "Tollerante ai guasti: topologia 2N con percorsi attivi simultanei.", "99,995%"]
          ]
        }
      ],
      quiz: [
        {
          q: "Cosa significa la lettera N?",
          options: ["La capacità minima di progetto necessaria a sostenere il carico reale.", "Il numero di generatori presenti.", "Il budget di latenza di rete."],
          answer: 0,
          explain: "N è la capacità di base necessaria per operare a pieno carico di progetto."
        },
        {
          q: "Cosa definisce la certificazione Tier III?",
          options: ["Funzionare solo con energia rinnovabile.", "Manutenibilità concorrente senza interrompere il calcolo.", "Non avere alcun UPS."],
          answer: 1,
          explain: "Il Tier III consente di intervenire su qualsiasi componente mentre il carico IT continua a funzionare."
        },
        {
          q: "Se una sala richiede 4 moduli UPS e ne vengono installati 5 in parallelo, quale schema è?",
          options: ["N.", "N+1.", "2N."],
          answer: 1,
          explain: "Quattro richiesti più uno di riserva equivalgono a N+1."
        }
      ]
    },
    {
      id: "m5",
      title: "Sistemi elettrici",
      kicker: "Continuità per progetto",
      video: "https://www.youtube.com/watch?v=x7dxWbNoq8s",
      activity: "ups",
      summary: "I sistemi elettrici di mission critical proteggono i processori da interruzioni e fluttuazioni della rete esterna tramite strati di protezione fisica. L'UPS agisce come ammortizzatore elettrico dinamico tra la rete e i server. La topologia standard è la doppia conversione: il raddrizzatore trasforma l'AC instabile in DC per le batterie e l'inverter restituisce quella DC pulita come AC perfetta per il carico IT.",
      tables: [
        {
          title: "Fasi di un UPS a doppia conversione",
          headers: ["Fase", "Funzione"],
          rows: [
            ["Raddrizzatore", "Converte l'AC in ingresso in DC e mantiene carico il banco batterie."],
            ["Batterie", "Accumulano energia e forniscono DC istantaneamente quando la rete cade."],
            ["Inverter", "Converte la DC pulita in AC stabile e priva di rumore per i server."],
            ["Bypass statico", "Offre un percorso alternativo di rete grezza per manutenzione o sovraccarico."]
          ]
        }
      ],
      quiz: [
        {
          q: "Quali sono i tre blocchi interni principali di un UPS?",
          options: ["Raddrizzatore, batterie e inverter.", "Chiller, torre e pompa.", "Switchgear, PDU e rPDU."],
          answer: 0,
          explain: "La doppia conversione si basa su raddrizzatore, banco batterie e inverter."
        },
        {
          q: "Qual è il beneficio secondario dell'UPS oltre al backup?",
          options: ["Genera carburante diesel.", "Condiziona e stabilizza la qualità dell'energia.", "Elimina la necessità di raffreddamento."],
          answer: 1,
          explain: "La doppia conversione isola il carico da cali, picchi e rumore."
        },
        {
          q: "Quale combustibile alimenta il backup di lungo periodo?",
          options: ["Solo gas naturale.", "Diesel per i generatori.", "Acido delle batterie."],
          answer: 1,
          explain: "I generatori diesel sostengono il sito durante blackout prolungati."
        }
      ]
    },
    {
      id: "m6",
      title: "UPS in profondità",
      kicker: "Batterie e trasferimento",
      video: "https://www.youtube.com/watch?v=uz6unYab6G0",
      activity: "scope",
      summary: "Durante un blackout generale il raddrizzatore dell'UPS perde l'ingresso. Le batterie forniscono istantaneamente DC all'inverter e mantengono i server accesi senza un solo millisecondo di sfarfallio. Questo ponte dura da 15 secondi a 15 minuti, il tempo necessario ai generatori per avviarsi, stabilizzarsi e assumere il carico. La chimica di quel ponte sta cambiando: il litio-ione sostituisce il piombo-acido.",
      tables: [
        {
          title: "Batterie VRLA vs litio-ione",
          headers: ["Parametro", "VRLA (piombo-acido)", "Litio-ione"],
          rows: [
            ["Densità energetica", "Bassa; richiede ampi locali e rinforzi strutturali.", "Molto alta; riduce l'ingombro fisico fino al 60%."],
            ["Vita utile", "Breve; sostituzione ogni 3–5 anni.", "Lunga; tipicamente oltre 10–15 anni."],
            ["Manutenzione", "Alta; richiede controlli manuali delle celle.", "Bassa; gestione automatica tramite BMS integrato."],
            ["CapEx iniziale", "Basso ed economico nel breve periodo.", "Elevato, compensato da un costo di ciclo di vita inferiore."]
          ]
        }
      ],
      quiz: [
        {
          q: "Quale componente dell'UPS converte la DC delle batterie in AC utilizzabile?",
          options: ["Il raddrizzatore.", "L'inverter.", "L'interruttore statico."],
          answer: 1,
          explain: "L'inverter riporta la DC delle batterie o del raddrizzatore in AC."
        },
        {
          q: "Perché il litio-ione sta sostituendo il piombo-acido VRLA?",
          options: ["Ingombro minore, vita più lunga e manutenzione ridotta.", "Non richiede alcuna gestione della batteria.", "Funziona senza inverter."],
          answer: 0,
          explain: "Il litio-ione offre densità superiore, vita più lunga e monitoraggio automatico."
        },
        {
          q: "Cosa accade visivamente al carico IT durante il passaggio alle batterie?",
          options: ["Niente; il flusso di corrente resta continuo e trasparente.", "Tutti i server si riavviano subito.", "Le luci sfarfallano per un secondo."],
          answer: 0,
          explain: "La doppia conversione rende il trasferimento trasparente per i server."
        }
      ]
    },
    {
      id: "m7",
      title: "Contenimento dei corridoi",
      kicker: "Gestire i flussi d'aria",
      video: "https://www.youtube.com/watch?v=qzTpqpHnRdU",
      activity: "containment",
      summary: "La gestione dei flussi d'aria nella sala bianca è cruciale per l'efficienza del raffreddamento. L'obiettivo è impedire fisicamente che l'aria fredda di mandata si mescoli con lo scarico caldo. I server sono disposti fronte contro fronte e retro contro retro, creando corridoi freddi in ingresso e corridoi caldi in uscita. Il contenimento sigilla uno di questi corridoi con porte, pannelli e soffitti.",
      tables: [
        {
          title: "Strategie di contenimento",
          headers: ["Criterio", "Corridoio freddo", "Corridoio caldo"],
          rows: [
            ["Meccanica", "Soffitti e porte racchiudono il corridoio frontale; l'aria fredda resta in un corridoio pressurizzato.", "Il corridoio posteriore viene sigillato e l'aria calda va direttamente al ritorno a soffitto."],
            ["Vantaggi", "Semplice ed economico da implementare nei data center esistenti.", "Massima efficienza termodinamica, ritorno ad alta temperatura e sala confortevole."],
            ["Svantaggi", "Il resto della sala aperta diventa caldo per i tecnici.", "Maggiore complessità ingegneristica e integrazione rigorosa con l'antincendio."],
            ["Uso consigliato", "Retrofit e sale a densità bassa o media.", "Sale ad alta densità e IA."]
          ]
        }
      ],
      quiz: [
        {
          q: "Qual è il principale svantaggio della miscelazione dei flussi d'aria?",
          options: ["Migliora la ridondanza.", "Riduce l'efficienza del raffreddamento e aumenta il consumo dei ventilatori.", "Abbassa automaticamente il PUE."],
          answer: 1,
          explain: "La miscelazione costringe chiller e ventilatori a lavorare di più per la stessa temperatura in ingresso."
        },
        {
          q: "Quale contenimento è preferito nei centri ad alta densità e IA?",
          options: ["Contenimento del corridoio freddo.", "Contenimento del corridoio caldo.", "Nessun contenimento."],
          answer: 1,
          explain: "Il corridoio caldo offre la migliore termodinamica per i rack densi."
        },
        {
          q: "Quali elementi fisici sigillano le estremità dei corridoi?",
          options: ["Porte scorrevoli e barriere di flusso o pannelli di soffitto.", "Solo passerelle portacavi.", "Solo piastrelle del pavimento tecnico."],
          answer: 0,
          explain: "Porte, pannelli di estremità e soffitto chiudono il corridoio contenuto."
        }
      ]
    },
    {
      id: "m8",
      title: "Impianti ad acqua refrigerata",
      kicker: "Tre circuiti idraulici",
      video: "https://www.youtube.com/watch?v=rUiYdpODxJI",
      activity: "chilledwater",
      summary: "I grandi data center sostituiscono i sistemi diretti a refrigerante con circuiti idraulici centralizzati. L'acqua refrigerata è il mezzo fisico usato per trasportare e dissipare megawatt di carico termico. Tre circuiti collaborano: il circuito interno CRAH assorbe calore dalla sala bianca, la centrale chiller lo rimuove dall'acqua e il circuito di condensazione lo rigetta in atmosfera tramite le torri.",
      tables: [
        {
          title: "I tre circuiti idraulici",
          headers: ["Circuito", "Ruolo"],
          rows: [
            ["Circuito interno CRAH", "L'aria calda passa sulle batterie CRAH; il calore si trasferisce all'acqua, che torna alla centrale."],
            ["Centrale chiller", "L'acqua tiepida entra nell'evaporatore; il ciclo frigorifero rimuove il calore e rimanda acqua refrigerata."],
            ["Circuito di rigetto", "Il chiller trasferisce calore all'acqua di condensazione, che viaggia verso le torri esterne."]
          ]
        }
      ],
      quiz: [
        {
          q: "Qual è il vantaggio dell'acqua rispetto ai refrigeranti DX su larga scala?",
          options: ["Consente un controllo centralizzato ed efficiente di carichi termici enormi.", "Elimina la necessità delle torri di raffreddamento.", "Elimina le unità CRAH."],
          answer: 0,
          explain: "Gli impianti ad acqua centralizzano il raffreddamento e scalano efficientemente ai megawatt."
        },
        {
          q: "Quale unità assorbe calore dall'aria interna della sala server?",
          options: ["La torre di raffreddamento.", "L'unità CRAH.", "Lo switchgear."],
          answer: 1,
          explain: "Le unità CRAH scambiano calore tra l'aria di sala e il circuito dell'acqua refrigerata."
        },
        {
          q: "Perché si progettano circuiti di tubazioni ridondanti?",
          options: ["Per garantire il flusso di acqua refrigerata anche se un tubo o una valvola si guasta.", "Per aumentare la temperatura dell'acqua.", "Per ridurre le pompe a una sola."],
          answer: 0,
          explain: "Tubazioni e pompe ridondanti mantengono la portata durante guasti o manutenzione."
        }
      ]
    },
    {
      id: "m9",
      title: "Unità CRAC vs CRAH",
      kicker: "Stesso armadio, fisica diversa",
      video: "https://www.youtube.com/watch?v=0h7xFUx4dNU",
      activity: "assembly",
      summary: "Nonostante l'estetica esterna identica — armadi modulari perimetrali con grandi ventilatori — le unità CRAC e CRAH rappresentano filosofie meccaniche completamente diverse. La CRAC genera il freddo all'interno con un proprio compressore e circuito refrigerante. La CRAH contiene solo una batteria ad acqua refrigerata, valvole e ventilatori, e dipende da una centrale esterna.",
      tables: [
        {
          title: "Confronto ingegneristico delle unità perimetrali",
          headers: ["Attributo", "CRAC", "CRAH"],
          rows: [
            ["Meccanica interna", "Compressori dedicati, valvola di espansione e linee refrigerante.", "Solo batteria ad acqua refrigerata, ventilatori modulari e valvole di controllo."],
            ["Principio di funzionamento", "Espansione diretta (DX): genera freddo meccanicamente dentro l'unità.", "Semplice scambio termico: dipende dall'acqua refrigerata pompata dalla centrale."],
            ["Applicazione tipica", "Piccole sale dati, sale TLC e nodi edge.", "Data center di grandi dimensioni, hyperscale e cloud pubblico."],
            ["Efficienza energetica", "Inferiore su larga scala per la somma di compressori indipendenti.", "Molto alta; ottimizzata con ventilatori EC e controllo centralizzato."]
          ]
        }
      ],
      quiz: [
        {
          q: "Quale componente critico differenzia internamente una CRAC da una CRAH?",
          options: ["Il compressore del refrigerante.", "Il filtro dell'aria.", "Il ventilatore di mandata."],
          answer: 0,
          explain: "Il compressore è ciò che rende la CRAC una macchina a espansione diretta."
        },
        {
          q: "Cosa significa CRAH?",
          options: ["Computer Room Air Handler.", "Critical Rack Air Humidifier.", "Cooling Return Air Housing."],
          answer: 0,
          explain: "CRAH sta per Computer Room Air Handler."
        },
        {
          q: "Perché le unità CRAH sono comuni negli impianti hyperscale?",
          options: ["Offrono efficienza superiore se integrate con centrali ad acqua.", "Includono un proprio generatore diesel.", "Non richiedono ventilatori."],
          answer: 0,
          explain: "Centrali ad acqua refrigerata e unità CRAH scalano in modo efficiente."
        }
      ]
    },
    {
      id: "m10",
      title: "Aria vs acqua",
      kicker: "PUE, WUE e clima",
      video: "https://www.youtube.com/watch?v=4BRcXRfxs1g",
      activity: "eco",
      summary: "L'architettura della centrale determina come il sito rigetta il carico termico all'esterno e definisce l'equilibrio ecologico tra energia elettrica e acqua. Il PUE confronta l'energia totale dell'edificio con quella dell'IT: 1,2 è eccellente, mentre 2,0 indica che il sito spende in supporto quanto in calcolo. Il WUE misura i litri d'acqua consumati per ogni kWh IT.",
      tables: [
        {
          title: "Confronto delle centrali di raffreddamento",
          headers: ["Variabile", "Centrale ad aria", "Centrale ad acqua"],
          rows: [
            ["Apparecchiature esterne", "Chiller raffreddati ad aria con grandi ventilatori assiali o dry cooler.", "Chiller centralizzati accoppiati a torri di raffreddamento evaporative."],
            ["Consumo d'acqua", "Nullo o trascurabile; ideale dove l'acqua scarseggia.", "Elevato per l'evaporazione continua nelle torri."],
            ["Efficienza elettrica", "Inferiore nelle estati molto calde, con aumento del PUE.", "Molto alta e stabile tutto l'anno, con PUE basso."],
            ["Complessità e manutenzione", "Bassa complessità meccanica e nessuna chimica complessa dell'acqua.", "Alta complessità operativa con controlli chimici giornalieri contro la corrosione."]
          ]
        }
      ],
      quiz: [
        {
          q: "Qual è il valore PUE ideale teorico?",
          options: ["1,0, dove il 100% dell'energia raggiunge il carico IT.", "2,0, dove il supporto equivale all'IT.", "0,5, dove l'IT usa metà dell'energia."],
          answer: 0,
          explain: "Un PUE di 1,0 significa nessun sovraccosto: tutta l'energia serve al calcolo."
        },
        {
          q: "Qual è il principale beneficio degli impianti ad aria?",
          options: ["Conservano l'acqua perché non la usano per il rigetto del calore.", "Hanno sempre un PUE inferiore agli impianti ad acqua.", "Richiedono più trattamento chimico."],
          answer: 0,
          explain: "Gli impianti ad aria evitano il consumo d'acqua per evaporazione."
        },
        {
          q: "In cosa consiste il funzionamento con economizzatore o free cooling?",
          options: ["Sfruttare le basse temperature esterne per raffreddare l'acqua senza compressori.", "Spegnere tutto il raffreddamento di notte.", "Usare le batterie per alimentare i chiller."],
          answer: 0,
          explain: "Quando l'esterno è abbastanza freddo, l'impianto rigetta calore senza refrigerazione meccanica."
        }
      ]
    }
  ]
};
