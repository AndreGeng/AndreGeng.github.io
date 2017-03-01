# Android Compound View

## 当构建复杂的应用时，我们总会遇到应用中很多地方都用到相同的一组控件。如果我们能把这些视图以及它们的业务逻辑组合在一起，将是非常方便的。这里我们简单介绍下怎么构建compound view来解决这种需求。

当构建复杂的应用时，我们总会遇到应用中很多地方都用到相同的一组控件。如果我们能把这些视图以及它们的业务逻辑组合在一起，将是非常方便的。这里我们简单介绍下怎么构建compound view来解决这种需求。

#1.需求
今天在用微信时，瞄到在我的中心里，有个我的地址，新建地址界面如下

![新增地址][New Address]

可以看到这里的EditText左边会有文字，查了下android官方只支持edittext左边放一些图片。其实这种场景个人觉得挺适合用compound view的。下面是实现的大概思路：

我们把这里要实现在控件叫EnhancedEdittext

* 首先我们的控件是继承于FrameLayout
* EnhancedEdittext包含两个View, textview用于显示label, edittext用于输入内容
* 在EnhancedEdittext里计算label的宽度，然后把相应设置edittext的paddingLeft值

恩恩，想来是可行的，下面来具体实现。

#2.实现
首先实现FrameLayout的构造方法如下：


    public EnhancedEdittext(Context context) {
        super(context);
        initViews(context);
    }

    public EnhancedEdittext(Context context, AttributeSet attrs) {
        super(context, attrs);
        TypedArray typedArray = context.obtainStyledAttributes(attrs, R.styleable.EnhancedEdittext);
        label = (String) typedArray.getText(R.styleable.EnhancedEdittext_label);
        initViews(context);
    }

在xml的构建方法里，我们定义了一个自定义属性，属性的声名是要放在values/attr.xml中：

    <?xml version="1.0" encoding="utf-8"?>
    <resources>
        <declare-styleable name="EnhancedEdittext">
            <attr name="label" format="string"></attr>
        </declare-styleable>
    </resources>

这里的initView要来生成我们的视图，主要就是inflate我们的layout文件.

    private void initViews(Context ctx) {
        LayoutInflater inflater = (LayoutInflater) ctx.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        inflater.inflate(R.layout.enhanced_et, this);
    }

enhanced_et代码如下：

    <?xml version="1.0" encoding="utf-8"?>
    <merge xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="match_parent">
        <TextView
            android:text="@string/default_txt"
            android:textColor="@color/black"
            android:textSize="14sp"
            android:id="@+id/label_tv"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:gravity="center_vertical"/>
        <EditText
            android:id="@+id/value_et"
            android:layout_height="wrap_content"
            android:layout_width="match_parent"/>
    </merge>

这里用到了merge标签，不太熟悉的同学可以自行百度下。然后在onFinishInflate中给我们的视图设置初始值。onFinishInflate方法是在我们组合视图里的所有视图都inflated and ready to use的时候被调用，所以我们视图设值的代码写在这里：

    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();
        label_tv = (TextView)findViewById(R.id.label_tv);
        label_tv.setText(label);
        value_et = (EditText)findViewById(R.id.value_et);
    }

接下来我们要获得label的宽度，然后设置edittext的paddingLeft，这里我把代码写在了onLayout（）中，因为onLayout会在onMeasure()之后被调用，在里面我们就已经可以拿到子视图的size:

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        int labelW = label_tv.getMeasuredWidth();
        value_et.setPadding(labelW + Utilities.dpToPixels(getContext(), 10), 0, 0, 0);
    }

到这里基本完成开始测试。。。发现个问题，当同一个activity有两个EnhancedEidttext里，转屏，会发现输入框里的内容全变成了第二个输入框的值。查了下发现，在转屏时android系统会根据view的id做key去维护一个map,当activity重建完成会再把存储的值赋回给我们的视图。但我们的两个compoundview里面edittext的id是一样的，这时就会出问题。

这里解决的办法是我们需要自己去处理custom的compound view数据的存储与恢复。

#3.转屏时数据存储和恢复。
大家应该都知道这部分代码应该写在onSaveInstanceState（）和onRestoreInstanceState（）中，但这里除了这两个方法我们还要去重写dispatchSaveInstanceState（）和dispatchRestoreInstanceState（），下面是代码：

    @Override
    protected Parcelable onSaveInstanceState() {
        Bundle bundle = new Bundle();

        bundle.putParcelable(Constants.STATE_SUPER_CLASS,
                super.onSaveInstanceState());
        bundle.putString(Constants.STATE_INPUT_VALUE, value_et.getText().toString());

        return bundle;
    }

    @Override
    protected void onRestoreInstanceState(Parcelable state) {
        if(state instanceof Bundle){
            Bundle bundle = (Bundle)state;

            super.onRestoreInstanceState(bundle
                    .getParcelable(Constants.STATE_SUPER_CLASS));
            value_et.setText(bundle.getString(Constants.STATE_INPUT_VALUE));
        }else{
            super.onRestoreInstanceState(state);
        }
    }

    @Override
    protected void dispatchSaveInstanceState(SparseArray<Parcelable> container) {
        super.dispatchFreezeSelfOnly(container);
    }

    @Override
    protected void dispatchRestoreInstanceState(SparseArray<Parcelable> container) {
        super.dispatchThawSelfOnly(container);
    }

查看文档你会发现android saving instance state的过程是，activity会递归的遍历layout hierarchy，对每个视图调用View.saveHierarchyState()，而这个方法又会去调用View.dispatchSaveInstanceState(),
* 如果这个视图是view的话，View.oSaveInstanceState()会被调用，然后它会把数据存在一个Parcelable中，再以view的id为key把这个Parcelable存储下来。
* 如果这个视图是ViewGroup的话，它会负责把对View.dispatchSaveInstance()分发到它的子视图上。

但我们的compound view已经处理了子视图的状态保存，所以我们重写dispatchSaveInstanceState（）来阻断这个事件被分发到子视图。restore的过程也是类似的，大家有时间可以去看下。

到这里我们算是完成了EnhancedEdittext的编写，虽然功能不强大，还是能了解到一些知识点的。

*注意：*我们的compound view的子view不需要唯一的id了，但compound view还是要有唯一的id才可以work的哦。


[New Address]: /images/add_address.png
