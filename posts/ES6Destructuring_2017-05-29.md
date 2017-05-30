## ES6(一) Destructuring

### 昨天在写node command line的应用的时候, 发现一些es6的语法还是掌握的不是太熟练, 所以这里准备写个系统的es6/7的blog, 也把相关的知识再巩固一下, 第一篇就先来说说平时用的很多的对象/数组的结构赋值吧

Refer links: [es6-destructuring-in-depth](https://ponyfoo.com/articles/es6-destructuring-in-depth)

结构赋值是无疑是我用的最多的新特性之一. 也非常简单. 它可以方便的从对象/数组里提取出你需要的内容.

```
const foo = { bar: 'bar', baz: 3 };
const { bar, baz } = foo;
console.log(bar); // 'bar'
console.log(baz); // 3
```

对象的解构赋值也允许给变量重命名.

```
const foo = { bar: 'bar', baz: 3 };
const { bar: a, baz: b } = foo;
console.log(a); // 'bar'
console.log(b); // 3
```

你也可以从对象中提取深层次的属性, 同样变量重命名这里也是适用的.

```
const foo = { bar: { deep: 'deep', deep2: 'deep2' } };
const { bar: { deep, deep2: baz } } = foo;
console.log(deep); // 'deep'
console.log(baz); // 'deep2'
```

如果你试图去访问的深层次的属性的parent不存在的话, 会有Exception throw出来.

```
const { foo: { bar } } = {baz: 'ouch'}; // Exception
```

我们也可以设置默认值, 当要访问的属性返回undefined的时候, 默认值会被应用.

```
const { foo = 3 } = { foo: 2 };
console.log(foo); // 2

const { bar = 3 } = {};
console.log(bar); // 3
```

解构赋值对数组也同样适用.

```
const [foo] = [19];
console.log(foo); // 19
```

默认值也同样适用.

```
const [foo] = [];
console.log(foo); // undefined

const [bar=10] = [];
console.log(bar); // 10
```

#### 解构赋值的使用场景

解构赋值有很多的适用场景, 下面是一些用的比较多的地方

1. 当你的一个function返回值为对象时, destructuring 会让操作表达的更简洁

	```
	const getCoords = () => ({ x: 10, y: 22 });
	const { x, y } = getCoords();
	console.log(x); // 10
	console.log(y); // 22
	```

	ps: 注意这里的箭头函数在函数体是单选的情况且返回值为对象的情况下, 要用()把函数体包裹起来, 不然解析器会报错的

2. 一个相似但相反的情况是, 你可以把解构用在函数的传参上面.

	```
	const random = ({ min=1, max=300 }) => Math.floor(Math.random() * (max - min)) + min;
	console.log(random({})); // 40
	console.log(random({ max: 24 })); // 18
	```

	如果这里你想把整个option对象变为optional的, 可以把写法改成下面的这样.

	```
	const random = ({ min=1, max=300 } = {}) => Math.floor(Math.random() * (max - min)) + min;
	console.log(random()); // 290
	```

3. 解构赋值可以不借助中间变量来实现两个变量值的互换.

	```
	const swap = () => {
		let left = 10;
		let right = 20;
		if (right > left) [left, right] = [right, left];
		console.log(left); // 20
		console.log(right); // 10
	}
	swap();
	```

4. 数组的解构赋值可以用来方便的跳过一些你不需要的值.

	```
	const getUrlParts = (url) => {
		const blogRegex = /^(https?):\/\/(\w+).github.io/;
		return blogRegex.exec(url);
	}
	const [, protocol, blogger] = getUrlParts('http://andregeng.github.io');
	console.log(protocol); // 'http'
	console.log(blogger); // 'andregeng'
	```

## 一些特殊情况
1. import语句的语法和解构语法是不同的, 它们看起来很相似, 但import语句并不遵循解构语法

		```
		import React, { PropTypes } from 'react';

		```

		import语句与解构语法有以下几点不同:
		1. 默认值语法不适用于import语句
			```
			import { PropTypes={} } from 'react'; // Exception
			```
		2. 'Deep' destructuring语法不适用于import语句
			```
			import { foo: { bar } } from 'test'; // Exception
			```
		3. 重命名语法不适用于import语句
			```
			import { foo: bar } from 'test'; // Exception
		```

2. 对已声明的对象解构赋值
细心的你有可能注意到了, 前面的解构语句中用到的变量都是和它的声明放在一起的, 那我们能不能对已经声明的变更做解构赋值呢?
```
let foo;
let bar;
({foo, bar} = { foo:1, bar:2 });
```
这是可以的, 只是要注意下第三行这里的小括号, **没有的话,解析器可是会报错的哦~**
