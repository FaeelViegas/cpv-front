import { LogLevelEnum } from "src/app/components/modules/logger/log-level.enum";

export const environment = {
    production: false,
    //localhost
    urlAPI: 'http://26.143.137.229:8008/api/',
    //casa
    // urlAPI: 'http://192.168.0.39:8008/api/',
    //faculdade
    // urlAPI: 'http://10.80.50.23:8008/api/',
    baseUrl: "",
    detailedLog: true,
    logLevel: LogLevelEnum.LOG.level
};
