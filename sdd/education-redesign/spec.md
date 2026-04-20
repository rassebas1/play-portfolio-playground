# Delta for Education Page Redesign

## Purpose

Redesign the Education page with Academic Luxury aesthetic, enhancing background effects, timeline, cards, animations, and typography.

## ADDED Requirements

### Requirement: Background Lighting System

The Education page background MUST implement a sophisticated lighting system replacing simple gradient orbs.

The system SHALL include:
- **Spotlight beams**: Two or more diagonal light beams crossing the viewport at angles (45-60 degrees), with soft edges and subtle animated sway
- **Grain/texture overlay**: Subtle noise texture at 3-5% opacity layered over entire background
- **Vignette effect**: Darkened edges fading toward center
- **Animated light pulses**: Ambient light variations that breathe slowly (8-12 second cycles)

The background base color SHALL be darker than current implementation: `hsl(220 13% 6%)` for dark mode.

#### Scenario: Light Beam Animation

- GIVEN user visits Education page in dark mode
- WHEN page loads and during scroll
- THEN spotlight beams animate with subtle horizontal drift every 8-12 seconds
- AND grain texture remains static at 3-5% opacity

#### Scenario: Vignette Depth

- GIVEN user views Education page
- THEN viewport edges show darkened vignette effect
- AND vignette intensity increases toward corners

### Requirement: Enhanced Timeline Design

The timeline MUST feature an elevated, elegant design with dynamic elements.

The timeline line SHALL be a multi-layer gradient:
- Core line: 2px solid with primary color at 60% opacity
- Outer glow: 8px blur with primary color at 15% opacity
- Animated pulse traveling along the line every 3 seconds

Timeline nodes SHALL:
- Be 12px diameter with inner 6px solid core
- Feature pulsing ring expanding to 24px and fading
- Include year label adjacent to node (left or right based on card alignment)

#### Scenario: Timeline Pulse Animation

- GIVEN user scrolls through Education page
- WHEN timeline comes into viewport
- THEN pulse animation travels along timeline line
- AND node rings expand and fade every 3 seconds

### Requirement: Year Markers on Timeline

The timeline SHALL display year markers at regular intervals.

Year markers SHALL:
- Display years from education data (e.g., "2025", "2022", "2012")
- Positioned adjacent to timeline nodes
- Use distinct typography: 0.75rem, font-medium, primary/60 color

#### Scenario: Year Display

- GIVEN education entries have years defined
- THEN year markers appear next to corresponding timeline nodes
- AND years align on opposite side from card content

## MODIFIED Requirements

### Requirement: Education Card Glassmorphism

The EducationCard component MUST implement enhanced glassmorphism with richer visual depth. (Previously: Basic glass-card with simple border)

The card background SHALL be:
- Darker base: `rgba(0, 0, 0, 0.5)` in dark mode
- Elevated blur: 20px backdrop-filter
- Multi-layer border with gradient stroke effect

The card border SHALL feature:
- Inner border: 1px solid at 8% white (dark mode) or 15% black (light mode)
- Outer border: 1px solid at primary color 25% opacity
- Corner accents: Gold/amber gradient lines at 50% opacity, 2px thickness

