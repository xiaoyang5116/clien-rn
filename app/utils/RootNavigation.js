import { 
  createNavigationContainerRef 
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

// Usage: import * as RootNavigation from '../utils/RootNavigation';
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
