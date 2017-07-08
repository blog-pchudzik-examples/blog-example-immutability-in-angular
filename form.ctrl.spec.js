describe('form.ctrl.spec.js', () => {
	let 
		$controller,
		$q,
		$rootScope,
		dictionariesService;

	beforeEach(() => {
		angular.mock.module('app');
		angular.mock.inject($injector => {
			$controller = $injector.get('$controller');
			$q = $injector.get('$q');
			$rootScope = $injector.get('$rootScope');
		});
		initMocks();
	});

	it('categories selection', () => {
		//given
			const 
				tag11 = tag('tag 1_1'),
				tag12 = tag('tag 1_2'),
				tag21 = tag('tag 2_1'),
				tag22 = tag('tag 2_1'),
				category1 = category('category 1', [tag11, tag12]),
				category2 = category('category 2', [tag21, tag22]),
				avaialbleDictionaries = {
					categories: [category1, category2],
					tags: [tag11, tag12, tag21, tag22]
				},
				scope = createController(avaialbleDictionaries);

		//when
		scope.toggleCategory(category1);

		//then
		expect(scope.availableOptions.tags).toEqual([tag11, tag12]);
		expect(scope.formData.selectedCategories).toEqual([category1]);

		//when
		scope.toggleCategory(category2);

		//then
		expect(scope.availableOptions.tags).toEqual([tag11, tag12, tag21, tag22]);
		expect(scope.formData.selectedCategories).toEqual([category1, category2]);

		//when
		scope.toggleCategory(category1);

		//then
		expect(scope.availableOptions.tags).toEqual([tag21, tag22]);
		expect(scope.formData.selectedCategories).toEqual([category2]);

		//when
		scope.toggleCategory(category2);

		//then
		expect(scope.availableOptions.tags).toEqual([]);
		expect(scope.formData.selectedCategories).toEqual([]);
	});

	it('tags selection', () => {
		//given
		const
			tag1 = tag('tag 1'),
			tag2 = tag('tag 2'),
			singleCategory = category('category', [tag1, tag2]),
			scope = createController({
				categories: [singleCategory],
				tags: [tag1, tag2]
			});
		scope.toggleCategory(singleCategory);

		//when
		scope.toggleTag(tag1);

		//then
		expect(scope.formData.selectedTags).toEqual([tag1]);

		//when
		scope.toggleTag(tag2);

		//then
		expect(scope.formData.selectedTags).toEqual([tag1, tag2]);

		//when
		scope.toggleTag(tag1);

		//then
		expect(scope.formData.selectedTags).toEqual([tag2]);

		//when
		scope.toggleTag(tag2);

		//then
		expect(scope.formData.selectedTags).toEqual([]);
	});

	function category(name, tags) {
		return {
			id: name,
			name: `cateogry ${name}`,
			tags: (tags || [])
		};
	}

	function tag(name) {
		return {
			id: name,
			name: `tag ${name}`
		};
	}

	function createController(avaialbleDictionaries) {
		const $scope = $rootScope.$new();
		$controller('FormController', {
			$scope,
			dictionariesService
		});

		if(avaialbleDictionaries) {
			dictionariesService.fetchCategories.deferred.resolve(avaialbleDictionaries.categories);
			dictionariesService.fetchTags.deferred.resolve(avaialbleDictionaries.tags);
		}

		$scope.$apply();

		return $scope;
	}

	function initMocks() {
		function createDeferredFn() {
			const 
				deferred = $q.defer(),
				result = () => deferred.promise;
			result.deferred = deferred;
			return result;
		}

		dictionariesService = {
			fetchCategories: createDeferredFn(),
			fetchTags: createDeferredFn()
		};
	}
});
