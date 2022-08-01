/// <reference types="cypress" />

const fs = require("fs-extra");
const path = require("path");

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    async rmdir(fullpath) {
      const filename = path.join(__dirname, "..", "..", ...fullpath);
      if(fs.existsSync(path.resolve(__dirname, 'cypress', 'screenshots'))) {
        await fs.rmdirSync(filename, { recursive: true, force: true });
      }
      return null;
    },

    async getFile(fullpath) {
      const filename = path.join(__dirname, "..", "..", ...fullpath);
      const data = await fs.readFileSync(filename, { encoding: "base64" });
      return data;
    }
  });

  on("after:screenshot", details => {
    const newPath = path.join(__dirname, "..", "..", "cypress", "screenshots", "screenshot.png");
    return new Promise((resolve, reject) => {
      fs.rename(details.path, newPath, err => {
        if (err) return reject(err);
        resolve({ path: newPath });
      });
    });
  });

  // chrome uses a color schema that changes the colors
  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.name === "chrome") {
      launchOptions.args.push("--force-color-profile=srgb");
    }

    return launchOptions;
  });
}
