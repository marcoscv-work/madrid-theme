AUI().ready(
	'anim',
	'event-mouseenter',
	'event-outside',
	'liferay-navigation-interaction',
	'liferay-sign-in-modal',
	'transition',
	function(A) {
		var Lang = A.Lang;

		var BODY = A.getBody();

		var WIN = A.getWin();

		var navigation = A.one('#navigation');

		if (navigation) {
			navigation.plug(Liferay.NavigationInteraction);
		}

		var signIn = A.one('a#sign-in');

		if (signIn && signIn.getData('redirect') !== 'true') {
			signIn.plug(Liferay.SignInModal);
		}

		var hamburguerNode = A.one('.hamburger-icon');

		if (hamburguerNode) {
			hamburguerNode.on(
				'click',
				function() {
					var icon = hamburguerNode.one('.icon-align-justify');
					icon.toggleClass('icon-chevron-left');
					BODY.toggleClass('opened');
					hamburguerNode.toggleClass('open');
				}
			);
		};

		// Dockbar bubbles, if dockbar is present

		var portletDockbar = A.one('.portlet-dockbar');

		if (portletDockbar) {
			var toggleDockbar = A.one('a.user-avatar-link');
			var toggleDockbarLeave = A.one('.portlet-dockbar .dockbar');

			if (toggleDockbar) {
				toggleDockbar.on(
					'mouseenter',
					function() {
						BODY.removeClass('over');

						closingDockbar = toggleDockbarLeave.once(
							'clickoutside',
							function() {
								BODY.addClass('over');
							}
						);
					}
				);
			}
		}

		// Detecting mouse scroll direction

		var mousewheelDir = function(e) {
			var dir = e.wheelDelta > 0 ? 'scroll-up' : 'scroll-down';
			var ScrollPos = (WIN.get('docScrollY'));

			if (ScrollPos > 100) {
			    if (e.wheelDelta > 3) {
				    if (BODY.hasClass("scroll-down")) {
				    	BODY.removeClass("scroll-down");
				  		BODY.removeClass("scroll-down-heavy");
				    };
				    BODY.addClass("scroll-up-heavy");
				} else if (e.wheelDelta > 0) {
				    if (BODY.hasClass("scroll-down")) {
				    	BODY.removeClass("scroll-down");
				  		BODY.removeClass("scroll-down-heavy");
				    };
				    BODY.addClass("scroll-up");
				} else if (e.wheelDelta < -3) {
				    if (BODY.hasClass("scroll-up")) {
				    	BODY.removeClass("scroll-up");
				  		BODY.removeClass("scroll-up-heavy");
				    };
				    BODY.addClass("scroll-down-heavy");
				} else {
				    if (BODY.hasClass("scroll-up")) {
				    	BODY.removeClass("scroll-up");
				  		BODY.removeClass("scroll-up-heavy");
				    };
				    BODY.addClass("scroll-down");
				}
			};
		}

       //Blocks with fullHeightNodes

        var fullHeightNodes = A.all('.fullHeight');

        var fullHeightNodesCalc = function() {
            var winHeight = WIN.get('innerHeight');
            var marginTop = BODY.getStyle('margin-top');
            if (Lang.isUndefined(winHeight)) {
                winHeight = document.documentElement.clientHeight;
            }

            fullHeightNodes.each(
                function(node) {
                	node.setStyle('minHeight', (winHeight - Lang.toInt(marginTop)));
                    node.addClass('done');
                }
            );
        }

		//Blocks with fullCenter over previus block or over full windows height

		var fullCenter = A.all('.fullCenter');

        var fullCenterCalc = function() {
            fullCenter.each(
            	function(node) {
            		var parent = node.ancestor('div');

            		if (node.hasClass('fullWinCenter')) {
    			        var winHeight = WIN.get('innerHeight');
						if (Lang.isUndefined(winHeight)) {
							winHeight = document.documentElement.clientHeight;
						}

						var parentHeight = winHeight;
            		}
                    else {
						var parentHeight = parent.height();
            		}

                    var parentWidth = parent.width();
                    var nodeHeight = node.height();
                    var nodeWidth = node.width();

                    node.setStyle('top', (parentHeight/2)-(nodeHeight/2)+'px');
                    node.setStyle('left', (parentWidth/2)-(nodeWidth/2)+'px');
        		}
        	);
        }

        if (!fullHeightNodes.isEmpty()) {
            A.on('windowresize', fullHeightNodesCalc);
            A.on('windowresize', fullCenterCalc);
            fullHeightNodesCalc();
            fullCenterCalc();
        }

		// Creating portlets node list no navegate

		creationIndex = true;

		portletsIndex = A.one('.portletsIndex ul');

		// Node portlets on screen selector, to decide if create lateral index navigation
		var allPortletsNodes = A.all('#column-1>div>.portlet-boundary');
		var allPortletsNodesSize = allPortletsNodes.size();

		// Theme setting add class to show styles
		var lateralPortletsIndexPresent = A.one('.lateral-portlets-index');

		//console.log('PORTLETS on screen: '+allPortletsNodesSize);

		// Create lateral portlets index

		var fullSizeNodesCalc = function () {
			var winHeight = WIN.get('innerHeight');
			var marginTop = BODY.getStyle('margin-top');
			if (Lang.isUndefined(winHeight)) {
				winHeight = document.documentElement.clientHeight;
			}

			allPortletsNodes.each(
				function(node,i) {
					var thisNode = node;
					node.setStyle('minHeight', (winHeight - Lang.toInt(marginTop)));

					var gettitle = thisNode.one('.portlet-title-text');

					if (!gettitle) {
						var gettitle = thisNode.one('.portlet-title-default');

						if (gettitle) {
							var title = gettitle.text();
						} else {
							var title = "Title hide";
						};

					} else {
						var title = gettitle.text();
					};

					if (creationIndex) {
						var nodeWidth = (100 / allPortletsNodesSize);
						node.prepend('<span id="portletIndexID'+i+'"></span>');
						portletsIndex.append('<li style="width:'+nodeWidth+'%"><a href="#portletIndexID'+i+'" class="scroll-animate portletIndex'+i+'">'+title+'</a></li>');
					};
				}
			);
		}

 		// Find POV to mark portletIndex

		var findPOV = function () {
			var ScrollPos = (WIN.get('docScrollY'));
			allPortletsNodes.each(
				function(node,i) {
					var nodeHeight = (node.height());
					var marginTop = BODY.getStyle('margin-top');
					var marginTopInt = (Lang.toInt(marginTop)+20);
					var nodePosition = (node.getY());

					if (ScrollPos > (nodePosition-marginTopInt) && ScrollPos < (nodePosition+nodeHeight)) {
						var numberSlideToGet = "portletIndex"+i;
						A.all('.portletsIndex li').removeClass('aactive');
						A.one('.portletsIndex .'+numberSlideToGet+'').ancestor().addClass('aactive');
					}
				}
			);
		}

		// Functions called on resize and scroll

		if (allPortletsNodesSize >= 2 && lateralPortletsIndexPresent) {
			BODY.addClass('lateral-portlets-index-ready');
			A.on('windowresize', fullSizeNodesCalc);
			fullSizeNodesCalc();
			creationIndex = false;

			A.on('scroll', findPOV);
            findPOV();
		}



		// remove loading animation
        BODY.addClass('loaded');

		// Scroll animate to hash

		A.all('.scroll-animate').on(
			'click',
			function(animScroll) {
				var instance = this;
				var marginTop = BODY.getStyle('margin-top');

				var node = animScroll.currentTarget;
				var section = A.one(node.get('hash'));

				if (section) {
					var scrollTo = (Lang.toInt(section.getY()) - Lang.toInt(marginTop));
					animScroll.preventDefault();

					new A.Anim(
						{
							duration: 0.3,
							easing: 'easeBoth',
							node: 'win',
							to: {
								scroll: [0, scrollTo]
							}
						}
					).run();
				}
			}
		);

		var magicMouseScrollPresent = A.one('.magic-mouse-scroll');

		if (magicMouseScrollPresent) {
			A.on('mousewheel', mousewheelDir);
		};
	}
);
