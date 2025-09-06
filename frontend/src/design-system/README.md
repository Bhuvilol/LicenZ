# LicenZ Design System

A comprehensive component library built with consistency, accessibility, and scalability in mind. This design system provides a foundation for building beautiful, consistent user interfaces across the LicenZ application.

## 🎨 Design Principles

- **Consistency**: All components follow the same design patterns and visual language
- **Accessibility**: Built with WCAG guidelines in mind, ensuring inclusive design
- **Scalability**: Easy to extend and customize for new use cases
- **Performance**: Optimized components with minimal bundle impact
- **Developer Experience**: Intuitive APIs and comprehensive documentation

## 🏗️ Architecture

The design system is built on top of:
- **Tailwind CSS**: For utility-first styling and design tokens
- **React**: For component composition and state management
- **Design Tokens**: Centralized values for colors, typography, spacing, and more

## 📚 Component Library

### Core Components

#### Button
A versatile button component with multiple variants, sizes, and states.

```jsx
import { Button } from './components/ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With states
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `disabled`: boolean
- `loading`: boolean
- `fullWidth`: boolean
- `onClick`: function
- `type`: 'button' | 'submit' | 'reset'

#### Input
A flexible input component with support for labels, errors, and icons.

```jsx
import { Input } from './components/ui';

// Basic usage
<Input placeholder="Enter text..." />

// With label and error
<Input
  label="Email Address"
  placeholder="Enter your email"
  error="Please enter a valid email"
/>

// With helper text
<Input
  label="Username"
  placeholder="Choose a username"
  helperText="Must be at least 3 characters"
/>

// With icons
<Input
  label="Search"
  placeholder="Search..."
  leftIcon={<SearchIcon />}
  rightIcon={<ClearIcon />}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `fullWidth`: boolean
- All standard input props

#### Card
A container component with multiple variants and sub-components.

```jsx
import { Card } from './components/ui';

// Basic usage
<Card>
  <p>Card content</p>
</Card>

// With variants
<Card variant="elevated">
  <p>Elevated card with shadow</p>
</Card>

// With sub-components
<Card>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'filled' | 'primary' | 'success' | 'warning' | 'error'
- `padding`: 'none' | 'sm' | 'default' | 'lg' | 'xl'
- `fullWidth`: boolean

**Sub-components:**
- `Card.Header`: For card titles and headers
- `Card.Body`: For main content
- `Card.Footer`: For actions and metadata

#### Modal
A modal dialog component with backdrop and keyboard support.

```jsx
import { Modal } from './components/ui';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="lg"
>
  <p>Modal content goes here</p>
  <div className="flex gap-3 justify-end">
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={() => setIsOpen(false)}>
      Confirm
    </Button>
  </div>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean (default: true)
- `closeOnBackdrop`: boolean (default: true)

#### Badge
A small component for displaying status, labels, or counts.

```jsx
import { Badge } from './components/ui';

// Basic usage
<Badge>New</Badge>

// With variants
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>

// With sizes
<Badge size="sm">Small</Badge>
<Badge size="lg">Large</Badge>

// Rounded variant
<Badge variant="primary" rounded>Rounded</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `rounded`: boolean

#### Alert
A component for displaying important messages to users.

```jsx
import { Alert } from './components/ui';

// Basic usage
<Alert variant="info">
  This is an informational message.
</Alert>

// With title
<Alert variant="success" title="Success!">
  Your action was completed successfully.
</Alert>

// With close button
<Alert
  variant="warning"
  title="Warning"
  onClose={() => setShowAlert(false)}
>
  Please review your input before proceeding.
</Alert>
```

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `title`: string
- `onClose`: function

#### Textarea
A multi-line text input component.

```jsx
import { Textarea } from './components/ui';

<Textarea
  label="Description"
  placeholder="Enter your description..."
  rows={4}
  helperText="Maximum 500 characters"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `rows`: number (default: 4)
- `fullWidth`: boolean
- All standard textarea props

## 🎨 Design Tokens

