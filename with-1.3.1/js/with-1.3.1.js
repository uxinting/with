(function ( $ ) {
    
	var methods = {
		settings: {
			exampleSelector: '[data-example="true"]',
			boolSelector: '[data-with^="bool"]',
			key: /^[a-zA-Z]+$/,
			reTernary: /^(.+)\?\((.*)\)\((.*)\)$/,
            scriptSplitReg: /[<>(>=)(!=)(<=)(==)+-/*%]/,
		},
		
		sys: {},
        
        config: {
            remote: false,
            type: 'get',
            params: {},
            before: function( rs, st ){ return true; }
        },
		
		map: {
			text: function ( arg ) {
				this.text( methods.unaryParam( arg ) );
				this.children().fill( methods.data );
			},
			
			val: function ( arg ) {
				this.val( methods.unaryParam( arg ) );
				this.children().fill( methods.data );
			},
			
			attr: function ( arg ) {
				var params = methods.dualParams( arg );
				
				this.attr( params.key, params.value );
				this.children().fill( methods.data );
			},
            
            data: function( arg ) {
                var params = methods.dualParams( arg );
                
                this.data( params.key, params.value );
                this.children().fill( methods.data );
            },
			
			list: function ( arg ) {
				//find example, if failed, return
				var example = this.children( methods.settings.exampleSelector );
				if (  example.length == 0 ) return;
				
				var items = methods.unaryParam( arg );
				for ( var item = 0; item < items.length; item++ ) {
                    if ( typeof items[item] === 'undefined' ) continue; //IE
					//new instance of example and fill it
					var inst = example.clone().removeAttr('data-example');
					inst.fill( items[item], {data: {"loop": item}} );
					
					this.append( inst );
				}
			},
			
			fill: function ( arg ) {
				this.children().fill( methods.unaryParam( arg ) );
			},
			
			bool: function ( arg ) {
				this.data( 'with', methods.ternaryParams( arg ) );
				this.fill( methods.data );
                this.children().fill( methods.data );
			},
			
			show: function ( arg ) {
				this.show();
			},
			
			hide: function ( arg ) {
				this.hide();
			},
			
			remove: function ( arg ) {
				this.remove();
			},
			
			href: function ( arg ) {
				this.attr( 'href', methods.unaryParam( arg ) );
				this.children().fill( methods.data );
			},
			
			src: function ( arg ) {
				this.attr( 'src', methods.unaryParam( arg ) );
				this.children().fill( methods.data );
			}
		},
		
		fill: function ( that, data ) {
			//fill self
			methods.data = data;
			
			var params = $( that ).data( 'with' );
			
			if ( typeof params === 'undefined' ) {
				$( that ).children().fill( data );
				return $( that );
			} else {
				params = params.split( ';' );
			}
			
			for ( var item = 0; item < params.length; item++ ) {
				var method = methods.getMethod( params[item] );
				var arg = methods.getArgument( params[item] );
				
				if ( method == '' ) break;
				methods.map[method].call( $( that ), arg );
			}
			
			return $(that);
		},
		
		getMethod: function ( param ) {
			return param.split( ':' )[0].trim();
		},
		
		getArgument: function ( param ) {
			return param.split( ':' ).slice( 1 ).join(':').trim();
		},
		
		unaryParam: function ( arg ) {
			if ( arg == '' ) return methods.data;
			var data = $.extend( methods.data, methods.sys );
			
			//handle key
            var keys = arg.split( methods.settings.scriptSplitReg ).filter( function(val) {
                return methods.settings.key.test( val );
            } ).unique();

			for ( var i = 0; i < keys.length; i++ ) {
				arg = arg.replace( keys[i], 'data.'+keys[i] )
			}
			
			return eval( 'try{' + arg + '}catch(e){""}' );
		},
		
		dualParams: function ( arg ) {
			var key = arg.split(',')[0].trim();
			var val = arg.split(',').slice(1).join('').trim();
			return { "key": key, "value": methods.unaryParam( val, methods.data ) };
		},
		
		ternaryParams: function ( arg ) {
			var rs = methods.settings.reTernary.exec( arg ).slice( 1 );
			
			var _if = methods.unaryParam( rs[0].trim() );
			if ( typeof _if === 'undefined' || !_if ) {
				return rs[2].trim();
			} else {
				return rs[1].trim();
			}
		}
	};
    
    //Hide all data-example="true"
//    $( methods.settings.exampleSelector ).hide();
    
    if ( typeof Array.prototype.unique === 'undefined' )
    Array.prototype.unique = function() {
        var n = {},r=[];
        for(var i = 0; i < this.length; i++)
        {
            if (!n[this[i]])
            {
                n[this[i]] = true;
                r.push(this[i]);
            }
        }
        return r;
    };
    
    //Add trim function for string object
    if ( typeof Array.prototype.trim === 'undefined' )
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g,"");
    };
    
    //Add filter function from Array object
    if ( typeof Array.prototype.filter === 'undefined' )
    Array.prototype.filter = function(fun /*, thisArg */){
        "use strict";
        if (this === void 0 || this === null)
            throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++){
            if (i in t){
                var val = t[i];
                if (fun.call(thisArg, val, i, t))
                res.push(val);
            }
        }
        return res;
    };
	
	$.fn.fill = function ( data, sys ) {
        if ( typeof sys != 'undefined' ) {
            $.extend( methods.sys, sys.data );
            $.extend( methods.config, sys.config );
        }
        
        return this.each( function() {
            return methods.fill( this, data );
        });
	};
	
})( jQuery );