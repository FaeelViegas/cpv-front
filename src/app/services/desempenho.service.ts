import { Injectable } from "@angular/core";
import { CrudBase } from "./crudBase";
import { HttpClient } from '@angular/common/http';
import { DesempenhoMensal } from "../models/Desempenho";
@Injectable({
    providedIn: 'root'
})

export class DesempenhoService extends CrudBase<DesempenhoMensal> {
    constructor(protected override http: HttpClient) {
        super(http, "Desempenho");
    }
}