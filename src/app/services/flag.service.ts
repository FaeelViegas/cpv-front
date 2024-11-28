import { Injectable } from "@angular/core";
import { CrudBase } from "./crudBase";
import { HttpClient } from '@angular/common/http';
import { Flag } from "../models/Flag";
@Injectable({
    providedIn: 'root'
})

export class FlagService extends CrudBase<Flag> {
    constructor(protected override http: HttpClient) {
        super(http, "Flag");
    }
}