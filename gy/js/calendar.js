/**
 * 移动webapp开发 日历组件
 * 可用于需要日历选择的场景
 *  - 日历范围选择
 *  - 自由配置初始化生成多日历
 *  - 各种操作事件自由监听
 * ----------------------------------------------
 * 对外调用接口及自定义事件
 * @method render 渲染日历
 * @method show 显示日历
 * @method hide 隐藏日历
 * @method setSelectDate 设置当前选中日期

 * @customEvent selectDate 选择日期时派发事件
 * @customEvent show 显示日历时派发事件
 * @customEvent hide 隐藏日历时派发事件
 */

( function( root, factory ) {
    if ( typeof define === 'function' ) {
        define( 'calendar', [ 'jqmobi' ], function( $ ) {
            return factory( root, $ );
        } );
    } else {
        root.calendar = factory( root, root.$ );
    }
} )( window, function( root, $ ) {

    var util = {
        /**
         * 根据当前年月，计算下一个月的年月
         * @para year {int} eg: 2014 YYYY
         * @para month {int} eg: 12 MM/M
         * @return {object} 
         */
        getNextMonthDate: function( year, month ) {
            if ( month > 12 ) {
                year = year + Math.floor( ( month - 1 ) / 12 );

                if ( month % 12 == 0 ) {
                    month = 12;
                } else {
                    month = month % 12;  
                }
            }

            return {
                year: year,
                month: month
            }
        },

        /**
         * 处理小于10的数字前自动加0
         * @para num {num} int
         * return {string} '02'
         */
        formatNum: function( num ) {
            if ( num < 10 ) {
                num = '0' + num;
            }

            return num;
        },

        /**
         * 连接年月日，连接符为`-`
         * return {string} yyyy-mm-dd
         */
        joinDate: function( year, month, day ) {
            var formatNum = util.formatNum;

            return year + '-' + formatNum( month ) + '-' + formatNum( day );
        },

        /**
         * 将格式化后日期转化为数字，便于日期计算
         * @para date {string|date object} yyyy-mm-dd|日期对象
         * return {string} yyyymmdd
         */
        dateToNum: function( date ) {
            var rst = '';
            if ( typeof date == 'string' ) {
                rst = date.split( '-' ).join( '' );
            } else {
                rst = util.formatDate( date ).split( '-' ).join( '' );
            }

            return rst;
        },

        /**
         * 格式化日期对象
         * @para {date object} 日期对象
         * return {string} yyyy-mm-dd
         */
        formatDate: function( dateObj ) {
            var year = dateObj.getFullYear(),
                month = dateObj.getMonth() + 1,
                day = dateObj.getDate();

            return util.joinDate( year, month, day );
        },

        /**
         * 获取当前日期的下一天
         * @para date {string|date object} yyyy-mm-dd|日期对象
         * @para num {int} 获取指定日期之后的几天
         * return {string} yyyy-mm-dd
         */
        getNextDate: function( date, num ) {
            return util.formatDate( new Date( +new Date( date ) + num * 86400000 ) );
        },
        // yyyy-mm-dd字符串转日期格式（乘 减 变成时间戳），strDate为要转为日期格式的字符串
        changeStrDate: function(strDate) {
            var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
             function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
            return date;
        },
        changeDay: function( day ) {
            var day = day/24/3600/1000;
            return day;
        },
    };

    var tpl = [
        '<div class="cal-wrap">',
            '<h2>{%date%}</h2>',
            '{%week%}',
            '<ul class="day">',
                '{%day%}',
            '</ul>',
        '</div>'
    ].join( '' );

    var weekTpl = [
        '<ul class="week">',
            '<li>一</li>',
            '<li>二</li>',
            '<li>三</li>',
            '<li>四</li>',
            '<li>五</li>',
            '<li>六</li>',
            '<li>日</li>',
        '</ul>'
    ].join( '' );

    var priceMap = [];
  
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

/*    function showPrice() {
        var id = getUrlParam('id');
        var index = 0;
        $.ajax({
            url: '/order/price',
            type: 'post',
            async: false,
            dataType: 'json',
            data: {id: id},
            success: function(data) {
                if (data.success) {
                    priceMap = data.data;
                }
            },
            error: function(err) {
                console.error(err);
            }
        });
        for (var i = 0; i < priceMap.length; i++) {
            var today = util.dateToNum( new Date());
            var every = util.dateToNum( priceMap[i]['date'][0] );
            if (today > every) {
                index++;
            };
        };
        priceMap.splice(0, index);
    }
    showPrice();*/
    var priceMap = [];
    var xzdate = new Date();
    var oneDay = 24*3600*1000;
    for (var i = 0; i < 200; i++) {
        var price = 0.01;
        var priceInfo = {
            roomNum: '2',
            price: price,
            date: [ util.formatDate(new Date(xzdate*1 + i*oneDay)) ]
        };
        priceMap.push(priceInfo);
    };
    console.log(priceMap);
    priceMap[5].roomNum = '0';
    priceMap[7].roomNum = '0';
    priceMap[12].roomNum = '0';
    priceMap[17].roomNum = '0';
    priceMap[20].roomNum = '0';

    var calendar = function( config ) {
        this.defaultConfig = {
            /**
             * 日历外层容器ID
             * type {string|jq object} id字符串或jq对象
             */
            el: '#calendar',

            /**
             * 初始化日历显示个数
             */
            count: 5,

            /**
             * 用于初始化日历开始年月
             * type {date object} 日期对象
             */
            date: new Date(),

            /**
             * 日期最小值，当小于此日期时日期不可点
             * type {date object} 日期对象
             */
            minDate: null,

            /**
             * 日期最大值，当大于此日期时日期不可点
             * type {date object} 日期对象
             */
            maxDate: null,  //日期对象

            /**
             * 初始化当前选中日期，用于高亮显示
             * type {date object} 日期对象
             */
            selectDate: new Date(),

            /**
             * 选中日期时日期下方文案
             * type {string}
             */
            selectDateName: '入住',

            /**
             * 是否显示节假日
             * type {boolean}
             */
            isShowHoliday: true,

            /**
             * 在日历中是否显示星期
             * type {boolean}
             */ 
            isShowWeek: true
        };

        this.config = $.extend( {}, this.defaultConfig, config || {} );
        this.el = ( typeof this.config.el === 'string' ) ? $( this.config.el ) : this.config.el;

        this.init.call( this );
    };

    $.extend( calendar.prototype, {
        init: function() {
            this._initDate();
            this.render( this.config.date );
            this._initEvent();
        },

        _initDate: function() {
            var me = this,
                config = this.config,
                dateObj = config.date,
                dateToNum = util.dateToNum;

            //初始化日历年月
            this.year = dateObj.getFullYear();
            this.month = dateObj.getMonth() + 1;

            this.minDate = config.minDate;
            this.maxDate = config.maxDate;
            this.selectDate = config.selectDate;

            //上下月切换步长，根据初始化日历个数决定
            this.step = config.count;
        },

        /**
         * 根据日期对象渲染日历
         * @para {date object} 日期对象
         */
        render: function( date ) {
            var me = this,
                config = this.config,
                date = date || config.date,
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                tmpTplArr = [];

            for ( var i = 0; i < config.count; i++ ) {
                var curMonth = month + i,
                    curDate = util.getNextMonthDate( year, curMonth ),
                    dateStr = curDate.year + '年' + util.formatNum( curDate.month ) + '月',
                    dayList = this._getDayList( curDate.year, curDate.month ),
                    week = '';

                if ( config.isShowWeek ) {
                    week = weekTpl;
                } 

                var curTpl = tpl.replace( '{%date%}', dateStr )
                    .replace( '{%week%}', week )
                    .replace( '{%day%}', dayList );

                tmpTplArr.push( curTpl );
            }

            this.el.html( tmpTplArr.join( '' ) );

            this.setSelectDate( this.selectDate );
        },

        _initEvent: function() {
            var me = this,
                config = this.config;

            this.el.delegate( 'ul.day li', 'click', function( event ) {
                var curItem = $( this ),
                    date = curItem.data( 'date' ),
                    dateName = $( curItem.find( 'i' )[ 1 ] ).text();

                //更新当前选中日期YYYY-MM-DD
                me.selectDate = date;
                if ( !curItem.hasClass( 'iv' ) && !curItem.hasClass('no') ) {
                    $.trigger( me, 'afterSelectDate', [ {
                        date: date,
                        dateName: dateName,
                        curItem: curItem
                    } ] );
                }
            } );
        },

        /**
         * 根据当前年月，获取日期列表html字体串
         * @para year {int} eg: 2014 YYYY
         * @para month {int} eg: 12 MM/M
         * @return {string}
         */
        _getDayList: function( year, month ) {
            var me = this,
                config = this.config,

                days = new Date( year, month, 0 ).getDate(),
                firstDay = Math.abs( new Date( year, month - 1, 1 ).getDay() ),

                dateToNum = util.dateToNum,
                joinDate = util.joinDate,

                tmpEptArr = [];
                tmpDayDataArr = [],
                tmpDayTplArr = [];

            //如果是星期天
            if ( firstDay == 0 ) {
                firstDay = 7;
            }

            //插入空白字符
            for ( var i = 0; i < firstDay - 1; i++ ) {
                tmpEptArr.push( '<li class="ept"></li>' );
            }

            for ( var i = 0; i < days; i++ ) {
                var day = i + 1,
                    date = joinDate( year, month, day ),
                    wkDay = new Date( date ).getDay(),
                    dateNum = dateToNum( date ),
                    jrClassName = 'dl jr';

                //默认不做任何处理
                tmpDayDataArr.push( {
                    class: '',
                    date: date,
                    day: day,
                    roomNum: '',
                    price: ''
                } );

                //双休单独标注出
                if ( wkDay == 6 || wkDay == 0 ) {
                    jrClassName = 'dl jr wk';
                    tmpDayDataArr[ i ][ 'class' ] = 'wk';
                }

                //不在指定范围内的日期置灰
                if ( ( me.minDate && dateNum < dateToNum( me.minDate ) ) ||
                    ( me.maxDate && dateNum > dateToNum( me.maxDate ) )
                ) {
                    jrClassName = 'dl iv';
                    tmpDayDataArr[ i ][ 'class' ] = 'iv';
                }

                //价格处理
                if ( config.isShowHoliday ) {
                    for ( var k = 0, hlen = priceMap.length; k < hlen; k++ ) {
                        var price = priceMap[ k ][ 'price' ],
                            roomNum = priceMap[ k ][ 'roomNum' ],
                            dateArr = priceMap[ k ][ 'date' ];

                        for ( var j = 0, len = dateArr.length; j < len; j++ ) {
                            var item = dateArr[ j ];

                            if ( dateNum == dateToNum( item ) ) {
                                tmpDayDataArr[ i ][ 'class' ] = jrClassName;
                                tmpDayDataArr[ i ][ 'roomNum' ] = roomNum;
                                tmpDayDataArr[ i ][ 'price' ] = price;
                                break;
                            }
                        }
                    }
                }

                //初始化当前选中日期状态
                if ( config.selectDate ) {
                    if ( dateNum == dateToNum( me.selectDate ) ) {
                        tmpDayDataArr[ i ][ 'class' ] += ' cur';
                    }
                }
            }

            //生成日期模板字符串
            for ( var i = 0, len = tmpDayDataArr.length; i < len; i++ ) {
                var item = tmpDayDataArr[ i ];
                var today = util.dateToNum( new Date());
                var itemDate = util.dateToNum( item.date );
                var noClass;
                var info = parseInt(item.roomNum) === 0 ? "已租" : '￥'+item.price;
                if (parseInt(item.roomNum) === 0 && itemDate >= today) {
                    noClass = ' no online rent';
                } else if (parseInt(item.roomNum) >0 && itemDate >= today) {
                    noClass = ' online';
                } else {
                    noClass = '';
                    info = '';
                }
                tmpDayTplArr.push(
                    '<li class="' + item.class + noClass + '" data-status="'+item.roomNum+'" data-date="' + item.date + '">' +
                        '<i>' + item.day + '</i><i class="price" >' + info + '</i>' + 
                    '</li>'
                );
            }

            return tmpEptArr.concat( tmpDayTplArr ).join( '' );
        },

        /**
         * 设置选中日期格式
         * @para {date object|date string} YYYY-MM-DD
         */
        setSelectDate: function( date ) {
            var me = this,
                config = this.config,
                date = ( typeof date == 'string' ) ? date : util.formatDate( date ),
                dateNum = util.dateToNum( date ),
                today = util.dateToNum( new Date());
                curSltItem = $( this.el[ 0 ].querySelector( 'li[data-date="' + date + '"]' ) );
                
            var one = 24*3600*1000,
                selcetDay = [],
                priceArr = [],
                day = 0,
                total_fee = 0;

            var lis = $('#calendar .day li');
            var startLi = $('#calendar .day li.start');
            var endLi = $('#calendar .day li.end');
            var online = $('#calendar .day li.online');
            var rent = $('#calendar .day li.rent');
            var sure = $('#calendar .day li.sure');
            var onlen = online.length;
            //  添加当前选中日期高亮
            if ( curSltItem.length ) {
                var curDateNameEl = $( curSltItem.find( 'i' )[ 1 ] );

                curSltItem.addClass( 'cur' );
                if ( !curSltItem.hasClass( 'jr' ) ) {
                    // curSltItem.addClass( 'dl' );
                    curDateNameEl.text( config.selectDateName );
                }
            }

            if (startLi.length == 0 && endLi.length == 0) {
                curSltItem.addClass('start');
                noSelcet();
                $('#startTime').text($('.start').data('date'));
            } else if (startLi.length == 1 && endLi.length == 0) {
                if (curSltItem.hasClass('start')) { return };
                curSltItem.addClass('end');
                var start = util.changeStrDate(startLi.data('date'));
                var end = util.changeStrDate(curSltItem.data('date'));
                var day = (end - start)/one;
                showStyle(start, 'sure', day);
                lis.removeClass('no');
                rent.addClass('no');
                $('#endTime').text($('.end').data('date'));
            } else if (startLi.length == 1 && endLi.length ==1) {
                lis.removeClass('start end cur sure');
                rent.addClass('no');
                curSltItem.addClass('start cur');
                noSelcet();

                $('#startTime').text($('.start').data('date'));
                $('#endTime').text('--');
            }

            $('#total_day').text(day);


            // 选择入住日期的同时  处理不可选的样式
            function noSelcet() {
                if (today <= dateNum) {
                    var now = util.changeStrDate(util.formatDate(new Date()));
                    var start = util.changeStrDate(curSltItem.data('date'));
                    var day = (start - now)/one;
                    showStyle(now, 'no', day);
                    for (var i = day; i < onlen; i++) {
                      if ($(online[i]).hasClass('no')) {
                        return noClick(i, day);
                      };
                    };
                };
            }

            // 被选日期之后  如有已租房改变为不可选样式
            function noClick(index, day) {
                $(online[index]).removeClass('no');
                var noTime = util.changeStrDate($(online[index + 1]).data('date'));
                var day = onlen - day;
                showStyle(noTime, 'no', day); 
            }

            // 展示选中日期的状态
            function showStyle(start, className, day) {
                var noEnd = util.formatDate(new Date(start - 0 + day*one));
                start = start - one;
                for (var i = 0; i < day; i++) {
                    start = start - 0;
                    start  += one;
                    start =  new Date(start);
                    selcetDay.push(start);
                };
                selcetDay.forEach(function (v, i) {
                    var date = util.formatDate(v);
                    var selectedLi = $($('#calendar').get(0).querySelector( 'li[data-date="' + date + '"]' ));
                    selectedLi.addClass(className);

                    if (className == 'sure') {
                        var price = selectedLi.find('.price').text();
                        priceArr.push(price);
                    };
                    
                });
                console.log(priceArr);
                for (var i = 0; i < priceArr.length; i++) {
                    total_fee += Number(priceArr[i].trim().substr(1, priceArr[i].trim().length - 1));
                };

            };
            
            $('#total_fee').text(total_fee.toFixed(2));
        },

        show: function() {
            this.el.show();
            $.trigger( this, 'show' );
        },

        hide: function() {
            this.el.hide();
            $.trigger( this, 'hide' );
        }
    } );

    return {
        calendar: calendar,
        util: util
    };
} );



