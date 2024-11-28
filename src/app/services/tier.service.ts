import { Injectable } from "@angular/core";
import { CrudBase } from "./crudBase";
import { HttpClient } from '@angular/common/http';
import { Tier } from "../models/Tier";
@Injectable({
    providedIn: 'root'
})

export class TierService extends CrudBase<Tier> {
    constructor(protected override http: HttpClient) {
        super(http, "Tier");
    }
}