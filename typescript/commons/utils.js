"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../commons/constants");
class Utils {
    static getParsedDate(extra_minutes) {
        let date = new Date();
        if (extra_minutes > 0) {
            date = new Date(date.getTime() + extra_minutes * 60 * 1000); // Add minutes
        }
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let is_pm = false;
        if (minutes >= 55) {
            date = new Date(date.getTime() + 5 * 60 * 1000); // Add 5 minutes
            hours = date.getHours();
            minutes = date.getMinutes();
        }
        if (minutes !== 0) {
            let index = 0;
            for (let i = 0; i < constants_1.Constants.MINUTES_DATEPICKER.length; i++) {
                if (constants_1.Constants.MINUTES_DATEPICKER[i] > date.getMinutes()) {
                    index = i;
                    break;
                }
            }
            minutes = constants_1.Constants.MINUTES_DATEPICKER[index];
        }
        is_pm = (hours >= 12);
        hours = (hours > 12) ? hours - 12 : hours;
        return {
            day: date.getDay().toString().padStart(2, '0'),
            hours: hours.toString(),
            is_pm,
            minutes: minutes.toString(),
            month: date.getMonth() + 1,
            string_month: constants_1.Constants.MONTHS_NAMES[date.getMonth()],
            year: date.getFullYear().toString(),
        };
    }
    static getSmsCode() {
        var code;
        axios_1.default.get(constants_1.Constants.RELAY_CLIENT_URL).then((response) => {
            console.log('------------------------- Var code ---------------------');
            console.log(response.data.code);
            code = response.data.code;
            return response.data.code;
        }, (error) => {
            console.log(error);
        });
        return code;
    }
}
exports.Utils = Utils;
