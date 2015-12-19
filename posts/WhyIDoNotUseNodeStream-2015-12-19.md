此篇个人翻译，不足之处烦请指出。

[原文链接](https://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html)
#  为什么我不用Node的原生'stream'模块
npm中'readable-stream'是node核心中Stream2和Stream3实现的真实写照。
##  以前那些好日子
在node 0.10之前，实现一个stream意为着继承Stream对象。这个对象只简单的是一个EventEmitter加上了一个特殊的pipe方法来实现stream.

实现一个stream通常像下面这样：

````
var Stream = require(stream).Stream;
var util = require('util');

function MyStream(){
  Stream.call(this);
}

util.inherits(MyStream, Stream);

//任意stream的实现逻辑
````
如果你曾经不得不,在不用辅助库（比如through）的情况下为0.10之前版本的node写一个稍大点的stream, 你就知道状态管理会是个怎么样的噩梦。真正定制stream的实现会比上述代码复杂很多。

##  欢迎来到node 0.10
令人欣慰的是Stream2带来了一系列的stream实现，而不紧紧是pipe().最明显的优点是*状态管理*基本上已不用我们费神。我们只需要去覆写一些抽象的方法，哪怕是在比较复杂的情况下。

实现一个stream现在会是这样：

````
var Readable = require('stream').Readable;
//'Stream' is still provided for backward-compatibility
//Use 'Writable', 'Duplex' and 'Transform' where required
var util = require('util');

function MySteam() {
    Readable.call(this, { /* options, maybe `objectMode: true`*/ });
}

util.inherits(MyStream, Readable);

// stream logic, implemented minly by providing concrete method implementations:

MyStream.prototype._read = function(size){
  //
}
````
状态管理由基类来处理，你可以与内建方法交互，例如对于`Readable` stream 来说是`this.push(chunk)`
stream内部的实现比之前要复杂很多，但这些都是为了让我们这些写custom stream人的生活更美好些。Yay!

##  向后兼容性
当一个新的主要的node稳定版本发布时，那些npm上公开模块的贡献者就要觉定自己的模块要支持哪些node版本。通常来讲，那些npm中流行模块的开发者会去支持当前的node版本以及这之前的一个node稳定版本。

Stream2设计之初就考虑了向后兼容性。require('stream').Stream大多数情况下与我们期待的运行方式是一样的，它也可以和继承其它类的流一起工作。当你把Stream2 pipe在一起时，它们不会像旧版本的stream一样像典型的EventEmitter一样工作。当你把Stream2的流和之前基于EventEmitter的流pipe在一起时，Stream2会运行在*兼容模式*下。

所以Stream2有很好的向后兼容性（除了少数个例）。但是当你想在node 0.8下面使用Stream2会怎么样呢？如果npm中那些开源的包在使用Stream2的情况下想提供兼容性到node 0.8怎么办呢？

###  "readable-stream"的救赎
在node0.9的开发阶段，在0.10发布之前，Isaac开发了新的Stream2，并发布到了npm中，但它不能应用在更之前的node版本中。"readable-stream"实际上是可以npm中获得的node核心模块的实现。这种形式在我们向node1.0行进的过程中会看到更多。像core-util-is包就是node 0.11中新的`is`类型检查功能的实现。

readable-stream给了我们在node核心中没有Stream2的情况下使用Stream2的能力。所以通用的支持旧版本node并同时采用Stream2新特性的模式，一般都以下面这种代码开头，假设你已经把'read-stream'作为了一个依赖：
`var Readable = require('stream').Readable || require('readable-stream').Readable`

##  Stream3: a new flavour
readable-stream也被用来记录0.12版中的改变。即将到来的Stream3实现更像是一个小更改。它尝试把“兼容模式”变为一等公民，还提供了一些对pause/resume方面的改进。

像Stream2一样，Steam3的目标是向后（向前）兼容，但在这方面是有限制的。

现在新的stream实现会将是现在的Stream2的改进，它是unstable development分支的一部分,目前还没有一些特例会与0.10版Stream2相冲突的情况。

###  你的实现基础是什么？
看一看上面用来获取Stream2的实现，想想我们在不同版本的node下会得到什么结果：

````
var Readable = require('stream').Readable || require('readable-stream').Readable;
````
* Node 0.8以及之前：我们会获得依赖中readable-stream提供的部分。
* Node 0.10:我们会获得我们正在使用的特定版本node中自带的Stream2实现。
* Node 0.11:我们会获得我们正在使用的特定版本node中自带的Stream3实现。

这也许在你对你的custom stream所有的开发/实现有完全控制，并且同样掌控他们运行的node版本时不会是一个问题。但它会对在npm中发布的开源软件库有一定的影响，它们的用户可能还在使用node0.8(对一些用户，升级的路线会因为种种原因而不那么顺畅),0.10, 或者正在试用node和v8 0.11中的新特性。

最终的结果就是你stream实现的基础会很不稳定。这个会变的特别严重当我们基于的代码是来自node核心也可能是来自readable-stream包。一些在0.10稍后的版本中（例如0.10.X）改正的问题，就算是readable-stream中已经有相当修复的版本，但那些在使用0.10稍前版本的用户还是会存在一些问题。

然后，当你的streams运行在node 0.11中时，Stream3又会出现一些你的大多数用户不期望出现的细微的不同。

找到这些细微不同的一种方式是通过错误报告。用户可以报告只在特定版本node核心和readable-stream组合的情况下出现的问题，这些问题有可能与node的基础实现无关，但这些问题在浪费大多数人的时间。

那么稳定性又怎么样呢？这种任意组合带来的碎片化意为着你的‘稳定的’库有着外方不稳定的依赖。这个就是你基于一个快速发展的核心库的代价，那些v1之前的平台。但是我们可以选择自己继承的基础库的版本，不用管node自带的版本是怎么样的。readable-stream会帮助我们。

###  重获控制权
为了去掌控你的stream实现基于的版本，我们只要简单的使用readable-stream，完全抛用`require(''stream)`. 那么你就可以决定什么时候把基于的基础库升级到stream3，有可能是在node0.12发布一段时间之后。

readable-stream有两个主要版本，v1.0.x和v1.1x. 前面那个版本跟踪stream在node0.10中的实现，包括bug修复和小的一些改进。后面那个版本本跟踪node0.11中的stream3的实现；我们也可能看到一个针对node 0.12的v1.2x版本。

任何成熟的库都应该遵循minor版本和patch版本（major版本所带来的好处现在还处在讨论当中）。readable-stream会提供给你合适的patch-level的版本，所以当你把依赖指向‘~1.0.0’，你会得到node 0.10最新的Stream2实现，包括所有的问题修复和minor的非break性的提升。patch-level的1.0.x和1.1.x会反映node核心中所有patch-level的代码更新。

当你准备好使用Stream3时，你可以指向'~1.1.0',但你应该要等上一段时间,当stream3的实现和node 0.12中更接近时，而不是在stream3刚开始发布的时候。

###  Smart core FTW!
反你基于的库版本的控制权可以减少那些因为兼容性或是未证明的实现所引入的bug.

当我们依赖于一个不太稳定的标准库去构建我们的应用时，我们就像站在流沙之上，有很少的控制权。这个问题会特别显著当你是一个开源库的作者，这时你的用户会有各种'合理'的理由使用那些不宁愿不去支持的版本。

stream2是一个强大的抽象，但这个实现也远远称不上简单。Strem2的代码在某种程度上会是你在node代码中看到的最复杂的javascript实现。除非你想要对node的实现有一个细致的了解，并在你的开发过程中去咔嚓这个改变，你应该把stream2的依赖像其它库那样引用。***选择readable-stream而不是node核心所提供的***

````
{
  "name": "mystream",
  ...
  "dependencies": {
    "readable-stream": "~1.0.0"
  }
}
````

````
var Readable = require('readable-stream').Readable;
var util = require('util');

function MyStream () {
  Readable.call(this);
}

util.inherits(MyStream, Readable);

MyStream.prototype._read = function (size) {
  // ...
};
````
###  附录："through2"
如果Stream2的基础对象（“类”）对你来说不好理解，或是它引发了你过去做JAVA时的创伤后精神紧张性精神障碍，你可以选择npm中的“through2”包来实现你的工作。

through2是基于Dominic Tarr为Stream2构建的*through*模块，然而"through"是一个纯粹 stream1方式。through2与through的api大体相同，但更灵活和简单。

through2提供给你一个DuplexStream来实现你想实现的所有stream，它可以是只读的，只写的或是一个全双工的stream。实际上你也可以通过不写任何实现就通过through2创建一个passthrough stream.

来看一个例子：

````
var through2 = require('through2');

fs.createReadStream('ex.txt')
    .pipe(through2(function(chunk, enc, callback) {

        for (var i = 0; i < chunk.length; i++)
            if (chunk[i] == 97)
                chunk[i] = 122; // swap 'a' for 'z'

        this.push(chunk);

        callback();

    }))
    .pipe(fs.createWriteStream('out.txt'));

````
或是一个对象流：

````
fs.createReadStream('data.csv')
    .pipe(csv2())
    .pipe(through2.obj(function(chunk, enc, callback) {

        var data = {
            name: chunk[0],
            address: chunk[3],
            phone: chunk[10]
        };

        this.push(data);

        callback();

    }))
    .on('data', function(data) {
        all.push(data);
    })
    .on('end', function() {
        doSomethingSpecial(all);
    });

````