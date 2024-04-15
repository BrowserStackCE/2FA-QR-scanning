var wd = require("wd");
var assert = require("assert");
var asserters = wd.asserters;
var fs = require("fs");
var axios = require("axios");

var desiredCaps = {
    "browserstack.user": "USER",
    "browserstack.key": "KEY",
    build: "Node Android",
    name: "demo_test",
    os_version: "12.0",
    device: "Samsung Galaxy S21",
    app: "bs://app_id",
    "browserstack.debug": false,
    "browserstack.local": false,
    "browserstack.enableBiometric": "true",
    "browserstack.enableCameraImageInjection": true,
};

var driver = wd.promiseRemote("https://hub-cloud.browserstack.com/wd/hub");

driver
    .init(desiredCaps)
    .then(function () {
        return driver.waitForElementByAccessibilityId(
            "Search Wikipedia",
            asserters.isDisplayed && asserters.isEnabled,
            30000
        );
    })
    .then(function (searchElement) {
        return searchElement.click();
    })
    .then(function () {
        waitForImage()
    })
    .then(function async () {
        console.log("File exists: ", fs.existsSync("../web/check.png"));

        // Upload media using axios
        return axios.post(
            "https://api-cloud.browserstack.com/app-automate/upload-media",
            {
                file: fs.createReadStream(
                    "local_path/web/check.png"
                ),
                custom_id: "SampleFile",
            },
            {
                auth: {
                    username: "adarshsingh_GkJR3E",
                    password: "HtfyDgQmxY9ZPpFgUesy",
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    })
    .then(function (response) {
        console.log("Media uploaded successfully:", response.data);
        const media_url = response.data.media_url;
        return driver.execute(
            `browserstack_executor: {"action":"cameraImageInjection", "arguments": {"imageUrl": "${media_url}"}}`
        );
    })
    .then(function (response) {
        console.log(response);
    })
    .then(() => {
        return driver.quit();
    })
    .catch(function (err) {
        console.error("Error:", err);
    });

async function waitForImage() {
    let imageExists = fs.existsSync("../web/check.png");

    while (!imageExists) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
        imageExists = fs.existsSync("../web/check.png");
    }

    // At this point, the image exists
    console.log("Image exists");
    // Your code here that you want to execute after the image exists
}
