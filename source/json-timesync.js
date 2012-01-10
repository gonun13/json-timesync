/**
 * @author Nuno Gomes
 */

// revealing prototype pattern
var jsonTimesync = function (params){
	this.configs = {
		// you can set multiple upstreams and downstreams
		// equivalent to setting several masters and/or several slaves
		upstreams: [
			{"active": false, "url": ""}
		],
		downstreams: [
			{"active": true, "url": "", "create": true, "delete": true}
		]
	}
	// override configs as needed
    for(param in params)
    {		    	
        this.configs[param] = params[param];
    }
	this.init(this.configs);
};

jsonTimesync.prototype = function(){	

	/**
	 *  inits our instance
	 * 
	 * @param params (upstreams, downstreams)
	 * @return object
	 */
	var init = function (params)
	{
	    // create json from params or empty if none
	    if (typeof(params.json) == 'string')
	    {
		    try {
				var json = JSON.parse(params.json);				
			} catch(e) {
				return false;
			}
		}
		else if (typeof(params.json) == 'object')
		{
			var json = params.json;			
		}
		else
		{
			var json = {};				
		}
		// convert to json-timesync
		this.data = convertToTimesync(json);
	}
	
	/**
	 * converts our json object into a json-timesync object
	 * 
	 * @param json
	 * @return object
	 */	
	var convertToTimesync = function (json)
	{
		// no json, no fun
		if (typeof(json) != 'object') return false;
		// setter for root
		json.set = function(newKey, newValue) {
			// push for arrays
			if (!newValue)
			{
				this.push(transform(newKey));
			}
			else
			{						
				json[newKey] = transform(newValue);
			}
		}
		// recursive conversion of object
		for (var key in json) 
		{
			// all objects gain a setter to add new data
    		if (typeof(json[key]) == 'object')
    		{    			
    			json[key].set = function(newKey, newValue) {
    				// push for arrays
    				if (!newValue)
    				{
    					this.push(transform(newKey));
    				}
    				else
    				{
    					json[newKey] = transform(newValue);
    				}
    			}
    			json[key] = convertToTimesync(json[key]);
    		}
    		// final values gain getters and setters
    		else if (typeof(json[key]) == 'number' || typeof(json[key]) == 'string')
    		{
    			json[key] = transform(json[key]);
    		}
		}
		return json; 
	}
	
	/**
	 * generates current timestamp string (YYYYMMDDHHMMSS)
	 * 
	 * @return int
	 */
	var currentTimestamp = function ()
	{
		var date = new Date();		
		return (+formatDate(date));
	}
	
	/**
	 * formats a date to our timestamp format (YYYYMMDDHHMMSS)
	 * 
	 * @param date
	 * @return string
	 */
	var formatDate = function (date)
	{
		var year = date.getUTCFullYear();
		var month = date.getUTCMonth()+1;
		month = (month < 10 ? '0' : '') + month;
		var day = date.getUTCDate();
		day = (day < 10 ? '0' : '') + day;
		var hour = date.getUTCHours();
		hour = (hour < 10 ? '0' : '') + hour;
		var minute = date.getUTCMinutes();
		minute = (minute < 10 ? '0' : '') + minute;
		var second = date.getUTCSeconds();
		second = (second < 10 ? '0' : '') + second;
		var millisecond = date.getUTCMilliseconds();
		if (millisecond < 10) millisecond = '00'+ millisecond;
		else if (millisecond < 100) millisecond = '0'+ millisecond;
		return year+month+day+hour+minute+second+millisecond;
	}
	
	/**
	 * transforms a regular json key/pair into a json-timesync object
	 * 
	 * @param value
	 * @return mixed
	 */
	var transform = function(value)
	{
		// objects get sent back for recursive passes
		if (typeof(value) == 'object') {
			return convertToTimesync(value);
		}
		// normal values are transformed
		return { 
			"ts": currentTimestamp(), 
			"value": value,
			get: function() { 
				return this.value; 
			},
			getTime: function() { 
				return this.ts; 
			},
			set: function(newValue) {
				this.ts = currentTimestamp(); 
				this.value = newValue;
				return this.ts;
			}
		};
	} 
	
	/**
	 * public methods
	 */
	return {
		init: init,
		convert: convertToTimesync
	};
}();