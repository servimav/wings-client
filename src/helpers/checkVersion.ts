/**
 * checkVersion
 * @param a 
 * @param b 
 * @returns 
 */
export function checkVersion(a: string, b: string) {
	const x = a.split('.').map(e => parseInt(e));
	const y = b.split('.').map(e => parseInt(e));
	let z = "";

	for (let i = 0; i < x.length; i++) {
		if (x[i] === y[i]) {
			z += "e";
		} else
			if (x[i] > y[i]) {
				z += "m";
			} else {
				z += "l";
			}
	}
	if (!z.match(/[l|m]/g)) {
		return 0;
	} else if (z.split('e').join('')[0] == "m") {
		return 1;
	} else {
		return -1;
	}
}