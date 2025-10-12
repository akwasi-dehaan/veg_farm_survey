# Youth Vegetable Farming Survey

An offline-first data collection system designed for field researchers in rural areas with unreliable or no internet connectivity. The system allows data collection completely offline, stores data locally using IndexedDB, and automatically syncs to a server when internet becomes available.

## Features

### 🚀 Core Functionality

- **Offline-First**: Complete functionality without internet connection
- **Multi-Section Survey**: 9 comprehensive sections covering all aspects of youth vegetable farming
- **Real-time Sync**: Automatic synchronization when online
- **Data Persistence**: Robust local storage using IndexedDB
- **Export Capabilities**: JSON and CSV export functionality

### 📱 User Experience

- **Mobile Responsive**: Works on tablets and mobile devices
- **Progressive Web App**: Can be installed on devices
- **Intuitive Navigation**: Clear section-based form flow
- **Visual Feedback**: Real-time online/offline status indicators
- **Form Validation**: Comprehensive client-side validation

### 🔧 Technical Features

- **TypeScript**: Full type safety throughout the application
- **Next.js 14**: Modern React framework with App Router
- **Tailwind CSS**: Utility-first styling
- **IndexedDB**: Client-side database using Dexie.js
- **Real-time Detection**: Online/offline status monitoring

## Survey Sections

1. **Section A: Biodata** - Household & Respondent Information
2. **Section B: Farm Profile** - Farming Activities & Practices
3. **Section C: Vegetables** - Types of Vegetables & Production
4. **Section D: Marketing** - Marketing, Income & Value Chain
5. **Section E: Services** - Access to Services, Inputs & Finance
6. **Section F: Challenges** - Challenges & Constraints
7. **Section G: Technology** - Technology & Information Use
8. **Section H: Aspirations** - Perceptions & Aspirations
9. **Section I: Suggestions** - Suggestions & Closing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd youth-farming-survey
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Data Collection

1. Navigate to the Survey page
2. Fill out the survey header (enumerator info, location, consent)
3. Complete all 9 sections of the survey
4. Save the survey (data is stored locally)

### Data Management

1. Navigate to the Dashboard page
2. View all collected surveys
3. Filter by sync status (Pending/Synced/Failed)
4. Search by respondent name or location
5. Export data to JSON or CSV format

### Offline Usage

- The application works completely offline
- Data is automatically saved to IndexedDB
- When internet connection is restored, data syncs automatically
- Visual indicators show online/offline status

## API Endpoints

- `POST /api/surveys` - Submit survey data
- `GET /api/surveys` - Retrieve all surveys
- `PUT /api/surveys` - Update survey data
- `DELETE /api/surveys` - Delete survey data

## Data Storage

### IndexedDB Schema

```typescript
interface Survey {
  id?: number;
  surveyId: string;
  enumeratorName: string;
  date: string;
  location: string;
  consent: string;
  timestamp: string;
  syncStatus: "pending" | "synced" | "failed";
  syncedAt?: string;
  // ... survey data fields
}
```

### Sync Status

- **Pending**: Survey saved locally, not yet synced
- **Synced**: Survey successfully uploaded to server
- **Failed**: Sync attempt failed, will retry

## Development

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── survey/           # Survey page
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── survey/           # Survey form components
│   ├── shared/           # Shared components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
│   ├── db.ts           # IndexedDB operations
│   ├── sync.ts         # Sync functionality
│   ├── types.ts        # TypeScript types
│   ├── validation.ts   # Form validation
│   └── export.ts       # Export utilities
```

### Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Dexie.js**: IndexedDB wrapper
- **Lucide React**: Icon library

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.

## Roadmap

- [ ] Photo capture and storage
- [ ] GPS coordinates capture
- [ ] Signature capture for consent
- [ ] Multi-language support
- [ ] Offline map integration
- [ ] Advanced analytics dashboard
- [ ] Data visualization charts
- [ ] Bulk import from CSV
- [ ] User authentication
- [ ] Role-based access control
