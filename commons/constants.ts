/**
 * sub page containing constants values
 */
class Constants {
    public static readonly SELECTOR_VALUE = '{VALUE}';
    public static readonly PARAMETRIC_SELECTOR = `//span[contains(.,'${Constants.SELECTOR_VALUE}')]`;
    public static readonly RELAY_CLIENT_URL = 'https://twilio-api-nautilus.herokuapp.com/phones/+12514187060/getsms';
}

export default new Constants();
