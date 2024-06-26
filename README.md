## 基于uniapp开发的电商小程序
### uniapp
一款基于**vue.js**的前端框架，使用该框架，开发者能以vue语法进行小程序或安卓应用的开发，降低了学习成本。  
另外，该框架还能实现应用的**多端适配**，一次开发，多端发布，减少了开发者进行不同平台适配的工作。
### 项目设计思路
#### 核心
1. 展示商品信息
2. 结算选定商品
#### 页面 
主包：四个tabbar页面，分别为首页、分类、购物车、我的。   
1. 首页：展示推荐商品或商品类别。点击轮播图区域跳转到推荐**商品详情页**；点击楼层区域跳转到推荐**商品列表页**。
2. 分类：提供不同选项卡供用户选择商品**一级分类**，根据一级分类展示对应商品**二级分类**，点击二级分类后进入**商品列表页**。
3. 购物：供用户选择**收货地址**，展示加入购物车的商品，对勾选的商品进行数量的统计并计算价格，以及**结算**功能。
4. 我的：提供**登录**与**退出登录**功能。

副包：三个不需要第一时间加载的页面，分别为商品详情、商品列表、搜索页。
1. 商品详情：展示商品详细信息，提供加入购物车功能，还可以从该页面跳转到购物车页面。
2. 商品列表：展示一类商品的简单信息及价格，选中某一项进入该商品的详情页。
3. 搜索页：提供商品**搜索**功能，点击搜索结果进入商品详情页。

组件：六个可复用组件，分别为商品项组件、地址选择组件、搜索栏组件、结算组件、登录组件、用户信息组件。
1. 商品项组件：在**商品列表页**和**购物车页**使用，根据传入属性的不同可以有不同效果的显示，如购物车页面中的商品项有勾选框以及数量选择盒（NumberBox），而商品列表中没有。
2. 地址选择组件：在**购物车页面**中使用，该组件在用户未选择地址时仅仅展示一个按钮，选择地址后展示地址信息。
3. 搜索栏组件：在**首页和分类**两个tabbar页面中使用，固定在页面顶端显示，点击后进入搜索页。
4. 结算组件：在**购物车页面**中使用，实现购物车商品的全选或反选及价格统计及结算功能。**注：只有在登录后才能进行结算**。
5. 登录组件：在我的页面中使用，获取用户的基本信息，调用服务器的登录接口并获取token。用户未登录时展示，登录后则展示用户信息组件。
6. 用户信息组件：展示用户的头像和昵称，实现退出登录功能。
### 实现效果
除支付功能因没有接口权限而未实现外，其他功能都成功实现。
