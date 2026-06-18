import 'react';

// Re-export nothing; this file exists so TS picks up project-wide ambient typing if needed.
declare module '*.svg' {
  const src: string;
  export default src;
}
