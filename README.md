# AXIOM SMART WARDROBE

### Intelligent Wardrobe Management · Context-Aware Outfit Recommendations · Virtual Try-On

Axiom Smart Wardrobe is an intelligent wardrobe management platform that combines modern web technologies, IoT concepts, contextual outfit recommendations, and virtual try-on workflows to simplify everyday clothing decisions.

The project aims to bridge the gap between a physical wardrobe and a digital intelligence layer, helping users organize garments, explore outfit combinations, and make more informed clothing choices.

---

##  Key Features

- **Digital Wardrobe:** Organize garments by category, color, formality, and other relevant attributes.
- **RFID/NFC Integration Concept:** Demonstrates how physical garments can be identified and associated with digital inventory records.
- **Context-Aware Recommendations:** Generate outfit combinations using garment properties, weather context, and wear history.
- **Three-Day Non-Repeat Rule:** Incorporates a rule designed to reduce repetitive outfit recommendations.
- **Wear History & Archive:** Maintain a historical view of garment and outfit usage.
- **Style Lab:** Explore and compose outfits using tops, bottoms, footwear, and accessories.
- **Virtual Try-On (VTO):** Provides an interactive outfit-visualization workflow using the project's computer-vision integration.
- **Interactive Interface:** A dark, industrial-inspired interface featuring restrained metallic-gold accents, technical visualizations, and motion effects.

##  Application Modules

| Module | Description |
|---|---|
| Command Center | Main dashboard and entry point for wardrobe operations |
| Inventory | Digital garment catalog and inventory management |
| Archive | Historical wardrobe usage and wear timeline |
| Style Lab | Outfit composition, compatibility exploration, and virtual try-on |

##  System Architecture

Axiom follows a modular architecture that connects wardrobe data, contextual processing, recommendation logic, and user-facing visualization.

```text
       PHYSICAL WARDROBE
               |
        RFID / NFC Layer
          (Simulated)
               |
               v
       DIGITAL INVENTORY
               |
       +-------+--------+
       |                |
       v                v
 Weather / Context   Wear History
       |                |
       +-------+--------+
               |
               v
     RECOMMENDATION ENGINE
               |
               v
       OUTFIT GENERATION
               |
               v
       STYLE LAB / VTO
               |
               v
       USER INTERFACE
```

The diagram represents the intended workflow. Physical RFID hardware integration and the maturity of individual computer-vision features depend on the current implementation.

##  Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework and routing |
| React | Component-based user interface |
| TypeScript | Type-safe application development |
| Tailwind CSS | Styling and responsive layouts |
| Motion / Framer Motion | Animations and interactive transitions |
| PostgreSQL | Relational data storage |
| Prisma | Database access and ORM |
| MediaPipe / TensorFlow Lite | Vision-related processing, where integrated |
| RFID / NFC | Conceptual garment identification layer |

*The final technology list should reflect the packages and services actually used in the repository.*

##  GET GOING

### Prerequisites

- Node.js and npm
- Git
- A code editor such as Visual Studio Code
- PostgreSQL, if the configured application requires a database

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the environment variables required by the application.

Example:

```env
DATABASE_URL="your_database_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
```

These are examples, not a guarantee of the exact variable names required by every module. Check the application's configuration and existing environment-variable references before using them. Add other required variables only when the corresponding integration is implemented.

**Security:** Never commit `.env.local`, API keys, database credentials, or other secrets to GitHub.

### 4. Configure the database

If the project uses Prisma and PostgreSQL, configure the database connection and run the migrations required by the existing schema.

```bash
npx prisma generate
npx prisma migrate dev
```

Run the migration command only after verifying that the project has the required Prisma schema and migration setup.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL shown in your terminal, usually:

```text
http://localhost:3000
```

## 📁 Project Structure

The application is organized around its primary pages and API functionality.

```text
app/
├── page.tsx
├── inventory/
│   └── page.tsx
├── archive/
│   └── page.tsx
├── lab/
│   └── page.tsx
└── api/
    └── recommend/
        └── route.ts

prisma/
public/
components/
```

The structure above is illustrative. Update it to match the actual folders and files in the repository.

## 🧠 Recommendation Workflow

The recommendation workflow is designed to consider several factors before presenting an outfit:

1. Retrieve available garment information.
2. Consider weather and environmental context.
3. Evaluate garment thermal characteristics.
4. Apply the three-day non-repeat rule using available wear history.
5. Consider formality and color compatibility.
6. Generate a structured outfit recommendation.
7. Present the result through the application interface.

The recommendation logic depends on the data and integrations available in the current implementation.

## 🔬 Current Implementation & Limitations

Axiom is being developed as a software prototype for an intelligent wardrobe ecosystem.

- RFID/NFC-based garment detection is currently simulated rather than connected to physical wardrobe hardware.
- A complete hardware deployment would require RFID readers, suitable antennas, garment tags, collision handling, and hardware-software integration.
- Recommendation quality depends on the available garment data, contextual inputs, and wear history.
- Production-grade virtual try-on would require robust garment segmentation, pose estimation, and realistic garment rendering.
- Features that depend on external services may require valid credentials and additional configuration.

The project does not claim unverified performance figures, recommendation accuracy, hardware capabilities, or benchmark results.

## 🗺️ Future Roadmap

- [ ] Integrate physical RFID readers and garment tags.
- [ ] Improve automatic garment identification and inventory synchronization.
- [ ] Enhance personalized recommendations using user preferences and historical data.
- [ ] Improve virtual try-on realism and garment visualization.
- [ ] Expand contextual inputs for outfit selection.
- [ ] Strengthen testing, error handling, and deployment readiness.
- [ ] Improve documentation and setup automation.

These items represent potential future development, not necessarily completed features.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them.
4. Commit your changes with a descriptive message.
5. Open a pull request explaining the changes.

Please avoid committing secrets, generated build artifacts, or unrelated changes.

## 🔐 Security

Do not publish API keys, passwords, database credentials, or private environment files. Report security issues responsibly rather than publishing sensitive information.

## 📄 License

Choose and add an appropriate open-source license before permitting reuse of the project. Until a license is specified, do not assume that the code is available for unrestricted reuse.

## 👥 Project Team

**Axiom Smart Wardrobe**

Developed as an academic and technical project exploring intelligent wardrobe management, contextual recommendations, IoT integration concepts, and virtual try-on workflows.

---

*Built around a simple idea: make the wardrobe more intelligent, so choosing what to wear becomes less complicated.*
