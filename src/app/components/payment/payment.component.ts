import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import {
  StripeService,
  StripeCardNumberComponent,
  StripeCardCvcComponent,
  StripeCardExpiryComponent,
  StripeCardComponent,
  StripeCardGroupDirective,
} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
  Stripe,
} from '@stripe/stripe-js';

import { environment as env, PUBLIC_KEY } from '../../../environments/env';
import { CoreModule } from '../../modules';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';

enum PaymentMethods {
  CARD = 'card',
  CASH = 'cash',
  INSURANCE = 'insurance',
}

@Component({
  selector: 'app-simple-payment-intent',
  standalone: true,
  imports: [
    CoreModule,
    RouterModule,
    ReactiveFormsModule,
    StripeCardComponent,
    StripeCardNumberComponent,
    StripeCardExpiryComponent,
    StripeCardCvcComponent,
    StripeCardGroupDirective,
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [AuthService],
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripeCardNumberComponent) card!: StripeCardNumberComponent;

  selectedMethod: PaymentMethods = PaymentMethods.CARD;
  PaymentMethods: PaymentMethods[] = [
    PaymentMethods.CARD,
    PaymentMethods.CASH,
    PaymentMethods.INSURANCE,
  ];

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  stripeTest!: FormGroup;
  ischeckinLoading!: boolean;

  id!: string;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private toster: ToastrService,
    private authService: AuthService,
    private router: ActivatedRoute,
    private route: Router
  ) {}

  setPaymentMethod(method: PaymentMethods): void {
    this.selectedMethod = method;
  }

  ngOnInit(): void {
    const id = this.router.snapshot.params['id'];
    if (id) {
      this.id = id;
    }
    this.stripeTest = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      paymentmethod: [this.selectedMethod, [Validators.required]],
    });
  }

  stripe: Stripe | undefined;
  markAsPaid(id: string) {
    this.ischeckinLoading = false;
    this.authService
      .markAsPaid(id)
      .pipe(
        catchError((error) => {
          this.toster.error(error.error.message);
          this.ischeckinLoading = false;
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.toster.success('Marked as paid successfully');
          this.ischeckinLoading = false;
          setTimeout(() => {
            this.route.navigate(['/quality']);
          }, 2000);
        }
      });
  }

  pay(): void {
    if (this.stripeTest.valid) {
      this.ischeckinLoading = true;
      const { amount } = this.stripeTest.value;
      this.createPaymentIntent(amount, 'usd')
        .pipe(
          switchMap((pi) => {
            if (pi.client_secret !== null) {
              return this.stripeService.confirmCardPayment(pi.client_secret, {
                payment_method: {
                  card: this.card.element,
                }
              });
            } else {
              throw new Error('Invalid client secret');
            }
          }),
          switchMap((result) => {
            if (result.error) {
              this.toster.error(result.error.message);
              throw new Error(result.error.message);
            } else if (result.paymentIntent?.status === 'succeeded') {
              this.toster.success('Payment successful');
              return this.authService.markAsPaid(this.id);
            } else {
              throw new Error('Payment was not successful');
            }
          }),
          switchMap((markAsPaidResult) => {
            if (markAsPaidResult) {
              this.ischeckinLoading = false;
              this.toster.success('Payment successful');
              return this.completePayment(this.id);
            } else {
              this.toster.error('Marking as paid failed');
              this.ischeckinLoading = false;
              throw new Error('Marking as paid failed');
            }
          }),
          catchError((error) => {
            this.toster.error("Payment failed");
            this.ischeckinLoading = false;
            return of(null);
          }
        ))
        .subscribe(
          (paymentCompleteResult) => {
            if (paymentCompleteResult) {
              this.toster.success('Payment completed successfully');
              this.ischeckinLoading = false;
              setTimeout(() => {
                this.route.navigate(['/quality']);
              }, 1000);
            }
          },
        );
    } else {
      this.toster.error('Invalid form data');
    }
  }

  createPaymentIntent(
    amount: number,
    currency: string
  ): Observable<PaymentIntent> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<PaymentIntent>(
      'http://localhost:8080/api/payment/payment-intent',
      { amount, currency },
      {
        headers,
      }
    );
  }

  private completePayment(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(
      `http://localhost:8080/api/payment/payment-complete/${id}`,
      null,
      {
        headers,
      }
    );
  }
}
