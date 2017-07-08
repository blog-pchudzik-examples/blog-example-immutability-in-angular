module.exports = function(config) {
	config.set({
	frameworks: ['jasmine'],
	browsers: ['Chrome'],
	files: [
		'node_modules/angular/angular.min.js',
		'node_modules/angular-mocks/angular-mocks.js',
		'*.js'
    ]
  })
};
