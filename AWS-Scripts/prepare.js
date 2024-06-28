const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(__dirname, "..", "package.json");

// Read the package.json file
fs.readFile(packageJsonPath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading package.json:", err);
    return;
  }

  try {
    // Collect arguments
    const arguments = process.argv.slice(2);
    // Parse the JSON data
    const packageJson = JSON.parse(data);

    // Modify a property 
    if (packageJson && packageJson.scripts['start-mobile']) {
      packageJson.scripts['start-mobile-aws'] += `\"${arguments[0]} \"`;
    }

    // Write back the modified package.json
    fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing package.json:", err);
          return;
        }
        console.log("package.json has been updated successfully!");
      }
    );
  } catch (parseError) {
    console.error("Error parsing package.json:", parseError);
  }
});
