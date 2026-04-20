# Proyectos Destacados para Portfolio Profesional

Estos son los proyectos que recomiendo mostrar como carta de presentación profesional. Cada uno demuestra habilidades específicas y valiosas en el mercado actual.

---

## ⭐ play-portfolio-playground

**Portfolio interactivo de juegos clásicos** - El proyecto más completo y profesional del grupo.

### Lo que demuestra
- Capacidad de construir interfaces interactivas y atractivas
- Manejo de estado complejo (game state, high scores)
- Arquitectura limpia y escalable
- Dominio de React con TypeScript
- UI/UX pulida con Tailwind + shadcn/ui

### Tech Stack
```
React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + React Router + Framer Motion
```

### Características destacadas
- 🎮 Múltiples juegos (Tic Tac Toe, 2048, Flappy Bird)
- 🌙 Dark/Light mode
- 🏆 Sistema de high scores
- 📱 Diseño responsive
- ♿ Accesibilidad con Radix UI

### Live Demo
👉 https://rassebas1.github.io/play-portfolio-playground/

### Estructura profesional
```
src/
├── games/[game-name]/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── constants/
├── components/ui/        # Componentes shadcn/ui
├── hooks/                # Custom hooks globales
├── lib/                  # Utilidades
└── pages/                # Rutas
```

### ¿Por qué es impressive?
Cada juego es un módulo independiente con su propia arquitectura interna. Demuestra que sabés separar responsabilidades, manejar estado con hooks, y construir componentes reutilizables. Además, tener una **live demo pública** es un diferenciador enorme.

---

## 🦋 pokedex

**Pokédex Angular Edition** - Aplicación web completa con arquitectura empresarial y características avanzadas.

### Lo que demuestra
- Dominio de Angular 21 con Signals y Standalone Components
- State management reactivo con señales (sin NgRx boilerplate)
- Zoneless Change Detection (experimental, ~30KB menos de bundle)
- Patrones de arquitectura limpia y escalable
- Integración con APIs externas (PokéAPI v2)
- Testing con Vitest y cobertura de código
- CI/CD con GitHub Actions
- UI responsive mobile-first con TailwindCSS
- `@defer` views para optimización de carga

### Tech Stack
```
Angular 21 + TypeScript 5.x + TailwindCSS v3 + Signals + Zoneless + Vitest + PokéAPI v2
```

### Características implementadas
- 🔍 **Búsqueda y exploración** - Busca por nombre o navega los 1025+ Pokémon
- 📊 **Type Effectiveness Heatmap** - Matriz interactiva 18x18 de tipos
- ⚔️ **Battle Simulator** - Batallas por turnos con fórmula de daño Gen IX real
- 🏠 **Team Builder** - Construí equipos de 6 Pokémon con análisis de coverage
- 🛡️ **Role Advisor** - Detecta roles competitivos (Sweeper, Wall, Support, Pivot)
- 🌳 **Evolution Explorer** - Árbol evolutivo interactivo
- 🎲 **Random Encounter** - Descubrí un Pokémon aleatorio con animación
- 📅 **Pokémon of the Day** - Pokémon diaria única por fecha

### Live Demo
👉 https://pokedex-pi-ochre-85.vercel.app/

### Features técnicas destacadas

| Feature | Descripción |
|---------|-------------|
| **Signal-based Cache** | Sistema de cache con Signals que evita llamadas API duplicadas |
| **Damage Formula** | Calculadora de daño oficial Gen IX (testeada unitariamente) |
| **Coverage Matrix** | Análisis ofensivo/defensivo del equipo en tiempo real |
| **Type Engine** | Utilidades puras para efectividad de tipos (100% testable) |
| **LocalStorage Persistence** | Equipos guardados automáticamente |
| **@defer Views** | Carga diferida de componentes pesados |

### Estructura profesional
```
src/app/
├── core/
│   ├── stores/                    # Global stores (cache, type chart)
│   └── services/                  # Servicios singleton
├── features/
│   ├── pokedex/                   # Grid y búsqueda
│   ├── detail/                    # Detalle de Pokémon
│   ├── analytics/                 # Type chart, comparador
│   ├── team-builder/              # Constructor de equipos
│   ├── discovery/                 # Evolución, búsqueda smart
│   └── battle/                    # Simulador de batallas
├── shared/
│   ├── components/                # Componentes reutilizables
│   ├── models/                    # Interfaces TypeScript
│   ├── utils/                     # Funciones puras
│   └── constants/                 # Constantes de la app
└── app.routes.ts                  # Rutas lazy-loaded
```

### Documentación profesional
- **Feature Plan** (1200+ líneas) - Arquitectura detallada con fases de implementación
- **Angular Guidelines** (1400+ líneas) - Estándares de código, patrones, i18n, a11y

