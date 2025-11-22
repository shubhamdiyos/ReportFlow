# 🎨 Frontend Documentation

## Overview

The ReportFlow frontend is a modern React 18 application built with TypeScript, providing a responsive and interactive dashboard for GitHub analytics.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **State Management**: TanStack Query + React Context
- **Routing**: Wouter (lightweight alternative to React Router)
- **UI Components**: Radix UI + Tailwind CSS
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite for fast development
- **Database**: Drizzle ORM with PostgreSQL

## Project Structure

```
report_frontend/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Radix UI primitives
│   │   │   ├── dashboard/       # Analytics components
│   │   │   ├── layout/          # App shell, navigation
│   │   │   └── shared/          # Reusable components
│   │   ├── pages/               # Route components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities, API clients
│   │   └── shared/              # Database schemas (Drizzle)
│   └── package.json
├── server/                      # Express server (if needed)
├── shared/
│   └── schema.ts               # Database schemas
└── package.json
```

## Key Features

### Authentication Flow
- GitHub OAuth integration
- JWT token management
- Multi-tenant organization switching
- Role-based access control

### Dashboard Components
- Real-time KPI cards
- Interactive charts with linking
- Role-specific analytics views
- Report generation wizard

### State Management
```typescript
// Authentication Context
AuthProvider → useAuth() → User state & JWT tokens

// Tenant Management  
TenantProvider → useTenant() → Organization switching

// Server State
TanStack Query → API caching & synchronization
```

## Component Architecture

### UI Components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Framer Motion**: Animations

### Chart Components
- **Recharts**: Data visualization
- **Chart linking**: Interactive cross-chart selection
- **Annotations**: Custom chart markers
- **Export functionality**: PNG/SVG export

### Layout Components
- **App Shell**: Main application layout
- **Navigation**: Responsive sidebar
- **Header**: User profile and organization switcher

## Development Guidelines

### Component Standards
```typescript
// Functional components with hooks
interface ComponentProps {
  // Define props with TypeScript
}

export default function Component({ ...props }: ComponentProps) {
  // Component logic
  return <div>...</div>;
}
```

### State Management Patterns
```typescript
// Custom hooks for complex state
export function useDashboardData() {
  const { user } = useAuth();
  const { organization } = useTenant();
  
  return useQuery({
    queryKey: ['dashboard', organization.id],
    queryFn: () => fetchDashboardData(organization.id)
  });
}
```

### Styling Guidelines
- Use Tailwind CSS classes
- Implement responsive design
- Follow accessibility best practices
- Use semantic HTML elements

## Performance Optimization

### Code Splitting
```typescript
// Lazy loading for route components
const Dashboard = lazy(() => import('./pages/dashboard'));
const Reports = lazy(() => import('./pages/reports'));
```

### Image Optimization
```typescript
// Optimized image loading
const optimizedImage = {
  src: imageUrl,
  sizes: '(max-width: 768px) 100vw, 50vw',
  loading: 'lazy'
};
```

### Bundle Optimization
- Tree shaking with Vite
- Dynamic imports for large components
- Service worker caching for static assets

## Testing Strategy

### Unit Testing
```typescript
// Component testing with Jest
import { render, screen } from '@testing-library/react';
import Component from './Component';

test('renders component correctly', () => {
  render(<Component />);
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});
```

### Integration Testing
- API integration testing
- User flow testing
- Cross-browser testing

### E2E Testing
- Playwright for end-to-end tests
- Visual regression testing
- Performance testing

## Deployment

### Build Process
```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment Configuration
```typescript
// Environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
```

### Deployment Platforms
- **Vercel**: Recommended for React apps
- **Netlify**: Alternative with excellent CI/CD
- **AWS S3 + CloudFront**: Custom deployment

## Security Considerations

### Frontend Security
- Content Security Policy (CSP)
- XSS prevention
- Secure token storage
- HTTPS enforcement

### Data Protection
- Input validation
- Output encoding
- Secure API communication
- User data privacy

## Accessibility

### WCAG 2.1 Compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Color contrast compliance

### Testing Tools
- axe-core for automated testing
- Screen reader testing
- Keyboard-only navigation
- Color contrast analyzers

## Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Graceful degradation
- Feature detection
- Polyfills for older browsers
- Fallback UI components

## Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size monitoring
- Error tracking and reporting
- User interaction analytics

### User Analytics
- Feature usage tracking
- Performance metrics
- Error reporting
- User feedback collection

## Contributing

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Husky pre-commit hooks

### Pull Request Process
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit pull request with description

## Troubleshooting

### Common Issues
- **Build failures**: Check TypeScript errors
- **API errors**: Verify environment variables
- **Performance issues**: Check bundle size
- **Accessibility issues**: Run axe-core tests

### Debug Tools
- React DevTools
- Redux DevTools (if applicable)
- Browser DevTools
- Vite dev server logs

---

For more detailed information, see the specific documentation files in this section.
