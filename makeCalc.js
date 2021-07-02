export default function makeCalc(str) {
	let [ numberList, operatorList ] = [ getNumberList(str), getOperatorList(str) ];

	[ numberList, operatorList ] = makeNegation(numberList, operatorList);
	[ numberList, operatorList ] = makeOperation(numberList, operatorList, '%');
	[ numberList, operatorList ] = makeOperation(numberList, operatorList, '/');
	[ numberList, operatorList ] = makeOperation(numberList, operatorList, '*');
	[ numberList, operatorList ] = makeOperation(numberList, operatorList, '+');
	[ numberList, operatorList ] = makeOperation(numberList, operatorList, '-');

	return numberList[0];
}

function makeNegation(numberList, operatorList) {
	const newOperatorList = [];
	const newNumberList = [];

	for(let i = 0; i < numberList.length; i++) {
		if (numberList[i] === null && operatorList[i] === '-') {
			i++;
			newNumberList.push(-numberList[i]);
			newOperatorList.push(operatorList[i]);
		} else {
			newNumberList.push(numberList[i]);
			if (i < operatorList.length) newOperatorList.push(operatorList[i]);
		}
	}
	
	return [ newNumberList, newOperatorList ];
}

function makeOperation(numberList, operatorList, operator) {
	if (operatorList.length === 0) {
		return [ numberList, operatorList ];
	}

	const newOperatorList = [];
	const newNumberList = [];
	
	let opCursor = 0;
	let numCursor = 0;
	let relCursor = 0;
	let accumulator = null;

	while(opCursor < operatorList.length) {
		if (operatorList[opCursor] === operator) {
			if (numCursor === opCursor) {
				accumulator = numberList[numCursor];
			}

			relCursor++;

			switch (operator) {
				case '+': accumulator += numberList[numCursor+relCursor]; break;
				case '-': accumulator -= numberList[numCursor+relCursor]; break;
				case '*': accumulator *= numberList[numCursor+relCursor]; break;
				case '%': accumulator %= numberList[numCursor+relCursor]; break;
				case '/': accumulator /= numberList[numCursor+relCursor]; break;
			}

			if (numCursor + relCursor === numberList.length - 1) newNumberList.push(accumulator);

		} else {
			newOperatorList.push(operatorList[opCursor]);

			if (numCursor < opCursor) {
				newNumberList.push(accumulator);
				numCursor = opCursor; 							// Update the absolute numeric cursor.
				relCursor = 0;									// Reset the relative cursor.
				accumulator = null;								// Reset accumulator.
			} else {
				newNumberList.push(numberList[numCursor]);
			}

			numCursor++;
			if (numCursor === numberList.length - 1) newNumberList.push(numberList[numCursor]);
		}

		opCursor++;
	}

	return [ newNumberList, newOperatorList ];
}

function getNumberList(str) {
	return str.split(/[\*\/\%\+\-]/).map((item) => {
		if(item === "") {
			return null;
		} else {
			return parseFloat(item);
		}
	});
}

function getOperatorList(str) {
	return str.split(/\d*\.?\d*/).filter((item) => {
		if(item !== "") return item;
	});
}
