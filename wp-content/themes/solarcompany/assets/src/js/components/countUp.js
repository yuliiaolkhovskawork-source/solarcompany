import { CountUp } from 'countup.js';

export default function initCountUp() {
	document.querySelectorAll('.count').forEach((element) => {
		const rawValue = element.getAttribute('data-value') || '';
		const cleaned = rawValue.replace(/,/g, '');
		const endVal = parseFloat(cleaned) || 0;
		const decimalPlaces = (cleaned.split('.')[1] || '').length;

		const options = {
			startVal: 0,
			duration: 2,
			decimalPlaces,
			enableScrollSpy: true,
			scrollSpyOnce: true
		};

		const countUp = new CountUp(element, endVal, options);

		countUp.start();
	});
}
