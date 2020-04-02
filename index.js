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
    let template = `<h1>${ans.projTitle}</h1><p>${ans.projDesc}</p><h2>Table Of Contents</h2><ul><li><a href="#contributors">Contributors</a></li></ul><h3 id=""contributors>Contributors</h3><p>${ans.gitHub}</p>`;


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