import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Filter out sensitive data
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    // Filter out sensitive data from context
    if (event.contexts?.runtime) {
      delete event.contexts.runtime;
    }
    
    // Filter out sensitive request data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }
    
    return event;
  },
  
  // Ignore certain errors
  ignoreErrors: [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'NetworkError',
  ],
});
