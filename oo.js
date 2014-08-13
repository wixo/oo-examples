$( function () {
	var binds = {}
	  // fn declarations
		, observer
	  ;

	observer = function ( ele, obj, key ) {
		var $elem = ele.jquery === undefined ? $(ele) : ele
		  , type
		  ;

		type = $elem.is('select, option, input, textarea') ? 'val' : 'html'
		$elem[ type ]( obj[0].object[key] );
		$().trigger('bindings.'+key);
	};

	binds.firstName = 'Juan';
	binds.lastName  = 'La Jara';
	binds.age       = 12;
	binds.email     = 'juan@mail.com';
	binds.house     = 'Lannister';

	$('[data-ng-model]').each( function () {
		var $this  = $(this)
		  , key    = $this.attr('data-ng-model')
		  , hasVal = $this.is('select,options,input,textarea')
		  , keyup  = $this.is('input,textarea')
		  ;

		$this[hasVal?'val':'html'](binds[key]);

		$this.on( 'keyup.bindings change.bindings', function () {
			binds[key] = hasVal ? $this.val() : $this.html();
			$().trigger('bindings.'+key);
		} );

		Object.observe( binds, function ( obj ) {
			observer( $this, obj, key );
		} );

	} );

	window.binds = binds;
} );