### Colors
The design system uses a comprehensive color palette:

- **Primary**: Purple-based brand colors (50-900)
- **Semantic**: Success (green), Warning (yellow), Error (red), Info (blue)
- **Neutral**: Grayscale colors for text, borders, and backgrounds

### Typography
- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
- **Font Weights**: light, normal, medium, semibold, bold, extrabold
- **Line Heights**: tight, snug, normal, relaxed, loose

### Spacing
Consistent spacing scale from 0 to 128 (0.125rem to 32rem)

### Border Radius
- **sm**: 0.125rem
- **default**: 0.25rem
- **md**: 0.375rem
- **lg**: 0.5rem
- **xl**: 0.75rem
- **2xl**: 1rem
- **3xl**: 1.5rem
- **4xl**: 2rem
- **full**: 9999px

### Shadows
- **soft**: Subtle shadow for cards and elevated elements
- **medium**: Medium shadow for modals and overlays
- **strong**: Strong shadow for emphasis and depth

### Transitions
- **Duration**: 75ms to 1000ms
- **Easing**: linear, in, out, inOut

## 🚀 Usage Guidelines

### 1. Import Components
```jsx
// Import individual components
import { Button, Input, Card } from './components/ui';

// Or import all components
import * as UI from './components/ui';
```

### 2. Follow Component Patterns
- Use consistent prop naming across components
- Leverage component composition (e.g., Card.Header, Card.Body)
- Utilize semantic variants for different contexts

### 3. Maintain Accessibility
- Always provide labels for form inputs
- Use semantic color variants for status indicators
- Ensure proper focus management in interactive components

### 4. Responsive Design
- Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- Test components across different screen sizes
- Leverage the design system's spacing scale

## 🔧 Customization

### Extending Components
```jsx
// Custom button variant
const CustomButton = ({ className, ...props }) => (
  <Button
    className={`bg-gradient-to-r from-purple-500 to-pink-500 ${className}`}
    {...props}
  />
);
```

### Adding New Variants
```jsx
// Extend existing component variants
const buttonVariants = {
  ...defaultVariants,
  gradient: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
};
```

### Custom Design Tokens
```jsx
// Add custom colors to Tailwind config
module.exports = {
  theme: {
    extend: {
      colors: {
        custom: {
          500: '#your-color',
        },
      },
    },
  },
};
```

## 📱 Responsive Design

The design system is built with mobile-first responsive design:

- **Mobile**: Base styles (no prefix)
- **Small**: sm: (640px+)
- **Medium**: md: (768px+)
- **Large**: lg: (1024px+)
- **Extra Large**: xl: (1280px+)
- **2XL**: 2xl: (1536px+)

## ♿ Accessibility Features

- **Keyboard Navigation**: All interactive elements support keyboard navigation
- **Focus Management**: Proper focus indicators and management
- **Screen Reader Support**: Semantic HTML and ARIA attributes
- **Color Contrast**: Meets WCAG AA standards
- **Reduced Motion**: Respects user's motion preferences

## 🧪 Testing

### Component Testing
```jsx
import { render, screen } from '@testing-library/react';
import { Button } from './components/ui';

test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
});
```

### Visual Regression Testing
Use tools like Chromatic or Percy to catch visual regressions in components.

## 📖 Storybook Integration

The design system includes Storybook for component documentation and testing:

```bash
# Install Storybook
npm install -D @storybook/react

# Run Storybook
npm run storybook
```

## 🤝 Contributing

### Adding New Components
1. Create the component in `src/components/ui/`
2. Add proper TypeScript types
3. Include accessibility features
4. Add comprehensive tests
5. Update documentation
6. Add to the showcase

### Component Standards
- Use React.forwardRef for proper ref handling
- Include displayName for debugging
- Support className prop for customization
- Follow the established prop patterns
- Include proper JSDoc comments

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Design System Best Practices](https://www.designsystems.com/)

## 📄 License

This design system is part of the LicenZ project and follows the same licensing terms.
