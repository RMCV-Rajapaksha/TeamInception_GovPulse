# Time Slot Analytics Dashboard

## Overview

The Analytics Dashboard provides comprehensive insights into government officials' time slot availability patterns. It connects to the backend API endpoint `/api/time-slots/view-free-time-slots` to fetch real-time data and present it through interactive charts and statistics.

## Features

### 📊 Key Metrics Dashboard
- **Total Time Slots**: Shows the total number of available time slots
- **Total Hours**: Displays cumulative available hours
- **Daily Average**: Calculates average slots per day
- **Busiest Day**: Identifies the day with maximum slots

### 📈 Interactive Charts
- **Line Chart**: Visualizes time slot trends over time
- **Bar Chart**: Alternative view for comparing daily availability
- **Time Period Controls**: Switch between Week, Month, and Quarter views
- **Hourly Distribution**: Shows most popular hours for time slots

### 🔍 Advanced Analytics
- **Time Distribution Analysis**: Breaks down slots by Morning (6AM-12PM), Afternoon (12PM-5PM), and Evening (5PM-12AM)
- **Activity Insights**: Categorizes availability as Very Active, Active, or Light
- **Efficiency Metrics**: Analyzes average hours per slot
- **Preferred Time Analysis**: Identifies preferred time periods

### 📅 Weekly Pattern Analysis
- **Day-of-Week Distribution**: Shows availability patterns across different days
- **Slot vs Hours Comparison**: Dual-axis chart showing both slot count and total hours

## API Integration

### Endpoint
```
GET /api/time-slots/view-free-time-slots
```

### Authentication
- Requires Bearer token authentication
- Token automatically included from localStorage

### Data Structure
```typescript
interface FreeTimeSlot {
  authority_id: number;
  date: string; // ISO format: "2025-08-15T00:00:00.000Z"
  time_slots: string[]; // Format: ["10:00 - 11:00", "11:30 - 12:30"]
}
```

### Auto-Refresh
- Data automatically refreshes every 30 seconds
- Manual refresh button available
- Retry mechanism with exponential backoff

## Technical Implementation

### Architecture
- **React Hooks**: Custom `useTimeSlotAnalytics` hook for data management
- **React Query**: Handles API calls, caching, and error states
- **Recharts**: Powers all data visualizations
- **Tailwind CSS**: Styling and responsive design
- **TypeScript**: Full type safety

### Components Structure
```
Analytics.tsx (Main component)
├── QuickStats (Statistics cards)
├── TimeSlotInsights (Detailed analysis)
├── Main Chart (Line/Bar chart)
└── Weekly Pattern Chart
```

### Data Processing
1. **Filtering**: Filters data based on selected time range
2. **Categorization**: Groups slots by time of day (Morning/Afternoon/Evening)
3. **Aggregation**: Calculates totals, averages, and distributions
4. **Sorting**: Orders data chronologically and by popularity

## User Experience Features

### Loading States
- Skeleton loading for statistics cards
- Loading spinner for main content
- Smooth transitions and animations

### Error Handling
- Network error detection and display
- Retry mechanisms
- Graceful fallbacks for missing data

### Empty States
- No data message when no time slots exist
- Helpful instructions for users
- Refresh option to retry data loading

### Responsive Design
- Mobile-friendly layout
- Adaptive grid systems
- Touch-friendly controls

## Performance Optimizations

### Data Caching
- React Query caches API responses
- Intelligent cache invalidation
- Background refetching

### Computation Efficiency
- Memoized calculations using `useMemo`
- Efficient data transformations
- Optimized re-renders

### Bundle Size
- Tree-shaking for unused chart components
- Lazy loading considerations
- Optimized dependencies

## Customization Options

### Date Ranges
- **Week**: Last 7 days
- **Month**: Last 30 days  
- **Quarter**: Last 90 days

### Chart Types
- Line charts for trend analysis
- Bar charts for period comparison
- Interactive tooltips with detailed information

### Color Schemes
- Consistent color palette
- Accessibility-compliant contrasts
- Brand-aligned styling

## Future Enhancements

### Planned Features
- [ ] Export functionality (CSV/PDF)
- [ ] Custom date range selection
- [ ] Comparative analytics (month-over-month)
- [ ] Appointment booking integration
- [ ] Real-time notifications
- [ ] Advanced filtering options

### Analytics Enhancements
- [ ] Predictive availability forecasting
- [ ] Seasonal pattern analysis
- [ ] Meeting outcome correlation
- [ ] Authority performance comparison
- [ ] Utilization efficiency scoring

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies
- React 18.3+
- React Query 5.83+
- Recharts 2.15+
- Tailwind CSS 3.4+
- Lucide React 0.462+

## Development

### Running Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

## API Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 200 | Success | Display data |
| 401 | Unauthorized | Check authentication |
| 500 | Server Error | Show retry option |

## Contributing

When adding new analytics features:
1. Update the `useTimeSlotAnalytics` hook for data processing
2. Add new components to `AnalyticsComponents.tsx`
3. Update TypeScript interfaces as needed
4. Ensure responsive design compliance
5. Add appropriate error handling
