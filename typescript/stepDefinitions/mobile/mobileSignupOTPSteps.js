"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
const signupOTP_1 = require("../../pages/mobile/signupOTP");
const constants_1 = require("../../commons/constants");
const axios_1 = __importDefault(require("axios"));
const signup_page_otp = new signupOTP_1.SignupOTP();
cucumber_1.Then(/^The OTP screen is displayed$/, function () {
    signup_page_otp.signupTitleLabel().waitForExist({ timeout: 8000 });
    expect(signup_page_otp.signupVerificationLabel()).toBeDisplayed;
    expect(signup_page_otp.signupTitleLabel()).toBeDisplayed;
    expect(signup_page_otp.signupThisNotLabel()).toBeDisplayed;
    expect(signup_page_otp.signupResendButton()).toBeDisplayed;
    expect(signup_page_otp.signupPhoneNumberLabel()).toBeDisplayed;
    expect(signup_page_otp.signupBackBtn()).toBeDisplayed;
});
cucumber_1.Then(/^OTP title is displayed with text "(.*?)"$/, function (expected) {
    expect(signup_page_otp.signupTitleLabel().getText()).toEqual(expected);
});
cucumber_1.Then(/^Back button is displayed in the otp screen$/, function () {
    expect(signup_page_otp.signupBackBtn()).toBeDisplayed;
});
cucumber_1.Then(/^the first text "(.*?)" is displayed in the otp screen$/, function (expected) {
    expect(signup_page_otp.signupVerificationLabel().getText()).toEqual(expected);
});
cucumber_1.Then(/^the second text with phone number "(.*?)" is displayed in the otp screen$/, function (expected) {
    signup_page_otp.signupPhoneNumberLabel().waitForExist;
    expect(signup_page_otp.signupPhoneNumberLabel().getText()).toEqual(expected);
});
cucumber_1.Then(/^the below text "(.*?)" is displayed in the otp screen$/, function (expected) {
    expect(signup_page_otp.signupThisNotLabel().getText()).toEqual(expected);
});
cucumber_1.Then(/^the inputs to type the OTP code are displayed$/, function () {
    expect(signup_page_otp.signupVerificationInputs()).toBeDisplayed;
});
cucumber_1.Then(/^the OTP resend button is displayed with text "(.*?)"$/, function (expected) {
    expect(signup_page_otp.signupResendButton().getText()).toContain(expected);
});
cucumber_1.Then(/^tap Resend btn in OTP screen$/, function () {
    signup_page_otp.signupResendButton().click();
});
cucumber_1.Then(/^the user fill the OTP SMS inputs with code "(.*?)"$/, (param) => {
    signup_page_otp.fillInputOTP(param);
});
cucumber_1.Then(/^the user fill the OTP SMS inputs with code received trough sms$/, () => {
    signup_page_otp.signupTitleLabel().waitForExist({ timeout: 15000 });
    var sms_code;
    const sms = axios_1.default.get(constants_1.Constants.RELAY_CLIENT_URL).then((response) => {
        //resolve response.data.code;
        sms_code = response.data.code;
    }, (error) => {
        console.log(error);
    });
    sms;
    browser.pause(5000);
    signup_page_otp.fillInputOTP(sms_code);
});
cucumber_1.Then(/^the warning message "(.*?)" is displayed in the otp screen$/, (param) => {
    expect(signup_page_otp.signupWarningLabel().getText()).toEqual(param);
});
