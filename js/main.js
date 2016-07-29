/**
 * Created by wujincun on 2016/7/26.
 */
var Scroll = {};
(function (win, doc, $) {
    function CusScrollBar(options) {
        this._init(options)
    }

    $.extend(CusScrollBar.prototype, {
        _init: function (options) {
            var self = this;
            self.options = {
                scrollDir: "y",//滚动方向
                contSelector: "",//滚动内容物选择器
                barSelector: "",//滚动条选择器
                sliderSelector: "",//滚动滑块选择器
                wheelStep:10 //滚轮步长
            };
            $.extend(true, self.options, options || {});
            self._initDomEvent();
            self._initSlideDragEvent()
                ._bindContScroll()
                ._bindMOusewheel()
        },
        /*
         * 初始化DOM引用
         * @method _initDomEvent
         * @return {CusScrollBar}
         * */
        _initDomEvent: function () {
            var opts = this.options;
            this.$cont = $(opts.contSelector);
            this.$slider = $(opts.sliderSelector);
            this.$bar = opts.barSelector ? $(opts.barSelector) : self.$slider.parent();
            //获取文档对象
            this.$doc = $(doc);

        },
        /*
         * 初始化滑块拖动功能
         * @return{[Object]}[this]
         * */
        _initSlideDragEvent: function () {
            var self = this;
            var slider = self.$slider, sliderEle = slider[0];
            if (sliderEle) {
                var doc = self.$doc,
                    dragStartPagePosition,
                    dragStartScrollPosition,
                    dragContBarRate;

                function mousemoveHandler(e) {
                    e.preventDefault();
                    if (dragStartPagePosition == null) {
                        return
                    } else {
                        self.scrollTo(dragStartScrollPosition + (e.pageY - dragStartPagePosition) * dragContBarRate)
                    }
                }

                slider.on('mousedown', function (e) {
                    e.preventDefault();
                    dragStartPagePosition = e.pageY;
                    dragStartScrollPosition = self.$cont[0].scrollTop;
                    dragContBarRate = self.getMaxScrollPosition() / self.getMaxSliderPosition();
                    doc.on('mousemove.scroll', mousemoveHandler)
                        .on('mouseup.scroll', function (e) {
                            e.preventDefault();
                            doc.off('.scroll')
                        })
                })

            }
            return self;
        },
        /*
         * 监听内容的滚动，同步滑块的位置
         * */
        _bindContScroll: function () {
            var self = this;
            self.$cont.on('scroll', function () {
                var sliderEl = self.$slider && self.$slider[0];
                if (sliderEl) {
                    sliderEl.style.top = self.getSliderPosition() + 'px'
                }
            });
            return this
        },
        _bindMOusewheel: function () {
            var self = this;
            self.$cont.on('mousewheel DOMMouseScroll', function (e) {
                e.preventDefault();
                var oEv = e.originalEvent,
                    wheelRange = oEv.wheelDelta ? -oEv.wheelDelta / 120 : (oev.detal || 0) / 3;
                self.scrollTo(self.$cont[0].scrollTop + wheelRange * self.options.wheelStep)
            });
            return self
        },
        /*
         * 计算滑块的当前位置
         * */
        getSliderPosition: function () {
            var self = this,
                maxSliderPosition = self.getMaxSliderPosition();
            return Math.min(maxSliderPosition, maxSliderPosition * self.$cont[0].scrollTop / self.getMaxScrollPosition())
        },
        /*
         * 获取内容区域可滚动距离
         * */
        getMaxScrollPosition: function () {
            var self = this;
            return Math.max(self.$cont.height(), self.$cont[0].scrollHeight - self.$cont.height())
        },
        /*
         * 滑块可移动距离
         * */
        getMaxSliderPosition: function () {
            var self = this;
            return self.$bar.height() - self.$slider.height()
        },
        scrollTo: function (positionVal) {
            var self = this;
            self.$cont.scrollTop(positionVal)
        }
    });
    Scroll.CusScrollBar = CusScrollBar;
})(window, document, jQuery);
new Scroll.CusScrollBar({
    contSelector: ".scroll_cont",//滚动内容物选择器
    barSelector: ".scroll_bar",//滚动条选择器
    sliderSelector: ".scroll_slider"//滚动滑块选择器
});