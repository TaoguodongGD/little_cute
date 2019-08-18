// pages/beauty/beauty.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        image: "/assets/image/beauty.jpg",

        result: null
    },

    /**
     * 按钮事件处理函数
     */
    handclick(e) {
        if (e.type === 'tap') {
            //点击按钮为拍摄照骗
            this.getImage()
        } else {
            //长按按钮为选择照片
            this.getImage('album')
        }
    },

    /**
     * 获取照片函数
     * handclick事件调用该函数
     */
    getImage(type = 'camera') {
        const that = this

        //调用系统API 选择或拍摄找片
        wx.chooseImage({
            sourceType: [type], //['album', 'camera'] [相册 ， 相机]
            sizeType: 'compressed', //['original', 'compressed']  [原图，压缩图]
            count: 1,
            success(res) {
                // 获取图片对象（路径）
                const image = res.tempFiles[0]

                // 判断图片大小
                if (image.size > 1024 * 1000) {
                    return wx.showToast({ title: '图片过大, 请重新拍张小的！', icon: 'none', duration: 2500 })
                }

                // 把图片显示到界面背景上
                that.setData({ image: image.path })
                    // console.log('图片检测' + that.image)


                // 上传图片 分析检测人脸
                that.uploadImage(image.path)
            }
        })

    },


    /**
     * 上传分析照片
     */
    uploadImage(src) {
        const that = this

        // 取消之前的结果显示
        that.setData({ result: null })

        // loading
        wx.showLoading({ title: '分析中...' })

        // 上传图片到AI服务端点
        wx.uploadFile({
            url: 'https://ai.qq.com/cgi-bin/appdemo_detectface',
            name: 'image_file',
            filePath: src,
            success(res) {
                console.log(res.data)
                    // 解析json数据
                const result = JSON.parse(res.data)

                if (result.ret === 0) {
                    // 成功获取分析结果
                    that.setData({ result: result.data.face[0] })
                        // that.setData({ x: result.data.face[0].x + 'rpx', y: result.data.face[0].y + 'px', width: result.data.face[0].width + 'px', height: result.data.face[0].height + 'px' })
                        // + 'px', y: result.data.face[0].y + 'px', width: result.data.face[0].width + 'px', heigh: result.data.face[0].heigh + 'px')
                        // console.log(result.data.face[0].x)
                } else {
                    wx.showToast({ title: '哎呦，找不到你的小脸蛋喽~', icon: 'none' })
                    that.setData({ image: "/assets/image/beauty.jpg" })
                }
                // end loading 
                wx.hideLoading()
                    // console.log(that.result)
                    // console.log(x)
            }
        })
        console.log(this.result)
        console.log(this.x)
    },

    /**
     * 确定按钮
     * 退出当前显示
     */
    confirm() {
        this.setData({ image: "/assets/image/beauty.jpg", result: null })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        if (!this.data.result) return
        return { title: `刚刚测了我的颜值◸${this.data.result.beauty}◿ 你也来试试吧` }
    }
})