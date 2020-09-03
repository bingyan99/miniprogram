Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: undefined
    },
    color: {
      type: String,
      value: 'rgba(0, 0, 0, 1)'
    },
    title: {
      type: String,
      value: ''
    },
    searchText: {
      type: String,
      value: ''
    },
    searchPlaceholder: {
      type: String,
      value: '点我搜索'
    },
    showSearch: {
      type: Boolean,
      value: false
    },
    searchIconSize: {
      type: Number,
      value: 20
    },
    searchTextColor: {
      type: String,
      value: '#333'
    },
    showBack: {
      type: Boolean,
      value: false
    },
    showHome: {
      type: Boolean,
      value: false
    },
    homePath: {
      type: String,
      value: "/pages/home/home"
    },
    homeOpenType: {
      type: String,
      value: "switchTab"
    },
    iconSize: {
      type: Number,
      value: 18
    },
    theme: {
      type: String,
      value: 'black'
    },
    delta: {
      type: Number,
      value: 1
    }
  },
  // 组件数据字段监听器
  observers: {
    showBack: function (v) {
      setTimeout(function () {
        this.setData({
          // 页面栈数<2, v为true，也不会显示返回按钮
          back: v && this.pageCount < 2 ? !1 : v
        })

        this.setStyle();
      }.bind(this), 50)
    },
    showHome: function (v) {
      setTimeout(function () {
        this.setData({
          home: v
        })

        this.setStyle();
      }.bind(this), 50)
    },
    showSearch: function (v) {
      setTimeout(function () {
        this.setData({
          searchBar: v
        })

        this.setStyle();
      }.bind(this), 50)
    }
  },
  created: function () {
    this.app = getApp()
    this.getSystemInfo();
  },
  // 组件实例进入页面节点树执行
  attached: function () {
    this.pages = getCurrentPages() || []
    let isHome = this.pages.filter(item => item.route.indexOf('home') > -1)
    this.setData({ home: !isHome.length }) // 分享页面设置home
    this.pageCount = this.pages.length
    this.cp = this.pages[this.pageCount - 1] || {}
    
    var h = this.cp && this.cp.route + '.html'
    this.window = __wxConfig && __wxConfig.page && __wxConfig.page[h] && __wxConfig.page[h].window ? __wxConfig.page[h].window : {}
    this.window = Object.assign(__wxConfig.global.window, this.window)
    this.setStyle(); //设置样式
  },
  methods: {
    setStyle: function () {
      const {
        statusBarHeight,
        navBarHeight,
        capsulePosition,
        navBarExtendHeight,
        ios,
        windowWidth
      } = this.app.globalSystemInfo;
      let { back, home, title, searchBar } = this.data,
        rightDistance = windowWidth - capsulePosition.right, //胶囊按钮右侧到屏幕右侧的边距
        leftWidth = windowWidth - capsulePosition.left, //胶囊按钮左侧到屏幕右侧的边距

        theme = this.window.navigationBarTextStyle || 'black',
        background = this.data.background || this.window.navigationBarBackgroundColor || '#fff'

      title = title || this.window.navigationBarTitleText || (this.app.globalData ? this.app.globalData.appName : '')
      let navigationbarinnerStyle = [
        'color: ' + this.data.color,
        'background: ' + background,
        'height:' + (navBarHeight + navBarExtendHeight) + 'px',
        'padding-top:' + statusBarHeight + 'px',
        'padding-right:' + leftWidth + 'px',
        'padding-bottom:' + navBarExtendHeight + 'px'
      ].join(';');
      let navTitleWidth = '', navBarLeft = '', navBarSubLeft = ''
      if (back && home){
        navBarLeft = [
          'width:' + capsulePosition.width + 'px',
          'height:' + capsulePosition.height + 'px',
        ].join(';')
        navBarSubLeft = [
          'width:' + capsulePosition.width + 'px',
          'height:' + capsulePosition.height + 'px',
          'margin-left:' + rightDistance + 'px'
        ].join(';')
        navTitleWidth = 'width:calc( 100vw - ' + (capsulePosition.width + rightDistance) * 2 + 'px )'

      } else if (!back && !home){

        navBarLeft = [
          'width:' + (searchBar ? 0 : capsulePosition.width)+'px',
          'margin-left:' + (rightDistance-5) + 'px'
        ].join(';')
        navBarSubLeft = [
          'width:0'
        ].join(';')
        navTitleWidth = 'width:calc( 100vw - ' + (capsulePosition.width + rightDistance)*2 + 'px )'

      } else if ((!back && home) || (back && !home)) {
        navBarLeft = [
          'width:' + (searchBar ? capsulePosition.height + rightDistance : capsulePosition.width) + 'px',
          'height:' + capsulePosition.height + 'px',
        ].join(';')
        navBarSubLeft = [
          'width:' + capsulePosition.height + 'px',
          'height:' + capsulePosition.height + 'px',
          'margin-left:' + rightDistance + 'px'
        ].join(';')
        navTitleWidth = 'width:calc( 100vw - ' + (searchBar ? capsulePosition.height + capsulePosition.width + rightDistance * 2 : (capsulePosition.width + rightDistance) * 2) + 'px )'
      }else {
        navBarLeft =['width:auto', 'margin-left:0px'].join(';');
      }
      
      this.setData({
        theme,
        title,
        background,
        navigationbarinnerStyle,
        navBarLeft,
        navBarSubLeft,
        navBarHeight,
        capsulePosition,
        navBarExtendHeight,
        navTitleWidth,
        ios
      });
    },
    // 返回事件
    back: function () {
      var t = this
      if (!this.data.back) return
      if (this.cp.onBeforeBack){
        const ret = this.cp.onBeforeBack()
        if (!ret || !ret.then) console.error('function onBeforeBack must return  at /' + this.cp.route + '.js')
        ret && ret.then && ret.then(res=>{
          if (res.navBack){
            let entryPagePath = (__wxConfig.entryPagePath.replace(/\.html$/, '') || __wxConfig.pages[0])
            this.pageCount > 1 ? wx.navigateBack({ delta: 1 }) : this.cp.route != entryPagePath && wx.navigateTo({
              url: '/' + entryPagePath
            })
          }
        })
      } else {
        wx.navigateBack({ delta: 1 })
      }
    },
    home: function () {
      if (!this.data.home) return
      if (this.cp.onBeforeBack && wx.getStorageSync('showBackModal')) {
        const ret = this.cp.onBeforeBack()
        if (!ret || !ret.then) console.error('function onBeforeBack must return wx.showModal at /' + this.cp.route + '.js')
        ret && ret.then && ret.then(res => {
          res.navBack && this.goHome()
        })
      } else {
        this.goHome()
      }
    },
    goHome: function () {
      let { homePath, homeOpenType } = this.data,
        opt = {
          fail(res) {
            if (res.errMsg.indexOf('no-tabBar') > 0) {
              wx.redirectTo({ url: homePath })
            } else if (res.errMsg.indexOf('a tabbar page') > 0) {
              console.log('switchTab', oopt, [homePath])
              wx.switchTab({ url: homePath })
            }else {
              wx.showToast({
                title: res.errMsg,
                icon: 'none'
              })
            }
          }
        }
      homePath = homePath ? homePath : '/pages/home/home'
      homeOpenType = homeOpenType ? homeOpenType : 'switchTab'
      opt.url = homePath
      if (homeOpenType == 'switchTab') {
        wx.switchTab(opt)
      } else if (homeOpenType == 'navigateTo') {
        wx.navigateTo(opt)
      } else if (homeOpenType == 'reLaunch') {
        wx.reLaunch(opt)
      } else {
        wx.redirectTo(opt)
      }

    },
    search: function () {
      this.triggerEvent('search', {});
    },
    searchEvent: function (e) {
      this.setData({ searchText: e.detail.value })
      if (!this.data.showSearch) return
      if (this.cp.onSearchEvent){
        this.cp.onSearchEvent(e.detail.value)
      }
    },
    getSystemInfo() {
      if (this.app.globalSystemInfo && !this.app.globalSystemInfo.ios) {
        return this.app.globalSystemInfo;
      } else {
        let systemInfo = wx.getSystemInfoSync();
        let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
        let rect;
        try {
          rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
          if (rect === null) {
            throw 'getMenuButtonBoundingClientRect error';
          }
          //取值为0的情况  有可能width不为0 top为0的情况
          if (!rect.width || !rect.top || !rect.left || !rect.height) {
            throw 'getMenuButtonBoundingClientRect error';
          }
        } catch (error) {
          let gap = ''; // 胶囊按钮上下间距 使导航内容居中
          let width = 96; // 胶囊的宽度
          let height = 32; // 胶囊的高度
          if (systemInfo.platform === 'android') {
            gap = 8;
            width = 96;
          } else if (systemInfo.platform === 'devtools') {
            if (ios) {
              gap = 5.5; // 开发工具中ios手机
            } else {
              gap = 7.5; // 开发工具中android和其他手机
            }
          } else {
            gap = 4;
            width = 88;
          }
          if (!systemInfo.statusBarHeight) {
            //开启wifi的情况下修复statusBarHeight值获取不到
            systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
          }
          rect = {
            //获取不到胶囊信息就自定义重置一个
            bottom: systemInfo.statusBarHeight + gap + height,
            height: height,
            left: systemInfo.windowWidth - width - 10,
            right: systemInfo.windowWidth - 10,
            top: systemInfo.statusBarHeight + gap,
            width: width
          };
          console.log('error', error);
          console.log('rect', rect);
        }

        let navBarHeight = '';
        if (!systemInfo.statusBarHeight) {
          systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
          navBarHeight = (function () {
            let gap = rect.top - systemInfo.statusBarHeight;
            return 2 * gap + rect.height;
          })();

          systemInfo.statusBarHeight = 0;
          systemInfo.navBarExtendHeight = 0; //下方扩展4像素高度 防止下方边距太小
        } else {
          navBarHeight = (function () {
            let gap = rect.top - systemInfo.statusBarHeight;
            return systemInfo.statusBarHeight + 2 * gap + rect.height;
          })();
          if (ios) {
            systemInfo.navBarExtendHeight = 4; //下方扩展4像素高度 防止下方边距太小
          } else {
            systemInfo.navBarExtendHeight = 0;
          }
        }
        systemInfo.navBarHeight = navBarHeight; //导航栏高度不包括statusBarHeight
        systemInfo.capsulePosition = rect; //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
        systemInfo.ios = ios; //是否ios

        this.app.globalSystemInfo = systemInfo; //将信息保存到全局变量中,后边再用就不用重新异步获取了

        //console.log('systemInfo', systemInfo);
        return systemInfo;
      }
    }
  }
});