const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
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

function generateReadMe(ans) {
    let template = `# ${ans.projTitle}\n\n${ans.projDesc}\n\n## Table of Contents\n* [Installation](#installation)\n* [Usage](#usage)\n* [License](#license)\n* [Contributing](#contributing)\n* [Tests](#tests)\n* [Questions](#questions)\n\n## Installation\n\n## Usage\n\n## License\n[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)\n\n## Contributing\n\n## Tests\n\n## Questions`;

    return template;
}

async function init() {
    console.log("Welcome to the readme generator. Let's begin.")
    try {
        const answers = await promptUser();

        const readMe = generateReadMe(answers);

        await writeFileAsync("README.md", readMe);

        console.log("Successfully wrote to readMe.md");
    } catch (err) {
        console.log(err);
    }
}

init();