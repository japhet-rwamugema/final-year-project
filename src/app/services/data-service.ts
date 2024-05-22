import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class setDataService<T> {
    public data!: T

    setData(data: T) {
        this.data = data;
    }

    getData(): T | string{
        if (!this.data) {
            return 'No data available'
        }
        return this.data
    }
}