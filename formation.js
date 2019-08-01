/**
 * Contructor: Formation.
 * Access: Public.
 * Description: Create the formation object to control a form.
 * 
 * @param form [element] [optional] - The form element to be converted into a formation object.
 * @returns formation [object] - The formation object returned as a object variable.
 */
function formation(form) {
	
	// Create a formation object attached to a new document element if form parameter does not exist.
	if(!form) {
		this.form = document.createElement('form');
	}
	
	// Attach the form parameter to the form formation property if it's a document element.
	else if(form.nodeType) {
		this.form = form;
	}
	
	// If form parameter exists but does not a document element, notify the user formation can't continue.
	else {
		throw Error('Unable to create a formation object. The form parameter specified is not of type node.')
	}
	
	// Set Custom Information Zone.
	this.meta = {};
}

// Protect global space while inserting function into formation object.
(function(){
	
	/**
	 * Name: Check Value.
	 * Type: Function.
	 * Access: Private.
	 * For: Formation.
	 * Description: Matches an input value to an array.
	 * 
	 * @param input [Object node] [Required] - The input, textarea, select, or other, to be compared.
	 * @param arrayValues [Object array[string]] [Required] - An array of values to used for comparison.
	 * @param methodType [String] [Optional] - Which instructions should be followed.
	 */
	function checkValue(input, arrayValues, methodType) {

		// Check to see if all parameters exist, error if they don't.
		if (!input || !arrayValues)
			throw Error('Input or array values were not found.');
		
		// If Method Type is not found, assume generic.
		if (!methodType)
			methodType = 'generic';
		else if (typeof methodType !== 'string')
			throw Error('The method type must be a string.');
		
		// Array containers to hold different inputs.
		var approved_inputs = [];
		var rejected_inputs = [];

		// Instructions for unspecified data type. Simply matches data to one another for a match. (Note: "3" as a string does equal 3 as a integer. This is intended.)
		if (methodType == 'generic') {
			
			// Compare generic values.
			for (var g = 0; g < arrayValues.length; g++) {
				if (input.value == arrayValues[g]) {
					approved_inputs.push(input);
					break;
				}
				else if (arrayValues.length - 1 == g) {
					rejected_inputs.push(input);
				}
			}
		}
		
		// Instructions for range data type. Google "math range" if you are don't know what a range is.
		else if (methodType == 'range') {
			
			// Compare range values.
			for (var r = 0; r < arrayValues.length; r++) {
				var range_string = arrayValues[r];
				var range_string_length = range_string.length;
				var plus_idx = range_string.indexOf('+');
				var min_idx = range_string.indexOf('-');
				var num = undefined;
				var err = true;
				
				// Check if plus exists.
				if (plus_idx >= 0) {
					
					// Disable Error.
					err = false;
					
					// Validate.
					if (plus_idx == range_string_length - 1) {
						num = range_string.substring(0, range_string_length - 1);
						if (num < input.value)
							approved_inputs.push(input);
						else
							rejected_inputs.push(input);
					}
				}
				
				// Check if minus exists.
				if (min_idx >= 0) {
					
					// Disable Error.
					err = false;
					
					// Validate.
					if (minus_idx == 0) {
						num = range_string.substring(1, range_string_length);
						if (num > input.value)
							approved_inputs.push(input);
						else
							rejected_inputs.push(input);
					}
				}
				
				// Error if range was not found.
				if (err)
					throw Error('Range validation is not set up correctly for value ' + range_string + 'at array index ' + r);
			}
		}
		
		else
			throw Error('Method type did not match avialable method types.')
		
		// Return all approved and rejected inputs.
		return [approved_inputs, rejected_inputs];
	}
	
	/**
	 * Name: Elements By Selector.
	 * Type: Function.
	 * Access: Private.
	 * For: Formation.
	 * Description: Searches for all elements by a string indicating the selector search for (ex. "#element" or ".elements").
	 * 
	 * @param selector [String] [Required] - The string containing the selector to grab elements ('#' or '.' for example).
	 * @param root [Object node] [Optional] - The js object node which to conduct the selector search. Default is document.
	 * @return elements [Object Array[Object Node]] - Returns an array of object nodes found from the search.
	 */
	function elementsBySelector(selector, root) {
		
		// Container for returned elements.
		var elements = [];
		
		// Validate and initialize root.
		if (!root)
			var root = document;
		else if (!root.nodeType)
			throw Error('The Root of the selector search must be an object node.');
		
		// Error if selector is not found.
		if (!selector)
			throw Error('A select parameter of type string must exist to use the validate function.');
		
		// Check if selector is a ID.
		else if (selector.substring(0, 1) === "#") {
			elements.push(document.getElementById(selector.replace("#", "")));
		}
		
		// Check if selector is a Class.
		else if (selector.substring(0, 1) === ".") {
			elements = root.getElementsByClassName(selector.replace(".", ""));
		}
		
		// If selector is invalid. Notify the user.
		else
			throw Error('The selector must be of type string and start with either a "#" for id, or "." for classname.');
		
		// Return found elements.
		return elements;
	}
	
	/**
	 * Name: Library ID.
	 * Type: Key.
	 * Access: Public.
	 * For: Formation.
	 * Description: The Javascript Library ID for validation and checking.
	*/ 
	formation.prototype.libID = 'formation'; // This should never change.
	
	/**
	 * Name: Pager.
	 */
	formation.prototype.pager = {
		next: function(pageSelector, activeSelector) {

			// Search and store elements found by selector.
			var page_elements = elementsBySelector(pageSelector, this.form);
			
			// Convert active selector into readable object.
			var selector_obj = splitSelector(activeSelector);
			
			// Container for all pages.
			var pages = [];
			
			// Container to hold active index to maniplate pages later.
			var active_idx = undefined;
			
			// Find active page in list.
			for (var p = 0; p < page_elements.length; p++) {

				// Get page and append it to pages.
				var page = page_elements[p];
				pages.push(page);
				
				// Find active page.
				if (selector_obj.type == 'id') {
					if (page.id = selector_obj.name)
						active_idx = p;
				}
				else if (selector_obj.type == 'className') {
					if (page.classList.contains(selector_obj.name))
						active_idx = p;
				}
				else
					throw Error('Could not find active page.');
			}

			// Set next page.
			var next_idx = active_idx + 1;
			if (next_idx < pages.length) {
				if (selector_obj.type == 'id') {
					pages[active_idx].id = '';
					pages[next_idx].id = selector_obj_name;
				}
				else if (selector_obj.type == 'className') {
					pages[active_idx].classList.remove(selector_obj.name);
					pages[next_idx].classList.add(selector_obj.name);
				}	
			}
		},
		
		prev: function(pageSelector, activeSelector) {
			// Search and store elements found by selector.
			var page_elements = elementsBySelector(pageSelector, this.form);
			
			// Convert active selector into readable object.
			var selector_obj = splitSelector(activeSelector);
			
			// Container for all pages.
			var pages = [];
			
			// Container to hold active index to maniplate pages later.
			var active_idx = undefined;
			
			// Find active page in list.
			for (var p = 0; p < page_elements.length; p++) {

				// Get page and append it to pages.
				var page = page_elements[p];
				pages.push(page);
				
				// Find active page.
				if (selector_obj.type == 'id') {
					if (page.id = selector_obj.name)
						active_idx = p;
				}
				else if (selector_obj.type == 'className') {
					if (page.classList.contains(selector_obj.name))
						active_idx = p;
				}
				else
					throw Error('Could not find active page.');
			}

			// Set previous page.
			var prev_idx = active_idx - 1;
			if (prev_idx >= 0) {
				if (selector_obj.type == 'id') {
					pages[active_idx].id = '';
					pages[prev_idx].id = selector_obj_name;
				}
				else if (selector_obj.type == 'className') {
					pages[active_idx].classList.remove(selector_obj.name);
					pages[prev_idx].classList.add(selector_obj.name);
				}	
			}
		}
	}
	
	/**
	 * Name: Split Selector.
	 * Type: Function.
	 * Access: Public.
	 * For: Formation.
	 * Description: Seperates the select name and type from the string.
	 * 
	 * @param selector [String] [Required] - The CSS selector.
	 * @return [Object] - An object with a type and name.
	 */
	function splitSelector(selector) {
		
		// Check if selector is present.
		if (!selector && typeof selector != 'string')
			throw Error('Selector must exist as type string.');
		
		// Get type from selector.
		var type = selector.substring(0, 1);
		if (type == '#')
			type = 'id';
		else if (type == '.')
			type = 'className';
		else
			type = undefined;
		
		// Get name from selector.
		var name = selector.substring(1);
		
		//Return an object with type and name.
		return {type: type, name: name};
	}
	
	/**
	 * Name: Validate.
	 * Type: Function.
	 * Access: Public.
	 * For: Formation.
	 * Description: Check the input value with valid combinations.
	 * 
	 * @param selector [String] [Required] - The string containing the selector to grab elements ('#' or '.' for example).
	 * @param callback [Function] [Optional] - A function call to receive true or false boolean. True if value is valid. False if value is invalid.
	 * @return data [Object Array[Object Array], [Object, Array]] - Returns an 2D array. idx 0 being approved values, and 1 being rejected values. If their is a callback function...
	 		no value will be return, except if the callback returns a value.
	 */
	formation.prototype.validate = function(selector, callback) {

		// Search and store elements found by selector.
		var elements = elementsBySelector(selector, this.form);

		// Data storage to return and local for pushing.
		var return_data = [[],[]];
		var local_data = undefined;
		
		// Validate each element.
		for (var i = 0; i < elements.length; i++) {

			// Grap single input & set container for check values.
			var input = elements[i];
			var valuesArray = undefined;
			
			// Gather acceptable inputs & compare values with input.
			if (input.hasAttribute('data-validate-accept')) {
				
				// Gather acceptable inputs & compare values with input.
				valuesArray = input.getAttribute('data-validate-accept').split(',');
				local_data = checkValue(input, valuesArray);
				return_data[0] = return_data[0].concat(local_data[0]);
				return_data[1] = return_data[1].concat(local_data[1]);
				
			}
			
			// Gather acceptable inputs & compare values with input.
			else if (input.hasAttribute('data-validate-accept-range')) {
				
				// Gather acceptable inputs & compare values with input.
				valuesArray  = input.getAttribute('data-validate-accept-range').split(',');
				local_data = checkValue(input, valuesArray, 'range');
				return_data[0] = return_data[0].concat(local_data[0]);
				return_data[1] = return_data[1].concat(local_data[1]);
			}
			
			// Gather rejectable inputs & compare values with input.
			else if (input.hasAttribute('data-validate-reject')) {
				
				// Gather rejectable inputs & compare values with input.
				valuesArray = input.getAttribute('data-validate-reject').split(',');
				local_data = checkValue(input, valuesArray);
				return_data[0] = return_data[0].concat(local_data[1]);
				return_data[1] = return_data[1].concat(local_data[0]);
			}
			
			// Gather rejectable inputs & compare values with input.
			else if (input.hasAttribute('data-validate-reject-range')) {
				
				// Gather rejectable inputs & compare values with input.
				valuesArray = input.getAttribute('data-validate-reject-range').split(',');
				local_data = checkValue(input, valuesArray, 'range');
				return_data[0] = return_data[0].concat(local_data[1]);
				return_data[1] = return_data[1].concat(local_data[0]);
			}
		}
		
		// Execute callback, and return any value that is returned via callback function.
		if (callback) {
			var returnValue = callback(return_data[0], return_data[1]);
			if (typeof returnValue !== 'undefined')
				return returnValue;
		}
		
		// Return 2D array to the user if no callback.
		else
			return return_data;
	}
	
}());