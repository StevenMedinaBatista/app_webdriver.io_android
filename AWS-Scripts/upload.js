const { execSync } = require("child_process");
const os = require("os");
const projectARN =
  "arn:aws:devicefarm:us-west-2:807608485714:project:28439b46-94b9-4c2f-ba76-aefff9eca9cd";

let reportFilePath;

if (os.platform().includes("win32")) {
  reportFilePath = `${__dirname}\\Host_Machine_Files\\$DEVICEFARM_LOG_DIR`;
} else {
  reportFilePath = `${__dirname}/Host_Machine_Files/'$DEVICEFARM_LOG_DIR'`;
}
const getCurrentRun = () => {
  const allRuns = execSync(`aws devicefarm list-runs --arn ${projectARN}`);
  const allRunsParsed = JSON.parse(allRuns.toString());
  return allRunsParsed.runs[0];
};


const checkForRunStatus = () => {
  let currentRun = getCurrentRun();
  let statusChecker = setInterval(() => {
    if (currentRun.status === "COMPLETED") {
      console.log(new Date(), "- Status:", currentRun.status);
      downloadArtifact();
      clearInterval(statusChecker);
    } else {
      console.log(new Date(), "- Checking Status...");
      console.log(new Date(), `- Current: ${currentRun.status}`);
      currentRun = getCurrentRun();
    }
  }, 50000);
};

const getArtifactFromCurrentRun = () => {
  const currentRun = getCurrentRun();
  const listArtifacts = execSync(
    `aws devicefarm list-artifacts --arn ${currentRun.arn} --type "FILE"`
  );
  const listArtifactsParsed = JSON.parse(listArtifacts.toString());
  const retrieveZipFile = listArtifactsParsed.artifacts.filter(
    (file) => file.extension === "zip"
  );
  if (retrieveZipFile.length > 0) {
    return retrieveZipFile[0].url;
  } else {
    return "failed";
  }
};

const downloadArtifact = () => {
  const artifactDownloadUrl = getArtifactFromCurrentRun();
  if (artifactDownloadUrl === "failed") {
    console.log("fallo al encontrar link de descarga de reporte");
  } else {
    const downloadArtifact = execSync(
      `curl "${artifactDownloadUrl}" > artifacts.zip`
    );
    let getAllureReport = execSync(`unzip -o artifacts.zip`).toString();
  console.log(getAllureReport);
  execSync(`mv ${reportFilePath}/allure-report.zip ${__dirname}`);
  let extractAllureReport = execSync(`unzip -o allure-report.zip -d ./allure-report`).toString();
  console.log(extractAllureReport);
  }
};


checkForRunStatus();

