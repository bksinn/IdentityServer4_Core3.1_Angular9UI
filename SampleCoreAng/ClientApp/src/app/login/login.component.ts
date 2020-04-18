import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedIn = false;
  returnUrl: string;
  logInData: ILogin;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder) {
    this.activatedRoute.queryParams.subscribe(
      (params:ILogin) => {
        this.logInData = params;
      },
      err => console.error(err)
    )
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
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

