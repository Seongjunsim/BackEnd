// @ts-check
require('dotenv').config();
const fs = require('fs');
const { program } = require('commander');
const { Octokit } = require('octokit');

program.version('0.0.1');

const { GITHUB_ACCESS_TOKEN } = process.env;

const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });

program
  .command('me')
  .description('check my profile')
  .action(async () => {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();
    console.log(login);
  });

program
  .command('list-bugs')
  .description('List issues with bug label')
  .action(async () => {
    const result = await octokit.rest.issues.listForRepo({
      owner: 'Seongjunsim',
      repo: 'BackEnd',
    });

    const issuesWithBugLabel = result.data.filter(
      (issue) =>
        issue.labels.find((label) => label.name === 'bug') !== undefined
    );

    const output = issuesWithBugLabel.map((issue) => ({
      title: issue.title,
      number: issue.number,
    }));

    console.log(output);
  });

program
  .command('check-prs')
  .description('Check pull requrest status')
  .action(() => {
    console.log('Check PRS');
  });

program.parse();
