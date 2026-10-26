/* Data Center desde 0 — English module content */
window.CONTENT = window.CONTENT || {};
window.CONTENT.en = {
  modules: [
    {
      id: "m1",
      title: "How Data Centers Actually Work",
      kicker: "Energy conversion, 24/7",
      video: "https://www.youtube.com/watch?v=cTwvUqLNQrM",
      activity: "layers",
      summary: "From an engineering perspective, a data center is a building dedicated to energy conversion: it stores, processes and distributes digital information. Unlike office computers, servers run 24/7/365, and almost every watt that enters the facility is eventually converted into heat that must be removed continuously. The entire design rests on three concurrent pillars: continuous power, continuous cooling and concurrent maintainability.",
      tables: [
        {
          title: "Office building vs data center",
          headers: ["Attribute", "Commercial office", "Data center"],
          rows: [
            ["Load profile", "Variable and intermittent; drops at night and on weekends.", "Constant, massive and close to 100% of design demand."],
            ["Cooling objective", "Human comfort, typically 22–24 °C.", "Hardware survival and thermal stability."],
            ["Outage tolerance", "High; an outage causes discomfort, not immediate critical loss.", "None; a millisecond interruption can cause global outages and data corruption."],
            ["Base infrastructure", "Standard commercial mechanical and electrical systems.", "Heavy redundant layers: generators, UPS, N+1 or 2N chillers."]
          ]
        }
      ],
      quiz: [
        {
          q: "What is the main function of a data center from an engineering perspective?",
          options: ["Hosting intermittent office terminals.", "Acting as an energy-conversion building: power in, computing, heat out.", "Serving only as a wireless interconnection point for city networks."],
          answer: 1,
          explain: "The facility converts electrical energy into computation and, ultimately, into heat that must be removed continuously."
        },
        {
          q: "What happens if cooling stops completely?",
          options: ["Servers keep working indefinitely without consequences.", "The hardware suffers thermal stress and shuts down for protection.", "The UPS automatically cools the room with battery energy."],
          answer: 1,
          explain: "Heat generation is continuous. Without cooling, inlet temperatures rise within minutes and equipment throttles or shuts down."
        },
        {
          q: "What are the three pillars of physical infrastructure?",
          options: ["Electrical systems, mechanical cooling and monitoring/control.", "Networking, storage and virtual machines.", "Firewalls, backups and user accounts."],
          answer: 0,
          explain: "Power, cooling and control must all operate concurrently for the data center to stay online."
        }
      ]
    },
    {
      id: "m2",
      title: "Power Flow",
      kicker: "From the grid to the server",
      video: "https://www.youtube.com/watch?v=Y_8P3wzxsqY",
      activity: "powerflow",
      summary: "Power flow is the electrical road map of the data center. It guarantees a controlled transformation from the public high-voltage network down to the electronics inside each server, while maintaining absolute continuity. Redundancy starts at the utility entrance and repeats at every distribution stage: switchgear, transformers, generators, UPS, switchboards, PDUs, remote panels and intelligent rack PDUs.",
      tables: [
        {
          title: "Electrical architecture components",
          headers: ["Component", "Primary function and operational impact"],
          rows: [
            ["Utility", "The electric company supply network: nuclear, gas, hydro or solar generation."],
            ["Transmission", "High-voltage, low-current transport that reduces resistive losses over distance."],
            ["Switchgear", "Entrance point with overcurrent protection, metering and grid isolation."],
            ["Transformer", "Steps medium voltage down (12–34.5 kV) to the building distribution level (480 V)."],
            ["Generator", "Diesel backup engines that take the full load during prolonged grid failures."],
            ["UPS", "Battery-based uninterruptible power supply: filters disturbances and covers the transition."],
            ["UPS SB", "Output switchboard that distributes the protected branches to the facility."],
            ["PDU", "Power distribution unit: transforms 480 V to IT levels such as 208 V or 415 V."],
            ["RPP", "Remote power panels that extend circuits with additional breakers in the white space."],
            ["rPDU", "Intelligent rack strips that energize servers and meter consumption per outlet."]
          ]
        }
      ],
      quiz: [
        {
          q: "Why is electricity transmitted at high voltage over long distances?",
          options: ["To increase the current and heat the cables.", "To reduce current and minimize line losses.", "To make the waveform cleaner for servers."],
          answer: 1,
          explain: "For the same power, higher voltage means lower current and therefore lower resistive losses."
        },
        {
          q: "What is the role of the ATS or paralleling switchgear?",
          options: ["Detect grid failures, start and synchronize generators and transfer the load.", "Convert AC into DC for the batteries.", "Distribute power directly to each server outlet."],
          answer: 0,
          explain: "The automatic transfer switch or paralleling gear coordinates the generator plant and the load transfer."
        },
        {
          q: "Which device directly energizes each individual server?",
          options: ["The chiller.", "The step-down transformer.", "The rPDU, or rack power distribution unit."],
          answer: 2,
          explain: "The rPDU sits inside the rack and feeds the servers while metering each outlet."
        }
      ]
    },
    {
      id: "m3",
      title: "Cooling Methods",
      kicker: "Air, liquid and density",
      video: "https://www.youtube.com/watch?v=iRLCUWbi0o4",
      activity: "cooling",
      summary: "As rack power density rises, cooling evolves from general room air toward liquid solutions applied directly at the heat source. Water and dielectric fluids have a far higher heat capacity than air, so they transport heat much more efficiently. For GPU and AI clusters the dominant recommendation is direct-to-chip liquid cooling, which allows warmer water temperatures and lets compressors stay off most of the year.",
      tables: [
        {
          title: "Cooling technologies by density",
          headers: ["Technology", "Typical density", "How it works"],
          rows: [
            ["Room-based air cooling", "3–5 kW/rack", "CRAC/CRAH units push cold air through a raised floor into open aisles."],
            ["Close-coupled air cooling", "10–20 kW/rack", "In-row units or rear-door heat exchangers move cooling next to the racks."],
            ["Direct-to-chip liquid cooling", "50–100+ kW/rack", "Cold plates on CPUs and GPUs carry heat away in a closed liquid loop."],
            ["Immersion cooling", "Very high", "Servers are fully submerged in non-conductive dielectric fluid, single or two-phase."]
          ]
        }
      ],
      quiz: [
        {
          q: "What drives the transition from air cooling to liquid cooling?",
          options: ["The radical increase in heat density per rack.", "The falling price of network switches.", "The need to reduce the number of servers."],
          answer: 0,
          explain: "Air cannot transport the heat generated by very dense racks efficiently enough."
        },
        {
          q: "Which method is preferred for AI-focused data centers?",
          options: ["Open-room air cooling.", "Direct-to-chip liquid cooling.", "Passive ventilation only."],
          answer: 1,
          explain: "Direct-to-chip liquid cooling is the reference design for high-density GPU clusters."
        },
        {
          q: "What is the principle of aisle containment?",
          options: ["Mixing cold and hot air to equalize temperature.", "Physically separating cold and hot air streams to improve efficiency.", "Cooling only the front doors of the racks."],
          answer: 1,
          explain: "Containment stops cold supply air from mixing with hot exhaust air."
        }
      ]
    },
    {
      id: "m4",
      title: "Redundancy: N, N+1 and 2N",
      kicker: "Designing for failure",
      video: "https://www.youtube.com/watch?v=FWpWU9tiKs4",
      activity: "tiers",
      summary: "Redundancy defines the reserve capacity that lets the data center survive failures or maintenance without interrupting the servers. N is the minimum number of components required to operate at full design load. Adding spare units, or duplicating entire distribution paths, increases resilience and capital cost. Uptime Institute tiers translate these topologies into availability classes.",
      tables: [
        {
          title: "Redundancy schemes",
          headers: ["Scheme", "Description", "Fault tolerance", "CapEx", "Typical tier"],
          rows: [
            ["N", "Exact installed capacity with no spare units.", "None; any failure interrupts service.", "Minimum", "Tier I"],
            ["N+1", "One additional backup component per system.", "Survives one unit failure.", "Moderate", "Tier II / III"],
            ["N+2", "Two additional backup components.", "Survives two simultaneous or successive failures.", "Medium-high", "High availability"],
            ["2N", "Two independent 100% capacity systems.", "Survives the loss of a complete distribution path.", "High", "Tier IV"],
            ["2(N+1)", "Two independent branches, each with one extra unit.", "Full resilience even during maintenance.", "Very high", "Hyperscale / cloud critical"],
            ["3N/2", "Three reserve systems protecting two loads crosswise.", "Optimized load efficiency with resilience.", "Optimized", "Colocation centers"]
          ]
        },
        {
          title: "Uptime Institute tiers",
          headers: ["Tier", "Capability", "Availability"],
          rows: [
            ["Tier I", "Basic infrastructure with a single non-redundant path.", "99.671%"],
            ["Tier II", "Redundant components on a single path.", "99.749%"],
            ["Tier III", "Concurrently maintainable: multiple paths, one active and one passive.", "99.982%"],
            ["Tier IV", "Fault tolerant: 2N topology with simultaneous active paths.", "99.995%"]
          ]
        }
      ],
      quiz: [
        {
          q: "What does the letter N mean?",
          options: ["The minimum design capacity required to carry the real load.", "The number of generators on site.", "The network latency budget."],
          answer: 0,
          explain: "N is the baseline capacity needed to operate at full design load."
        },
        {
          q: "What defines Tier III certification?",
          options: ["Running entirely on renewable energy.", "Concurrent maintainability without interrupting computing.", "Having no UPS at all."],
          answer: 1,
          explain: "Tier III allows any component to be serviced while the IT load keeps running."
        },
        {
          q: "If a room needs 4 UPS modules and 5 are installed in parallel, which scheme is it?",
          options: ["N.", "N+1.", "2N."],
          answer: 1,
          explain: "Four required plus one spare is N+1."
        }
      ]
    },
    {
      id: "m5",
      title: "Electrical Systems",
      kicker: "Continuity by design",
      video: "https://www.youtube.com/watch?v=x7dxWbNoq8s",
      activity: "ups",
      summary: "Mission-critical electrical systems protect processors from interruptions and fluctuations on the external grid through physical layers of protection. The UPS acts as a dynamic electrical buffer between the utility and the servers. The standard topology in large data centers is double conversion: a rectifier turns unstable AC into DC to feed the batteries, and an inverter turns that clean DC back into perfect AC for the IT load.",
      tables: [
        {
          title: "Double-conversion UPS stages",
          headers: ["Stage", "Function"],
          rows: [
            ["Rectifier", "Converts incoming AC into DC and keeps the battery bank charged."],
            ["Batteries", "Store energy and supply DC instantly when the grid fails."],
            ["Inverter", "Converts clean DC back into stable, noise-free AC for the servers."],
            ["Static bypass", "Provides an alternate raw-utility path for maintenance or overload."]
          ]
        }
      ],
      quiz: [
        {
          q: "What are the three main internal blocks of a UPS?",
          options: ["Rectifier, batteries and inverter.", "Chiller, cooling tower and pump.", "Switchgear, PDU and rPDU."],
          answer: 0,
          explain: "Double conversion relies on a rectifier, a battery bank and an inverter."
        },
        {
          q: "What is a secondary benefit of the UPS besides backup?",
          options: ["It generates diesel fuel.", "It conditions and stabilizes power quality.", "It removes the need for cooling."],
          answer: 1,
          explain: "The double-conversion process isolates the load from sags, spikes and noise."
        },
        {
          q: "What fuel feeds the long-term backup system?",
          options: ["Natural gas only.", "Diesel for the generators.", "Battery acid."],
          answer: 1,
          explain: "Diesel generators carry the site during prolonged grid outages."
        }
      ]
    },
    {
      id: "m6",
      title: "UPS Deep Dive",
      kicker: "Batteries and transfer",
      video: "https://www.youtube.com/watch?v=uz6unYab6G0",
      activity: "scope",
      summary: "During a general grid outage the UPS rectifier loses its input. The batteries instantly supply DC to the inverter, keeping servers on without a single millisecond of flicker. This bridge lasts from 15 seconds to 15 minutes, giving the mechanical generators time to start, stabilize and take the full load. The chemistry of that bridge is changing: lithium-ion is replacing lead-acid in modern facilities.",
      tables: [
        {
          title: "VRLA vs lithium-ion batteries",
          headers: ["Parameter", "VRLA (lead-acid)", "Lithium-ion"],
          rows: [
            ["Energy density", "Low; requires large rooms and structural reinforcement.", "Very high; cuts physical footprint by up to 60%."],
            ["Service life", "Short; replacement every 3–5 years.", "Long; typically more than 10–15 years."],
            ["Maintenance", "High; requires manual cell checks.", "Low; automated management through an integrated BMS."],
            ["Initial CapEx", "Low and economical in the short term.", "High, offset by a lower lifecycle cost."]
          ]
        }
      ],
      quiz: [
        {
          q: "Which UPS component converts battery DC into usable rack AC?",
          options: ["The rectifier.", "The inverter.", "The static switch."],
          answer: 1,
          explain: "The inverter turns DC from the batteries or rectifier back into AC."
        },
        {
          q: "Why is lithium-ion replacing lead-acid VRLA?",
          options: ["Smaller footprint, longer life and lower maintenance.", "It needs no battery management at all.", "It works without an inverter."],
          answer: 0,
          explain: "Lithium-ion offers higher density, longer service life and automated monitoring."
        },
        {
          q: "What happens visually to the IT load during the transfer to batteries?",
          options: ["Nothing; the current flow remains continuous and transparent.", "All servers reboot immediately.", "The lights flicker for one second."],
          answer: 0,
          explain: "Double conversion makes the transfer transparent to the servers."
        }
      ]
    },
    {
      id: "m7",
      title: "Hot vs Cold Aisle Containment",
      kicker: "Managing airflow",
      video: "https://www.youtube.com/watch?v=qzTpqpHnRdU",
      activity: "containment",
      summary: "Airflow management inside the white space is critical for cooling efficiency. The goal is to physically prevent cold supply air from mixing with hot exhaust air. Servers are arranged front to front and back to back, creating cold aisles at the intakes and hot aisles at the exhausts. Containment seals one of those aisles with doors, panels and ceilings.",
      tables: [
        {
          title: "Containment strategies",
          headers: ["Criterion", "Cold aisle containment", "Hot aisle containment"],
          rows: [
            ["Mechanics", "Ceilings and doors enclose the front aisle; cold air stays in a pressurized corridor.", "The rear exhaust aisle is sealed and hot air is drawn straight to the ceiling return."],
            ["Advantages", "Simple and economical to retrofit into existing data centers.", "Maximum thermodynamic efficiency, high return temperatures and a comfortable room."],
            ["Disadvantages", "The rest of the open room becomes hot, reducing comfort for technicians.", "More complex engineering and strict integration with fire-suppression systems."],
            ["Best use", "Retrofit and low-to-medium density halls.", "High-density and AI halls."]
          ]
        }
      ],
      quiz: [
        {
          q: "What is the main penalty of mixing airflow?",
          options: ["It improves redundancy.", "It reduces cooling efficiency and raises ventilation energy use.", "It lowers the PUE automatically."],
          answer: 1,
          explain: "Mixing forces chillers and fans to work harder to deliver the same inlet temperature."
        },
        {
          q: "Which containment is preferred in high-density and AI centers?",
          options: ["Cold aisle containment.", "Hot aisle containment.", "No containment."],
          answer: 1,
          explain: "Hot aisle containment delivers better thermodynamics for dense racks."
        },
        {
          q: "What physical elements seal the ends of the aisles?",
          options: ["Sliding doors and flow barriers or ceiling panels.", "Cable trays only.", "Raised floor tiles only."],
          answer: 0,
          explain: "Doors, end panels and roof panels close the contained corridor."
        }
      ]
    },
    {
      id: "m8",
      title: "Chilled Water Systems",
      kicker: "Three hydraulic loops",
      video: "https://www.youtube.com/watch?v=rUiYdpODxJI",
      activity: "chilledwater",
      summary: "Large data centers replace direct refrigerant systems with centralized hydraulic circuits. Chilled water is the physical medium used to transport and dissipate megawatts of thermal load. Three loops cooperate: the internal CRAH loop absorbs heat from the white space, the chiller plant removes it from the water, and the exterior condenser loop rejects it to the atmosphere through cooling towers.",
      tables: [
        {
          title: "The three hydraulic circuits",
          headers: ["Circuit", "Role"],
          rows: [
            ["Internal CRAH loop", "Hot room air passes over the CRAH coils; heat transfers to the water, which returns to the plant."],
            ["Chiller plant", "Warm water enters the evaporator; the refrigeration cycle removes heat and sends chilled water back."],
            ["Heat rejection loop", "The chiller transfers heat to condenser water, which travels to exterior cooling towers."]
          ]
        }
      ],
      quiz: [
        {
          q: "What is the advantage of water over DX refrigerants at scale?",
          options: ["It allows centralized and efficient control of massive heat loads.", "It eliminates the need for cooling towers.", "It removes the need for CRAH units."],
          answer: 0,
          explain: "Water-based plants centralize cooling and scale efficiently to megawatts."
        },
        {
          q: "Which unit absorbs heat from the internal server-room air?",
          options: ["The cooling tower.", "The CRAH air handler.", "The switchgear."],
          answer: 1,
          explain: "CRAH units exchange heat between room air and the chilled water loop."
        },
        {
          q: "Why are redundant piping loops designed into the hydraulic circuit?",
          options: ["To guarantee chilled water flow even if a pipe or valve fails.", "To increase the water temperature.", "To reduce the number of pumps to one."],
          answer: 0,
          explain: "Redundant piping and pumps preserve flow during failures or maintenance."
        }
      ]
    },
    {
      id: "m9",
      title: "CRAC vs CRAH Units",
      kicker: "Same cabinet, different physics",
      video: "https://www.youtube.com/watch?v=0h7xFUx4dNU",
      activity: "assembly",
      summary: "Despite their identical exterior — modular perimeter cabinets with large supply fans — CRAC and CRAH units represent completely different mechanical philosophies. A CRAC generates cooling inside the unit with its own compressor and refrigerant circuit. A CRAH contains only a chilled-water coil, valves and fans, and depends on a central plant outside the room.",
      tables: [
        {
          title: "Perimeter unit engineering comparison",
          headers: ["Attribute", "CRAC", "CRAH"],
          rows: [
            ["Internal mechanics", "Dedicated compressors, expansion valve and refrigerant lines.", "Chilled-water coil, modular fans and control valves only."],
            ["Operating principle", "Direct expansion (DX): generates cooling mechanically inside the unit.", "Simple heat exchange: depends on chilled water pumped from a central plant."],
            ["Typical application", "Small data rooms, telecom rooms and edge nodes.", "Large, hyperscale and public-cloud data centers."],
            ["Energy efficiency", "Lower at scale because of multiple independent compressors.", "Very high; optimized with EC fans and centralized control."]
          ]
        }
      ],
      quiz: [
        {
          q: "Which critical component differentiates a CRAC from a CRAH internally?",
          options: ["The refrigerant compressor.", "The air filter.", "The supply fan."],
          answer: 0,
          explain: "The compressor is what makes a CRAC a direct-expansion machine."
        },
        {
          q: "What does CRAH stand for?",
          options: ["Computer Room Air Handler.", "Critical Rack Air Humidifier.", "Cooling Return Air Housing."],
          answer: 0,
          explain: "CRAH stands for Computer Room Air Handler."
        },
        {
          q: "Why are CRAH units common in hyperscale facilities?",
          options: ["They offer higher efficiency when integrated with central water plants.", "They include their own diesel generator.", "They do not need any fans."],
          answer: 0,
          explain: "Central chilled-water plants plus CRAH units scale efficiently."
        }
      ]
    },
    {
      id: "m10",
      title: "Air Cooled vs Water Cooled",
      kicker: "PUE, WUE and climate",
      video: "https://www.youtube.com/watch?v=4BRcXRfxs1g",
      activity: "eco",
      summary: "The central plant architecture determines how the site rejects its total thermal load to the outside and defines the ecological balance between electrical energy and water. PUE compares total building energy with IT energy: 1.2 is excellent, while 2.0 means the facility spends as much on support as on computing. WUE measures liters of water consumed per IT kWh.",
      tables: [
        {
          title: "Central plant comparison",
          headers: ["Variable", "Air-cooled plant", "Water-cooled plant"],
          rows: [
            ["Outdoor equipment", "Air-cooled chillers with large axial fans or dry coolers.", "Centralized chillers coupled to evaporative cooling towers."],
            ["Water consumption", "Zero or negligible; ideal where water is scarce.", "High, due to continuous evaporation in the towers."],
            ["Electrical efficiency", "Lower in very hot summers, which raises site PUE.", "Very high and stable year-round, keeping PUE low."],
            ["Complexity and maintenance", "Low mechanical complexity and no complex water chemistry.", "High operational complexity with daily chemical controls against corrosion."]
          ]
        }
      ],
      quiz: [
        {
          q: "What is the ideal theoretical PUE value?",
          options: ["1.0, where 100% of the energy reaches the IT load.", "2.0, where support equals IT.", "0.5, where IT uses half the energy."],
          answer: 0,
          explain: "PUE of 1.0 means no overhead at all: all energy is used for computing."
        },
        {
          q: "What is the main benefit of air-cooled plants?",
          options: ["They conserve water because no water is used for heat rejection.", "They always have a lower PUE than water-cooled plants.", "They require the most chemical treatment."],
          answer: 0,
          explain: "Air-cooled plants avoid evaporative water consumption."
        },
        {
          q: "What is free cooling or economizer operation?",
          options: ["Using cold outdoor temperatures to cool water without running compressors.", "Turning off all cooling equipment at night.", "Using batteries to power the chillers."],
          answer: 0,
          explain: "When outside air is cold enough, the plant can reject heat without mechanical refrigeration."
        }
      ]
    }
  ]
};
