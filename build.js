let path = require('path');
let fs = require('fs');
let open = require('open');
let chalk = require('chalk');

console.log(chalk.green('build started!'));
let posts = fs.readdirSync(path.resolve(__dirname, 'posts'));
let postList = posts.map((item) => {
  let fileContent = fs.readFileSync(path.resolve(__dirname, 'posts', item)).toString('utf8');
  return {
    date: getCreateDate(item),
    subject: getSubject(item, fileContent),
    summary: getSummary(item, fileContent),
    postContent: item
  };
})
.sort((itemOne, itemTwo) => {
  if (itemOne.date > itemTwo.date) {
    return 1;
  } else if (itemOne.date < itemTwo.date) {
    return -1
  } else {
    return 0;
  }
})
.map((item, index, list) => {
  item.id = index + 1;
  return item;
})
.reverse();
fs.writeFileSync(path.resolve(__dirname, 'data', 'PostList.json'), JSON.stringify(postList), {encoding: 'utf8'});
console.log(chalk.green('build finished!'));

console.log(chalk.green('buildposts started!'));
let exec = require('child_process').exec;
new Promise((resolve, reject) => {
  exec('gulp buildposts', (err, stdout, stderr) => {
    if (err) reject(err);
    console.log(chalk.green('buildposts finished!'));
    resolve();
  });
})
.then(() => {
  exec('http-server', (err, stdout, stderr) => {
    if(err) Promise.reject(err);
    console.log(chalk.green('http-server started!'));
  });
})
.then(() => {
  open('http://127.0.0.1:8080');
})
.catch((e) => {
  console.log(chalk.red('within catch!!!'));
  console.log(chalk.red('Error:' + e));
});


function getCreateDate(filename) {
  let regex = /^[a-zA-Z0-9&]*_([0-9]{4}-[0-9]{2}-[0-9]{2})\.md$/;
  let matchResult = regex.exec(filename);
  if (matchResult && matchResult[1]) {
    return matchResult[1];
  } else {
    throw new Error(filename + ' is not legit filename, it did not match regex: ' + regex);
  }
}

function getSubject(filename, fileContent) {
  let regex = /##[\s]*([^\n]+)/;
  let matchResult = regex.exec(fileContent);
  if (matchResult && matchResult[1]) {
    return matchResult[1];
  } else {
    throw new Error(filename + ' do not have a subject');
  }
}

function getSummary(filename, fileContent) {
  let regex = /###[\s]*([^\n]+)/;
  let matchResult = regex.exec(fileContent);
  if (matchResult && matchResult[1]) {
    return matchResult[1];
  } else {
    throw new Error(filename + ' do not have a summary');
  }
}
