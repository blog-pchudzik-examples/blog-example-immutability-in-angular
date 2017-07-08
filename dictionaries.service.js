angular
	.module('app')
	.factory('dictionariesService', ($q, flatten) => {
		return {
			fetchCategories,
			fetchTags
		};

		function fetchCategories() {
			return $q.when([
					{
						id: 1, 
						name: 'Howtos',
						tags: [
							{id: 11, name: 'Java'},
							{id: 12, name: 'AngularJS'},
							{id: 13, name: 'Groovy'},
							{id: 13, name: 'Scala'}
						]
					},
					{
						id: 2, 
						name: 'Best practives',
						tags: [
							{id: 21, name: 'Testing'},
							{id: 22, name: 'Design'},
							{id: 23, name: 'Architecture'}
						]
					},
					{
						id: 3, 
						name: 'JavaScript',
						tags: [
							{id: 31, name: 'Good parts'},
							{id: 32, name: 'Code smells'},
							{id: 33, name: 'Functional Programming'}
						]
					}
				]);
		}

		function fetchTags() {
			return fetchCategories()
				.then(extractTags)
		}

		function extractTags(categories) {
			return categories
				.map(c => c.tags)
				.reduce(flatten, []);
		}
	});
