# RiskRatio Design System Styleguide

## Color Schemes

### 1. Professional Dark
```css
--primary: #2563eb;     /* Royal Blue */
--secondary: #475569;   /* Slate */
--accent: #3b82f6;      /* Bright Blue */
--background: #0f172a;  /* Dark Navy */
--surface: #1e293b;     /* Lighter Navy */
--text: #f8fafc;        /* Off White */
--error: #ef4444;       /* Red */
--success: #22c55e;     /* Green */
```
Perfect for professional trading platforms, emphasizing readability and reduced eye strain.

### 2. Light Analytics
```css
--primary: #0ea5e9;     /* Sky Blue */
--secondary: #64748b;   /* Cool Gray */
--accent: #06b6d4;      /* Cyan */
--background: #ffffff;  /* Pure White */
--surface: #f1f5f9;    /* Light Gray */
--text: #0f172a;       /* Dark Navy */
--error: #dc2626;      /* Red */
--success: #16a34a;    /* Green */
```
Clean and crisp design for data-heavy interfaces.

### 3. Modern Fintech
```css
--primary: #6366f1;     /* Indigo */
--secondary: #a855f7;   /* Purple */
--accent: #8b5cf6;      /* Violet */
--background: #18181b;  /* Dark Gray */
--surface: #27272a;     /* Medium Gray */
--text: #fafafa;        /* White */
--error: #f43f5e;       /* Rose */
--success: #10b981;     /* Emerald */
```
Contemporary and engaging, perfect for modern financial applications.

### 4. Warm Professional
```css
--primary: #f59e0b;     /* Amber */
--secondary: #d97706;   /* Dark Amber */
--accent: #fbbf24;      /* Light Amber */
--background: #fffbeb;  /* Cream */
--surface: #fef3c7;     /* Light Cream */
--text: #1f2937;        /* Dark Gray */
--error: #b91c1c;       /* Dark Red */
--success: #15803d;     /* Dark Green */
```
Welcoming and trustworthy, ideal for client-facing features.

### 5. High Contrast
```css
--primary: #3b82f6;     /* Blue */
--secondary: #1e40af;   /* Dark Blue */
--accent: #60a5fa;      /* Light Blue */
--background: #000000;  /* Black */
--surface: #111827;     /* Very Dark Gray */
--text: #ffffff;        /* White */
--error: #ff0000;       /* Pure Red */
--success: #00ff00;     /* Pure Green */
```
Maximum readability and accessibility focus.

### 6. Eco Green
```css
--primary: #059669;     /* Emerald */
--secondary: #047857;   /* Dark Emerald */
--accent: #34d399;      /* Light Emerald */
--background: #ecfdf5;  /* Mint */
--surface: #d1fae5;     /* Light Mint */
--text: #064e3b;        /* Dark Green */
--error: #dc2626;       /* Red */
--success: #059669;     /* Emerald */
```
Fresh and calming, emphasizing growth and success.

### 7. Ocean Deep
```css
--primary: #0891b2;     /* Cyan */
--secondary: #0e7490;   /* Dark Cyan */
--accent: #22d3ee;      /* Light Cyan */
--background: #164e63;  /* Deep Blue */
--surface: #155e75;     /* Medium Deep Blue */
--text: #ecfeff;        /* Light Cyan */
--error: #e11d48;       /* Rose */
--success: #059669;     /* Emerald */
```
Professional and focused, inspired by deep ocean colors.

## Design Styles

### 1. Minimalist Trading
- Clean, uncluttered layouts
- Ample white space
- Thin borders and subtle shadows
- Monospaced fonts for numbers
- Minimal use of colors
- Focus on data presentation
```css
font-family: 'Inter', sans-serif;
border-radius: 4px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
```

### 2. Glass Morphism
- Frosted glass effects
- Subtle transparency
- Soft blur effects
- Layered elements
- Light borders
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 16px;
```

### 3. Neumorphism
- Soft, extruded surfaces
- Light and shadow play
- Minimal color palette
- Subtle gradients
- Rounded corners
```css
box-shadow: 
  5px 5px 10px rgba(0,0,0,0.1),
  -5px -5px 10px rgba(255,255,255,0.1);
border-radius: 12px;
```

### 4. Modern Flat
- Bold colors
- Sharp edges
- Clear typography
- High contrast
- Grid-based layouts
```css
font-family: 'DM Sans', sans-serif;
border-radius: 0;
transition: all 0.2s ease;
```

### 5. Rich Depth
- Multiple layers
- Strong shadows
- Card-based design
- Elevated elements
- Interactive depth
```css
box-shadow: 
  0 4px 6px -1px rgba(0,0,0,0.1),
  0 2px 4px -1px rgba(0,0,0,0.06);
border-radius: 8px;
```

### 6. Dynamic Motion
- Smooth animations
- Micro-interactions
- Responsive feedback
- Fluid transitions
- State changes
```css
transition: transform 0.2s ease, opacity 0.2s ease;
transform-origin: center;
will-change: transform, opacity;
```

### 7. Data Dense
- Compact layouts
- Information hierarchy
- Small interactive elements
- Dense grids
- Tabular design
```css
font-family: 'IBM Plex Mono', monospace;
font-size: 0.875rem;
line-height: 1.25;
```

## Typography

### Headers
```css
h1 {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

h2 {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 600;
  letter-spacing: -0.025em;
}

h3 {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
}
```

### Body Text
```css
body {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 400;
}

.small {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
```

## Spacing System
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

## Border Radius
```css
--radius-sm: 0.125rem;
--radius-md: 0.375rem;
--radius-lg: 0.5rem;
--radius-xl: 1rem;
--radius-2xl: 1.5rem;
```

## Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## Usage Guidelines

1. **Consistency**: Choose one color scheme and design style and stick to it throughout the application.
2. **Accessibility**: Ensure sufficient contrast ratios between text and background colors.
3. **Responsiveness**: All design styles should adapt gracefully to different screen sizes.
4. **Performance**: Use transitions and animations judiciously to maintain smooth performance.
5. **Dark Mode**: Consider providing dark mode variants for each color scheme.

## Implementation

To implement these styles:

1. Create CSS custom properties (variables) for the chosen color scheme
2. Import appropriate fonts
3. Set up base styles for typography and spacing
4. Create utility classes for common patterns
5. Use CSS modules or styled-components for component-specific styles

Remember to maintain consistency across components and follow the chosen design style's principles throughout the application.
