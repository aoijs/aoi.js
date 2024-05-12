const { exec } = require("child_process");
const { Agent, fetch } = require("undici");
const json = require("../../package.json");
const AoiError = require("../classes/AoiError.js");

module.exports = async () => {
    try {
        const res = await fetch("https://registry.npmjs.org/aoi.js", {
            dispatcher: new Agent({
                keepAliveTimeout: 10000,
                keepAliveMaxTimeout: 15000
            }),
            headers: {
                "User-Agent": "aoi.js"
            }
        });

        const data = await res.json();
        if (json.version !== data["dist-tags"].latest) {
            AoiError.createConsoleMessage(
                [
                    {
                        text: "",
                        textColor: "white"
                    },
                    {
                        text: "aoi.js is outdated!",
                        textColor: "red"
                    },
                    {
                        text: `Available version: ${data["dist-tags"].latest} ready to install.`,
                        textColor: "white"
                    },
                    {
                        text: "",
                        textColor: "white"
                    },
                    {
                        text: "Installing latest aoi.js version...",
                        textColor: "yellow"
                    }
                ],
                "white",
                { text: "aoi.js AutoUpdate ", textColor: "yellow" }
            );

            const Process = exec("npm i aoi.js@latest", (error) => {
                if (error)
                    return AoiError.createConsoleMessage(
                        [
                            {
                                text: `aoi.js AutoUpdate: ERR! ${error.message}`,
                                textColor: "red"
                            }
                        ],
                        "white",
                        { text: "aoi.js AutoUpdate", textColor: "yellow" }
                    );

                AoiError.createConsoleMessage(
                    [
                        {
                            text: `Successfully Installed aoi.js v${data["dist-tags"].latest}.`,
                            textColor: "white"
                        },
                        {
                            text: "",
                            textColor: "white"
                        },
                        {
                            text: "Commencing 'RESTART' in 3 seconds...",
                            textColor: "yellow"
                        }
                    ],
                    "white",
                    { text: "aoi.js AutoUpdate  ", textColor: "yellow" }
                );

                setTimeout(Reboot, 3000);
            });
        } else {
            return;
        }
    } catch (error) {
        AoiError.createConsoleMessage(
            [
                {
                    text: "aoi.js AutoUpdate: Unexpected error when trying to reach API.",
                    textColor: "red"
                }
            ],
            "white",
            { text: "aoi.js AutoUpdate ", textColor: "yellow" }
        );
    }
};

function Reboot() {
    try {
        process.on("exit", () => {
            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
            });
        });
        process.exit();
    } catch (e) {
        AoiError.createConsoleMessage(
            [
                {
                    text: `aoi.js AutoUpdate: ERR! Failed to commence 'RESTART', ${e.message}`,
                    textColor: "red"
                }
            ],
            "white",
            { text: "aoi.js AutoUpdate ", textColor: "yellow" }
        );
    }
}
