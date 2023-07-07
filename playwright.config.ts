import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'tests', 
  timeout: 30000, 
  use: {
    
    browserName: 'chromium',
    headless: true,
  },
};

export default config;
