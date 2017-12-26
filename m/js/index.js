$(function(){
	var navList = {
		0: '首页',
		1: '公寓',
		2: '众筹',
		3: '宅系',
		4: '关于'
	};
	mySwiper1 = new Swiper('#swiper1', {
		speed: 400, 
		direction: 'vertical',
		pagination : '#pagination1',
		paginationClickable :true,
		paginationBulletRender: function (swiper, index, className) {
			return '<span class="' + className + '">' + navList[index] + '</span>';
		},
		longSwipesRatio : 0.1,
		shortSwipes : true,
		noSwiping : true,
		noSwipingClass : 'stop-swiping',
		onInit: function(swiper){ 
			swiperAnimateCache(swiper); //隐藏动画元素 
			swiperAnimate(swiper); //初始化完成开始动画
		}, 
		onSlideChangeEnd: function(swiper){ 
			swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
		} 
	})

	// 隐式导航栏显示
	var menuBtn = $('.nav_box .menu_btn');
	var mask = $('#mask');
	var navBox = $('#pagination1');

	function menuHandle() {
		$(this).toggleClass('active');
		if($(this).hasClass('active')){
			mask.show();
			navBox.addClass('shownav');
		}else{
			mask.hide();
			navBox.removeClass('shownav');
		}
	}
	function closeHandle() {
		menuBtn.removeClass('active');
		mask.hide();
		navBox.removeClass('shownav');
	}

	menuBtn.on('click', menuHandle);
	mask.on('touchmove', closeHandle);
})