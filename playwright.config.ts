import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'tests/e2e',  
  timeout: 30000, 
  use: {
    
    browserName: 'chromium',
    headless: true,
  },
};

export default config;
