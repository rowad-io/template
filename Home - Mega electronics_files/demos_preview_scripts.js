jQuery(document).ready(function ($) {

	var $demosPreview = $('.xtemos-demos-preview'),
		$demoTabs = $('.xtemos-demo-tabs'),
		demosLoad = false,
		demosShown = false,
		htmlResponse = '';

	// var timeoutShowDemos = setTimeout( function() {
	// 	xtemos_get_demos();
	// 	//console.log('setT');
	// }, 2000 );

	$('.demos-search input').on('keyup', function (e) {
		var val = $(this).val().toLowerCase();

		$('.xtemos-demo-tab-item.active').find('.xtemos-demo-preview-item').each(function () {
			var $this = $(this);
			$name = $this.find('.xtemos-demo-preview-item-inner').attr('data-template_name').toLowerCase();
			$tag = $this.find('.xtemos-demo-preview-item-inner').attr('data-template_tag').toLowerCase();

			if ($name.indexOf(val) > -1 || $tag.indexOf(val) > -1) {
				$this.removeClass('hide-by-search').addClass('show-by-search');
			} else {
				$this.addClass('hide-by-search').removeClass('show-by-search');
			}
		});
	});

	$(document).on('click', '.xtemos-show-demos', function (e) {

		e.preventDefault();

		$('.xtemos-show-demos-preview').addClass('xtemos-demos-open');
		$('.wd-close-side').removeClass('wd-close-side-opened');
		$('.mobile-nav').removeClass('wd-opened');

		if (demosLoad && demosShown) {
			$demosPreview.addClass('xtemos-preview-open');
			if ( $(window).width() >= 1024 ) {
				setTimeout(function () { 
					$('.demos-search').find('input[type="text"]').focus(); 
				}, 300);
			}
			return;
		} else if (demosLoad && !demosShown) {
			$demosPreview.addClass('xtemos-preview-open');
			$demoTabs.html(htmlResponse);
			tabs();
			lazyload('.xtemos-demo-tab-item.active .xtemos-lazy');
			demosShown = true;
			if ( $(window).width() >= 1024 ) {
				setTimeout(function () { 
					$('.demos-search').find('input[type="text"]').focus(); 
				}, 300);
			}
			return;
		} else if (!demosLoad && !demosShown) {
			$demosPreview.addClass('xtemos-preview-open');
			//clearTimeout( timeoutShowDemos );
			xtemos_get_demos(showDemos = true);
			if ( $(window).width() >= 1024 ) {
				setTimeout(function () { 
					$('.demos-search').find('input[type="text"]').focus(); 
				}, 300);
			}
		}

	});

	$(document).on('click', '.xtemos-close-demos-preview', function () {

		$demosPreview.removeClass('xtemos-preview-open');

		$('.xtemos-show-demos-preview').removeClass('xtemos-demos-open');

	});

	$(document).keyup(function (e) {

		if (e.keyCode === 27) $('.xtemos-close-demos-preview').click();

	});

	$(document).on('mouseenter mouseleave mousemove', '.xtemos-hover-open', function (e) {

		lazyload('.xtemos-demos-dropdown-wrapper .xtemos-lazy');

	});

	$(document).on('click', '.xtemos-category-list .xtemos-category-item', function () {

		var categoryTabId = $(this).attr('id'),
			tab = $('.xtemos-demo-tab-item[data-tab-id="' + categoryTabId + '"]');

		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		tab.siblings().removeClass('active');
		tab.addClass('active');

		lazyload('.xtemos-demo-tab-item.active .xtemos-lazy');

	});

	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};

	function xtemos_get_demos(showDemos) {
		$demosPreview.addClass('xtemos-demos-loading');
		// var clear = '';
		// if ( getUrlParameter( 'clear_demos_preview' ) != null ) {  
		// 	clear = '?clear_demos_preview';
		// }
		$.ajax({
			//url: plugin_obj.ajax_url + clear,
			url: plugin_obj.ajax_url,
			data: { action: 'get_demos' },
			method: "POST",
			dataType: "JSON",
			success: function (response) {

				htmlResponse = response;

				demosLoad = true;

				if (showDemos) {
					$demoTabs.html(htmlResponse);
					tabs();
					lazyload('.xtemos-demo-tab-item.active .xtemos-lazy');
					demosShown = true;
				}

				$demosPreview.removeClass('xtemos-demos-loading');
				$demosPreview.addClass('xtemos-demos-loaded');
			},
			error: function () {
				console.log('ajax error');
			}
		});

	}


	function tabs() {
		var $firstTabEl = $('.xtemos-category-list .xtemos-category-item').first(),
			firstTabEl_id = $firstTabEl.attr('id');

		$firstTabEl.addClass('active');
		$('.xtemos-demo-tab-item[data-tab-id="' + firstTabEl_id + '"]').addClass('active');
	}

	function lazyload($selector) {
		var lazy = $($selector);

		lazy.each(function () {
			if (!$(this).parent().hasClass('xtemos-image-loaded')) {
				var ImageSrc = $(this).data('lazy-original');
				$(this).attr('src', ImageSrc);
				$(this).parent().addClass('xtemos-image-loading');
				$(this).on('load', function () {
					$(this).parent().removeClass('xtemos-image-loading');
					$(this).parent().addClass('xtemos-image-loaded');
				})
			}
		})

	}

	// $('body').addClass('xtemos-demos-ready');

});


