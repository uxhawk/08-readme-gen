const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([{
            type: "input",
            name: "gitHub",
            message: "What is your GitHub username?"
        },
        {
            type: "input",
            name: "projTitle",
            message: "What is the title of your project?"
        },
        {
            type: "input",
            name: "projDesc",
            message: "What is the description of your project?"
        },
        {
            type: "input",
            name: "projInstall",
            message: "What are the installation instructions?"
        },
        {
            type: "input",
            name: "projUsage",
            message: "What are the usage instructions?"
        },
        {
            type: "list",
            name: "license",
            message: "What license would you like to use?",
            choices: ["ISC", "MIT", "GNU GPLv3"]
        },
        {
            type: "input",
            name: "projTests",
            message: "What are the testing instructions?"
        },
        {
            type: "input",
            name: "projQuestions",
            message: "What are the questions for this project?"
        },

    ]);
}

function promptEmail() {
    return inquirer.prompt([{
            type: "input",
            name: "email",
            message: "The program couldn't locate your email address. Please manually input your email."
        }

    ]);
}

function generateReadMe(ans, img, badge, email) {
    //template for readme without any spaces, otherwise formatting is thrown off
    const template = `# ${ans.projTitle}\n\n${ans.projDesc}\n\n## Table of Contents\n* [Installation](#installation)\n* [Usage](#usage)\n* [License](#license)\n* [Contributing](#contributing)\n* [Tests](#tests)\n* [Questions](#questions)\n\n## Installation\n\n${ans.projInstall}\n\n## Usage\n\n${ans.projUsage}\n\n## License\n${badge}\n\n## Contributing\n[<img src="${img}" width="60px" style="border-radius:30px">](https://github.com/${ans.gitHub})\n\n${email}\n\n## Tests\n\n${ans.projTests}\n\n## Questions\n\n${ans.projQuestions}`;

    return template;
}

async function init() {
    console.log(`\nWelcome to the README generator.\n\nThese prompts will help you create a legit README.md file for your project.\n\nLet's begin.\n${`-`.repeat(60)}\n`);
    try {
        const answers = await promptUser();

        const gitData = await axios.get(`https://api.github.com/users/${answers.gitHub}/events/public`);

        var userEmail = "";
        //loop through the massive events/public JSON object to look for an email
        for (let i = 0; i < gitData.data.length; i++) {
            if (gitData.data[i].payload.hasOwnProperty("commits")) {
                userEmail = gitData.data[i].payload.commits[0].author.email;
                break;
            }
        };

        if (userEmail === "") {
            emailFollowUp = await promptEmail();
            userEmail = emailFollowUp.email;
        }

        const avatar = gitData.data[0].actor.avatar_url;

        //get the badge for the license
        const license = answers.license;
        var badge = "";
        if (license === "ISC") {
            badge = `[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)`;
        } else if (license === "MIT") {
            badge = `[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)`;
        } else {
            badge = `[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)`;
        }

        const readMe = generateReadMe(answers, avatar, badge, userEmail);

        await writeFileAsync("README2.md", readMe);

        console.log("Successfully wrote to readMe.md");
    } catch (err) {
        console.log(err);
    }
}

init();