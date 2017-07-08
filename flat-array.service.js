angular
	.module('app')
	.factory('flatten', () => {
		return function(array1, array2) {
			return [...array1, ...array2];
		}
	});