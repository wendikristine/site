/********************************************************
 *
 * Custom Javascript code for AppStrap Bootstrap theme
 * Written by Themelize.me (http://themelize.me)
 *
 *******************************************************/
var jPM = {},
  pageLoaderDone = false;
var PLUGINS_LOCALPATH = './assets/plugins/';
var SLIDER_REV_VERSION = '4.6';
var loadedFiles = [];

(function($) {
  $.extend($.fn, {

    // ===============================================================
    // Initiates all theme JS
    // ===============================================================
    themeInit: function(refresh) {
      var context = $(this);
      refresh = refresh || false;

      // Page load only
      if (refresh === false) {

      }

      // Menus
      context.themeSubMenus();
      context.themeScrollMenus();

      // Custom 
      context.themeCustom(refresh);

      // Plugins
      // Call single plugins like context.themePlugins(false).themePluginSidr();
      var plugins = context.themePlugins(refresh);
      $.each(plugins, function(key, func) {
        func(refresh);
      });
    },

    // ===============================================================
    // Refresh scripts after ajax calls
    // ===============================================================
    themeRefresh: function() {
      var context = $(this);
      if (typeof context.context === "undefined" || context.context === null) {
        context.context = context;
      }

      context.themeInit(true);
      if (typeof jQuery.fn.waypoint !== 'undefined') {
        Waypoint.refreshAll();
      }
    },

    // ===============================================================
    // @group: Third-party plugin intergration/init
    // ===============================================================  
    themePlugins: function(refresh) {
      var context = $(this);
      if (typeof context === "undefined" || context === null) {
        context = $(document);
      }
      $document = $(document);

      // Plugin functions
      // name pattern themePluginPLUGINNAME
      // items: PLUGINNAMEs
      // ----------------------------------------------------------------
      return {
        themePluginFakeLoader: function() {
          // ----------------------------------------------------------------
          // fakeLoader.js - page loading indicator/icon
          // @see: http://joaopereirawd.github.io/fakeLoader.js/
          // ----------------------------------------------------------------
          var $fakeLoaders = context.find('[data-toggle=page-loader]');
          if ($fakeLoaders.length > 0) {
            var themePluginFakeLoaderInit = function() {
              jQuery('html').addClass('has-page-loader');
              var $pageLoader = jQuery('[data-toggle=page-loader]'),
                options = {
                  zIndex: 9999999,
                  spinner: $pageLoader.data('spinner') || 'spinner6',
                  timeToHide: 1000
                };
              $pageLoader.fakeLoader(options);
              $document.isPageLoaderDone(function() {
                jQuery('html').removeClass('has-page-loader');
                $(window).trigger('resize');
              });
            };
            $document.themeLoadPlugin(["fakeLoader/fakeLoader.min.js"], ["fakeLoader/fakeLoader.css"], themePluginFakeLoaderInit);
          }
        },

        themePluginCountTo: function() {
          // ----------------------------------------------------------------
          // Count To (counters)
          // @see: https://github.com/mattboldt/typed.js
          // ----------------------------------------------------------------
          var $countTos = context.find('[data-toggle="count-to"]');
          if ($countTos.length > 0) {
            var themePluginCountToInit = function() {
              $countTos.each(function() {
                var $this = $(this),
                  delay = $this.data('delay') || 0;
                $this.waypoint(function() {
                  setTimeout(function() {
                    $this.countTo({
                      onComplete: function() {
                        $this.addClass('count-to-done');
                      },
                      formatter: function(value, options) {
                        var v = value.toFixed(options.decimals);
                        if (v == '-0') {
                          v = '0';
                        }
                        return v;
                      },
                    });
                  }, delay);
                  this.destroy();
                }, {
                  offset: '90%',
                });
              });
            };
            $document.themeLoadPlugin(["https://cdnjs.cloudflare.com/ajax/libs/jquery-countto/1.2.0/jquery.countTo.min.js"], [], function() {
              $document.includeWaypoints(function() {
                $document.isPageLoaderDone(themePluginCountToInit);
              });
            });
          }
        },

        themePluginTyped: function() {
          // ----------------------------------------------------------------
          // typed.js - typewriter effect
          // @see: https://github.com/mattboldt/typed.js
          // ----------------------------------------------------------------
          var $typeds = context.find('[data-typed]');
          if ($typeds.length > 0) {
            var themePluginTypedInit = function() {
              $typeds.each(function() {
                var $this = $(this),
                  typedStrings = $this.data('typed') || null,
                  typedSettings = $this.data('typed-settings') || {},
                  typedDelay = typedSettings.delay || 0;
                typedSettings.autoStart = true;
                typedSettings.callback = function() {
                  if (typedSettings.doneClass !== '') {
                    $.each(typedSettings.doneClass, function(e, c) {
                      $(e).addClass(c);
                    });
                  }
                };

                if (typedStrings !== '') {
                  if (typeof typedStrings === 'object') {
                    typedSettings.strings = typedStrings;
                  }
                  $this.waypoint(function() {
                    setTimeout(function() {
                      $this.typeIt(typedSettings);
                    }, typedDelay);
                    this.destroy();
                  }, {
                    offset: '100%',
                  });
                }
              });
            };

            $document.themeLoadPlugin(["https://cdnjs.cloudflare.com/ajax/libs/typeit/4.3.0/typeit.min.js"], [], function() {
              $document.includeWaypoints(function() {
                $document.isPageLoaderDone(themePluginTypedInit);
              });
            });
          }
        },

        themePluginDropdown: function() {
          // ----------------------------------------------------------------
          // Plugin: Bootstrap Hover Dropdown
          // @see: https://github.com/CWSpear/bootstrap-hover-dropdown
          // ----------------------------------------------------------------
          var $dropdowns = context.find('[data-hover="dropdown"]');
          if ($dropdowns.length > 0) {
            $document.themeLoadPlugin(["bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js"], [], null, 'append');
          }
        },

        themePluginVide: function() {
          // ----------------------------------------------------------------
          // Plugin: Video Backgrounds
          // @see: https://github.com/VodkaBears/Vide
          // ----------------------------------------------------------------
          var $vides = context.find('[data-bg-video]');
          if ($vides.length > 0) {
            var themePluginVideInit = function() {
              $vides.each(function() {
                var videoBg = $(this);
                var videoBgVideos = videoBg.data('bg-video') || null;
                var videoBgOptions = videoBg.data('settings') || {};
                var videoBgDefaultOptions = {
                  'className': 'bg-video-video'
                };
                videoBgOptions = jQuery.extend(videoBgDefaultOptions, videoBgOptions);

                if (videoBgVideos !== null) {
                  videoBg.addClass('bg-video').vide(videoBgVideos, videoBgOptions);
                }
              });
            };
            $document.themeLoadPlugin(['https://cdnjs.cloudflare.com/ajax/libs/vide/0.5.1/jquery.vide.min.js'], [], themePluginVideInit);
          }
        },

        themePluginBootstrapSwitch: function() {
          // ----------------------------------------------------------------
          // Plugin: Bootstrap switch integration
          // @see: http://www.bootstrap-switch.org/
          // ----------------------------------------------------------------
          var $bootstrapSwitches = context.find('[data-toggle=switch]');
          if ($bootstrapSwitches.length > 0) {
            var themePluginBootstrapSwitchInit = function() {
              $bootstrapSwitches.bootstrapSwitch();
            };
            $document.themeLoadPlugin(["bootstrap-switch/build/js/bootstrap-switch.min.js"], ["bootstrap-switch/build/css/bootstrap3/bootstrap-switch.min.css"], themePluginBootstrapSwitchInit);
          }
        },

        themePluginJpanelMenu: function() {
          // ----------------------------------------------------------------
          // Plugin: jPanel Menu
          // data-toggle=jpanel-menu must be present on .navbar-btn
          // @todo - allow options to be passed via data- attr
          // @see: http://jpanelmenu.com/
          // ----------------------------------------------------------------
          var $jpanelMenus = context.find('[data-toggle=jpanel-menu]');
          if ($jpanelMenus.length > 0) {
            var themePluginJpanelMenuInit = function() {
              var jpanelMenuTrigger = $jpanelMenus;
              var jpanelMenuState = '';
              var target = jpanelMenuTrigger.data('target');
              var $target = $(target);
              var $window = $(window);
              var $headerSticky = $('#header .is-sticky');
              var $html = $('html');
              var triggerActive = function($trigger) {
                if ($trigger.css("display") === "block" || $trigger.css("display") === "inline-block") {
                  return true;
                }
                return false;
              };

              jPM = jQuery.jPanelMenu({
                menu: target,
                direction: jpanelMenuTrigger.data('direction'),
                trigger: '.' + jpanelMenuTrigger.attr('class'),
                excludedPanelContent: '.jpanel-menu-exclude',
                openPosition: '280px',
                clone: true,
                keepEventHandlers: true,
                afterOpen: function() {
                  jpanelMenuTrigger.addClass('open');
                  $html.addClass('jpanel-menu-open');
                  $window.trigger('resize');
                },
                afterClose: function() {
                  jpanelMenuTrigger.removeClass('open');
                  $html.removeClass('jpanel-menu-open');
                  $window.trigger('resize');
                },
                beforeOpen: function() {
                  if ($headerSticky.size() > 0) {
                    $html.addClass('jpanel-menu-opening');
                    $headerSticky.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                      $html.removeClass('jpanel-menu-opening');
                    });
                  }
                }
              });

              // Resize event trigger JPMenu on off based on trigger visibility
              $window.on("debouncedresize", function() {
                var triggerState = triggerActive(jpanelMenuTrigger);
                if (triggerState === true && jpanelMenuState !== 'on') {
                  jPM.on();
                  var $menu = jPM.getMenu();
                  $menu.themeRefresh();
                  jpanelMenuState = 'on';

                  // Internal click not working
                  jpanelMenuTrigger.on('click.jpm', function() {
                    jPM.trigger(true);
                    return false;
                  });
                } else if (triggerState === false && jpanelMenuState !== 'off') {
                  jPM.off();
                  jpanelMenuTrigger.off('click.jpm');
                  jpanelMenuState = 'off';
                }
              });

              $window.trigger('resize');
            };
            $document.themeLoadPlugin(["jPanelMenu/jquery.jpanelmenu.min.js", "https://cdn.jsdelivr.net/jquery.smartresize/0.1/jquery.debouncedresize.js"], [], themePluginJpanelMenuInit);
          }
        },

        themePluginFixTo: function() {
          // ----------------------------------------------------------------
          // Plugin: fixto(sticky navbar)
          // @see: https://bbarakaci.github.io/fixto/
          // ----------------------------------------------------------------
          var $fixTos = context.find('[data-toggle=clingify], [data-toggle=sticky]');
          if ($fixTos.length > 0) {
            var themePluginFixToInit = function() {
              var stickySetSettings = function(sticky) {
                var stickySettings = sticky.data('settings') || {};
                stickySettings.className = 'is-sticky';
                stickySettings.useNativeSticky = false;
                sticky.data('stickSettings', stickySettings);
              };

              var stickyStart = function(sticky, state) {
                stickySetSettings(sticky);
                var stickySettings = sticky.data('stickSettings');
                var stickyParent = stickySettings.parent || 'body';
                var stickyPersist = stickySettings.persist || false;
                var stickyBreakpoint = stickySettings.breakpoint || false;
                state = state || 'init';
                sticky.addClass('sticky').fixTo(stickyParent, stickySettings);

                // Sticky from the start - @todo
                if (stickyPersist) {
                  stickySetPersist(sticky, stickySettings);
                }

                $(window).on('resize', function() {
                  setTimeout(function() {
                    if (stickyBreakpoint) {
                      if ($(window).width() <= stickyBreakpoint) {
                        sticky.fixTo('destroy');
                        sticky.data('fixto-instance', '');
                      } else {
                        if (sticky.data('fixto-instance') === '') {
                          sticky.addClass('sticky').fixTo(stickyParent, sticky.data('stickSettings'));
                        }
                      }
                    }

                    if (stickyPersist) {
                      stickySetPersist(sticky, stickySettings);
                    }
                  }, 400);
                });
              };

              var stickySetPersist = function(sticky, stickySettings) {
                var persistTop = sticky[0].getBoundingClientRect().top;
                if (stickySettings.mind !== '') {
                  $(stickySettings.mind).each(function(key, value) {
                    var $this = $(value);
                    if ($this.length > 0) {
                      persistTop -= $this.outerHeight();
                    }
                  });
                }
                if (sticky.data('fixto-instance') !== '') {
                  sticky.fixTo('setOptions', {
                    top: persistTop
                  });
                } else {
                  sticky.attr('style', 'top: auto;');
                }
              };

              $fixTos.each(function(i) {
                stickyStart($(this));
              });
            };
            $document.themeLoadPlugin(["https://cdnjs.cloudflare.com/ajax/libs/fixto/0.5.0/fixto.js"], [], themePluginFixToInit);
          }
        },

        themePluginFlexslider: function() {
          // ----------------------------------------------------------------
          // Plugin: flexslider
          // @see: http://www.woothemes.com/flexslider/
          // ----------------------------------------------------------------
          var $flexsliders = context.find('.flexslider');
          if ($flexsliders.length > 0) {
            var themePluginFlexsliderInit = function() {
              $flexsliders.each(function() {
                var sliderSettings = {
                  animation: jQuery(this).attr('data-transition'),
                  selector: ".slides > .slide",
                  controlNav: true,
                  smoothHeight: true,
                  start: function(slider) {
                    //hide all animated elements
                    slider.find('[data-animate-in]').each(function() {
                      jQuery(this).css('visibility', 'hidden');
                    });

                    //slide backgrounds
                    slider.find('.slide-bg').each(function() {
                      jQuery(this).css({
                        'background-image': 'url(' + jQuery(this).data('bg-img') + ')'
                      });
                      jQuery(this).css('visibility', 'visible').addClass('animated').addClass(jQuery(this).data('animate-in'));
                    });

                    //animate in first slide
                    slider.find('.slide').eq(1).find('[data-animate-in]').each(function() {
                      jQuery(this).css('visibility', 'hidden');
                      if (jQuery(this).data('animate-delay')) {
                        jQuery(this).addClass(jQuery(this).data('animate-delay'));
                      }
                      if (jQuery(this).data('animate-duration')) {
                        jQuery(this).addClass(jQuery(this).data('animate-duration'));
                      }
                      jQuery(this).css('visibility', 'visible').addClass('animated').addClass(jQuery(this).data('animate-in'));
                      jQuery(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                        function() {
                          jQuery(this).removeClass(jQuery(this).data('animate-in'));
                        }
                      );
                    });
                  },
                  before: function(slider) {
                    slider.find('.slide-bg').each(function() {
                      jQuery(this).removeClass(jQuery(this).data('animate-in')).removeClass('animated').css('visibility', 'hidden');
                    });

                    //hide next animate element so it can animate in
                    slider.find('.slide').eq(slider.animatingTo + 1).find('[data-animate-in]').each(function() {
                      jQuery(this).css('visibility', 'hidden');
                    });
                  },
                  after: function(slider) {
                    //hide animtaed elements so they can animate in again
                    slider.find('.slide').find('[data-animate-in]').each(function() {
                      jQuery(this).css('visibility', 'hidden');
                    });

                    //animate in next slide
                    slider.find('.slide').eq(slider.animatingTo + 1).find('[data-animate-in]').each(function() {
                      if (jQuery(this).data('animate-delay')) {
                        jQuery(this).addClass(jQuery(this).data('animate-delay'));
                      }
                      if (jQuery(this).data('animate-duration')) {
                        jQuery(this).addClass(jQuery(this).data('animate-duration'));
                      }
                      jQuery(this).css('visibility', 'visible').addClass('animated').addClass(jQuery(this).data('animate-in'));
                      jQuery(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                        function() {
                          jQuery(this).removeClass(jQuery(this).data('animate-in'));
                        }
                      );
                    });

                    $(window).trigger('resize');

                  }
                };

                var sliderNav = jQuery(this).attr('data-slidernav');
                if (sliderNav !== 'auto') {
                  sliderSettings = $.extend({}, sliderSettings, {
                    manualControls: sliderNav + ' li a',
                    controlsContainer: '.flexslider-wrapper'
                  });
                }

                jQuery('html').addClass('has-flexslider');
                jQuery(this).flexslider(sliderSettings);
                jQuery('.flexslider').resize(); //make sure height is right load assets loaded
              });
            };
            $document.themeLoadPlugin(["flexslider/jquery.flexslider-min.js"], ["_overrides/plugin-flexslider.min.css", "flexslider/flexslider.css"], themePluginFlexsliderInit);
          }
        },

        themePluginSliderRevolution: function() {
          // ----------------------------------------------------------------
          // Plugin: Slider Revolution
          // @see: http://codecanyon.net/item/slider-revolution-responsive-jquery-plugin/2580848
          // ----------------------------------------------------------------
          $sliderRevolutions = context.find('[data-toggle=slider-rev]');
          if ($sliderRevolutions.length > 0) {
            var themePluginSliderRevolutionInit = function() {
              $sliderRevolutions.each(function() {
                var sliderRevEl = $(this);
                var pluginsLocation = $document.getScriptLocation();
                var sliderRevSettingsDefaults = {
                  extensions: pluginsLocation + 'slider-revolution/revolution/js/extensions/',
                  responsiveLevels: [1240, 1024, 778, 480],
                  visibilityLevels: [1240, 1024, 778, 480],
                  navigation: {
                    arrows: {
                      enable: true,
                      style: 'appstrap',
                      tmp: '',
                      rtl: false,
                      hide_onleave: false,
                      hide_onmobile: true,
                      hide_under: 481,
                      hide_over: 9999,
                      hide_delay: 200,
                      hide_delay_mobile: 1200,
                      left: {
                        container: 'slider',
                        h_align: 'left',
                        v_align: 'center',
                        h_offset: 20,
                        v_offset: 0
                      },
                      right: {
                        container: 'slider',
                        h_align: 'right',
                        v_align: 'center',
                        h_offset: 20,
                        v_offset: 0
                      },
                    },
                  },
                };
                var sliderRevSettings;
                sliderRevEl.hide();
                sliderRevSettings = $.extend(sliderRevSettingsDefaults, sliderRevEl.data());
                var slider = sliderRevEl.css('visibility', 'visible').show().revolution(sliderRevSettings);
              });
            };

            $document.themeLoadPlugin(
              ["slider-revolution/revolution/js/jquery.themepunch.tools.min.js?v=" + SLIDER_REV_VERSION, "slider-revolution/revolution/js/jquery.themepunch.revolution.min.js?v=" + SLIDER_REV_VERSION], ["_overrides/plugin-slider-revolution.min.css", "slider-revolution/revolution/css/settings.css?v=" + SLIDER_REV_VERSION],
              themePluginSliderRevolutionInit
            );
          }
        },

        themePluginBackstretch: function() {
          // ----------------------------------------------------------------
          // Plugin: Backstretch
          // @see: http://srobbin.com/jquery-plugins/backstretch/
          // ----------------------------------------------------------------
          var $backstretches = context.find('[data-toggle=backstretch]');
          if ($backstretches.length > 0) {
            var themePluginBackstretchInit = function() {
              $backstretches.each(function() {
                var backstretchEl = $(this);
                var backstretchTarget = jQuery,
                  backstretchImgs = [];
                var backstretchSettings = {
                  fade: 750,
                  duration: 4000
                };

                // Get images from element
                jQuery.each(backstretchEl.data('backstretch-imgs').split(','), function(k, img) {
                  backstretchImgs[k] = img;
                });

                // block level element
                if (backstretchEl.data('backstretch-target')) {
                  backstretchTarget = backstretchEl.data('backstretch-target');
                  if (backstretchTarget === 'self') {
                    backstretchTarget = backstretchEl;
                  } else {
                    if ($(backstretchTarget).length > 0) {
                      backstretchTarget = $(backstretchTarget);
                    }
                  }
                }

                if (backstretchImgs) {
                  $('html').addClass('has-backstretch');

                  // Merge in any custom settings
                  backstretchSettings = $.extend({}, backstretchSettings, backstretchEl.data());
                  backstretchTarget.backstretch(backstretchImgs, backstretchSettings);

                  // add overlay
                  if (backstretchEl.data('backstretch-overlay') !== false) {
                    $('.backstretch').prepend('<div class="backstretch-overlay"></div>');

                    if (backstretchEl.data('backstretch-overlay-opacity')) {
                      $('.backstretch').find('.backstretch-overlay').css('background', 'white').fadeTo(0, backstretchEl.data('backstretch-overlay-opacity'));
                    }
                  }
                }
              });
            };
            $document.themeLoadPlugin(["backstretch/jquery.backstretch.min.js"], [], themePluginBackstretchInit);
          }
        },

        themePluginFitVids: function() {
          // ----------------------------------------------------------------
          // Plugin: FitVids.js
          // @see: http://fitvidsjs.com/
          // ----------------------------------------------------------------
          var selectors = [
            "iframe[src*='player.vimeo.com']",
            "iframe[src*='youtube.com']",
            "iframe[src*='youtube-nocookie.com']",
            "iframe[src*='kickstarter.com'][src*='video.html']",
            "object",
            "embed"
          ];
          var $fitVids = context.find(selectors.join(','));
          if ($fitVids.length > 0) {
            var themePluginFitVidsInit = function() {
              $('body').fitVids({
                ignore: '.no-fitvids'
              });
            };
            $document.themeLoadPlugin(["fitvidsjs/jquery.fitvids.js"], [], themePluginFitVidsInit);
          }
        },

        themePluginIsotope: function() {
          // ----------------------------------------------------------------
          // Plugin: Isotope (blog/customers grid & sorting)
          // @see: http://isotope.metafizzy.co/
          // Also loads plugin: Imagesloaded (utility for Isotope plugin)
          // @see: https://github.com/desandro/imagesloaded
          // ----------------------------------------------------------------
          var $isoTopes = context.find('[data-toggle=isotope-grid]');
          if ($isoTopes.length > 0) {
            var themePluginIsotopeInit = function() {
              $isoTopes.each(function() {
                var $container = $(this),
                  options = $container.data('isotope-options'),
                  filters = $container.data('isotope-filter') || null;


                // If imagesLoaded avaliable use it
                if ($document.imagesLoaded) {
                  $container.imagesLoaded(function() {
                    $container.isotope(options);
                  });
                } else {
                  $container.isotope(options);
                }

                // Filtering
                if (filters) {
                  var $filters = $(filters);
                  $filters.on('click', function(e) {
                    e.preventDefault();
                    var $this = $(this),
                      filterValue = $this.data('isotope-fid') || null;

                    if (filterValue) {
                      $container.isotope({
                        filter: filterValue
                      });
                    }

                    return false;
                  });
                }

                $('body').addClass('has-isotope');
              });
            };
            $document.themeLoadPlugin(
              ["https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/4.1.1/imagesloaded.pkgd.min.js", "https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js"], [], themePluginIsotopeInit
            );
          }
        },

        themePluginHighlightJS: function() {
          // ----------------------------------------------------------------
          // Plugin: highlightjs (code highlighting)
          // @see: https://highlightjs.org
          // ----------------------------------------------------------------
          var $highlightJSs = context.find('code');
          if ($highlightJSs.length > 0) {
            var themePluginHighlightJSInit = function() {
              $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
              });
            };
            $document.themeLoadPlugin(
              ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min.js"], ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/default.min.css", "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/github.min.css"],
              themePluginHighlightJSInit
            );
          }
        },

        themePluginOwlCarousel: function() {
          // ----------------------------------------------------------------
          // Plugin: OwlCarousel (carousel displays)
          // @see: http://owlgraphic.com/owlcarousel/
          // ----------------------------------------------------------------
          var $owlCarousels = context.find('[data-toggle="owl-carousel"]');
          var $owlCarouselThumbs = context.find('[data-owl-carousel-thumbs]');
          if ($owlCarousels.length > 0) {
            var themePluginOwlCarouselInit = function(context) {
              $owlCarousels.each(function() {
                var $owlCarousel = $(this),
                  owlCarouselSettings = $owlCarousel.data('owl-carousel-settings') || null;

                $owlCarousel.addClass('owl-carousel').owlCarousel(owlCarouselSettings);
              });

              $owlCarouselThumbs.each(function() {
                var $owlThumbsWrap = $(this),
                  $owlThumbs = $owlThumbsWrap.find('.owl-thumb'),
                  $owlTarget = $($owlThumbsWrap.data('owl-carousel-thumbs')) || null,
                  owlThumbsCarousel = $owlThumbsWrap.data('toggle') !== '' && $owlThumbsWrap.data('toggle') == 'owl-carousel' || false;

                if ($owlTarget) {
                  $owlThumbs.eq(0).addClass('active');
                  $owlThumbs.on('click', function(event) {
                    $owlTarget.trigger('to.owl.carousel', [$(this).parent().index(), 300, true]);
                  });
                  if (owlThumbsCarousel) {
                    $owlThumbsWrap.owlCarousel();
                  }

                  // Owl API
                  $owlTarget.owlCarousel();
                  $owlTarget.on('changed.owl.carousel', function(event) {
                    var item = event.item.index;
                    $owlThumbs.removeClass('active');
                    $owlThumbs.eq(item).addClass('active');

                    if (owlThumbsCarousel) {
                      if ($owlThumbsWrap.find('.owl-item').eq(item).hasClass('active') === false) {
                        $owlThumbsWrap.trigger('to.owl.carousel', [item, 300, true]);
                      }
                    }
                  });
                }
              });
            };
            $document.themeLoadPlugin(
              ["https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.0/owl.carousel.min.js"], ["_overrides/plugin-owl-carousel.min.css", "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.0/assets/owl.carousel.min.css", "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"],
              themePluginOwlCarouselInit
            );
          }
        },

        themePluginMagnificPopup: function() {
          // ----------------------------------------------------------------
          // Plugin: MagnificPopup (popup content)
          // @see: http://dimsemenov.com/plugins/magnific-popup/
          // ----------------------------------------------------------------
          var $magnificPopups = context.find('[data-toggle="magnific-popup"]');
          if ($magnificPopups.length > 0) {
            var themePluginMagnificPopupInit = function() {
              var magnificPopupSettingsDefault = {
                disableOn: 0,
                key: null,
                midClick: false,
                mainClass: 'mfp-fade-zoom',
                preloader: true,
                focus: '', // CSS selector of input to focus after popup is opened
                closeOnContentClick: false,
                closeOnBgClick: true,
                closeBtnInside: true,
                showCloseBtn: true,
                enableEscapeKey: true,
                modal: false,
                alignTop: false,
                removalDelay: 300,
                prependTo: null,
                fixedContentPos: 'auto',
                fixedBgPos: 'auto',
                overflowY: 'auto',
                closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',
                tClose: 'Close (Esc)',
                tLoading: 'Loading...',
                type: 'image',
                image: {
                  titleSrc: 'data-title',
                  verticalFit: true
                }
              };

              $magnificPopups.each(function() {
                var magnificPopupSettings;
                var magnificPopupSettingsExtras = {};

                if ($(this).data('magnific-popup-settings') !== '') {
                  magnificPopupSettingsExtras = $(this).data('magnific-popup-settings');
                }
                magnificPopupSettings = jQuery.extend(magnificPopupSettingsDefault, magnificPopupSettingsExtras);
                $(this).magnificPopup(magnificPopupSettings);

                // Transitions
                var mfpImgLoadedClass = 'mfp-image-in';
                $(this).on('mfpOpen', function(e /*, params */ ) {
                  $.magnificPopup.instance.next = function() {
                    var self = this;
                    self.wrap.removeClass(mfpImgLoadedClass);
                    setTimeout(function() {
                      $.magnificPopup.proto.next.call(self);
                    }, 120);
                  };
                  $.magnificPopup.instance.prev = function() {
                    var self = this;
                    self.wrap.removeClass(mfpImgLoadedClass);
                    setTimeout(function() {
                      $.magnificPopup.proto.prev.call(self);
                    }, 120);
                  };
                }).on('mfpImageLoadComplete', function() {
                  var $this = $.magnificPopup.instance;
                  setTimeout(function() {
                    $this.wrap.addClass(mfpImgLoadedClass);
                  }, 10);
                });
              });
            };
            $document.themeLoadPlugin(
              ["magnific-popup/dist/jquery.magnific-popup.min.js"], ["_overrides/plugin-magnific-popup.min.css", "magnific-popup/dist/magnific-popup.css"],
              themePluginMagnificPopupInit
            );
          }
        },

        themePluginZoom: function() {
          // ----------------------------------------------------------------
          // Plugin: jQuery Zoom (image zoon)
          // @see: http://www.jacklmoore.com/zoom/
          // ----------------------------------------------------------------
          var $zooms = context.find('[data-img-zoom]');
          if ($zooms.length > 0) {
            var themePluginZoomInit = function() {
              $zooms.each(function() {
                var $this = $(this),
                  imgLarge = $this.data('img-zoom'),
                  imgZoomSettings = $this.data('img-zoom-settings') || {};

                imgZoomSettings.url = imgLarge;

                $this.addClass('d-block').zoom(imgZoomSettings);
              });
            };
            $document.themeLoadPlugin(["https://cdnjs.cloudflare.com/ajax/libs/jquery-zoom/1.7.18/jquery.zoom.min.js"], [], themePluginZoom);
          }
        },

        themePluginCountdown: function() {
          // ----------------------------------------------------------------
          // Plugin: jQuery Countdown timer
          // @see: http://hilios.github.io/jQuery.countdown/
          // ----------------------------------------------------------------
          var $countdowns = context.find('[data-countdown]');
          if ($countdowns.length > 0) {
            var themePluginCountdownInit = function() {
              $countdowns.each(function() {
                var $this = $(this),
                  countTo = $this.data('countdown'),
                  countdownFormat = $this.data('countdown-format') || null,
                  coundownExpireText = $this.data('countdown-expire-text') || null;

                $this.countdown(countTo)
                  .on('update.countdown', function(event) {
                    if (countdownFormat === null) {
                      countdownFormat = '%H hrs %M mins %S secs';
                      if (event.offset.totalDays > 0) {
                        countdownFormat = '%-d day%!d ' + countdownFormat;
                      }
                      if (event.offset.weeks > 0) {
                        countdownFormat = '%-w week%!w ' + countdownFormat;
                      }
                    }
                    $this.html(event.strftime(countdownFormat));
                  })
                  .on('finish.countdown', function(event) {
                    if (coundownExpireText !== coundownExpireText) {
                      $this.html(coundownExpireText);
                    }
                    $this.addClass('countdown-don');
                  });
              });
            };
            $document.themeLoadPlugin(["https://cdnjs.cloudflare.com/ajax/libs/jquery.countdown/2.2.0/jquery.countdown.min.js"], [], themePluginCountdownInit);
          }
        },

        themePluginCubePortfolio: function() {
          // ----------------------------------------------------------------
          // Plugin: Cube Portfolio
          // @see: http://hilios.github.io/jQuery.countdown/
          // ----------------------------------------------------------------
          var $cubePortfolios = context.find('[data-toggle="cbp"]');
          if ($cubePortfolios.length > 0) {
            var themePluginCubePortfolioInit = function() {
              $cubePortfolios.each(function() {
                var $this = $(this),
                  customSettings = $this.data('settings') || {},
                  defaultSettings = {
                    layoutMode: 'mosaic',
                    sortToPreventGaps: true,
                    defaultFilter: '*',
                    animationType: 'slideDelay',
                    gapHorizontal: 2,
                    gapVertical: 2,
                    gridAdjustment: 'responsive',
                    mediaQueries: [{
                      width: 1100,
                      cols: 4
                    }, {
                      width: 800,
                      cols: 3
                    }, {
                      width: 480,
                      cols: 2
                    }, {
                      width: 0,
                      cols: 1
                    }],
                    caption: 'zoom',
                    displayTypeSpeed: 100,

                    // lightbox
                    lightboxDelegate: '.cbp-lightbox',
                    lightboxGallery: true,
                    lightboxTitleSrc: 'data-title',
                    lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',

                    // singlePageInline
                    singlePageInlinePosition: 'top',
                    singlePageInlineInFocus: true,

                    // singlePage
                    singlePageAnimation: 'fade'

                  },
                  settings = $.extend({}, defaultSettings, customSettings);

                // Custom callbacks
                settings.singlePageInlineCallback = function(url, element) {
                  var t = this,
                    $this = $(t),
                    $element = $(element),
                    content = $element.data('content') || 'ajax';

                  // get content from ajax or inline HTML
                  if (content !== 'ajax' && $(content).size() > 0) {
                    // Inline HTML
                    var html = $(content).clone(true, true);
                    html.themeRefresh();
                    t.content.html('');
                    t.content.append(html.contents());
                    t.cubeportfolio.$obj.trigger('updateSinglePageInlineStart.cbp');
                    t.singlePageInlineIsOpen.call(t);
                  } else if (content == 'ajax') {
                    // Ajax
                    $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: 'html',
                        timeout: 30000
                      })
                      .done(function(result) {
                        // overwritter updateSinglePageInline() so events work
                        var html = $(result);
                        html.themeRefresh();
                        t.content.html('');
                        t.content.append(html);
                        t.cubeportfolio.$obj.trigger('updateSinglePageInlineStart.cbp');
                        t.singlePageInlineIsOpen.call(t);

                        if ($document.imagesLoaded) {
                          t.content.imagesLoaded(function() {
                            // If inline has owlCarousel
                            var $owl = t.content.find('[data-toggle="owl-carousel"]');
                            $owl.on('translated.owl.carousel', function(event) {
                              setTimeout(function() {
                                t.resizeSinglePageInline();
                              }, 200);
                            });

                            setTimeout(function() {
                              t.resizeSinglePageInline();
                            }, 1000);
                          });
                        }
                      })
                      .fail(function() {
                        t.updateSinglePageInline('AJAX Error! Please refresh the page!');
                      });
                  } else {
                    t.updateSinglePageInline('Content Error! Please refresh the page!');
                  }
                };
                settings.singlePageCallback = function(url, element) {
                  var t = this;

                  // Ajax
                  $.ajax({
                      url: url,
                      type: 'GET',
                      dataType: 'html',
                      timeout: 30000
                    })
                    .done(function(result) {
                      // overwrite updateSinglePageInline() so events work
                      var html = $(result);
                      html.themeRefresh();
                      var counterMarkup,
                        animationFinish,
                        scripts, isWrap;

                      t.content.addClass('cbp-popup-content').removeClass('cbp-popup-content-basic');
                      if (isWrap === false) {
                        t.content.removeClass('cbp-popup-content').addClass('cbp-popup-content-basic');
                      }
                      // update counter navigation
                      if (t.counter) {
                        counterMarkup = $(t.getCounterMarkup(t.options.singlePageCounter, t.current + 1, t.counterTotal));
                        t.counter.text(counterMarkup.text());
                      }
                      t.fromAJAX = {
                        html: html,
                        scripts: scripts
                      };
                      t.finishOpen--;
                      if (t.finishOpen <= 0) {
                        t.wrap.addClass('cbp-popup-ready');
                        t.wrap.removeClass('cbp-popup-loading');
                        t.content.html('');
                        t.content.append(html);
                        t.checkForSocialLinks(t.content);
                        t.cubeportfolio.$obj.trigger('updateSinglePageComplete.cbp');
                      }
                    })
                    .fail(function() {
                      t.updateSinglePage('AJAX Error! Please refresh the page!');
                    });
                };

                // If imagesLoaded avaliable use it
                if ($document.imagesLoaded) {
                  $this.imagesLoaded(function() {
                    $this.cubeportfolio(settings);
                  });
                }
              });
            };
            $document.themeLoadPlugin(
              ["https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/4.1.1/imagesloaded.pkgd.min.js", "cubeportfolio-jquery-plugin/cubeportfolio/js/jquery.cubeportfolio.js"], ["_overrides/plugin-magnific-popup.min.css", "_overrides/plugin-cube-portfolio.min.css", "cubeportfolio-jquery-plugin/cubeportfolio/css/cubeportfolio.css"],
              themePluginCubePortfolioInit
            );
          }
        }

        // Next plugin here

      }; // end of plugins object
    },

    // ===============================================================
    // @group: Custom functionality intergration/init
    // ===============================================================
    themeCustom: function(refresh) {
      var context = $(this);
      if (typeof context === "undefined" || context === null) {
        context = $(document);
      }
      $document = $(document);

      // ----------------------------------------------------------------
      // Fullheight elements
      // ----------------------------------------------------------------
      var fullHeights = context.find('[data-toggle="full-height"]');
      if (fullHeights.length > 0) {
        var doFullHeightsOffset = function(height, offset) {
          if (typeof offset == 'number') {
            return height - offset;
          } else if (typeof offset == 'string' && $(offset).length > 0) {
            $(offset).each(function() {
              height = height - $(offset).height();
            });
          }
          return height;
        };

        var doFullHeights = function() {
          fullHeights.each(function() {
            var $element = $(this),
              fullHeightParent = $element.data('parent') || window,
              fullHeightOffset = $element.data('offset') || null,
              fullHeightBreakpoint = $element.data('breakpoint') || null,
              $fullHeightParent = $(fullHeightParent) || null;

            if ($fullHeightParent) {
              var fullHeightParentHeight = $fullHeightParent.height();
              var fullHeight = fullHeightParentHeight;
              if (fullHeightOffset) {
                fullHeight = doFullHeightsOffset(fullHeight, fullHeightOffset);
              }

              if (fullHeightBreakpoint) {
                if ($(window).width() <= fullHeightBreakpoint) {
                  $element.css('height', 'auto');
                } else {
                  $element.outerHeight(fullHeight);
                }
              } else {
                $element.outerHeight(fullHeight);
              }
            }
          });
        };

        doFullHeights();
        $(window).on('resize', function() {
          setTimeout(function() {
            doFullHeights();
          }, 400);
        });
      }

      // ----------------------------------------------------------------
      // Animated elements
      // ----------------------------------------------------------------
      var elementsAnimated = context.find('[data-animate]');
      if (elementsAnimated.length > 0) {
        var initElementsAnimated = function() {
          elementsAnimated.each(function() {
            var $element = jQuery(this),
              animateClass = $element.data('animate'),
              animateInfinite = $element.data('animate-infinite') || null,
              animateDelay = $element.data('animate-delay') || null,
              animateDuration = $element.data('animate-duration') || null,
              animateOffset = $element.data('animate-offset') || '98%';

            // Infinite
            if (animateInfinite !== null) {
              $element.addClass('infinite');
            }

            // Delays & durations
            if (animateDelay !== null) {
              $element.css({
                '-webkit-animation-delay': animateDelay + 's',
                '-moz-animation-delay': animateDelay + 's',
                'animation-delay': animateDelay + 's'
              });
            }
            if (animateDuration !== null) {
              $element.css({
                '-webkit-animation-duration': animateDuration + 's',
                '-moz-animation-duration': animateDuration + 's',
                'animation-duration': animateDuration + 's'
              });
            }

            $element.waypoint(function() {
              $element.addClass('animated ' + animateClass).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $element.addClass('animated-done');
              });
              this.destroy();
            }, {
              offset: animateOffset,
            });
          });
        };

        $document.includeWaypoints(function() {
          $document.themeLoadPlugin([], ["https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"], function() {
            $document.isPageLoaderDone(initElementsAnimated);
          });
        });
      }

      // ----------------------------------------------------------------
      // Scroll state
      // ----------------------------------------------------------------
      context.find('[data-scroll="scroll-state"]').each(function() {
        var $scroll = $(this),
          $doc = $(document),
          scrollAmount = $scroll.data('scroll-amount') || $(window).outerHeight();

        $doc.scroll(function() {
          var y = $(this).scrollTop();
          if (y > scrollAmount) {
            $scroll.addClass('scroll-state-active');
          } else {
            $scroll.removeClass('scroll-state-active');
          }
        });
      });

      // ----------------------------------------------------------------
      // scrollax - adjust oapcity & top on scroll
      // ----------------------------------------------------------------
      context.find('[data-scroll="scrollax"]').each(function() {
        var $scroll = $(this),
          $doc = $(document),
          $window = $(window),
          opRatio = $scroll.data('scrollax-op-ratio') || 500,
          yRatio = $scroll.data('scrollax-y-ratio') || 5;

        $doc.scroll(function() {
          var windowTop = $window.scrollTop();
          $scroll.css({
            "opacity": 1 - windowTop / opRatio,
            "transform": "translateY(" + (0 - windowTop / yRatio) + "px)",
          });
        });
      });

      // ----------------------------------------------------------------
      // Quantity widget
      // ----------------------------------------------------------------
      context.find('[data-toggle="quantity"]').each(function() {
        var $this = $(this),
          $down = $this.find('.quantity-down'),
          $up = $this.find('.quantity-up'),
          $quantity = $this.find('.quantity');

        var toggleQuantity = function(direction) {
          var value = parseInt($quantity.val());
          if (direction === 'down') {
            value = value - 1;
          } else if (direction === 'up') {
            value = value + 1;
          }
          if (value < 0) {
            value = 0;
          }
          $quantity.val(value);
        };

        if ($quantity.length > 0) {
          $down.on('click', function() {
            toggleQuantity('down');
          });
          $up.on('click', function() {
            toggleQuantity('up');
          });
        }
      });

      // ----------------------------------------------------------------
      // Background images
      // @todo - support retina bg too
      // ----------------------------------------------------------------
      context.find('[data-bg-img]').each(function() {
        var $this = $(this),
          currentStyles = $this.attr("style") || '',
          bgImg = $this.data('bg-img');

        // Must be merged in
        currentStyles += 'background-image: url("' + bgImg + '") !important;';
        $this.attr("style", currentStyles).addClass('bg-img');
      });

      // ----------------------------------------------------------------
      // Dynamic/quick CSS props
      // Example: data-css='{"height":"240px","background-position":"center center"}'
      // ----------------------------------------------------------------
      context.find('[data-css]').each(function() {
        var $this = $(this),
          currentStyles = $this.data('css') || '',
          styleProps = $this.data('css') || {},
          newStyles = {};
        if (styleProps !== null && typeof styleProps === 'object') {
          newStyles = $.extend(currentStyles, styleProps);
          $this.css(newStyles);
        }
      });

      // ----------------------------------------------------------------
      // Overlay menu
      // ----------------------------------------------------------------
      var overlayMenus = context.find('[data-toggle=overlay]');
      if (overlayMenus.length > 0) {
        overlayMenus.each(function() {
          var $this = jQuery(this),
            target = $this.data('target') || null;

          // General class for all triggers
          $this.addClass('overlay-trigger');
          if (jQuery(target).size() > 0) {
            $target = jQuery(target);
            $this.on('click', function(e) {
              $this.toggleClass('overlay-active');
              jQuery($this.data('target')).toggleClass('overlay-active');
              jQuery('body').toggleClass('overlay-open');
              return false;
            });
          }
        });

        // Overlay dismiss links/buttons
        context.find('[data-dismiss="overlay"]').each(function() {
          var $this = jQuery(this),
            $target = $this.data('target') || '.overlay',
            $trigger = jQuery('[data-toggle="overlay"][data-target="' + $target + '"]') || null;

          // Check target overlay to close exists
          if ($($target).size() > 0) {
            $target = jQuery($target);
            $this.on('click', function(e) {
              $target.removeClass('overlay-active');
              jQuery('body').removeClass('overlay-open');

              // Try to find the trigger
              if ($trigger.size() > 0) {
                $trigger.removeClass('overlay-active');
              } else {
                // close all
                jQuery('[data-toggle="overlay"]').removeClass('overlay-active');
              }
              return false;
            });
          }
        });
      }

      // ----------------------------------------------------------------
      // Clickable elements
      // ----------------------------------------------------------------
      context.find('[data-url]').each(function() {
        var url = $(this).data('url');
        var parseStringUrl = function(url) {
          var a = document.createElement('a');
          a.href = url;
          return a;
        };
        var urlParse = parseStringUrl(url);
        $(this).addClass('clickable-element');

        // Hover event
        $(this).on('hover', function() {
          $(this).hover(
            function() {
              $(this).addClass("hovered");
            },
            function() {
              $(this).removeClass("hovered");
            }
          );
        });

        // Disable Links within block
        $(this).find('a').on('click', function(e) {
          if ($(this).attr('href') === urlParse.href) {
            e.preventDefault();
          }
        });

        // Click event
        $(this).on('click', function() {
          if (urlParse.host !== location.host) {
            // external
            window.open(urlParse.href, '_blank');
          } else {
            // internal
            window.location = url;
          }
        });
      });

      // ----------------------------------------------------------------
      // Search form show/hide
      // ----------------------------------------------------------------
      $searchForm = context.find('[data-toggle=search-form]');
      if ($searchForm.length > 0) {
        var $trigger = $searchForm;
        var target = $trigger.data('target');
        var $target = $(target);

        if ($target.length === 0) {
          return;
        }

        $target.addClass('collapse');
        $('[data-toggle=search-form]').click(function() {
          $target.collapse('toggle');
          $(target + ' .search').focus();
          $trigger.toggleClass('open');
          $('html').toggleClass('search-form-open');
          $(window).trigger('resize');
        });
        $('[data-toggle=search-form-close]').click(function() {
          $target.collapse('hide');
          $trigger.removeClass('open');
          $('html').removeClass('search-form-open');
          $(window).trigger('resize');
        });
      }

      // ----------------------------------------------------------------
      // colour switch - demo only
      // ----------------------------------------------------------------
      var defaultColour = 'green';
      context.find('.theme-colours a').click(function() {
        var $this = $(this);
        var c = $this.attr('href').replace('#', '');
        var cacheBuster = 3 * Math.floor(Math.random() * 6);
        $('.theme-colours a').removeClass('active');
        $('.theme-colours a.' + c).addClass('active');

        if (c !== defaultColour) {
          context.find('#colour-scheme').attr('href', 'assets/css/colour-' + c + '.css?x=' + cacheBuster);
        } else {
          context.find('#colour-scheme').attr('href', '#');
        }
      });

      // ----------------------------------------------------------------
      // IE placeholders
      // ----------------------------------------------------------------
      if (navigator.userAgent.toLowerCase().indexOf('msie') > -1) {
        context.find('[placeholder]').focus(function() {
          var input = jQuery(this);
          if (input.val() === input.attr('placeholder')) {
            if (this.originalType) {
              this.type = this.originalType;
              delete this.originalType;
            }
            input.val('');
            input.removeClass('placeholder');
          }
        }).blur(function() {
          var input = jQuery(this);
          if (input.val() === '') {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
          }
        }).blur();
      }



      // ----------------------------------------------------------------
      // Bootstrap animated progressbar width
      // ----------------------------------------------------------------
      var progressBarsAnimated = context.find('[data-toggle="progress-bar-animated-progress"]');
      if (progressBarsAnimated.length > 0) {
        var initProgressBarsAnimated = function() {
          progressBarsAnimated.each(function() {
            var $progress = jQuery(this);
            $progress.waypoint(function() {
              $progress.css("width",
                function() {
                  return $(this).attr("aria-valuenow") + "%";
                }
              ).addClass('progress-bar-animated-progress');
              this.destroy();
            }, {
              offset: '98%'
            });
          });
        };

        $document.includeWaypoints(function() {
          progressBarsAnimated.css("width", 0);
          $document.isPageLoaderDone(initProgressBarsAnimated);
        });
      }

      // ----------------------------------------------------------------
      // Bootstrap collapse
      // ----------------------------------------------------------------
      var collapses = context.find('[data-toggle="collapse"]');
      collapses.each(function() {
        var $this = $(this);
        var target = $this.attr('href') || $this.data('target');
        var parent = $this.data('parent') || null;
        if ($(target).length > 0) {
          if ($(target).hasClass('show')) {
            $this.addClass('show');
          }
        }

        $this.on({
          'click': function() {
            $this.toggleClass('show', !$(target).hasClass('show'));
            $(window).trigger('resize');

            var $checks = $this.find('input[type="checkbox"]');
            if ($checks.length > 0) {
              $checks.prop('checked', !$(target).hasClass('show'));
            }
          }
        });
      });

      var radioCollapses = context.find('[data-toggle="radio-collapse"]');
      radioCollapses.each(function(index, item) {
        var $item = $(item);
        var $target = $($item.data('target'));
        var $parent = $($item.data('parent'));
        var $radio = $item.find('input[type=radio]');
        var $radioOthers = $parent.find('input[type=radio]').not($radio);

        $radio.on('change', function() {
          if ($radio.is(':checked')) {
            $target.collapse('show');
          } else {
            $target.collapse('hide');
          }
        });

        $radio.on('click', function() {
          $radioOthers.prop('checked', false).trigger('change');
        });
      });

      // ----------------------------------------------------------------
      // Bootstrap modals onload & duration
      // @see: http://v4-alpha.getbootstrap.com/components/modal/
      // ----------------------------------------------------------------
      var modalsDuration = context.find('[data-modal-duration]');
      if (modalsDuration.length > 0) {
        var $modal = modalsDuration,
          duration = $modal.data('modal-duration'),
          progressBar = $('<div class="modal-progress"></div>');

        $modal.find('.modal-content').append(progressBar);

        // Actual durations
        $modal.on('show.bs.modal', function(e) {
          var i = 2;
          var durationProgress = setInterval(function() {
            progressBar.width(i++ + '%');
          }, duration / 100);

          setTimeout(function() {
            $modal.modal('hide');
            clearInterval(durationProgress);
          }, duration);
        });
      }

      var modalsOnload = context.find('[data-toggle="modal-onload"]');
      if (modalsOnload.length > 0) {
        modalsOnload.each(function() {
          var $modal = $(this),
            delay = $modal.data('modal-delay') || null;

          // Delay modal opening
          if (delay !== null) {
            setTimeout(function() {
              $modal.modal();
            }, delay);
          } else {
            // No delay trigger direct
            $modal.modal();
          }
        });
      }

      // ----------------------------------------------------------------
      // Bootstrap tooltip
      // @see: http://getbootstrap.com/javascript/#tooltips
      // ----------------------------------------------------------------
      // invoke by adding data-toggle="tooltip" to a tags (this makes it validate)
      if ($document.tooltip) {
        context.find('[data-toggle="tooltip"]').tooltip();
      }

      // ----------------------------------------------------------------  
      // Bootstrap popover
      // @see: http://getbootstrap.com/javascript/#popovers
      // ----------------------------------------------------------------
      // invoke by adding data-toggle="popover" to a tags (this makes it validate)
      if ($document.popover) {
        context.find('[data-toggle="popover"]').popover();
      }



      // ----------------------------------------------------------------
      // allow any page element to set page class
      // ----------------------------------------------------------------
      context.find('[data-page-class]').each(function() {
        context.find('html').addClass(jQuery(this).data('page-class'));
      });

      // ----------------------------------------------------------------
      // Detect Bootstrap fixed header
      // @see: http://getbootstrap.com/components/#navbar-fixed-top
      // ----------------------------------------------------------------
      if (context.find('.navbar-fixed-top').size() > 0) {
        context.find('html').addClass('has-navbar-fixed-top');
      }

      // ----------------------------------------------------------------
      // simple show toggles
      // ----------------------------------------------------------------  
      context.find('[data-toggle="show"]').each(function() {
        var $this = $(this);
        var target = $this.data('target');
        var $target = $(target);
        if ($target.length === 0) {
          return;
        }

        $this.click(function() {
          $target.toggleClass('show');
          return false;
        });
      });

      // ----------------------------------------------------------------
      // show hide for hidden header
      // ----------------------------------------------------------------
      context.find('[data-toggle=show-hide]').each(function() {
        var $this = jQuery(this);
        var target = $this.attr('data-target');
        var $target = $(target);
        var state = 'show'; //open or hide
        var targetState = $this.attr('data-target-state');
        var callback = $this.attr('data-callback');

        if ($target.length === 0) {
          return;
        }

        if (state === 'show') {
          // Close by default
          $target.addClass('collapse');
        }

        $this.click(function() {
          //allows trigger link to say target is open & should be closed
          if (typeof targetState !== 'undefined' && targetState !== false) {
            state = targetState;
          }
          if (state === undefined) {
            state = 'show';
          }
          if (!$target.hasClass('show')) {
            // About to open
            $this.addClass('show');
          } else {
            $this.removeClass('show');
          }

          $target.collapse('toggle');

          if (callback && typeof(callback) === "function") {
            callback();
          }
        });
      });
    },

    // ===============================================================
    // @group: Internal worker functions
    // ===============================================================    
    // ----------------------------------------------------------------
    // Trigger callback when fakeLoader is loaded
    // ----------------------------------------------------------------
    isPageLoaderDone: function(callback) {
      var $loader = jQuery('[data-toggle="page-loader"]'),
        triggerCallback = function() {
          if (callback && typeof(callback) === "function") {
            callback();
          }
        };

      if ($loader.length === 0) {
        triggerCallback();
      }

      var isPageLoaderDoneTimer = setInterval(function() {
        if ($loader.css('display') == 'none') {
          pageLoaderDone = true;
          clearInterval(isPageLoaderDoneTimer);
          triggerCallback();
        }
      }, 500);
    },

    // ----------------------------------------------------------------
    // Plugin: Waypoints
    // @see: http://imakewebthings.com/waypoints/
    // Used as helper for other functions so not called direct
    // ----------------------------------------------------------------
    includeWaypoints: function(callback) {
      if (typeof jQuery.fn.waypoints === 'undefined') {
        $document.themeLoadPlugin(['https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js'], [], callback);
      } else {
        if (callback && typeof(callback) === "function") {
          callback();
        }
      }
    },

    // ----------------------------------------------------------------
    // Scroll links
    // ----------------------------------------------------------------
    themeScrollMenus: function() {
      var context = $(this);
      var scrollLinks = context.find('[data-toggle="scroll-link"]');
      var $header = $('#header');
      var $body = $('body');
      var $spys = $('[data-spy="scroll"]');

      if (scrollLinks.length > 0) {
        var getHeaderOffset = function() {
          var offset = $header.outerHeight();

          if ($body.hasClass('header-compact-sticky')) {
            offset -= 35;
          }
          return offset;
        };

        var triggerSpy = function(state) {
          if (state == 'refresh') {
            var spyData = $body.data('bs.scrollspy');
            spyData._config.offset = getHeaderOffset();
            $body.data('bs.scrollspy', spyData);
            $body.scrollspy('refresh');
          } else {
            $body.scrollspy({
              target: '.navbar-main',
              offset: getHeaderOffset(),
            });
          }
        };

        triggerSpy('init');

        $(window).on('resize', function() {
          setTimeout(function() {
            triggerSpy('refresh');
          }, 200);
        });

        scrollLinks.click(function() {
          if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var $this = $(this),
              target = $(this.hash),
              offset = 2;

            var clickScroll = function() {
              target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
              if (target.length) {
                $('html, body').animate({
                  scrollTop: target.offset().top - getHeaderOffset() + offset,
                }, 1000);
              }
            };

            // If header changes size
            $(window).trigger('resize');
            clickScroll();
            return false;
          }
        });
      }
    },

    //submenu dropdowns
    // --------------------------------
    themeSubMenus: function() {
      var context = $(this);
      var $tabsPills = $('.dropdown-menu [data-toggle="tab"], .dropdown-menu [data-toggle="pill"]');

      $tabsPills.on('click', function(e) {
        event.preventDefault();
        event.stopPropagation();
        $(this).tab('show');
      });
      $tabsPills.on('shown.bs.tab', function(e) {
        var $from = $(e.relatedTarget);
        var $to = $(e.target);
        var toSelectors = $to.getSelector();
        var fromSelectors = $from.getSelector();
        var $toSelectors = $(toSelectors);
        var $fromSelectors = $(fromSelectors);

        $toSelectors.addClass('active');
        $fromSelectors.removeClass('active');
        $(document).find('[data-target="' + toSelectors + '"]').addClass('active');
        $(document).find('[data-target="' + fromSelectors + '"]').removeClass('active');
      });

      context.find('.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        // Toggle direct parent
        $(this).parent().toggleClass('show');
      });

      // Persistent menus
      context.find('.dropdown.dropdown-persist').on({
        "shown.bs.dropdown": function() {
          $(this).data('closable', false);
        },
        "hide.bs.dropdown": function(event) {
          temp = $(this).data('closable');
          $(this).data('closable', true);
          return temp;
        }
      });
      context.find('.dropdown.dropdown-persist .dropdown-menu').on({
        "click": function(event) {
          $(this).parent('.dropdown.dropdown-persist').data('closable', false);
        },
      });
    },

    // Gets selector from href or data-target
    getSelector: function() {
      var element = $(this);
      var selector = element.data('target');
      if (!selector || selector === '#') {
        selector = element.attr('href') || '';
      }

      try {
        var $selector = $(selector);
        return $selector.length > 0 ? selector : null;
      } catch (error) {
        return null;
      }
    },

    // Detected IE & adds body class
    isIE: function() {
      if (document.documentMode || /Edge/.test(navigator.userAgent)) {
        return true;
      }
    },

    // Determines plugin location
    // --------------------------------
    getScriptLocation: function() {
      var location = $('body').data('plugins-localpath') || null;
      if (location) {
        return location;
      }
      return PLUGINS_LOCALPATH;
    },

    // Load plugin
    // --------------------------------
    themeLoadPlugin: function(js, css, callback, placement) {
      var themeLoadPluginPath = function(url) {
        if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
          return url;
        }
        var location = $document.getScriptLocation();
        return location + url;
      };

      $.ajaxPrefilter("script", function(s) {
        s.crossDomain = true;
      });
      if (js.length > 0) {
        var progress = 0;
        var internalCallback = function(url) {
          // Complete
          if (++progress === js.length) {
            $.each(css, function(index, value) {
              if (loadedFiles[value] === value) {
                // Already loaded
                return true;
              }

              // Record file loaded
              loadedFiles[value] = value;
              $('head').prepend('<link href="' + themeLoadPluginPath(value) + '" rel="stylesheet" type="text/css" />');
            });

            if (callback && typeof(callback) === "function") {
              callback();
            }
          }
        };

        $.each(js, function(index, value) {
          if (loadedFiles[value] === value) {
            // Already loaded
            internalCallback();
            return true;
          }

          // Record file loaded
          loadedFiles[value] = value;
          if (placement === undefined) {
            var options = {
              url: themeLoadPluginPath(value),
              dataType: "script",
              success: internalCallback,
              cache: true
            };
            $.ajax(options);
          } else if (placement === 'append') {
            $('script[src*="bootstrap.min.js"]').after('<script src="' + themeLoadPluginPath(value) + '"></script>');
            internalCallback();
          } else if (placement === 'prepend') {
            $('script[src*="bootstrap.min.js"]').before('<script src="' + themeLoadPluginPath(value) + '"></script>');
            internalCallback();
          } else if (placement === 'head') {
            $('head').append('<script src="' + themeLoadPluginPath(value) + '"></script>');
            internalCallback();
          }
        });
      } else if (css.length > 0) {
        // Just CSS
        $.each(css, function(index, value) {
          if (loadedFiles[value] === value) {
            // Already loaded
            return true;
          }

          // Record file loaded
          loadedFiles[value] = value;
          $('head').prepend('<link href="' + themeLoadPluginPath(value) + '" rel="stylesheet" type="text/css" />');
        });

        if (callback && typeof(callback) === "function") {
          callback();
        }
      }
    }
  });
})(jQuery);


$(document).ready(function() {
  "use strict";
  
  // Init theme functions
  $(document).themeInit();
});