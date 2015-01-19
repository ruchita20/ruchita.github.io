// ******************************* Configuration **************************//
// ***********************************************************************//
// ********************************* Start ******************************// 

// =======================================================================// 
// Twitter                                                               //        
// =====================================================================//

//Your twitter username
var twitter_username = 'ruchitarathi';

// =======================================================================// 
// Google Maps                                                           //        
// =====================================================================//

// Point 1
var google_maps_latitude = 38.707126;
var google_maps_longitude = -8.135499;

// Point 2 (Set to null if you want to disable)
var google_maps_latitude_2 = null;
var google_maps_longitude_2 = null;

//Circle color
var google_maps_circle_color = '#fb8047';

//Landscape color
var google_maps_landscape_color = '#ffffff';

//Water color
var google_maps_water_color = '#d4d4d4';

// =======================================================================// 
// Portfolio Settings                                                    //        
// =====================================================================//

var portfolio_items_page = 5;
var portfolio_curent_page = 1;
var portfolio_total_items;

// =======================================================================// 
// Blog                                                                  //        
// =====================================================================//

var blog_items_page = 8;
var blog_curent_page = 1;
var blog_total_items;

// =======================================================================// 
// Newsletter form                                                       //        
// =====================================================================//

////Set true or false to enable/disable ajax (If you want to use third-party services like Mailchimp, Campaign Monitor,you should disable ajax form)
var ajax_form = true;

// ******************************* Configuration **************************//
// ***********************************************************************//
// ********************************** End *******************************// 






/* Do not modify below unless you know what you are doing */

var header_height = $('header.navbar').outerHeight(true);

if (Modernizr.mq('only screen and (max-width: 979px)'))
{
	header_height = 0;
}


