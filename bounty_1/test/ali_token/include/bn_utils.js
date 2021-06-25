// Both Truffle anf Hardhat with Truffle make an instance of web3 available in the global scope
// BN constants, functions to work with BN
const BN = web3.utils.BN;
const toBN = web3.utils.toBN;
const isBN = web3.utils.isBN;

// generates random BN [from, from + range)
function random_bn(from, range) {
	// convert inputs to BNs if they are not BNs
	from = new BN(from);
	range = new BN(range);

	const TRILLION = new BN(10).pow(new BN(12));
	const rnd12 = Math.floor(Math.random() * TRILLION.toNumber());
	// muln(rnd12) cannot be used with big ints due to undocumented BN.js
	// check that multiplier doesn't exceed 0x4000000
	// using mul(new BN(rnd12)) instead of muln(rnd12)
	return from.add(range.mul(new BN(rnd12)).div(TRILLION));
}

// sums up an array of BNs, returns BN
function sum_bn(array) {
	return array.reduce((accumulator, currentVal) => accumulator.add(new BN(currentVal)), new BN(0));
}

// sums up an array of numbers, returns Number (or whatever inputs are)
function sum_n(array) {
	return array.reduce((accumulator, currentVal) => accumulator + currentVal, new BN(0));
}

// user friendly big number printer
function print_amt(amt, dm = new BN(10).pow(new BN(18))) {
	// convert inputs to BNs if they are not BNs
	amt = new BN(amt);
	dm = new BN(dm);

	if(amt.isZero()) {
		return '0';
	}
	const THOUSAND = new BN(1_000);
	const MILLION = new BN(1_000_000);
	if(amt.div(dm).lt(THOUSAND)) {
		return amt.div(MILLION).toNumber() / dm.div(MILLION).toNumber() + '';
	}
	const k = amt.div(dm).toNumber() / 1000;
	return k + "k";
}

// graphically draw amounts array as a string to be printed in the consoles
// example: [..|.........|................|..........|...||...............|...........................|...|......]
function draw_amounts(amounts) {
	const total_amount = sum_bn(amounts);
	if(total_amount.isZero()) {
		return "[" + ".".repeat(100) + "]";
	}

	let s = "[";
	let remainder = new BN(0);
	for(let amount of amounts) {
		const skip = amount.add(remainder).muln(100).div(total_amount);
		remainder = amount.add(remainder).sub(skip.mul(total_amount).divn(100));
		if(!skip.isZero()) {
			for(let i = 0; i < skip.toNumber() - 1; i++) {
				s += ".";
			}
			s += "|";
		}
	}
	s += "]";
	return s;
}

// prints a value using "*" (asterisk) if its defined and is not zero, or using " " (whitespace) otherwise
function print_bool(bool) {
	return bool? "*": " ";
}
// prints values one by one, placing "*" (asterisk) instead of defined non-zero values
// and " " (whitespace) instead of undefined or zero values
function print_booleans(arr) {
	return arr.map(s => print_bool(s)).join("");
}

// prints a value using one of the following symbols:
// " " (zero),
// "^" (non-zero),
// "." (more than 10% of max),
// "+" (more than 50% of max),
// "*" (max),
// "!" (bigger than max)
function print_symbol(amt, max = amt) {
	// convert inputs to BNs if they are not BNs
	amt = new BN(amt);
	max = new BN(max);

	if(amt.isZero()) {
		return " ";
	}
	if(amt.eq(max)) {
		return "*";
	}
	if(amt.gt(max)) {
		return "!";
	}
	if(amt.lte(max.divn(10))) {
		return ".";
	}
	if(amt.lte(max.divn(2))) {
		return "+";
	}
	return "^";
}
// prints values one by one, placing " ", ".", "+", "*", or "!" instead of the values
function print_symbols(arr, arr_max = new Array(arr.length).fill(arr.reduce((a, v) => a.gte(v)? a: v, new BN(0)))) {
	return arr.map((r, i) => print_symbol(r, arr_max[i])).join("");
}

// export the constants
module.exports = {
	BN,
	toBN,
	isBN,
	random_bn,
	sum_bn,
	sum_n,
	print_amt,
	draw_amounts,
	print_booleans,
	print_symbols,
};
