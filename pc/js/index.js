$(function(){	
	var navItem = $('.nav_box .nav_inner .item');
	var swiper1 = new Swiper('#swiper1',{
		speed: 400,
		mode: 'vertical',
		cssWidthAndHeight : true,
		pagination: '.pagination',
		paginationClickable: true,
		slidesPerView: 1,
		mousewheelControl: true,
		keyboardControl : true,
		onSlideChangeStart: function(swiper){
	      	var i = swiper.activeIndex;
			dot(i);
	    }
	});

	function dot(index) {
		navItem.removeClass('active').eq(index).addClass('active');
	};

	navItem.on('mousedown', false);
	navItem.on('click', function() {
		var i = $(this).index();
		dot(i);
		swiper1.swipeTo(i);
	});
	// 公寓展示
	var swiper2 = new Swiper('#swiper2',{
		autoplay: 5000,
		loop : true,
		noSwiping: true,
		noSwipingClass: 'stop-swiping',
		autoplayDisableOnInteraction : false,
	});
	var nextBtn = $('.slide2 .next');
	nextBtn.on('click', function(){
		swiper2.swipeNext();
	})
})
