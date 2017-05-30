let path = require('path');
let fs = require('fs');
let open = require('open');
let chalk = require('chalk');

generatePostList();

console.log(chalk.green('buildposts started!'));
let exec = require('child_process').exec;
new Promise((resolve, reject) => {
  // transform markdown to html
  exec('gulp buildposts', (err, stdout, stderr) => {
    if (err) reject(err);
    console.log(chalk.green('buildposts finished!'));
    resolve();
  });
})
.then(() => {
  // start server
  exec('http-server', (err, stdout, stderr) => {
    if(err) Promise.reject(err);
    console.log(chalk.green('http-server started!'));
  });
})
.then(() => {
  // open blog url for regression test
  open('http://127.0.0.1:8080');
})
.catch((e) => {
  console.log(chalk.red('within catch!!!'));
  console.log(chalk.red('Error:' + e));
});

/**
 * generate data/PostList.json(used to show postlist page)
 */
function generatePostList() {
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
  fs.writeFileSync(path.resolve(__dirname, 'data', 'PostList.json'), JSON.stringify(postList, null, 2), {encoding: 'utf8'});
  console.log(chalk.green('build finished!'));
}
/**
 * get file created date from filename
 * @param  {string} filename
 * @return {string} file created date
 */
function getCreateDate(filename) {
  let regex = /^[a-zA-Z0-9&]*_([0-9]{4}-[0-9]{2}-[0-9]{2})\.md$/;
  let matchResult = regex.exec(filename);
  if (matchResult && matchResult[1]) {
    return matchResult[1];
  } else {
    throw new Error(filename + ' is not legit filename, it did not match regex: ' + regex);
  }
}

/**
 * get post subject
 * @param  {string} filename
 * @param  {string} fileContent
 * @return {string} post's subject
 */
function getSubject(filename, fileContent) {
  let regex = /##[\s]*([^\n]+)/;
  let matchResult = regex.exec(fileContent);
  if (matchResult && matchResult[1]) {
    return matchResult[1];
  } else {
    throw new Error(filename + ' do not have a subject');
  }
}

/**
 * get post summary
 * @param  {string} filename
 * @param  {string} fileContent
 * @return {string} file summary
 */
function getSummary(filename, fileContent) {
  let regex = /###[\s]*([^\n]+)/;
  let matchResult = regex.exec(fileContent);
  if (matchResult && matchResult[1]) {
    return matchResult[1];
  } else {
    throw new Error(filename + ' do not have a summary');
  }
}
