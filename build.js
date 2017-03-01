var path = require('path');
var fs = require('fs');
console.log('build started!');
var posts = fs.readdirSync(path.resolve(__dirname, 'posts'));
var postList = posts.map(function(item) {
  var fileContent = fs.readFileSync(path.resolve(__dirname, 'posts', item)).toString('utf8');
  return {
    date: getCreateDate(item),
    subject: getSubject(item, fileContent),
    summary: getSummary(item, fileContent),
    postContent: item
  };
})
.sort(function(itemOne, itemTwo) {
  if (itemOne.date > itemTwo.date) {
    return 1;
  } else if (itemOne.date < itemTwo.date) {
    return -1
  } else {
    return 0;
  }
})
.map(function(item, index, list) {
  item.id = index + 1;
  return item;
})
.reverse();
fs.writeFileSync(path.resolve(__dirname, 'data', 'PostList.json'), JSON.stringify(postList), {encoding: 'utf8'});
console.log('build finished!');
function getCreateDate(filename) {
  var regex = /^[a-zA-Z0-9&]*_([0-9]{4}-[0-9]{2}-[0-9]{2})\.md$/;
  var matchResult = regex.exec(filename);
  if (matchResult && matchResult[1]) {
    return matchResult[1];
  } else {
    throw new Error(filename + ' is not legit filename, it did not match regex: ' + regex);
  }
}

function getSubject(filename, fileContent) {
  var regex = /#[\s]*([^\n]+)/;
  var matchResult = regex.exec(fileContent);
  if (matchResult && matchResult[1]) {
    return matchResult[1];
  } else {
    throw new Error(filename + ' do not have a subject');
  }
}

function getSummary(filename, fileContent) {
  var regex = /##[\s]*([^\n]+)/;
  var matchResult = regex.exec(fileContent);
  if (matchResult && matchResult[1]) {
    return matchResult[1];
  } else {
    throw new Error(filename + ' do not have a summary');
  }
}
