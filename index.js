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

    ]);
}

function generateReadMe(ans, img) {
    let template = `[![GitHub stars](https://img.shields.io/github/stars/${ans.gitHub}/gw-hmwk-08-readme-gen.svg?style=social&label=Star&maxAge=2592000)](https://github.com/${ans.gitHub}/gw-hmwk-08-readme-gen)\n\n# ${ans.projTitle}\n\n${ans.projDesc}\n\n## Table of Contents\n* [Installation](#installation)\n* [Usage](#usage)\n* [License](#license)\n* [Contributing](#contributing)\n* [Tests](#tests)\n* [Questions](#questions)\n\n## Installation\n\n## Usage\n\n## License\n[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)\n\n## Contributing\n[<img src="${img}" width="60px" style="border-radius:30px">](https://github.com/${ans.gitHub})\n\n## Tests\n\n## Questions`;

    return template;
}

async function init() {
    console.log("Welcome to the readme generator. Let's begin.")
    try {
        const answers = await promptUser();

        const avatar = await axios.get(`https://api.github.com/users/${answers.gitHub}`);

        const avatarUrl = avatar.data.avatar_url;

        const readMe = generateReadMe(answers, avatarUrl);

        await writeFileAsync("README.md", readMe);

        console.log("Successfully wrote to readMe.md");
    } catch (err) {
        console.log(err);
    }
}

init();
// https://api.github.com/users/octocat/orgs
// /user/emails
//https://api.github.com/users/uxhawk/events/public
//[<img src="img" width="60px" style="border-radius:30px">](https://github.com/${ans.gitHub})

//[![GitHub stars](https://img.shields.io/github/stars/${answers.gitHub}/gw-hmwk-08-readme-gen.svg?style=social&label=Star&maxAge=2592000)](https://github.com/answers.gitHub/gw-hmwk-08-readme-gen)