/**
 * @author Nuno Gomes
 */

// revealing module pattern
var jsonTimesync = (function(){	
	
	/**
	 * iterates json object and adds current timestamp to all values
	 * 
	 * @param json
	 * @return object
	 */	
	function convertToTimesync(json)
	{
		for (var key in json) 
		{ 
    		if (typeof(json[key]) == 'object')
    		{
    			json[key] = convertToTimesync(json[key]);
    		}
    		else if (typeof(json[key]) == 'number' || typeof(json[key]) == 'string')
    		{
    			json[key] = { "ts": currentTimestamp(), "value": json[key] };
    		}
		}
		return json; 
	}
	
	/**
	 * generates current timestamp string (YYYYMMDDHHMMSS)
	 * 
	 * @return int
	 */
	function currentTimestamp()
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
	function formatDate(date)
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
	
	return {
		convert: convertToTimesync
	};
}());