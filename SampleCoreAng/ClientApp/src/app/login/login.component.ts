import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  private antiForgeryToken: string;

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),

  });
  isLoggedIn = false;
  returnUrl: string;
  rememberLogin: boolean;
  logInData: Observable<ILogin>;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cookieService: CookieService) {
    this.activatedRoute.queryParams.subscribe(
      (params: Observable<ILogin>) => {
        this.logInData = params;
        this.returnUrl = params['ReturnUrl']
        this.rememberLogin = params['RememberLogin']
      },
      err => console.error(err)
    )
    this.createForm();
    this.antiForgeryToken = this.cookieService.get('XSRF-TOKEN');

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  logIn(form: FormGroup) {
    let user_username = form.value.username;
    let user_password = form.value.password;

    let formBody = new URLSearchParams();
    formBody.set('Username', user_username);
    formBody.set('Password', user_password);
    formBody.set('button', 'login');
    formBody.set('ReturnUrl', this.returnUrl);
    formBody.set('RememberLogin', String(this.rememberLogin));
    formBody.set('__RequestVerificationToken', this.antiForgeryToken);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    this.http.post("https://localhost:5001/Account/Login", formBody.toString(), options).subscribe(
      res => {
        window.location.href = this.returnUrl
      },
      err => console.error(err)
    )
    
  }

}

export interface ILogin {
  allowRememberLogin: boolean,
  enableLocalLogin: boolean,
  externalProviders: any,
  visibleExternalProviders: any,
  isExternalLoginOnly: boolean,
  externalLoginScheme: any,
  rememberLogin: boolean,
  returnUrl: string
}

interface ILogInViewModel {
  username: string;
  passworld: string;
  rememberLogin: boolean;
  returnUrl: string;
  button: string,
  __RequestVerificationToken: string
}
