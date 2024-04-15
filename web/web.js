const fs = require("fs");
const axios = require("axios");
const path = require("path");
var sleep = require('sleep');

require("chromedriver");
const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const chromeOptions = new chrome.Options();

async function main() {
    const driver = new Builder()
        .forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .build();

    await driver.get("https://www.google.com"); // Google Images search for "flowers"

    const imageElement = await driver.findElement(By.tagName("img")); // Find the first image element
    const imageUrl = await imageElement.getAttribute("src");

    console.log("Image URL (for informational purposes only):", imageUrl);

    // Download the image
    const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
    });

    // Determine file name and extension from URL
    const fileName = path.basename(imageUrl);
    const extension = path.extname(fileName);

    // Save the image to file
    const filePath = path.join(__dirname, "check.png"); // Save in current directory
    fs.writeFileSync(filePath, response.data);

    console.log("Image saved to:", filePath);

    sleep.sleep(40);

    await driver.quit();
}

main();