The card shadow SHALL include:
- Inner glow: `inset 0 0 30px rgba(142, 76, 36, 0.05)`
- Drop shadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5)`
- Ambient glow on hover: `0 0 40px rgba(142, 76, 36, 0.15)`

#### Scenario: Enhanced Card Appearance

- GIVEN user views EducationCard in dark mode
- THEN card shows deep glass effect with multi-layer border
- AND gold corner accents visible at 50% opacity

#### Scenario: Card Hover State

- GIVEN user hovers over EducationCard
- THEN border glows with amber tint
- AND inner glow intensifies
- AND card lifts with 12px transform

### Requirement: Typography Hierarchy

The EducationCard typography MUST establish clear visual hierarchy. (Previously: Standard heading/body styling)

Degree text SHALL be:
- Size: 1.5rem (24px) mobile, 1.875rem (30px) desktop
- Weight: 700 (bold)
- Color: foreground, transitioning to primary on hover
- Line-height: 1.2

University text SHALL be:
- Size: 0.9375rem (15px)
- Weight: 400 (regular)
- Color: muted-foreground
- Line-height: 1.5

Hook text SHALL be:
- Size: 0.875rem (14px)
- Weight: 500 (medium)
- Color: primary/80
- Italic: true
- Leading icon: Sparkles or Star icon in gold/amber

#### Scenario: Typography Rendering

- GIVEN EducationCard renders with data
- THEN degree displays largest with bold weight
- AND university follows in muted color
- AND hook shows with italic and icon accent

### Requirement: Card Entry Animation

EducationCard entry animation MUST use diagonal motion. (Previously: Simple fade with no directional emphasis)

Card entry SHALL:
- Start from 100px offset at 30-degree angle (left cards from bottom-left, right cards from bottom-right)
- Include rotation from -3 to 0 degrees during entry
- Use easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Duration: 0.8 seconds
- Stagger: 0.2 seconds between cards

#### Scenario: Diagonal Card Entry

- GIVEN EducationPage loads with multiple education entries
- WHEN cards animate into view
- THEN each card enters from angled direction
- AND rotation adjusts during motion

### Requirement: Parallax Scroll Effects

The Education page MUST implement subtle parallax effects during scroll. (Previously: Simple scaleY transform)

Parallax effects SHALL include:
- Background elements move at 0.3x scroll speed
- Timeline moves at 0.7x scroll speed
- Cards move at 1x scroll speed (baseline)
- Spotlight beams move at 0.5x scroll speed in opposite direction

#### Scenario: Parallax Depth

- GIVEN user scrolls Education page
- THEN background orbs/spotlights shift slower than timeline
- AND timeline shifts slower than cards
- AND creates layered depth perception

### Requirement: Card Element Stagger

EducationCard internal elements MUST stagger their reveal. (Previously: Basic itemVariants)

Element stagger sequence SHALL:
- Logo and year badge: delay 0.0s
- Degree: delay 0.1s
- University: delay 0.15s
- Hook: delay 0.2s
- Divider: delay 0.3s
- Skills section: delay 0.4s
- Courses section: delay 0.5s
- Project section: delay 0.6s

Each element SHALL:
- Fade in from 0 opacity
- TranslateY from 20px
- Duration: 0.4s with ease-out

#### Scenario: Staggered Reveal

- GIVEN EducationCard enters viewport
- THEN logo appears first
- AND degree follows at 0.1s
- AND remaining elements cascade with 0.1s intervals

### Requirement: Dramatic Hover States

EducationCard hover state MUST be visually dramatic. (Previously: Simple y transform)

Hover state SHALL include:
- Scale: 1.02
- TranslateY: -8px
- Border color transition to primary at 50% opacity
- Inner glow expansion to 50px blur
- Duration: 0.4s with ease-out
- Skill badges: individual scale to 1.1 with background color shift

#### Scenario: Card Hover Interaction

- GIVEN user hovers EducationCard
- THEN card lifts and scales slightly
- AND border glows amber
- AND skill badges respond individually

### Requirement: Decorative Card Elements

EducationCard MUST include refined decorative elements. (Previously: Basic corner borders)

Decorative elements SHALL include:
- Top-left: Gold diagonal line, 20px length, 2px stroke
- Top-right: Gold diagonal line matching top-left
- Bottom-left: Inverted gold diagonal line
- Bottom-right: Inverted gold diagonal line matching bottom-left
- Background: Subtle radial gradient from top-left corner at 3% opacity

These elements SHALL:
- Animate opacity from 30% to 60% on card hover
- Use gold color: `hsl(45 93% 58%)` (game-warning / amber)

#### Scenario: Decorative Elements on Hover

- GIVEN user hovers over EducationCard
- THEN decorative corner lines intensify
- AND background gradient brightens subtly

## REMOVED Requirements

### Requirement: Basic Gradient Orbs

(Reason: Replaced by sophisticated spotlight/beam system)

The simple floating gradient orbs previously at top-1/4 and bottom-1/4 positions with blur-3xl effect are REMOVED.

### Requirement: Simple Glass Card Border

(Reason: Replaced by multi-layer border with gold accents)

The previous single-layer `border-primary/15` is REMOVED and replaced with enhanced border system.

### Requirement: Basic Node Design

(Reason: Replaced by pulsing multi-ring nodes with year markers)

The previous 3px node with simple shadow is REMOVED and replaced with enhanced node design.