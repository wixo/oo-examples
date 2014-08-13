$( function () {
	var binds = {}
	  , chart
	  , chartsRef = {}
	  , chartsOptions
	  , fb
	  // fn declarations
		, observer
	  , onChartBinds
	  ;

	fb = new Firebase("https://firebat.firebaseio.com/limajs/chart");

	fb.on('value', function ( data ) {
		binds.opt1 = data.val() && data.val().opt1 && data.val().opt1.score || 0;
		binds.opt2 = data.val() && data.val().opt2 && data.val().opt2.score || 0;
		binds.opt3 = data.val() && data.val().opt3 && data.val().opt3.score || 0;
		binds.total= binds.opt1 + binds.opt2 + binds.opt3;
	});

	observer = function ( ele, obj, key ) {
		var $elem = ele.jquery === undefined ? $(ele) : ele
		  , type
		  ;

		type = $elem.is('select, option, input, textarea') ? 'val' : 'html'
		$elem[ type ]( obj[0].object[key] );
		$().trigger('bindings.'+key);

		!!key.match('opt') && ( onChartBinds() );
	};

	onChartBinds = function () {
		chartsOptions.series[0].data =
		[ {x:'windows', y:binds.opt1 / binds.total || 0}
		, {x:'osx', y:binds.opt2 / binds.total || 0}
		, {x:'linux', y:binds.opt3 / binds.total || 0}
		];
		chart = new Highcharts.Chart(chartsOptions);
	}

	$('button.js-btn-vote').on('click', function () {
		var $this  = $(this)
		// The weirdest trick to get class index
		  , idx    = parseInt( $this.attr('class').split('').reverse('').join(''), 10 )
		  , optIdx = 'opt' + idx
		  ;

		chartsRef[ optIdx ] = fb.child( optIdx );
		chartsRef[ optIdx ].set( { score: binds[ optIdx ] + 1 } );
	} );

	binds.firstName = 'Juan';
	binds.lastName  = 'La Jara';
	binds.age       = 12;
	binds.email     = 'juan@mail.com';
	binds.house     = 'Lannister';
	binds.opt1      = 0;
	binds.opt2      = 0;
	binds.opt3      = 0;

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

chartsOptions =
{ chart: {
	renderTo: 'lechart',
	plotBackgroundColor: null,
	plotBorderWidth: 1,//null,
	plotShadow: false,
	},
	title: {
		text: 'Mejor sistema operativo'
	},
	tooltip: {
		pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	},
	plotOptions: {
		pie: {
			allowPointSelect: true,
			animation: false,
			cursor: 'pointer',
			dataLabels: {
				enabled: true,
				format: '<b>{point.name}</b>: {point.percentage:.1f} %',
				style: {
					color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
				}
			}
		}
	},
	series: [{
		type: 'pie',
		name: 'distribución de fans',
		data: []
	}]
}

chart = new Highcharts.Chart(chartsOptions);

} );
