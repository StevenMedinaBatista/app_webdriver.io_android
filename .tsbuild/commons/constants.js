"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Constants {
}
Constants.SELECTOR_VALUE = '{VALUE}';
Constants.PARAMETRIC_SELECTOR = `//span[contains(.,'${Constants.SELECTOR_VALUE}')]`;
Constants.RELAY_CLIENT_URL = 'https://twilio-api-nautilus.herokuapp.com/phones/+12514187060/getsms';
exports.default = new Constants();