### ¿Por qué es impressive?
Este proyecto demuestra que sabés trabajar con las últimas features de Angular (Signals, Standalone, Zoneless, @defer), entendés arquitecturas de estado reactivo sin sobreingeniería, y sabés construir aplicaciones completas con estándares profesionales. Además, tener documentación extensa muestra que te importa el mantenimiento a largo plazo.

---

## 🦋 spark-ecosystem-cluster

**Cluster completo del ecosistema Big Data** - Para roles de Data Engineering o Backend con enfoque en datos.

### Lo que demuestra
- Conocimiento profundo de arquitecturas distribuidas
- Docker y orquestación de contenedores
- Apache Spark (master + workers)
- Kafka para streaming de datos
- Airflow para orquestación de workflows
- Hive Metastore + PostgreSQL
- Monitoring con Prometheus y Grafana

### Tech Stack
```
Docker Compose + Apache Spark + Kafka + Airflow + Hive + PostgreSQL + LocalStack + RabbitMQ + Jupyter + Superset
```

### Servicios disponibles
| Servicio | Puerto | Propósito |
|----------|--------|-----------|
| Spark Master | 9090 | Cluster management |
| Spark Workers | 9091/9093 | Procesamiento distribuido |
| Kafka | 9092 | Message streaming |
| Airflow | 8080 | Orquestación de DAGs |
| Jupyter | 8888 | Notebooks PySpark |
| Superset | 8081 | Visualización de datos |
| Grafana | 3000 | Dashboards |
| Prometheus | 19090 | Métricas |

### ¿Por qué es impressive?
No es solo "saber Docker". Es entender cómo funcionan los sistemas distribuidos, saber configurar un cluster de Spark desde cero, y comprender el ecosistema de datos moderno. Esto te posiciona para roles de:
- Data Engineer
- ML Engineer
- Backend Developer con enfoque en datos

---

## 🤖 project-abyss

**AI Studio App con Gemini** - Demuestra integración con APIs de AI.

### Lo que demuestra
- Integración con LLMs (Gemini API)
- Angular moderno (standalone components, signals)
- Configuración de entorno seguro con API keys
- Patrones de Angular 18+

### Tech Stack
```
Angular 18 + Gemini API + TypeScript
```

### Setup requerido
```bash
npm install
# Agregar GEMINI_API_KEY en .env.local
npm run dev
```

### ¿Por qué es impressive?
Muestra que entendés el paradigma actual de AI integration. No es solo "usar ChatGPT", sino saber integrar APIs de AI en una aplicación real, manejar keys de forma segura, y construir interfaces que consuman servicios de ML.

---

## 📊 Comparativa para tu CV

| Proyecto | Rol ideal | Habilidad principal |
|----------|-----------|---------------------|
| play-portfolio-playground | Frontend Dev | UI interactiva, React, UX |
| pokedex | Angular Dev | Signals, Standalone, arquitectura empresa |
| spark-ecosystem-cluster | Data Engineer | Sistemas distribuidos, Big Data |
| project-abyss | Full Stack / AI Dev | Integración AI, APIs |

### Mi recomendación

**Para roles de Angular/Frontend:**
> "Desarrollé una Pokédex SPA con Angular 21 utilizando las últimas features: Signals para state management, Standalone Components, Zoneless change detection y @defer views. Implementé un sistema de cache con Signals que evita el 80% de llamadas API duplicadas, un battle simulator con la fórmula de daño oficial de Gen IX, y un team builder con análisis de coverage en tiempo real. Incluye documentación técnica de +2500 líneas y CI/CD con GitHub Actions."

**Para frontend roles (React):**
> "Desarrollé un portfolio de juegos interactivos con React, TypeScript y Tailwind. Implementé arquitectura modular con componentes reutilizables, estado con hooks, y diseñé una UI accesible con Radix UI. Desplegado en GitHub Pages con más de X juegos implementados."

**Para data roles:**
> "Configuré un cluster local con Apache Spark, Kafka y Airflow usando Docker Compose. El entorno incluye Jupyter para PySpark, Superset para visualización, y Prometheus para monitoreo. Ideal para desarrollar y testear pipelines de datos."

**Para roles de AI/ML:**
> "Integré Gemini API en una aplicación Angular para crear interfaces conversacionales. Manejo de API keys, configuración de entorno, y arquitectura para consumir servicios de AI."

---

## Proyectos secundarios (no descartar)

- **country-app**: App Angular básica - buen ejemplo de Angular fundamentals
- **poe-sim**: Si lo terminás, es muy interesante para game dev
- **alma-commerce**: Base para e-commerce, expandible

Estos pueden completar tu portfolio pero los principales son los que más van a destacar en una entrevista técnica.