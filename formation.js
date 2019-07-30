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
	 * Key: Library ID.
	 * Access: Public.
	 * Description: The Javascript Library ID for validation and checking.
	*/ 
	formation.prototype.libID = 'formation'; // This should never change.
	
	
	
	
	
	/**
	 * Function: Validate.
	 * Access: Public.
	 * Description: Check the input value with valid combinations.
	 * 
	 * @param input node - The HTML element to validate.
	 * @param valid array[] - An array acceptable input values.
	 * @param callback function - A function call to receive true or false boolean. True if value is valid. False if value is invalid.
	 */
	formation.prototype.validate = function(selector, callback) {
		// Selector must exist to use validate function.
		var data = [];
		if (!selector)
			throw Error('A select parameter of type string must exist to use the validate function.');
		
		// Check if selector is a ID.
		else if (selector.substring(0, 1) === "#") {
			data.push(document.getElementById(selector.replace("#", "")));
		}
		
		// Check if selector is a Class.
		else if (selector.substring(0, 1) === ".") {
			data = this.form.getElementsByClassName(selector.replace(".", ""));
		}
		
		// If selector is invalid. Notify the user.
		else
			throw Error('The selector must be of type string and start with either a "#" for id, or "." for classname.');

		// Validate each data.
		var approved_inputs = [];
		var rejected_inputs = [];
		for (var i = 0; i < data.length; i++) {

			// Grap single input.
			var input = data[i];
			var sorted = false;
			
			// Gather acceptable inputs & compare values with input.
			if (input.hasAttribute('data-validate-accept') && !sorted) {
				var accept_array = input.getAttribute('data-validate-accept').split(',');

				// Compare acceptable values.
				for (var a in accept_array) {
					if (input.value == accept_array[a]) {
						approved_inputs.push(input);
						sorted = true;
					}
				}
			};
			
			// Gather acceptable inputs & compare values with input.
			if (input.hasAttribute('data-validate-accept-range') && !sorted) {
				var accept_array = input.getAttribute('data-validate-accept-range').split(',');

				// Compare range values.
				for (var ar = 0; ar < accept_array.length; ar++) {
					var accepted_range_string = accept_array[ar];
					var accepted_range_string_length = accepted_range_string.length;
					var plus_idx = accepted_range_string.indexOf('+');
					var min_idx = accepted_range_string.indexOf('-');
					var num = undefined;
					
					// Check if plus exists.
					if (plus_idx >= 0) {
						if (plus_idx == accepted_range_string.length - 1) {
							num = accepted_range_string.substring(0, plus_idx == accepted_range_string_length - 1);
							if (num < input.value) {
								approved_inputs.push(input);
								sorted = true;
							}
						}
					}

					// Check if minus exists.
					if (min_idx >= 0) {
						if (minus_idx == 0) {
							num = accepted_range_string.substring(1, accepted_range_string_length);
							if (num > input.value) {
								approved_inputs.push(input);
								sorted = true;
							}
						}
					}
				}
			};
			
			// Gather rejectable inputs & compare values with input.
			if (input.hasAttribute('data-validate-reject') && !sorted) {
				
				// Gather rejectable inputs & compare values with input.
				var reject_array = input.getAttribute('data-validate-reject').split(',');
				
				// Compare rejectable values.
				for (var r in reject_array) {
					if (input.value == reject_array[r]) {
						rejected_inputs.push(input);
						sorted = true;
					}
				}
			};
			
			// Gather rejectable inputs & compare values with input.
			if (input.hasAttribute('data-validate-reject-range') && !sorted) {
				var reject_array = input.getAttribute('data-validate-reject-range').split(',');

				// Compare range values.
				for (var rr = 0; rr < accept_array.length; rr++) {
					var rejected_range_string = reject_array[rr];
					var rejected_range_string_length = rejected_range_string.length;
					var plus_idx = rejected_range_string.indexOf('+');
					var min_idx = rejected_range_string.indexOf('-');
					var num = undefined;
					
					// Check if plus exists.
					if (plus_idx >= 0) {
						if (plus_idx == rejected_range_string.length - 1) {
							num = rejected_range_string.substring(0, plus_idx == rejected_range_string_length - 1);
							if (num < input.value) {
								rejected_inputs.push(input);
								sorted = true;
							}
						}
					}
					
					// Check if minus exists.
					if (min_idx >= 0) {
						if (minus_idx == 0) {
							num = rejected_range_string.substring(1, rejected_range_string_length);
							if (num > input.value) {
								rejected_inputs.push(input);
								sorted = true;
							}
						}
					}
				}
			};
			
			// Always reject input if it's isn't sorted.
			if (!sorted)
				rejected_inputs.push(input);
		}
		
		// Execute callback, and return any value that is returned via callback function.
		if (callback) {
			var returnValue = callback(approved_inputs, rejected_inputs);
			if (typeof returnValue === 'undefined') {
				return returnValue;
			}
		}
		
		// Return 2D array to the user if no callback.
		else
			return [approved_inputs, rejected_inputs];

	}
	
}());