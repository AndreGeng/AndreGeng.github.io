## CSS中元素垂直与水平居中

更新：发现一位外国大神总结的更好，英语无障碍的小伙伴请直接移步: [Absolute centering](http://codepen.io/shshaw/full/gEiDt/) by [Shaw](https://github.com/shshaw)

### 最近突然发现以前自己对css理解有些小儿科了，总以为它是一个经验学科，慢慢看的多了就自然会了，所以平时也不怎么注意。现在终于有些想了解其中原理的苗头了，而且发现有些css规则还是得总结下的，不然以后它总是会时不时的跳出来，又要重新去调去试太浪费时间了，这里这个不得不说应该是大家都会遇到的问题吧，写下自己的经验，这个方法应该有很多，以后慢慢补充。。小伙伴们发现不对或是新的方法还烦请帮忙补充:)

闲话少叙，进入正题：
关于水平居中，我们一般有`text-align: center`和`margin: 0 auto`这两个，相对比较简单，这里只列下垂直居中的方案：

* table-cell与vertical-align

  这个思路是利用vertical-align, 这个属性只在inline和table-cell的box下才会起作用，所以多加一个div包裹child,我们的html如下：

  ````
  <div class="parent">
        <div class="child-container">
            <div class="child">child</div>
        </div>
    </div>
  ````
  css如下：

  ````
  .parent{
        width: 400px;
        height: 400px;
        background: red;
        display: table;
    }
    .child-container{
        vertical-align: middle;
        background: yellow;
        display: table-cell;
    }
    .child{
        width: 200px;
        height: 200px;
        background: green;
        margin: 0 auto;
    }
    ````

    * 优点：兼容性比较好, 对IE这种困难户也可以支持到8+
    * 缺点：增加了无语义的标签


* 使用position: absolute

  这个的想法是使用margin: auto来实现水平竖直居中，直接上代码：
  html:

  ````
  <div class="parent">
        <div class="child">child</div>
    </div>
    ````
    css:

    ````
    .parent{
        width: 400px;
        height: 400px;
        background: red;
        position: relative;
    }
    .child{
        width: 200px;
        height: 200px;
        background: green;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
    ````
    * 优点：兼容性比较好, IE8+
    * 缺点：child必须给定height


* 使用transform

  这个以后写吧。。
