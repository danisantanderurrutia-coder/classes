# Φ Open Knowledge & Science Mentorship & Computational Geophysics
## Daniel Santander • Double M.Sc. & Geophysicist

An interactive, responsive portfolio, teaching sandbox, and booking portal for **Open Knowledge & Science Mentorship**: from sensory intuition to exact science under the **PIAD Method™**.

Built following rigorous pedagogical and computational geophysics standards.

---

## ⚡ Quick Start Options

### Option 1: Instant Standalone Launch (No installation needed)
You can directly double-click or open the self-contained HTML file in any modern browser:
- [`index_standalone.html`](./index_standalone.html) or [`dist/standalone.html`](./dist/standalone.html)

### Option 2: Run Live Development Server with Hot-Reloading
```bash
npm run dev
```
Then open `http://localhost:5173` in your browser.

### Option 3: Production Build & Preview
```bash
npm run build
npm run preview
```
To regenerate the single-file bundle anytime:
```bash
npm run build:standalone
```

---

## 🔬 Core Features & Architecture

### 1. Sticky Navigation Bar & Header
- **Monogram & Logo**: `[Φ] GeoPhysics & STEM Mentorship` with real-time green pulse indicator (*"Open for Semester Exam Sprints & Master Coaching"*).
- **Navigation Links**: Fast anchor scrolling to `#lab`, `#courses`, `#calculator`, `#mentor`, `#faq`.
- **Language Switcher (EN | ES)**: Instant pill toggle switching the entire app context between English and Spanish.
- **CTA**: Highlighted `"Book Intro Call"` button triggering the diagnostic session modal.

### 2. High-Converting Hero Section
- **Pedigree Badge**: *"Geophysicist & Double M.Sc. Engineer • Based in Germany"*.
- **Headline**: *"Crack University STEM with an Engineer & Geophysicist."*
- **Sub-headline**: Targeted for international students at German universities (TUM, RWTH Aachen, TU Berlin, KIT, Uni Stuttgart) and IB candidates.
- **Trust Badges**:
  - `[Double M.Sc.]` Science & Engineering
  - `[Altklausur Focus]` Past-exam focused preparation
  - `[Real-World Rigor]` Theory + Python / Differential Calculus Models
  - `[Official Invoice]` Registered Freiberufler in Germany (§ 19 UStG)

### 3. The Interactive Physics & Calculus Sandbox
- **Dual Physics Modes**:
  1. **Ballistic Projectile with Atmospheric Drag**: Computes real-time numerical trajectories using velocity-dependent drag.
  2. **Damped Harmonic Oscillator & Wave Dynamics**: Shows amplitude decay and oscillatory behavior.
- **Real-Time Sliders**:
  - Launch Angle ($\theta$)
  - Initial Velocity ($v_0$)
  - Gravity ($g$) — from Moon ($1.62\text{ m/s}^2$) to Earth ($9.81\text{ m/s}^2$) to high-gravity ($15.0\text{ m/s}^2$)
  - Air Drag Coefficient ($\gamma$) — compare vacuum parabola vs. realistic drag trajectory
- **Live Visual Overlays**:
  - **Tangent Calculus Derivative Vectors**: Dynamic rendering of $dy/dx$ and instantaneous velocity $\vec{v}(t)$ vectors on the moving particle.
  - **Underlying Differential Equations**: Displays governing ODE ($m\ddot{\mathbf{r}} = -mg\hat{j} - \gamma \mathbf{v}$).
  - **Scientific Python Code**: Live NumPy/SciPy `solve_ivp` overlay showing how 4 lines of Python reproduce the simulation.
- **Real-Time Telemetry**: Instant readouts for Max Altitude ($y_{max}$), Impact Range ($x$), Tangent Slope ($dy/dx$), and Flight Time ($t$).

### 4. 4 Signature Mentorship & Klausur Tracks
1. **Track 01: German University Klausur Sprint** (€55/h or €390 8h Survival Pack)
   - Focused on *Höhere Mathematik I-III*, *Lineare Algebra*, *Klassische Mechanik*, Altklausur drills, and partial credit maximization.
