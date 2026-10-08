import { ENVIRONMENT_CONFIG } from './environment';

export const TEST_CONFIG = {
  username: ENVIRONMENT_CONFIG.orangeHrmUsername,
  password: ENVIRONMENT_CONFIG.orangeHrmPassword
};

export const ESS_TEST_CONFIG = ENVIRONMENT_CONFIG.orangeHrmEssUsername &&
    ENVIRONMENT_CONFIG.orangeHrmEssPassword
  ? {
      username: ENVIRONMENT_CONFIG.orangeHrmEssUsername,
      password: ENVIRONMENT_CONFIG.orangeHrmEssPassword
    }
  : undefined;
