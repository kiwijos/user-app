/**
 * Calculates the difference between two dates in milliseconds
 * @param {string} startDate - String representation of a valid date, e.g. "2021-01-01T00:00:00.000Z"
 * @param {string} endDate - String representation of a valid date, e.g. "2021-01-01T01:00:00.000Z"
 * @returns {number} - The difference between the two dates in milliseconds, e.g. 3600000
 */
export const calculateTimeDifference = (startDate: string, endDate: string): number => {
	const start = new Date(startDate);
	const end = new Date(endDate);

	// @ts-expect-error - TS doesn't like the subtraction of dates but it works
	return end - start; // Difference in milliseconds
};

/**
 * Formats a time in milliseconds to a string representation of hours and minutes
 * @param {number} milliseconds - The time in milliseconds
 * @returns {string} - A string representation of the time in or hours and minutes (e.g. 1 h, 30 min)
 */
export const formatMilliseconds = (milliseconds: number): string => {
	const minutes = Math.floor(milliseconds / (1000 * 60));
	if (minutes < 60) {
		return `${minutes} min`;
	} else {
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return `${hours} h, ${remainingMinutes} min`;
	}
};

/**
 * Formats a date string to a more readable format using the locale sv-SE, e.g. "fredag 5 januari 2024 kl. 10:00"
 * @param {string} date - A string representation of a valid date, e.g. "2024-01-05T10:00:00"
 * @returns {string} - A string representation of the date, e.g. "fredag 5 januari 2024 kl. 10:00"
 */
export const formatDateReadable = (date: string): string => {
	const d = new Date(date);
	return d.toLocaleDateString('sv-SE', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: false // Use 24-hour format
	});
};