2. **Track 02: Applied Physics & Scientific Python** (€65/h)
   - Numerical ODE solvers, NumPy, SciPy, Matplotlib, signal processing, and geodata.
3. **Track 03: IB Diploma Math AA HL & Physics HL** (€50/h or €360 8h Pack)
   - Internal Assessment (IA) guidance, syllabus mastery, Paper 1, 2 & 3 exam drills.
4. **Track 04: Master's Thesis & Research Mentoring** (€75/h)
   - Numerical algorithm debugging, scientific writing, thesis defense rehearsal.

### 5. Interactive Rate & Package Calculator
- **Inputs**: Academic Level (IB Diploma, University Bachelor, Master/Research), Hours Slider (2 to 20h), Delivery Format (1-on-1 vs Small Group -30%), Intensity (Weekly vs 4-Week Sprint -15% bundle discount).
- **Outputs**: Instant total investment in Euros (€), effective hourly rate, estimated sessions, and list of included extras (Miro vector export, Altklausur breakdowns, WhatsApp Q&A, German § 19 UStG invoice).
- **1-Click Sync**: Clicking *"Claim This Study Plan"* pre-fills the booking modal.

### 6. The Proprietary PIAD Method™ (Pedagogía de la Indagación Abierta y Digital)
- **Manifesto & Interactive Framework (`#/piad`)**: Dedicated page and landing spotlight showcasing the 5-step dialectical learning cycle for the AI era:
  1. *Observation*: Physical, freehand sketching & phenomenological perception (inspired by Da Vinci's codices).
  2. *Questioning Prior Consensus & Dogmas*: Clearing space for new knowledge and scrutinizing assumptions.
  3. *Highlighting the Essential Core*: Applying Occam's parsimony to isolate governing laws from noise.
  4. *Empirical Laboratory Verification*: Direct testing against physical simulations (DCL) and official past exams.
  5. *Open Knowledge Artifact*: Creating shareable Miro vector sheets, Python code, and democratizing tools.
- **Productive AI Integration**: Channels AI to explore, design executable code (NumPy/SciPy), and democratize advanced STEM tools. Added a 5th concrete deliverable to every course track: *PIAD Critical AI Framework*.

### 7. Mentor Authority & Background
- **Mentor Profile**: Double Master's holder in Science & Environmental Engineering, Geophysics background, registered German Freiberufler.
- **Foundational Lineage**: Leonardo Da Vinci, William of Ockham, Paulo Freire, Alexandra Elbakyan, Karl Popper, and Paul Feyerabend.

### 8. Academic FAQ
- Accordions answering: Official invoices for German tax/university claims (§ 19 UStG), teaching exams in English/Spanish, digital whiteboard tools (Miro + Apple Pencil), trial/diagnostic sessions, payment methods, and study groups.

### 8. Diagnostic Request & Booking Modal
- Accessible modal with backdrop blur and `Esc` key handling.
- Captures Student Name, Email, University/Institution (TUM, RWTH, etc.), Module, Target Exam Date, Language Preference, Syllabus Bottlenecks, and File Upload placeholder.
- Instant submission view with confetti celebration and quick-connect WhatsApp link.

---

## 🛠️ Admin Panel (Marketing)
Open `#/admin` (e.g. `http://localhost:5173/#/admin`). Spanish-language panel with: dashboard (leads, diagnostics, students, revenue per channel), week-1 checklist (**eBay Kleinanzeigen + street only**), copy-ready ads/flyer/web pitch, street-spot tracker with tagged QR links, and a lead pipeline. Data is stored in the browser (`localStorage`); use Export/Import for backups. No authentication.

---

## 🎨 Design Tokens
- **Background**: Clean White `#FFFFFF` with crisp borders and ambient sky/emerald accents.
- **Cards**: Clean Slate & White surfaces with slate-200 borders.
- **Accents**: Electric Cyan / Sky (`#38BDF8`) & Computation Emerald (`#10B981`).
- **Typography**: Plus Jakarta Sans for body/headings and JetBrains Mono for equations, stats, tags, and telemetry.