$(document).ready(function() {

	$('body').scrollspy({
		target: '.navbar',
		offset: header_height+5
	});

	$('header.navbar, .localscroll').localScroll({
		easing : 'easeInOutExpo',
		hash : true,
		offset : -header_height
	});

	$('.contact-form-wrapper header').toggle(
		function(){
			$('.contact-form-wrapper').addClass('opened', 1000, function(){
				$('.contact-form').show('drop', { direction: "down" }, 500);
			});
		},
		function(){
			$('.contact-form').hide('drop', { direction: "down" }, 500);
			$('.contact-form-wrapper').removeClass('opened', 1000);
		}
	);

	$("a[rel=popover]").popover().click(function(e) {
		e.preventDefault()
	});

	$("a[rel^='lightwindow']").prettyPhoto({deeplinking:false});

	$('.slideshow').flexslider({
		animation : 'slide',
		directionNav : false,
		controlNav : true
	});

	$('[rel="tooltip"]').tooltip();

	$('input, textarea').placeholder();

	$(document).on('click', '.lightwindow', function(event){

		file = $(this).attr('href');
		
		$.ajax({
  			url: file,
		}).done(function(data) {
			
			$('#lightwindow-content').html(data);
			$('#lightwindow').show('fade', function() {

				$('body').addClass('no-scroll');

				$("a[rel^='lightwindow']").prettyPhoto({deeplinking:false});
				$('#lightwindow-content').show('fade');
			});
		});

		return false;
	});

	$(document).on('click', '.close-lightwindow', function(event){
		
		$('#lightwindow-content').hide('fade', function() {
			$('#lightwindow').hide('fade', function() {
				$('#lightwindow-content').html('').css({'margin-top' : 0});
				$('#lightwindow').css({'height' : 'auto'});
				$('body').removeClass('no-scroll');
			});
		});

		return false;
	});

	/* Forms */

	//Newsletter submit
    $('.newsletter-form').submit(function() {
        
        var form_data = $(this).serialize();

        if (validateEmail($('.newsletter-form input').attr('value')))
        {
            
            if (typeof ajax_form !== "undefined" && ajax_form === true)
            {
                $.post($(this).attr('action'), form_data, function(data) {
                    $('.newsletter-fields, .newsletter-validate').hide('fade', function() { 
                        $('.newsletter-info').show('fade');
                    });
                   
                });
            }
        }

        else
        {
            $('.newsletter-validate').filter(':not(:animated)').show("pulsate", { times:3 }, 2000);
        }

        return false;

    });

    //Newsletter submit
    $('.contact-form').submit(function() {
        
        var form_data = $(this).serialize();
           
        $.post($(this).attr('action'), form_data, function(data) {
            $('.contact-form .controls, .contact-form textarea').hide('fade', function() { 
                $('.contact-info').show('fade');
            });
        });

        return false;

    });

    /* Resizes / Layout changes */

    //Calculate margin top for first page (usually home)
	header_height = jQuery('header.navbar').height();
	jQuery('.page:first').css({'padding-top' : 0, 'margin-top' : header_height});

	update_page_height('.page');

    $('html').resize(function(e){

    	blog_margin();

    	if ($('.blog-container div.isotope-blog').hasClass('isotope'))
    	{
    		$('.blog-container div.isotope-blog').isotope( 'reLayout' );
    	}

    	update_page_height('.page');

    	update_scrollspy();
    	
    });

	/* URI Listener */
	uri();

	$(window).hashchange(function(){
		uri();
	});

	$(".twitter-feed").tweet({
        join_text : "",
        count : 1,
        loading_text : "loading tweets...",
        username : twitter_username,
        avatar_size : 56,
        template : '{avatar}{text}{join}<div class="twitter-info"><span class="twitter-username"><a href="http://twitter.com/' + twitter_username + '">@' + twitter_username + '</a></span><span class="twitter-logo">&nbsp;</span>{time}</div>'
    });    
	
	/* Ajax Portfolio */

	//Init Porfolio
	$('.portfolio').before('<div class="portfolio-loader"></div>');
	$('.portfolio-loader').spin({ color: '#cccccc' });
	portfolio_items(portfolio_items_page, portfolio_curent_page, portfolio_total_items, category, portfolio_scroll);

	$(document).on('click', 'article.portfolio-item', function(event){

		var portfolio_item = $(this);
		var portfolio_file = $(this).attr('data-file');
		var portfolio_item_id = $(this).attr('id');
			

		$('.ajax-portfolio-item').addClass('to-delete').slideFadeToggle(250, 'easeOutCirc', function() {
			
			$('.to-delete').remove();

			$('.triggered').each(function(index) {

	    		if (!$(this).is(":visible"))
	    		{
	    			$(this).slideDown(250, "easeInCirc", function() {

	  					$(this).removeClass('triggered');
	  			
					});
	    		}

			});
	  		
		});

		$.ajax({
  			url: portfolio_file,
		}).done(function(data) {

			var html_item = '<div style="display:none" class="ajax-portfolio-item">' + data + '</div>';


			portfolio_item.addClass('triggered').after(html_item);
			$("a[rel=popover]").popover({trigger : 'hover'}).click(function(e) { e.preventDefault() });

			$('.ajax-portfolio-item, .slideshow-portfolio-item-detail').imagesLoaded( function( $images, $proper, $broken ) {

				if ( $(data).filter('article').hasClass('extended') )
				{

					$('.slideshow-left .slideshow-portfolio-item-detail').flexslider({
						animation : 'fade',
						directionNav : false,
						controlNav : false
					});

					$('.slideshow-right .slideshow-portfolio-item-detail').flexslider({
						animation : 'fade',
						directionNav : false,
						controlNav : false,
						startAt : -1
					});
					

		            $('.slideshow-left-nav .bx-next').click(function(){
		                $('.slideshow-right .slideshow-portfolio-item-detail').flexslider('next');
		                $('.slideshow-left .slideshow-portfolio-item-detail').flexslider('next');
		                return false;
		            });

		            $('.slideshow-left-nav .bx-prev').click(function(){
		                $('.slideshow-right .slideshow-portfolio-item-detail').flexslider('next');
		                $('.slideshow-left .slideshow-portfolio-item-detail').flexslider('next');
		                return false;
		            });

		     

		            $("a[rel^='lightwindow']").prettyPhoto({deeplinking:false});
	        	}

	        	else
				{

					$('.slideshow-portfolio-item-detail').flexslider({
						animation : 'slide',
						easing : 'easeInOutCirc',
						controlNav : false
					});
				
				}

				//Animations
				portfolio_item.slideFadeToggle(250, "easeInCirc", function() { });

	  			$('.ajax-portfolio-item').slideDown(250, "easeInCirc", function() { 
	  				$('body').scrollTo( $(this), 1000, {easing:'easeOutCirc', offset: -header_height });
	  				/*update_scrollspy();*/
	  			});

			});

		});

	});

	$(document).on('click', '.portfolio-item-detail a.close', function(event){
		to_close = $(this).parents('.ajax-portfolio-item');
		to_open = to_close.prev('article');

		to_close.animate({height: "hide"}, 500, "easeInCirc", function() {
			to_close.remove();
  			to_open.animate({height: "show"}, 500);
  		});

		return false;

	});

	/* Ajax Blog */

	//Init Blog
	$('.blog-container').before('<div class="blog-loader"></div>');
	$('.blog-loader').spin({ color: '#000000' });
	blog_items(blog_items_page, blog_curent_page, blog_total_items, blog_scroll);

	/* Start Google Maps */ 
	startGmap();


});

