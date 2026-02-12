import examples from './exercise15-1.js';


function integrate(obj, indvar) {
    if (!obj?.numi?.terms) return obj;

    for (let term of obj.numi.terms) {
        let power = term.var?.[indvar];
        if (power === undefined) continue; // skip if variable not present
        term.coeff /= (power + 1);
        term.var[indvar] += 1;
    }

    return obj;
}

function definiteIntegrate(obj, lower, upper, indvar) {
    if (!obj?.numi?.terms) return obj;

    for (let term of obj.numi.terms) {
        let power = term.var[indvar] ?? 0;
        let coeff = term.coeff / (power + 1);
        let upperVal = Math.pow(upper, power + 1);
        let lowerVal = Math.pow(lower, power + 1);
        term.coeff = coeff * (upperVal - lowerVal);
        delete term.var[indvar];
    }

    return obj;
}
console.log(JSON.stringify(definiteIntegrate(definiteIntegrate(examples[3][0], 1, -1, 'y'), 0, -1, 'x'), null, 2));


// Exercise 15.1 Ques1
// console.log(JSON.stringify(definiteIntegrate(definiteIntegrate(examples[0], 4, 0, 'y'), 2, 1, 'x'), null, 2));

// Exercise 15.1 Ques2
// console.log(JSON.stringify(definiteIntegrate(definiteIntegrate(examples[1], 1, -1, 'y'), 2, 0, 'x'), null, 2));