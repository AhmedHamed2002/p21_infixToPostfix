// Global variables
let infix = [];
let postfix = [];
let lookahead = 0;

// Helper functions
function match(s) {
    if (s === infix[lookahead]) lookahead++;
}

function factor() {
    let sign = 1;
    while (infix[lookahead] === "+" || infix[lookahead] === "-") {
        sign *= infix[lookahead] === "-" ? -1 : 1;
        lookahead++;
    }
    if (sign === -1) postfix.push("-1");
    if (infix[lookahead] === "(") {
        match("(");
        expr();
        match(")");
        if (sign === -1) postfix.push("*");
        return;
    }
    if (!/^[0-9]+$/.test(infix[lookahead])) throw "Error in factor";

    postfix.push(infix[lookahead]);
    if (sign === -1) postfix.push("*");
    lookahead++;
}

function term() {
    factor();
    while (true) {
        if (lookahead === infix.length) return;
        else if (infix[lookahead] === "*") {
            match("*");
            factor();
            postfix.push("*");
        } else if (infix[lookahead] === "/") {
            match("/");
            factor();
            postfix.push("/");
        } else return;
    }
}

function expr() {
    term();
    while (true) {
        if (lookahead === infix.length) return;
        else if (infix[lookahead] === "+") {
            match("+");
            term();
            postfix.push("+");
        } else if (infix[lookahead] === "-") {
            match("-");
            term();
            postfix.push("-");
        } else return;
    }
}

function compute() {
    let numbers = [];
    postfix.forEach((x) => {
        if (x === "+") {
            let two = numbers.pop();
            let one = numbers.pop();
            numbers.push(one + two);
        } else if (x === "-") {
            let two = numbers.pop();
            let one = numbers.pop();
            numbers.push(one - two);
        } else if (x === "*") {
            let two = numbers.pop();
            let one = numbers.pop();
            numbers.push(one * two);
        } else if (x === "/") {
            let two = numbers.pop();
            let one = numbers.pop();
            numbers.push(one / two);
        } else {
            numbers.push(parseInt(x));
        }
    });
    return numbers[numbers.length - 1];
}

function getTokens(s) {
    let tokens = [];
    s = s.replace(/\s+/g, "");
    let temp = "";
    let isNumber = false;

    for (let char of s) {
        if (/^[0-9]$/.test(char) && isNumber) {
            temp += char;
            continue;
        } else {
            isNumber = /^[0-9]$/.test(char);
            if (temp.length) tokens.push(temp);
            temp = "";
        }
        temp += char;
    }
    if (temp.length) tokens.push(temp);

    return tokens;
}

function main() {
    const input = document.getElementById("expression").value;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results

    try {
        // Tokenize input and process expression
        infix = getTokens(input);
        postfix = [];
        lookahead = 0;
        expr();

        // Display tokens with < > brackets
        const tokenDisplay = infix.map(token => `&lt;${token}&gt;`).join(" ");
        resultsDiv.innerHTML += `<p class="text-white"><strong class="text-success fs-5 me-2">Tokens:</strong> <span class='b'>${tokenDisplay}</span></p>`;

        // Display postfix notation
        const postfixString = postfix.join(" ");
        const result = compute();

        resultsDiv.innerHTML += `<p class="text-white"><strong class="text-success fs-5 me-2">Postfix:</strong> <span class='b'>${postfixString}</span></p>`;
        resultsDiv.innerHTML += `<p class="text-white"><strong class="text-success fs-5 me-2">Result:</strong><span class='b'> ${result}</span></p>`;

        // Calculate additional metrics
        const n = input.length;
        const prefixes = n + 1;
        const suffixes = n + 1;
        const properPrefixes = n;
        const substrings = (n * (n + 1)) / 2;
        const subsequences = Math.pow(2, n);

        // Display calculated values
        resultsDiv.innerHTML += `<p class="text-white"><strong class="text-success fs-5 me-2">Number of prefixes:</strong> <span class='b'> ${prefixes}</span></p>`;
        resultsDiv.innerHTML += `<p class="text-white"><strong class="text-success fs-5 me-2">Number of suffixes:</strong> <span class='b'>${suffixes}</span></p>`;
        resultsDiv.innerHTML += `<p class="text-white"><strong class="text-success fs-5 me-2">Number of proper prefixes:</strong> <span class='b'>${properPrefixes}</span></p>`;
        resultsDiv.innerHTML += `<p class="text-white"><strong class="text-success fs-5 me-2">Number of substrings:</strong><span class='b'> ${substrings}</span></p>`;
        resultsDiv.innerHTML += `<p class="text-white"><strong class="text-success fs-5 me-2">Number of subsequences:</strong><span class='b'> ${subsequences}</span></p>`;

        // Display prefixes
        let  box1 =  "" ; 
        resultsDiv.innerHTML += `<h3 class="text-success pt-4 pb-2">Prefixes of the string "${input}":</h3>`;
        for (let i = 0; i <= n; i++) {
            box1 += `<p class="text-white px-3 ">${input.substring(0, i)}</p>`;
        }
        box1 += `<p class="text-white px-3">null</p>`;
        resultsDiv.innerHTML += `<div class='over'>${box1}</div>`  ; 

        // Display suffixes
        let box2 ="";
        resultsDiv.innerHTML += `<h3 class="text-success pt-4 pb-2">Suffixes of the string "${input}":</h3>`;
        for (let i = 0; i < n; i++) {
            box2 += `<p class="text-white px-3">${input.substring(i)}</p>`;
        }
        box2 +=`<p  class="text-white px-3">null</p>`;
        resultsDiv.innerHTML += `<div class='over'>${box2}</div>`  ; 
        // resultsDiv.innerHTML += `<p  class="text-white px-3">null</p>`;

    } catch (error) {
        resultsDiv.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
    }
}