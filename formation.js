// Global container object to hold library.
var formation = {};

// Protect global space while inserting function into formation object.
(function(){
	
	/**
	 * Function: Validate
	 * Description: Check the input value with valid combinations.
	 * 
	 * @param input node - The HTML element to validate.
	 * @param valid array[] - An array acceptable input values.
	 * @param callback function - A function call to receive true or false boolean. True if value is valid. False if value is invalid.
	 */
	formation.validate = function(value, valid, callback) {
		
		// Validate input and valid variables exist.
		if (!value)
			throw Error('A value is required.');
		if (!valid && typeof valid !== 'array')
			throw Error('An array of valid entries are required in order to validate.');
		
		// Compare value to valid answers.
		var isValid = false;
		for (var i in valid) {
			if (value == valid[i])
				isValid = true;
		}
		
		// Call callback function. True if value is valid. False if value is invalid.
		if (isValid)
			callback(true);
		else
			callback(false);
	}

	/**
	 * Function: Invalidate
	 * Description: Check the input value with invalid combinations.
	 * 
	 * @param input node - The HTML element to validate.
	 * @param valid array[] - An array acceptable input values.
	 * @param callback function - A function call to receive true or false boolean. True if value is invalid. True if value is valid.
	 */
	formation.invalidate = function(value, invalid, callback) {
		
		// Validate input and valid variables exist.
		if (!value)
			throw Error('A value is required.');
		if (!invalid && typeof invalid !== 'array')
			throw Error('An array of invalid entries are required in order to invalidate.');
		
		// Compare value to valid answers.
		var isInvalid = false;
		for (var i in invalid) {
			if (value == invalid[i])
				isInvalid = true;
		}
		
		// Call callback function. True if value is invalid. True if value is valid.
		if (isInvalid)
			callback(false);
		else
			callback(true);
	}
	
	/**
	 * Function: Next Page
	 * Description: If the form is a single page form which simulates multiple pages... this progresses to the next page.
	 * 
	 * @param FormId string - The form HTML element ID.
	 * @param pageClass string - A class to represent a form page.
	 * @param pageActive string - A class to represent the active page of multiple pages.
	 */
	formation.nextPage = function(formId, pageClass, pageActive) {
		
		// Throw error if formId, pageClass, and pageActive does not exist.
		if (!formId && typeof formId !== 'string')
			throw Error('A formId is required in order for pager to work.');
		else if (!pageClass && typeof pageClass !== 'string')
			throw Error('A class to reperesent a page is required in order for pager to work.');
		else if (!pageActive && typeof pageActive !== 'string')
			throw Error('A class to represent an active page is required in order for pager to work.');
		
		// Get Form Element.
		var form = document.getElementById(formId);
		
		// Find active page.
		var pages = form.getElementsByClassName(pageClass);
		var activeIDX = null;
		for (var i in pages) {
			var page = pages[i];
			if (page.classlist.contains(pageActive))
				activeIDX = i;
		}
		
		// Hide current page and activate next page.
		if (activeIDX == null)
			throw Error('please add an initial active page class to one of your page classes.');
		else if (activeIDX >= 0) {
			pages[activeIDX].classlist.remove(pageActive);
			pages[(activeIDX + 1)].add(pageActive);
		}
	}
	
	/**
	 * Function: Previous Page
	 * Description: If the form is a single page form which simulates multiple pages... this back tracks to the previous page.
	 * 
	 * @param FormId string - The form HTML element ID.
	 * @param pageClass string - A class to represent a form page.
	 * @param pageActive string - A class to represent the active page of multiple pages.
	 */
	formation.prevPage = function(formId, pageClass, pageActive) {
		
		// Throw error if formId, pageClass, and pageActive does not exist.
		if (!formId && typeof formId !== 'string')
			throw Error('A formId is required in order for pager to work.');
		else if (!pageClass && typeof pageClass !== 'string')
			throw Error('A class to reperesent a page is required in order for pager to work.');
		else if (!pageActive && typeof pageActive !== 'string')
			throw Error('A class to represent an active page is required in order for pager to work.');
		
		// Get Form Element.
		var form = document.getElementById(formId);
		
		// Find active page.
		var pages = form.getElementsByClassName(pageClass);
		var activeIDX = null;
		for (var i in pages) {
			var page = pages[i];
			if (page.classlist.contains(pageActive))
				activeIDX = i;
		}
		
		// Hide current page and activate previous page.
		if (activeIDX == null)
			throw Error('please add an initial active page class to one of your page classes.');
		else if (activeIDX >= 0) {
			pages[activeIDX].classlist.remove(pageActive);
			pages[(activeIDX - 1)].add(pageActive);
		}		
	}
	
})();