module.exports = {
	defaults: (obj, defaults) => {
		for (let prop in obj) {
			if (obj[prop] === null || obj[prop] === undefined && defaults.hasOwnProperty(prop)) {
				obj[prop] = defaults[prop];
			}
		}
		return obj;
	}
}