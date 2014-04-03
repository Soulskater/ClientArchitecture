(function ($) {
    "use strict";

    //Constants
    var LEFT = "left",
		RIGHT = "right",
		UP = "up",
		DOWN = "down",

		NONE = "none",
		AUTO = "auto",

        HORIZONTAL = "horizontal",
		VERTICAL = "vertical",
		SUPPORTS_TOUCH = 'ontouchstart' in window,

		PLUGIN_NS = 'IScroll';



    /**
	* The default configuration, and available options to configure touch swipe with.
	* You can set the default values by updating any of the properties prior to instantiation.
	* @name $.fn.iscroll.defaults
	* @namespace

	*/
    var defaults = {
        pageScroll: NONE
    };



    /**
	* Applies Touch behaviour to one or more jQuery objects.
	* The Touch plugin can be instantiated via this method, or methods within 
	* Touch can be executed via this method as per jQuery plugin architecture.
	* @see Touch
	* @class
	* @param {Mixed} method If the current DOMNode is a Touch object, and <code>method</code> is a Touch method, then
	* the <code>method</code> is executed, and any following arguments are passed to the Touch method.
	* If <code>method</code> is an object, then the Touch class is instantiated on the current DOMNode, passing the 
	* configuration properties defined in the object. See Touch
	*/
    $.fn.iscroll = function (method) {
        var $this = $(this),
			plugin = $this.data(PLUGIN_NS);

        //Check if we are already instantiated and trying to execute a method	
        if (plugin && typeof method === 'string') {
            if (plugin[method]) {
                return plugin[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.swipe');
            }
        }
            //Else not instantiated and trying to pass init object (or nothing)
        else if (!plugin && (typeof method === 'object' || !method)) {
            return init.apply(this, arguments);
        }

        return $this;
    };

    //Expose our defaults so a user could override the plugin defaults
    $.fn.iscroll.defaults = defaults;

    /**
	* The page scroll constants that can be used to set the value of <code>allowPageScroll</code> option
	* These properties are read only
	* @namespace
	* @readonly
	* @see $.fn.swipe.defaults#allowPageScroll
	* @property {string} NONE Constant indicating no page scrolling is allowed. Value is <code>"none"</code>.
	* @property {string} HORIZONTAL Constant indicating horizontal page scrolling is allowed. Value is <code>"horizontal"</code>.
	* @property {string} VERTICAL Constant indicating vertical page scrolling is allowed. Value is <code>"vertical"</code>.
	* @property {string} AUTO Constant indicating either horizontal or vertical will be allowed, depending on the swipe handlers registered. Value is <code>"auto"</code>.
	*/
    $.fn.iscroll.pageScroll = {
        NONE: NONE,
        HORIZONTAL: HORIZONTAL,
        VERTICAL: VERTICAL,
        AUTO: AUTO
    };

    /**
	* Initialise the plugin for each DOM element matched
	* This creates a new instance of the main TouchSwipe class for each DOM element, and then
	* saves a reference to that instance in the elements data property.
	* @internal
	*/
    function init(options) {
        //Prep and extend the options
        if (options && (options.pageScroll === undefined)) {
            options.pageScroll = NONE;
        }

        if (!options) {
            options = {};
        }

        //pass empty object so we dont modify the defaults
        options = $.extend({}, $.fn.iscroll.defaults, options);

        //For each element instantiate the plugin
        return this.each(function () {
            var $this = $(this);

            //Check we havent already initialised the plugin
            var plugin = $this.data(PLUGIN_NS);

            if (!plugin) {
                plugin = new IScroll(this, options);
                $this.data(PLUGIN_NS, plugin);
                plugin.init();
            }
        });
    }

    function IScroll(element, options) {
        var style = {
            '-webkit-overflow-scrolling': 'touch'
        }

        switch (options.pageScroll) {
            case HORIZONTAL:
                style['overflow-x'] = 'auto';
                style['overflow-y'] = 'hidden';
                break;

            case VERTICAL:
                style['overflow-x'] = 'hidden';
                style['overflow-y'] = 'auto';
                break;

            case AUTO:
                style['overflow'] = 'auto';
                break;
        }

        /**
            * Calculate the angle of the swipe
            * @param {point} startPoint A point object containing x and y co-ordinates
            * @param {point} endPoint A point object containing x and y co-ordinates
            * @return int
            * @inner
            */
        function calculateAngle(startPoint, endPoint) {
            var x = startPoint.x - endPoint.x;
            var y = endPoint.y - startPoint.y;
            var r = Math.atan2(y, x); //radians
            var angle = Math.round(r * 180 / Math.PI); //degrees

            //ensure value is positive
            if (angle < 0) {
                angle = 360 - Math.abs(angle);
            }

            return angle;
        }

        /**
        * Calculate the direction of the swipe
        * This will also call calculateAngle to get the latest angle of swipe
        * @param {point} startPoint A point object containing x and y co-ordinates
        * @param {point} endPoint A point object containing x and y co-ordinates
        * @return string Either {@link $.fn.swipe.directions.LEFT} / {@link $.fn.swipe.directions.RIGHT} / {@link $.fn.swipe.directions.DOWN} / {@link $.fn.swipe.directions.UP}
        * @see $.fn.swipe.directions
        * @inner
        */
        function calculateDirection(startPoint, endPoint) {
            var angle = calculateAngle(startPoint, endPoint);

            if ((angle <= 45) && (angle >= 0)) {
                return HORIZONTAL;
            } else if ((angle <= 360) && (angle >= 315)) {
                return HORIZONTAL;
            } else if ((angle >= 135) && (angle <= 225)) {
                return HORIZONTAL;
            } else if ((angle > 45) && (angle < 135)) {
                return VERTICAL;
            } else {
                return VERTICAL;
            }
        }

        this.init = function () {

            var $this = $(element);
            var start = {};
            $(window).scroll(function(e) {
                addConsole(e.target.id);
            });

            $this.css(style)
                .on("touchstart", function (jqEvent) {
                    var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
                    var evt = event.touches[0];

                    start.x = evt.pageX || evt.clientX;
                    start.y = evt.pageY || evt.clientY;

                    if (jqEvent.target == element && options.pageScroll == NONE) {
                        jqEvent.preventDefault();
                        return false;
                    }

                })
                .on("touchmove", function (jqEvent) {
                    var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
                    var evt = event.touches[0];

                    var end = {};
                    end.x = evt.pageX || evt.clientX;
                    end.y = evt.pageY || evt.clientY;
                    var direction = calculateDirection(start, end);
                    var overridedScroll = $(event.target).attr("data-scroll") || $(event.target).closest("[data-scroll]").attr("data-scroll");
                    
                    switch (options.pageScroll) {
                        case NONE:
                            if (direction == HORIZONTAL && overridedScroll != HORIZONTAL) {
                                jqEvent.preventDefault();
                            }
                            if (direction == VERTICAL && overridedScroll != VERTICAL) {
                                jqEvent.preventDefault();
                            }
                            event.stopPropagation();
                            break;
                        case HORIZONTAL:
                            if (direction == VERTICAL && overridedScroll != VERTICAL) {
                                jqEvent.preventDefault();
                            }
                            jqEvent.stopPropagation();
                            break;
                        case VERTICAL:
                            if (direction == HORIZONTAL && overridedScroll != HORIZONTAL) {
                                jqEvent.preventDefault();
                            }
                            jqEvent.stopPropagation();
                            break;
                        default:
                    }
                })
        }
    }
}(jQuery));
