var formation = null;
// Protect global space while inserting function into formation object.
(function(){
	
	/**
	 * Name: Formation.
	 * Type: Constructor.
	 * Access: Public.
	 * For: Formation.
	 * Description: Create the formation object to control a form.
	 * 
	 * @param form [element] [optional] - The form element to be converted into a formation object.
	 * @returns formation [object] - The formation object returned as a object variable.
	 */
	formation = function(form) {
		
		// Create a formation object attached to a new document element if form parameter does not exist.
		if(!form) {
			this.form = document.createElement('form');
		}
		
		// Attach the form parameter to the form formation property if it's a document element.
		else if(form.nodeType) {
			this.form = form;
		}
		
		// If form parameter exists but is not a DOM element, notify the user formation can't continue.
		else {
			throw Error('Unable to create a formation object. The form parameter specified is not of type node.');
		}
		
		// Retrieve all inputs for storage. Inputs are gathered as a collective whole and grouped for indexing.
		this.inputs = null;
		
		// Set Custom Information Zone.
		this.meta = {};
		
		// Get all inputs.
		this.update();
	}
	
	
	
	
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
	 * @return [Object] - The data object containing all of the information about the checked process.
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
		var matched_inputs = [];
		var noMatched_inputs = [];

		// Instructions for unspecified data type. Simply matches data to one another for a match. (Note: "3" as a string does equal 3 as a integer. This is intended.)
		if (methodType == 'generic') {
			
			// Compare generic values.
			for (var g = 0; g < arrayValues.length; g++) {
				
				// Detect Match.
				if (input.value == arrayValues[g]) {
					matched_inputs.push(buildCKObj(input, arrayValues, methodType, arrayValues[g]));
					break;
				}
				
				// No Match.
				else if (arrayValues.length - 1 == g) {
					noMatched_inputs.push(buildCKObj(input, arrayValues, methodType, null));
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
						
						// Detect Match
						if (num < input.value) {
							matched_inputs.push(buildCKObj(input, arrayValues, methodType, range_string));
							break;
						}
						
						// No Match
						else {
							noMatched_inputs.push(buildCKObj(input, arrayValues, methodType, null));
							break;
						}
					}
				}
				
				// Check if minus exists.
				if (min_idx >= 0) {
					
					// Disable Error.
					err = false;
					
					// Validate.
					if (minus_idx == 0) {
						num = range_string.substring(1, range_string_length);
						
						// Detect Match
						if (num > input.value) {
							matched_inputs.push(buildCKObj(input, arrayValues, methodType, range_string));
							break;
						}
						
						// No Match
						else {
							noMatched_inputs.push(buildCKObj(input, arrayValues, methodType, null));
							break;
						}
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
		return [matched_inputs, noMatched_inputs];
		
		/**
		 * Name: Build Check Object.
		 * Type: Function.
		 * Access: Private.
		 * For: Check Value.
		 * Description. Builds the check object containing all data about the check.
		 * 
		 * @param input [Object node] [Required] - The input element being checked.
		 * @param arrayValues [Object array[String] [Required] - A string array of data values the input value was compared to.
		 * @param methodType [String] [Required] - The type of instructions the data was checked against.
		 * @param matchedWith [String] [Required] - The data validation parameter the input value passed.
		 * @return [Object] - The data object containing all of the information about the checked process.
		 */
		function buildCKObj(input, arrayValues, methodType, matchedWith) {
			return {
				input: input,
				comparedTo: arrayValues,
				methodType: methodType,
				matchedWith: matchedWith
			}
		}
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
	 * Name: Find Active.
	 * Type: Function.
	 * Access: Public.
	 * For: Formation.
	 * Description: Loops through an array of elements and finds the active element.
	 * 
	 * @param elements [Object array[object node]] [Required] - A list of elements to loop through to set the active element.
	 * @param toggleClass [String] [Required] - The toggle class to add and remove from elements for viewing.
	 * @return [Integer] - The index of the currently active element within the array.
	 */
	formation.prototype.findActive = function(elements, toggleClass) {
		
		// Check if an array of element elements exist. If it doesn't, error.
		if (!elements || !elements.length)
			throw Error("In order to select next element, an array of elements needs to be passed through.");
		
		// Check if toggle class exists.
		if (!toggleClass)
			throw Error('A toggle class state must exist in order to set the next element.');
		
		// Container to hold active index to maniplate elements later.
		var active_idx = undefined;
		
		// Find active element in list.
		for (var p = 0; p < elements.length; p++) {

			// Get element and append it to elements.
			var element = elements[p];
			
			// Check if element is a js node.
			if (!element.nodeType)
				throw Error('This is not an element. Index ' + i + 'data is ' + input + ' of the element elements array.');

			// Find active element.
			if (element.classList.contains(toggleClass)) {
				active_idx = p;
				break;
			}
			else if (active_idx == undefined && elements.length - 1 == p)
				throw Error('Could not find active element.');
		}
		
		// Return the active index number.
		return active_idx;
	}
	
	/**
	 * Name: Next Active.
	 * Type: Function.
	 * Access: Public.
	 * For: Formation.
	 * Description: Loops through an array of elements and toggles the 'active' element.
	 * 
	 * @param elements [Object array[object node]] [Required] - A list of elements to loop through to set the active element.
	 * @param toggleClass [String] [Required] - The toggle class to add and remove from elements for viewing.
	 * @return [Integer] - The index of the currently active element within the array.
	 */
	formation.prototype.nextActive = function(elements, toggleClass) {

		// Check if an array of element elements exist. If it doesn't, error.
		if (!elements || !elements.length)
			throw Error("In order to select next element, an array of elements needs to be passed through.");
		
		// Check if toggle class exists.
		if (!toggleClass)
			throw Error('A toggle class state must exist in order to set the next element.');
		
		// Container to hold active index to manipulate elements later.
		var active_idx = this.findActive(elements, toggleClass);

		// Set next element.
		var next_idx = active_idx + 1;
		if (next_idx < elements.length) {
			elements[active_idx].classList.toggle(toggleClass);
			elements[next_idx].classList.toggle(toggleClass);
			
			// Return the new active index.
			return next_idx;
		}
		else {
			// Return unchanged active index.
			return active_idx;
		}
	},
		
	/**
	 * Name: Previous Active.
	 * Type: Function.
	 * Access: Public.
	 * For: Formation.
	 * Description: Loops through an array of elements and toggles the 'active' state of the element element.
	 * 
	 * @param elements [Object array[object node]] [Required] - A list of elements to loop through to set the active element.
	 * @param toggleClass [String] [Required] - The active class to add and remove from elements for viewing.
	 * @return [Integer] - The index of the currently active element within the array.
	 */
	formation.prototype.prevActive = function(elements, toggleClass) {
			
		// Check if an array of element elements exist. If it doesn't, error.
		if (!elements || !elements.length)
			throw Error("In order to select previous element, an array of elements needs to be passed through.");
		
		// Check if active class exists.
		if (!toggleClass)
			throw Error('An active class state must exist in order to set the next element.')
		
		// Container to hold active index to manipulate elements later.
		var active_idx = this.findActive(elements, toggleClass);

		// Set previous element.
		var prev_idx = active_idx - 1;
		if (prev_idx >= 0) {
			elements[active_idx].classList.toggle(toggleClass);
			elements[prev_idx].classList.toggle(toggleClass);
			
			// Return the new active index.
			return prev_idx;
		}
		else {
			// Return unchanged active index.
			return active_idx;
		}
	}
	
	/**
	 * Name: Update.
	 * Type: Function.
	 * Access: Public.
	 * For: Formation.
	 * Description: Updates any data, such as the DOM, that may have changed from manipulation.
	 */
	formation.prototype.update = function(){
		
		// Get All Inputs
		var all = this.form.getElementsByTagName('input');
		
		// Input Storage
		var input_storage = {
			all: all
		}

		// Group Inputs
		var input = null;
		for (var i = 0; i < all.length; i++) {
			
			// Get Input.
			input = all[i];
			
			// loop through parent elements, starting with each input, to create a input group tree. For indexing. Stops when it reaches parent form object.
			var element = input;
			var path = [];
			while (element != this.form) {
				path.push(element);
				element = element.parentElement;
			}
			
			// Attach path to input storage.
			var keys = Object.keys(input_storage);
			for (var k = 0; k < keys.length; k++) {
				
				// skip "all" key.
				if (k == 'all')
					continue;
				
				// Create the element DOM path.
				var element = keys[k];
				for (var p = path.length; p > 0; p--) {
					
				}
			}
		}
		
		// Return All Inputs.
		this.inputs = input_storage;
	}
	
	/**
	 * Name: Validate.
	 * Type: Function.
	 * Access: Public.
	 * For: Formation.
	 * Description: Check the input value with valid combinations.
	 * 
	 * @param selector [String] [Required] - The string containing the selector to grab elements ('#' or '.' for example).
	 * @return data [Object Array[Object array[Object node]], [Object, array[Object node]]] - Returns a 2D array. idx 0 being approved, and 1 being rejected.
			Each inner array is filled with an object containing information about the validation process.
	 */
	formation.prototype.validate = function(elements) {

		// Check if it's a single elements. If so, push into an array for checking.
		if (!elements.length && elements.nodeType)
			elements = [elements]
			
		// Check if an array of elements exist. If it doesn't, error.
		if (!elements || !elements.length)
			throw Error("In order to validate an array of elements needs to be passed through.");

		// Data storage to return and local for pushing.
		var return_data = [[],[]];
		var local_data = undefined;
		
		// Validate each element.
		for (var i = 0; i < elements.length; i++) {

			// Grap single input & set container for check values.
			var input = elements[i];
			var valuesArray = undefined;
			
			// Check if input is a js node.
			if (!input.nodeType)
				throw Error('This is not an element. Index ' + i + 'data is ' + input + ' of the elements array.');
			
			// Gather acceptable inputs & compare values with input.
			if (input.hasAttribute('data-fm-val-a')) {
				
				// Gather acceptable inputs & compare values with input.
				valuesArray = input.getAttribute('data-fm-val-a').split(',');
				local_data = checkValue(input, valuesArray);
				return_data[0] = return_data[0].concat(local_data[0]);
				return_data[1] = return_data[1].concat(local_data[1]);
			}
			
			// Gather acceptable inputs & compare values with input.
			else if (input.hasAttribute('data-fm-val-a-generic')) {
				
				// Gather acceptable inputs & compare values with input.
				valuesArray = input.getAttribute('data-fm-val-a-generic').split(',');
				local_data = checkValue(input, valuesArray);
				return_data[0] = return_data[0].concat(local_data[0]);
				return_data[1] = return_data[1].concat(local_data[1]);
			}
			
			// Gather acceptable inputs & compare values with input.
			else if (input.hasAttribute('data-fm-val-a-range')) {
				
				// Gather acceptable inputs & compare values with input.
				valuesArray  = input.getAttribute('data-fm-val-a-range').split(',');
				local_data = checkValue(input, valuesArray, 'range');
				return_data[0] = return_data[0].concat(local_data[0]);
				return_data[1] = return_data[1].concat(local_data[1]);
			}
			
			// Gather rejectable inputs & compare values with input.
			else if (input.hasAttribute('data-fm-val-r')) {
				
				// Gather rejectable inputs & compare values with input.
				valuesArray = input.getAttribute('data-fm-val-r').split(',');
				local_data = checkValue(input, valuesArray);
				return_data[0] = return_data[0].concat(local_data[1]);
				return_data[1] = return_data[1].concat(local_data[0]);
			}
			
			// Gather rejectable inputs & compare values with input.
			else if (input.hasAttribute('data-fm-val-r-generic')) {
				
				// Gather rejectable inputs & compare values with input.
				valuesArray = input.getAttribute('data-fm-val-r-generic').split(',');
				local_data = checkValue(input, valuesArray);
				return_data[0] = return_data[0].concat(local_data[1]);
				return_data[1] = return_data[1].concat(local_data[0]);
			}
			
			// Gather rejectable inputs & compare values with input.
			else if (input.hasAttribute('data-fm-val-r-range')) {
				
				// Gather rejectable inputs & compare values with input.
				valuesArray = input.getAttribute('data-fm-val-r-range').split(',');
				local_data = checkValue(input, valuesArray, 'range');
				return_data[0] = return_data[0].concat(local_data[1]);
				return_data[1] = return_data[1].concat(local_data[0]);
			}
		}
		
		// Return 2D array.
		return return_data;
	}
	
}());