/* History */
function uri()
{
	var url = $.url();
	hash_param = url.fsegment(1);

	category = '*';
	portfolio_curent_page = 1;
	portfolio_scroll = false;
	blog_scroll = false;

	if (hash_param == 'portfolio')
	{

		category = url.fsegment(2);

		if (url.fsegment(2) != '*')
		{
			category = '.category-' + url.fsegment(2);
		}
		
		portfolio_curent_page = url.fsegment(3);
		portfolio_scroll = true;

		portfolio_items(portfolio_items_page, portfolio_curent_page, portfolio_total_items, category, portfolio_scroll);
	}

	else if (hash_param == 'posts')
	{
		
		blog_curent_page = url.fsegment(2);
		blog_scroll = true;

		blog_items(blog_items_page, blog_curent_page, blog_total_items, blog_scroll);
	}


}

/* Blog Functions */

//Make Pagination 
function blog_update_pages(data, curent_page)
{

	blog_total_items = $(data).filter('article').size();

	pages_blog = Math.ceil(blog_total_items/blog_items_page);

	$('.pagination-blog ul').html('<li><a href="#posts/1" data-page="1">1</a></li>');

	for (var i=2;i<(pages_blog+1);i++) 
	{
		$('.pagination-blog ul').append('<li><a href="#posts/' + i + '" data-page="' + i + '">' + i + '</a></li>');
	}

	$('.pagination-blog ul li').removeClass('active', 500);
	$('.pagination-blog ul li:eq(' + (blog_curent_page-1) + ')').addClass('active', 500);

	$('.pagination-blog').show('fade');
}

