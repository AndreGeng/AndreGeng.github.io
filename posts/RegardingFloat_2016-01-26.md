# 浮动的原理和其带来的影响

## 浮动的原理: 浮动是让某元素脱离标准流，漂浮在标准流之上的一种布局方式。任何元素被设置为浮动元素后，就表明它是块级元素，拥有宽高属性。

### 浮动带来的影响
* 影响兄弟元素的位置
  一个元素设置了浮动样式后，会影响它的兄弟元素，至于如何影响，要看它的兄弟元素是块级元素还是内联元素。
  1. 如果兄弟元素是块级元素，会无视这个浮动元素，即兄弟元素和浮动元素共处同行，浮动元素会覆盖兄弟元素。除非这些div设置了宽度，并且元素的宽度不足以包含它们，这样兄弟元素才会被强制换行。
  2. 如果兄弟元素是内联元素，则会尽可能围绕浮动元素。
* 会导致父元素高度无法包裹浮动元素
  浮动元素脱离了普通流，导致父元素高度塌陷。
  闭合浮动：使浮动元素闭合，从而减少浮动带来的影响。
  闭合浮动的方法大体分为两类：
  1. 利用clear属性。可以通过在浮动元素末尾添加一个带有clear:both属性的空div来闭合元素，也可以通过after伪元素在浮动元素末尾添加一个内容为一个点并带有clear: both属性的元素来闭合元素。
   * after尾元素闭合浮动
   ````
   <div class="box red">1</div>
    <div class="float-container">
      <div class="box green fl">2</div>
    </div>
    <div class="box yellow">3</div>
   ````
   ````
   .box{
        width: 200px;
        height: 200px;
      }
      .red{
        background: red;
      }
      .green{
        background: green;
      }
      .yellow{
        background: yellow;
      }
      .fl{
        float: left;
      }
      .float-container:after{
        content: '.';
        display: block;
        clear: both;
        height: 0;
        visibility: hidden;
      }
   ````
 2. 触发该浮动元素父元素的BFC(Block Formatting Contexts),使其父元素可以包含浮动元素。
   *  给浮动元素的父元素添加浮动。
   *  给浮动元素的父元素添加display: table-cell/table-caption/inline-block/flex/inline-flex
   *  把浮动元素的父元素overflow属性设为hidden或auto, 可以闭合浮动。
   *  把浮动元素的父元素position设为absolute/fixed。

   另外在IE6还需要触发hasLayout,例如为你元素设置容器宽高或设置zoom: 1.
   ps: BFC除了被用于清除浮动还可以用于以下几个方面：
    * 防止竖直方向margin合并。
    * 防止text包裹float元素。
    * 创建多列布局。
 具体可以参见下面这篇文章：[understanding-block-formatting-contexts-in-css](http://www.sitepoint.com/understanding-block-formatting-contexts-in-css/)
