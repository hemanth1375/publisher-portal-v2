import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloakService = inject(KeycloakService);

  try {
    const isLoggedIn = await keycloakService.isLoggedIn();

    if (!isLoggedIn) {
      // Redirect to login page if not authenticated
      keycloakService.login({
        redirectUri: state.url, // Redirect to the attempted URL after login
      });
      return false;
    }

    // Load the user's profile to ensure userId is available
    const profile:any = await keycloakService.getKeycloakInstance().loadUserInfo();
    const userId = profile.sub;

    if (!userId) {
      console.error('User ID is not available.');
      return false;
    }

    // Allow access if the user is authenticated and userId is available
    return true;
  } catch (error) {
    console.error('Error in authGuard:', error);
    return false;
  }
};
