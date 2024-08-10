import { NgModule } from "@angular/core";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { NgxStripeModule } from "ngx-stripe";
import { PUBLIC_KEY } from "../environments/env";

@NgModule({
    imports:[NgxStripeModule.forRoot(PUBLIC_KEY)],
    declarations:[
        SpinnerComponent,
    ],
    exports:[
        SpinnerComponent,
    ]
})
export class CoreModule{}