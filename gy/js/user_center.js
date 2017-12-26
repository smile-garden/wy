$(function(){
	var bar = $('.condition .item');
	var order_list = $('.order .order_list');
	order_list.eq(0).addClass('show');

	function showOrderHandel() {
		var index = $(this).index();
		order_list.removeClass('show').eq(index).addClass('show');
	}

	bar.on('click', showOrderHandel);

})