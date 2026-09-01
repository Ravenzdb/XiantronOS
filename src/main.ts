import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { injectSpeedInsights } from '@vercel/speed-insights';

bootstrapApplication(AppComponent)
  .catch((err) => console.error(err));

// Initialize Vercel Speed Insights
injectSpeedInsights();