//Load blog items
function blog_items(blog_items_page, blog_curent_page, blog_total_items, scroll)
{

	curent_blog_items = (blog_curent_page*blog_items_page)-blog_items_page;

	if (blog_curent_page==1)
	{
		blog_filter = ':lt(' + blog_items_page + ')';
	}

	else
	{
		blog_filter = ':gt(' + (curent_blog_items-1) + '):lt(' + (blog_items_page) + ')';
	}
	
	$('.pagination-blog').hide('fade');
	$('.blog-loader').show('fade');

	$('.blog-container').animate({height: "hide"}, 500, "easeInCirc", function(){

		if (scroll == true)
		{
			$('body').scrollTo( '.blog', 1500, {easing:'easeOutCirc', offset:-header_height });
		}

		$('.blog-container').html( 

			$('<div style="opacity:0" class="isotope-blog">').load('blog.html article' + blog_filter, function(response, status, xhr){
				
				$('.blog-container article').css({'opacity' : 0});

				$('.blog-container img').imagesLoaded(function(){

					$('.isotope-blog .slideshow').flexslider({
						animation : 'fade',
						directionNav : false,
						controlNav : true,
						start : function() {
							$('.blog-container div.isotope-blog').isotope({
								itemSelector : 'article'
							});
						},
						slideshow : false
					});

					$('.blog-loader').hide('fade');

					var delay = 0;

					$('.blog-container article').each(function(index) {
			    		$(this).delay(delay).animate({'opacity' : 1});
			    		delay += 250;
					});

					$('.isotope-blog').animate({'opacity' : 1}, 1500);

					$('.blog-container').animate({height: "show"}, 1000, "easeOutCirc", function(){
						//update_scrollspy();
					});

					blog_update_pages(response, blog_curent_page);

				});
				
			}) 
		);

		

	});

	if ( (curent_blog_items+blog_items_page) >= blog_total_items)
	{
		return false;
	}

	else
	{
		return true;
	}

}


/* Portfolio Functions */


//Make Pagination 
function portfolio_update_pages(category, data, curent_page)
{

	if (category == '*' || category == '')
	{
		category = '';
		category_code = '*';
		category_slug = '*';
	}

	else
	{
		category_slug = category.replace('.category-', '');
		category_code = category;
	}

	portfolio_total_items = $(data).filter('article' + category).size();

	pages_portfolio = Math.ceil(portfolio_total_items/portfolio_items_page);

	$('.pagination-portfolio ul').html('<li><a href="#portfolio/' + category_slug + '/1" data-page="1" data-filter="' + category_code + '">1</a></li>');

	for (var i=2;i<(pages_portfolio+1);i++) 
	{
		$('.pagination-portfolio ul').append('<li><a href="#portfolio/' + category_slug + '/' + i + '" data-page="' + i + '" data-filter="' + category_code + '">' + i + '</a></li>');
	}

	$('.pagination-portfolio ul li').removeClass('active', 500);
	$('.pagination-portfolio ul li:eq(' + (portfolio_curent_page-1) + ')').addClass('active', 500);

	$('.pagination-portfolio').show('fade');
}

//Load portfolio items
function portfolio_items(portfolio_items_page, portfolio_curent_page, portfolio_total_items, category, scroll)
{

	$('.portfolio-filter ul li').removeClass('active');
	$('.portfolio-filter ul li a[data-filter="' + category + '"]').parent('li').addClass('active');
	$('.pagination-portfolio ul li a').attr('data-filter', category);

	curent_portfolio_items = (portfolio_curent_page*portfolio_items_page)-portfolio_items_page;

	if (category == '*')
	{
		category = '';
	}

	if (portfolio_curent_page==1)
	{
		portfolio_filter = ':lt(' + portfolio_items_page + ')';
	}

	else
	{
		portfolio_filter = ':gt(' + (curent_portfolio_items-1) + '):lt(' + (portfolio_items_page) + ')';
	}
	
	$('.pagination-portfolio').hide('fade');
	$('.portfolio-loader').show('fade');

	$('.portfolio').animate({height: "hide"}, 500, "easeInCirc", function(){
		
		if (scroll == true)
		{
			$('body').scrollTo( '.portfolio-filter', 1000, {easing:'easeOutCirc', offset: -(header_height+25) });
		}
		
		
		$('.portfolio').html( 

			$('<div style="opacity:0">').load('portfolio.html article' + category + portfolio_filter, function(response, status, xhr){

				$('.portfolio-loader').hide('fade');

				$(this).animate({'opacity' : 1}, 1500);

				$('.portfolio').animate({height: "show"}, 1000, "easeOutCirc", function() {
					/*update_scrollspy();*/
				});
				
				portfolio_update_pages(category, response, portfolio_curent_page);
				
			}) 
		);

	});

	if ( (curent_portfolio_items+portfolio_items_page) >= portfolio_total_items)
	{
		return false;
	}

	else
	{
		return true;
	}

}

