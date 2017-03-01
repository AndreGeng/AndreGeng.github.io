# 题目：标准事件模型与ie事件模型的区别

## 不管怎么说今天面试下来总体表现还是不好的，虽然对面试官颇有微词，但他们的面试题还是可以的，也别抱怨工作中没用了，毕竟也是些知识点，再说这些学起来难度也不是太大。不过最后楼主还是那句话We are the cool kids, we do not debug in IE :)

今天楼主去某房企面试了下，面的是前端开发，感觉他们公司前端比较看重：
* 浏览器的兼容(IE大家懂的)，毕竟他们这边网站是面向大众的适配IE，这我也能理解。但楼主真心没仔细看过这方面的东西。但也不用鄙视我吧- -！况且我都解释了我的工作中平时这个真的用不上啊。
* 原生js操作dom. 这个楼主做的也不多，略懂。平时真的是写写angular,其它就jquery用的多。

不管怎么说今天面试下来总体表现还是不好的，虽然对面试官颇有微词，但他们的面试题还是可以的，也别抱怨工作中没用了，毕竟也是些知识点，再说这些学起来难度也不是太大。

不过最后楼主还是那句话We are the cool kids, we do not debug in IE :)

## 正题：
* 标准的事件模型是分捕获和冒泡两个阶段的，这里的区别就是IE下面只有冒泡的过程。

  1. 那事件的挂载在IE和标准里面又有什么不同呢？
    * 标准的大家都知道是用addEventListener, 方法签名：
    target.addEventListener(type, listener[, useCapture]); //参考：[addEventListener-MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

    e.g: ele.addEventListener('click', clickHandler, false);
    * IE下呢这个方法叫做attachEvent, 方法签名：target.attachEvent(eventNameWithOn, callback)

    e.g: ele.attachEvent('onclick', clickHandler)

    **注意：**IE下这个方法的监听还要加上'on'的，哎- -！

  2. 取消事件的传递IE和标准又有什么不同呢？
    * 标准说我们用eve.stopPropogation()
    * IE: eve.cancelBabble = true;

  3. 阻止事件默认行为IE和标准又有什么不同呢？
    * 标准说我们用eve.preventDefault()
    * IE: eve.returnValue = false;


* js原生怎么操作DOM
  1. DOM节点创建
    var ele = document.createElement(tagName);
      vs
    var $ele = $(tagName);
  2. 添加创建的节点到document中
    var child = ele.appendChild(child);
      vs
    var $child = $elem.append(child);
  3. 给节点添加样式
    ele.style.color = "#fff";
    ele.style.marginTop = "30px";
      vs
    $ele.css('color', '#fff')
    $ele.css({'margin-top', '30px'});
  4. 设置元素内容
    ele.innerHtml = content;
      vs
    ele.html(content);
  5. 设置元素的类名
    var cName = ele.className;
    ele.className = cName;
      vs
    $ele.addClass/hasClass/removeClass
  6. select DOM元素
    document.getElementById(id);
    document.getElementByClassName(names);
    document.getElementsByClassName(names);
    document.getElementsByTagName(name);
    document.querySelector(selectors);
    document.querySelectorAll(selectors);
  7.find一个元素
    document.getElementById(id).getElementsByTagName(tagName);
    ele.childNodes
    ele.children
    **注意：**这里children与childNodes区别如下：
    ````
    var el = document.createElement("div");
    el.textContent = "foo"
    el.childNodes.length === 1; // TextNode is a node child
    el.children.length === 0; // no Element children
    ````
    ele.nextSibling
    ele.nextElementSibling
  8. 其它的一些操作大家可以参照: [YOU MIGHT NOT NEED JQUERY](http://youmightnotneedjquery.com/)
