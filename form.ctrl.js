angular
	.module('app')
	.controller('FormController', function($scope, $q, dictionariesService, flatten) {
		const initial = {
			availableCategories: [],
			availableTags: []
		};

		$scope.toggleCategory = toggleCategory;
		$scope.toggleTag = toggleTag;

		$scope.formData = {
			selectedCategories: [],
			selectedTags: []
		};
		$scope.availableOptions = {
			categories: [],
			tags: []
		};

		initialize();

		function toggleCategory(category) {
			if($scope.formData.selectedCategories.includes(category)) {
				removeCategory(category);
			} else {
				addCategory(category);
			}
		}

		function toggleTag(tag) {
			if($scope.formData.selectedTags.includes(tag)) {
				removeTag(tag);
			} else {
				addTag(tag);
			}
		}

		function addCategory(category) {
			updateFormState({selectedCategories: [...$scope.formData.selectedCategories, category]});
		}

		function removeCategory(category) {
			updateFormState({selectedCategories: filterOutSelected($scope.formData.selectedCategories, category)});
		}

		function addTag(tag) {
			updateFormState({selectedTags: [...$scope.formData.selectedTags, tag]});
		}

		function removeTag(tag) {
			updateFormState({selectedTags: filterOutSelected($scope.formData.selectedTags, tag)});
		}

		function updateFormState(newData) {
			const
				updatedFormData = Object.assign({}, $scope.formData, newData),
				selectedCategories = updatedFormData.selectedCategories,
				selectedTags = updatedFormData.selectedTags.filter(tag => isTagAssignableFrom(tag, selectedCategories)),
				availableCategories = [...initial.availableCategories],
				availableTags = initial.availableTags.filter(tag => isTagAssignableFrom(tag, selectedCategories));

			$scope.formData = {selectedCategories, selectedTags};
			$scope.availableOptions = {
				categories: availableCategories,
				tags: availableTags
			};
		}

		function isTagAssignableFrom(tag, selectedCategories) {
			if(selectedCategories.length === 0) {
				return false;
			}

			return selectedCategories
				.map(category => category.tags)
				.reduce(flatten, [])
				.map(t => t.id)
				.includes(tag.id);
		}

		function filterOutSelected(allItems, selected) {
			return allItems.filter(item => item.id !== selected.id);
		}

		function initialize() {
			$q
				.all({
					availableCategories:dictionariesService.fetchCategories(),
					availableTags: dictionariesService.fetchTags()
				})
				.then(result => Object.assign(initial, result))
				.then(() => {
					$scope.availableOptions = {
						categories: initial.availableCategories,
						tags: []
					};
				});
		}
	});
