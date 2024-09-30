
# Mobile, Web and API test automation

Mobile, Web and API automation framework based on Cucumber - WebdriverIO - NodeJS - TypeScript - Axios - Allure Reports. With support to execute test on BrowserStack cloud service.

## Table of contents

* [Pre-requisites](#Pre-requisites)
+ [Mobile Exclusive](#Mobile-Exclusive)
	+  [Installing Appium - Android Studio](#Installing-Appium-Android-Studio)
	+  [Configure environment variable](#Configure-environment-variable)
	+  [Creating new virtual device](#Creating-new-virtual-device)

+  [First time run](#First-time-run)

*  [Folders structure](#Folders-structure)
	+  [App](#App)
	+  [commons](#commons)
	+  [Config](#Config)
	+  [features](#features)
	+  [pages: Using Page Object Model Pattern](#pages)
	+  [stepDefinitions](#stepDefinitions)
+  [package.json](#package.json)
+  [Page Object Generator (Outdated)](#Page-Object-Generator-Outdated)
*  [BrowserStack service configuration](#browserstack-service-configuration)
*  [Change Log](#change-log)
*  [Contributing](#contributing)

## Getting started
### Pre-requisites

- Install a [Git Client](https://git-scm.com/downloads/guis) and clone Automation project.
- Install latest version of Node.js from the [official website](https://nodejs.org/) or using [nvm](https://github.com/creationix/nvm) (nvm approach is preferred).
	-  If you install Node.js from the official website, you must check the 'Tools for Native Modules' checkbox during the installation (it is not checked by default).
- Go to [official website JDK 1.8 ](https://www.oracle.com/sa/java/technologies/javase/javase-jdk8-downloads.html), go to *Java SE Development Kit* download and install the last version.

### Mobile-Exclusive

#### Installing-Appium-Android-Studio

- Install Android Studio from the [official website](https://developer.android.com/studio).
- Lastest Appium Server version from the [official website](http://appium.io/).

#### Configure environment variable

1. Right click the Computer icon.
2. Choose Properties from the context menu.
3. Click the Advanced system settings link.
4. Click Environment Variables.
5. In the section System Variables, create or edit **"ANDROID_HOME"** variable and set path of Android sdk. For example
```
Name  : ANDROID_HOME
Value : C:\Users\USERID\AppData\Local\Android\Sdk
```
6. In the section System Variables, create or edit **"JAVA_HOME"** variable and set path of Android sdk. For example
```
Name  : JAVA_HOME
Value : C:\Program Files\Java\jdk1.8.0_241
```

7. In the section System Variables, create or edit **"path"** variable and set path of Android sdk platform-tools. For example
```
Name  : path
Value : C:\Users\USERID\AppData\Local\Android\Sdk\platform-tools
```
8. In the section System Variables, create or edit **"path"** variable and set path of Android emulator. For example
```
Name  : path
Value : C:\Users\USERID\AppData\Local\Android\Sdk\emulator
```
#### **Creating new virtual device:**

	  - Open **Android Studio** and go to: **Tools** -> **AVD Manager** -> **Create Virtual Device...**
	  - Select **Nexus 6** - > **Next** -> **API Level 10** -> **Next** -> Then rename device as Nexus 6 -> **Finish**.

	**List of devices connected**

	With this command we can see a list of emualtors available on our local machine.

	```

	$ emulator -list-avds

	```

	**Open an emulator**

	We can open an emulator with the command **emulator** *@device_name* from the list of devices availables on local machine.
	For example:

	```

	$ emulator @Nexus_6

	```


# First time run

As root or admin.
### Run tests by tag @run

To install dependencies:
```console
$ npm install
```

To execute web testing in Chrome

```console
$ npm run start-web
```

With an emulator open to execute mobile testing on local machine.

```console
$ npm run start-mobile
```
Exclusive **BrowserStack**: With user and key of an account and  to execute mobile testing. Account's data must be in config file: config\wdio.mobile.bs.conf.ts.

```console
$ npm run start-mobile-bs
```


### Generate Allure-Reports after an execution

```console
$ npm run clean-report
```

To Open an Allure Report

```console
$ npm run open-report
```
# Folders structure



# **App**


In this folder we need to have the apk artifact.


# **Config**


We have this files:
- **wdio.chrome.conf.ts**:  with configurations to run tests on Chrome.
- **wdio.mobile.conf.ts**:  with configurations to run tests on a local mobile Android Device.
- **wdio.mobile.bs.conf.ts**: with configurations to run mobile tests on a BrowserStack mobile Android Device.

Configuration and parameters:
- **specs**: List of cucumber features to execute.
-  **reporters/reporter options:** Specifies the reporter to use, we use Allure Report.
-  **host/port/path:** Configuration of Appium server.
-  **maxInstances:** Maximus instances per execution, by default we must execute with 1 for mobile.
- **waitforTimeout/connectionRetryTimeout:** Parameters to set maximus time out.

-  **capabilities:** set of options related to device, platform, device name.
   - **browserName**: 'chrome' for web, empty for mobile.
   - **maxInstances**: To define the maximum amount to run parallel tests.
   - **platformName**: Android/iOS.
   - **app:** './app/**Android-NativeDemoApp-0.4.0.apk**'*.
   - **appPackage:**: Package name of the app.
     -  Field: **manifest.package** of AndroidManifest.xml file of apk.
   - **appActivity:**: Name of the first view or activity that open when we open our app.
     - Field: **manifest.activity** (**android:name**) of AndroidManifest.xml file of apk.
   - **platformVersion**: Associated to API version, Android version. **For example**: 10.
   - **deviceName:** Identifier of the device. **For example**: Nexus 6 of default value: emulator-5554.
   - **automationName:** We always use: **UiAutomator2** for Android.
-  **capabilities: (BrowserStack)** set of options related to device, platform, device name.
   - **appium:app**: **app_url** value that we get after uploading an app to BrowserStack, **For example**: *'bs://dbf4840f740e91f9d2e546479afd820ebc5a6e56'*.
   - **appium:deviceName**: Identifier of the device. **For example**: Google Pixel 3.
   - **appium:platformVersion**: Associated to API version, Android version. **For example**: 10.
   - **appium:automationName**: We always use: **UiAutomator2** for Android.

- **services:**
  - For web we use **chromedriver**.
  - For mobile we use **appium** service.
  - To use **BrowserStack** service we use: **browserstack** and *browserstackLocal* property in true.

- **logLevel:** We can use debug to log all the actions on appium or silent mode only to log final results.
- **framework/cucumberOpts:** We use Cucumber framework to execute.
  - On **cucumberOpts.require** we specify the steps of .ts files to exectute of the folder **stepDefinitions**.

**List of hooks of Cucumber we use:**

**IMPORTANT:** All hooks must be implemented using async/await.

**Examples**:

```Typescript
    /**
     * Runs after a Cucumber step
     */
    afterStep: async function () {
        await browser.takeScreenshot();
    },
```

```Typescript
    /**
     * Runs after a Cucumber scenario
     */
    afterScenario: async function () {
        await browser.closeApp();
        await browser.reset();
    },
```

- **onPrepare:** Actions to to before de begin of the excecution.
- **afterCommand:** Actions to do after a command is executed, for example after a click we want to take a screenshot.
- **onComplete:** Actions to do after all test had been executed.
- **beforeScenario:** Actions to do before a scenario is executed. For example: we use **browser.reset();** to prepeare the initial conditions.
- **afterScenario:** Actions to do after a scenario was executed. For example: **browser.closeApp()**; to close a mobile app. **browser.reloadSession()**; to reload a web browser.

We can use differents hooks, please visit [WebDriver IO Hooks](https://webdriver.io/docs/options.html#hooks) for more details.

# **features**

On this folder we have the list of cucumber .feature files group by functionalities.

# **pages**

On this folder we have the definitions of each view of our application using  Page Object Model pattern to define using Typescript.

The basic structure of each POM must have:
Filename: **viewToModelPO.ts**

```Typescript
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUsername() { return $('#username') }
    get inputPassword() { return $('#password') }
    get btnSubmit() { return $('button[type="submit"]') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login(username: string, password: string) {
        await (await this.inputUsername).setValue(username);
        await (await this.inputPassword).setValue(password);
        await (await this.btnSubmit).click();
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open() {
        return super.open('login');
    }
}

export default new LoginPage();

```

# **stepDefinitions**

On this folder we have to create the steps per functionality out set of scenarios defined on our .feature files.

**For example**:
  We have an **login.feature** file with this definition to execute with a set of 2 groups of data:

```Gherkin
@run @web
Feature: The Internet Guinea Pig Website

  @login_web
  Scenario Outline: As a user <username>, I can log into the secure area

    Given I am on the login page
    When I login with <username> and <password>
    Then I should see a flash message saying <message>

    Examples:
      | username | password             | message                        |
      | tomsmith | SuperSecretPassword! | You logged into a secure area! |
      | foobar   | barfoo               | Your username is invalid!      |
```

For each **Given**, **When**, **Then** step we have to create a step to do the behavior that happen on the application.

**For example:**
On our **loginSteps.ts** file, we will import our pages defined to create a test.

```Typescript
import { Given, Then, When } from '@cucumber/cucumber';
import LoginPage from '../../pages/web/login.page';
import Page from '../../pages/web/page';
import SecurePage from '../../pages/web/secure.page';


const pages: { [key: string]: Page } = { ["login"]: LoginPage };

Given(/^I am on the (\w+) page$/, async (page: string) => {
    await pages[page].open();
});

When(/^I login with (\w+) and (.+)$/, async (username: string, password: string) => {
    await LoginPage.login(username, password);
});

Then(/^I should see a flash message saying (.*)$/, async (message: string) => {
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(message);
});

```

# **commons**

On this folder we have a few utility classes for example: **constants.ts**, **utils.ts**.


# **package.json**

Scripts desctiptions:


- `clean`: Delete all files generated on each execution like reports.
- `start-mobile`: with this script we only run the **scenarios** or **features** with **@run** tag. on every .feature file that we have on our **wdio ./config/wdio.mobile.config.ts** on field specs and have to be releated to the stepDefinition files on cucumberOpts.require from the same config file.
- `start-mobile-bs`: *exclusive to use **BrowserStack service***. With this script we only run the **scenarios** or **features** with **@run** tag. on every .feature file that we have on our **wdio ./config/wdio.mobile.bs.config.ts** on field specs and have to be releated to the stepDefinition files on cucumberOpts.require from the same config file.
- `start-web`: with this script we only run the **scenarios** or **features** with **@run** tag. on every .feature file that we have on our **wdio ./config/wdio.chrome.config.ts** on field specs and have to be releated to the stepDefinition files on cucumberOpts.require from the same config file.
- `clean-report`: We generate the allure reports after an excecution.
- `open-report`: We can open de allure reports.
- `version`: We can auto-generate release note of our changes.


# Page Object Generator (Outdated)

Generate *PO.ts files to have our Page Object Model class


## How to use

Open utils/generator/generator.ts file and set the list the elements that will be nessesary for our scripts.

For example: Header Page

```Typescript
import { Util } from './util';

/**
 * on fieldList we define the names of our UI Elements that we will model in our POM classes
 */
const fieldList: string[] = [
    'menu_side',
    'title_header',
    'logout_btn',
];

const util: Util = new Util();
util.generatePageObjectFile(fieldList);

```

Run generator

```
npm run generate-po
```

It will generate viewPO.ts file for page layer. We only need to change class name and fill the path to locale the elements.

For example:

```
--------------------------------------------
poGenerated/viewPO.ts
--------------------------------------------
```

```Typescript
export class ViewPO {

    private menu_side: string;
    private title_header: string;
    private logout_btn: string;

    constructor() {
        this.menu_side = '#menu_side';
        this.title_header = '#title_header';
        this.logout_btn = '#logout_btn';
    }

    public validatePage(): void {
        browser.$(this.menu_side).waitForExist();
        browser.$(this.title_header).waitForExist();
        browser.$(this.logout_btn).waitForExist();
    }

    public menuSide(): WebdriverIO.Element {
        browser.$(this.menu_side).waitForExist();
        return browser.$(this.menu_side);
    }

    public titleHeader(): WebdriverIO.Element {
        browser.$(this.title_header).waitForExist();
        return browser.$(this.title_header);
    }

    public logoutBtn(): WebdriverIO.Element {
        browser.$(this.logout_btn).waitForExist();
        return browser.$(this.logout_btn);
    }

}

```

# **BrowserStack service configuration**

If you don't have an account but you want to try this service, firstly you need to create an **ACCESS_KEY**, that is **BROWSERSTACK_USERNAME** and **BROWSERSTACK_ACCESS_KEY**.

To create an account please go to [the official website](https://www.browserstack.com) to sign up.

When you are logged in, go to profile and click on *"Go to Dashboard"* to get username and access key.

This credentials have to be in config file, for example in: config\wdio.mobile.bs.conf.ts y fields: user and key entry respectively.

**Upload App**

An API to upload the App you want to test on the BrowserStack servers for interactive app testing. Use it to upload via CLI or automation scripts.

```console
curl -u "BROWSERSTACK_USERNAME:BROWSERSTACK_ACCESS_KEY" -X POST "https://api-cloud.browserstack.com/app-automate/upload" -F "file=@/path/to/app/file/Application-debug.apk"
```

Example:

**BROWSERSTACK_USERNAME**=sdetbaufest_zJFoTm
**BROWSERSTACK_ACCESS_KEY**=yMT1Mg8rXX3MnH1bvqFC

```console
curl -u "sdetbaufest_zJFoTm:yMT1Mg8rXX3MnH1bvqFC" -X POST "https://api-cloud.browserstack.com/app-automate/upload" -F "file=@C:/baf/app/Android-NativeDemoApp-0.4.0.apk"
```

**Note:**

```console

1. Supported file formats are .apk and .aab for Android apps and .ipa for iOS apps.
2. App upload will take few seconds to about a minute depending on the size of your app. Do not interrupt the curl command until you get the response back.
3. If you upload an iOS app, we will resign the app with our own provisioning profile to be able to install your app on our devices during test execution.
4. We will delete the uploaded app after 30 days from the date of upload.
5. Max file size supported is 1 GB.
```

After executing this command you will get the **app_url** value:
```console
{"app_url":"bs://f21b5b310fc6684c6f9dbd24d2549c7a586cde85"}
```

That **app_url** value is needed to add to capabilities in the config file to have a reference of our app to be automated.

```Typescript
    capabilities: [{
        "appium:app": 'bs://f21b5b310fc6684c6f9dbd24d2549c7a586cde85',
        "appium:deviceName": 'Google Pixel 3',
        "appium:platformVersion": '10.0',
        "appium:automationName": 'UiAutomator2',
        "platformName": "Android",
    }],
```

# **Change log**

Run "version" command to create the change log with details of changes that we made on each sprint.

```console
npm run version
```

This will create a HISTORY.md file.

# **Contributing**


### Commits:


For our commits message we use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification which provides an easy set of rules for creating an explicit commit history adding readable meaning to commit messages.


> See [Conventional Commits full specification](https://www.conventionalcommits.org/en/v1.0.0/#specification).



#  **Process**



1. Fork from `master` branch.

2. Create your branch with the reference of the associated ticket id of your project management tool like Jira, Azure DevOps  (`git checkout -b type/####-Description`)

3. Commit your changes (`git commit -am 'feat(feature):'`)

4. Push to the branch (`git push origin type/####-description`)

5. Create new Pull Request
