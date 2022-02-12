import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { IUser } from 'src/app/models/user.interface';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  login() {
    if (this.form.valid) {
      console.log('valid');
      this.authService
        .login({
          email: this.email.value,
          password: this.password.value,
        })
        .pipe(
          tap(() =>
            this.router.navigate(['../../../private/components/dashboard/'])
          )
        )
        .subscribe();
    }
  }

  ngOnInit(): void {}
}
