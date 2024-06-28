/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default abstract class Page {
    /**
    * Basic method to validate elements on each view
    */
    abstract validate(): Promise<void>;
}
