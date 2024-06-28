const { execSync, exec } = require("child_process");

let readyExecute = {
  binary: false,
  testPackage: false
};
const projectARN =
  "arn:aws:devicefarm:us-west-2:807608485714:project:28439b46-94b9-4c2f-ba76-aefff9eca9cd";

const uploadResource = (name, type, resourceType) => {
  const result = execSync(
    `aws devicefarm create-upload --project-arn ${projectARN} --name ${name} --type ${type}`
  );
  const parsedResults = JSON.parse(result.toString());
  exec(`curl -T ${name} "${parsedResults.upload.url}"`, (error, stdout, stderr) => {
    if (error) {
      console.log(new Date(), "- RESOURCE UPLOAD FAILED ", error);
      return;
    }
    verifyResource(parsedResults.upload.arn, resourceType)

  });

  return parsedResults;
};
const getResource = (arn, resourceType) => {
  const getUpload = execSync(`aws devicefarm get-upload --arn ${arn}`)
  let results = JSON.parse(getUpload.toString())
  return results.upload;
}
const verifyResource = (arn, type) => {
  let resourcesStatus = getResource(arn).status;
  console.log(new Date(), "- INITIALIZING RESOURCES VERIFICATION...");
  let statusChecker = setInterval(() => {
    if (resourcesStatus === "SUCCEEDED") {
      console.log(new Date(), "- Status: READY");
      readyExecute[type] = true;
      clearInterval(statusChecker);
    }
    else if (resourcesStatus === "FAILED") {
      console.log(new Date(), `- RESOURCE UPLOAD FAILED [${resourcesStatus}]`);
      clearInterval(statusChecker);
      process.exit(1);
    }
    else {
      console.log(new Date(), "- Checking Status...");
      console.log(new Date(), `- Current: NOT READY [${resourcesStatus}]`);
      resourcesStatus = getResource(arn).status
    }
  }, 5000);

}
const uploadAndValidation = () => {
  const arguments = process.argv.slice(2);
  let apkUpload = uploadResource("app_remesas.apk", "ANDROID_APP", "binary");
  let testPackageUpload = uploadResource(
    "webdriverio.zip",
    "APPIUM_NODE_TEST_PACKAGE",
    "testPackage"
  );
  let scheduler = setInterval(() => {
    if (readyExecute.binary && readyExecute.testPackage) {
      const scheduleRun = execSync(
        `aws devicefarm schedule-run --project-arn ${projectARN} --name "${arguments[0]}" --app-arn ${apkUpload.upload.arn} --device-pool arn:aws:devicefarm:us-west-2:807608485714:devicepool:28439b46-94b9-4c2f-ba76-aefff9eca9cd/1d75adac-b68d-4f63-b8f9-8b2e7a5d99d7 --test type=APPIUM_NODE,testPackageArn=${testPackageUpload.upload.arn},testSpecArn=arn:aws:devicefarm:us-west-2:807608485714:upload:28439b46-94b9-4c2f-ba76-aefff9eca9cd/7af04c97-27d8-4853-975e-f41231f2bebe`
      );
      console.log(new Date(), `- EXECUTING RUN...`);
      console.log("")
      console.log(scheduleRun.toString());
      clearInterval(scheduler)
    }
  }, 5000)
};

uploadAndValidation();