/* Update Scrollspy*/
function update_scrollspy()
{
	/*$('[data-spy="scroll"]').each(function () {
    	var $spy = $(this).scrollspy('refresh');
	});*/
	$('body').scrollspy('refresh');
}

function update_page_height(element)
{
	$(element).each(function(index) {

    	padding = ($(this).outerHeight(true)-$(this).height());

    	if ( $(this).hasClass('home') )
		{
			padding -= 120;
		}

    	$(this).css({ 'min-height' : $(window).height()-(padding+header_height) });
	});
}

function blog_margin()
{
	window_w = $(window).width();
	blog_item_w = $('.blog-container article').outerWidth(true);

	a = Math.floor(window_w/blog_item_w);
	b = a*blog_item_w;
	c = window_w-b;
	d = (c/2)-10;

	$('.blog-container').css({'margin-left' : d});
	
	if (window_w<768)
	{
		$('.blog-container').css({'margin-left' : 0});
	}
	
}


/* Google Maps */
function startGmap(){var n={zoom:4,center:new google.maps.LatLng(google_maps_latitude,google_maps_longitude),navigationControlOptions:{style:google.maps.NavigationControlStyle.NORMAL,position:google.maps.ControlPosition.RIGHT_TOP},streetViewControl:false,scrollwheel:false,zoomControl:true,zoomControlOptions:{style:google.maps.ZoomControlStyle.DEFAULT,position:google.maps.ControlPosition.RIGHT_TOP},mapTypeControl:false,mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DROPDOWN_MENU,position:google.maps.ControlPosition.TOP_RIGHT,mapTypeIds:["ptMap"]}};map=new google.maps.Map(document.getElementById("contact_map"),n);var j=[{featureType:"administrative",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"landscape",elementType:"all",stylers:[{color:google_maps_landscape_color},{visibility:"on"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"all",stylers:[{visibility:"on"},{lightness:-30}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"all",stylers:[{color:google_maps_water_color}]}];var m={name:"Map"};var l=new google.maps.StyledMapType(j,m);map.mapTypes.set("ptMap",l);map.setMapTypeId("ptMap");var k={path:google.maps.SymbolPath.CIRCLE,fillOpacity:0.75,fillColor:google_maps_circle_color,strokeOpacity:1,strokeColor:google_maps_circle_color,strokeWeight:1,scale:10};var q=new google.maps.LatLng(google_maps_latitude,google_maps_longitude);var p=new google.maps.Marker({position:q,map:map,zIndex:99999,optimized:false,icon:k});if(google_maps_latitude_2&&google_maps_longitude_2){var i={path:google.maps.SymbolPath.CIRCLE,fillOpacity:0.75,fillColor:google_maps_circle_color,strokeOpacity:1,strokeColor:google_maps_circle_color,strokeWeight:1,scale:10};var h=new google.maps.LatLng(google_maps_latitude_2,google_maps_longitude_2);var o=new google.maps.Marker({position:h,map:map,zIndex:99999,optimized:false,icon:i})}};

/* Spinner wrapper for jQuery */
$.fn.spin=function(a){this.each(function(){var c=$(this),b=c.data();if(b.spinner){b.spinner.stop();delete b.spinner}if(a!==false){b.spinner=new Spinner($.extend({color:c.css("color")},a)).spin(this)}});return this};

/* validate email */ 
function validateEmail(a){var b=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return b.test(a)};

//Fade Toggle
$.fn.slideFadeToggle  = function(speed, easing, callback) { return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback); };