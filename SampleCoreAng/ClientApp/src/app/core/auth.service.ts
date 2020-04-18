import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';

export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'https://localhost:5001/',
    client_id: 'spa',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: 'http://localhost:4200/',
    response_type: "code",
    scope: "openid profile api1",
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: 'http://localhost:4200/silent'
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public manager = new UserManager(getClientSettings());
  public user: User = null;

  constructor() {
    this.manager.getUser().then(user => {
      this.user = user;
    })
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect()
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;
    }).catch(err => console.error(err))
  }

  logOut(): Promise<void> {
    return this.manager.signoutRedirect();
  }

  revokeAccessToken(): Promise<void> {
    return this.manager.revokeAccessToken();
  }

  renew(): Promise<User> {
    return this.manager.signinSilent();
  }

  getCurrentUser(): Promise<User> {
    return this.manager.getUser();
  }
}
