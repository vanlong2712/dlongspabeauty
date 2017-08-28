(function ($) {
    "use strict";
    var main_wind = $(window);
    var wWidth = $(window).width();

    jQuery(document).ready(function ($) {

        //-----menuzord------
        jQuery("#menuzord").menuzord({
            trigger: "hover",
            indicatorFirstLevel: '<i class="fa fa-angle-down"></i>',
            indicatorSecondLevel: '<i class="fa fa-angle-right"></i>'
        });

        
        //-----------venobox--------
        jQuery('.venobox').venobox({
            titlePosition: 'bottom'
        });

        //-----------video venobox--------
        jQuery('.parlor_video').venobox();

        //-------quick booking form--------
        $("p.click_btn").on("click", function () {
            $(".quick_booking").toggleClass("open");
        });


        //----------moving to welcome section on clicking mouse icon---------
        $("#mouse").on("click", function () {
            $("html, body").animate({
                scrollTop: $("#welcome").offset().top - 64 + 'px'
            }, 1200);
        });

        //--------banner parallax--------
        if (wWidth > 767) {
            $('.service_banner, .shop_banner, .blog_banner, .booking_banner, .contact_banner, .gallery_banner').parallax("50%", 0.4);
        }

        //-----------facts counter----------
        $('.counter').counterUp({
            //delay: 10, // the delay time in ms
            time: 800 // the speed time in ms
        });

    });

    //------------nice select-----------
    $('select').niceSelect();

    //------Adjusting the top nav showing the top nav when scrolling >= 53----
    main_wind.on('scroll', function () {
        if ($(this).scrollTop() >= 35) {
            $("#header").addClass("sticked");
        } else {
            $("#header").removeClass("sticked");
        }
    });

    //-------Mega menu carousel-------
    $(".megamenu_carousel").owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        nav: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        margin: 25,
        navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        autoplay: true,
        smartSpeed: 1200,

    });

    //-------home page-4 hero carousel-------
    $(".hero_content4_wrapper").owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        nav: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        autoplay: true,
        smartSpeed: 1200,
        autoplayTimeout: 9000,

    });

    //-------product carousel-------
    $("#product_carousel").owlCarousel({
        items: 4,
        loop: true,
        dots: false,
        nav: true,
        margin: 25,
        navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        autoplay: true,
        smartSpeed: 1200,
        autoplayHoverPause: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            }
        }
    });

    //-------experts carousel-------
    $("#experts_carousel").owlCarousel({
        items: 4,
        loop: true,
        dots: false,
        nav: true,
        margin: 25,
        navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        autoplay: true,
        smartSpeed: 1200,
        autoplayHoverPause: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
            1200: {
                items: 4,
            }
        }
    });

    //-------testimonial carousel-------
    $(".testimoial_wrapper").owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        nav: true,
        navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        autoplay: true,
        smartSpeed: 1100,
        autoplayHoverPause: true
    });

    //-----------bootstrap popover-----------
    $("#popover1").popover({
        html: true,
        placement: 'top',
        content: function () {
            return $("#popover_content1").html();
        }
    });
    $("#popover2").popover({
        html: true,
        placement: 'bottom',
        content: function () {
            return $("#popover_content2").html();
        }
    });
    $("#popover3").popover({
        html: true,
        placement: 'top',
        content: function () {
            return $("#popover_content3").html();
        }
    });

    //--------mixitup active----------
    $('.gallery_wrapper').mixItUp({
        animation: {
            effects: 'fade'
        }
    });

    //---------product list view and grid view---------
    if (wWidth > 767) {
        $('#list_view').on('click', function () {
            $("#product_gallery_v2").addClass('list_view');
            $("#grid_view").removeClass('active');
            $(this).addClass('active');
        });
        $('#grid_view').on('click', function () {
            $("#product_gallery_v2").removeClass('list_view');
            $("#list_view").removeClass('active');
            $(this).addClass('active');
        });
    }

    //------Masonry active-----
    main_wind.on('load', function () {
        /*----preloader------*/
         $('#loading').fadeOut('slow');
        
        /*-------masonary-----*/
        if (wWidth > 767) {
            /*product gallery-1*/
            $('#product_gallery_v1').masonry({
                itemSelector: '#product_gallery_v1 > .col-md-3',
            });

            //---------blog-----------
            $('.blog_post_wrapper').masonry({
                itemSelector: '.blog_post_wrapper > .single_blog',
            });
        }

        //-----blog sidebr masonary-------
        $('.right_sidebar').masonry({
            itemSelector: '.right_sidebar > .single_sidebar_box',
        });
    });


    // -----datetime picker activation------ 
    $(function () {
        $('#datetimepicker1, #datetimepicker2').datetimepicker({
            useCurrent: false,
            format: "DD MMM YYYY",
            ignoreReadonly: true,
            minDate: new Date()

            /* if you want to select you only specify date then the code will beauty-carousel
             minDate: "2016-02-20",
             maxDate: "2016-02-25" */
        });
    });


    //--------Scroll Top---------
    main_wind.on('scroll', function () {
        var consultScroll = $('.scroll_top');
        if ($(this).scrollTop() > 500) {
            consultScroll.fadeIn();
            consultScroll.removeClass('not_visible');
        } else {
            consultScroll.fadeOut();
        }
    });
    var goScroll = $('.scroll_top');
    goScroll.on('click', function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    });


    //-------------main slider active------------
    $(".Modern-Slider").slick({
        autoplay: true,
        autoplaySpeed: 10000,
        speed: 900,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: false,
        pauseOnDotsHover: true,
        fade: true,
        prevArrow: '<button class="PrevArrow"></button>',
        nextArrow: '<button class="NextArrow"></button>',
        draggable: 'true',
        arrows: true,
    });

    //=----Hide arrow--------
    if (wWidth < 767) {
        $('.slick-arrow').hide()
    }

    //----------slick carousel for welcome sectioin------------
    $('#carousel_img').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        speed: 1200,
        cssEase: 'ease-in-out',
        fade: true,
        asNavFor: '#carousel_text'
    });
    $('#carousel_text').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '#carousel_img',
        speed: 900,
        cssEase: 'ease-in-out',
        focusOnSelect: true
    });

    // --------------price filter activation------------
    $("#price_filter").slider({
        from: 100,
        to: 10000,
        step: 1,
        smooth: true,
        round: 0,
        dimension: "$",
        skin: "round"
    });


}(jQuery));
