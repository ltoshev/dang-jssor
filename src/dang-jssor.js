angular.module("dang-jssor", []).factory("jssorServices", function () {
	    return {
	        random: function (minimum, maximum) {
	            return Math.floor((Math.random() * (maximum + 1 - minimum) + minimum));
	        }
	    };
}).directive('onFinishRender', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            if (scope.$last) {
                scope.$evalAsync(attrs.onFinishRender);
            }
        }
    };
}).directive("enableJssor", function () {
	    return {
	        restrict: "A",
	        scope: {
	            jssorOptions: "=",
	            jssorOnChanged: "&",
	            jssorObject: "=",
	            jssorTrigger: "="
	        },
	        link: function (scope, element, attrs) {
	            scope.$watch('jssorTrigger', function () {	                
	                return scope.handleReady();
	            });
	            angular.element(window).bind('orientationchange', function () {
	                if (scope.jssorObject) {
	                    scope.jssorObject.updateSliderWidth();
	                }
	            });
	            angular.element(window).bind('resize', function () {
	                if (scope.jssorObject) {
	                    scope.jssorObject.updateSliderWidth();
	                }
	            });
	            scope.handleReady = function () {
	                if (scope.jssorTrigger) {
	                    setTimeout(function () {
	                        return scope.init();
	                    });
	                }
	            };
	            scope.init = function () {
	                var container = element.closest('.slides-container');
	                if (!container.attr("id")) {
	                    scope.id = new Date().getTime().toString();
	                    container.attr("id", scope.id);
	                }
	                var slider = new $JssorSlider$(scope.id, scope.jssorOptions);
	                var handle = {
	                    slidesCount: slider.$SlidesCount(),
	                    slider: slider,
	                    playTo: function (index) {
	                        slider.$PlayTo(index);
	                    },
	                    goTo: function (index) {
	                        slider.$GoTo(index);
	                    },
	                    pause: function () {
	                        slider.$Pause();
	                    },
	                    play: function () {
	                        slider.$Play();
	                    },
	                    previous: function () {
	                        slider.$Prev();
	                    },
	                    next: function () {
	                        slider.$Next();
	                    },
	                    setTransition: function (transition) {
	                        slider.$SetSlideshowTransitions([transition]);
	                    },
	                    updateSliderWidth: function () {
	                        var parent = angular.element(slider.$Elmt).parent();
	                        if (parent && parent.width() > 0) {
	                            slider.$ScaleWidth(parent.width());
	                        }
	                        else {
	                            setTimeout(function () { return scope.jssorObject.updateSliderWidth(); }, 50);
	                        }
	                    }
	                };
	                scope.jssorObject = handle;
	                slider.$On($JssorSlider$.$EVT_PARK, function (slideIndex, fromIndex) {
	                    var status = {
	                        id: scope.id,
	                        slideIndex: slideIndex,
	                        fromIndex: fromIndex
	                    };
	                    if (scope.jssorOnChanged)
	                        scope.jssorOnChanged({ jssorData: status });
	                });
	                handle.playTo(scope.jssorOptions.$StartIndex);
	                if (scope.jssorOptions.onReady) {
	                    scope.jssorOptions.onReady();
	                };
	            }
	        }
	    };
    });