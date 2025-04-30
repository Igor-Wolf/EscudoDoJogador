
function rollf(rolling) {
    try {
        let string = "";
        let dices = rolling.split(/\s*[+-]\s*/);
        let num = 0;
        let operation = [];
        let result = 0;
        let count = 0;
        
        // Operations verifications
        for (let item of rolling) {
            if (item === "+" || item === "-") {
                operation.push(item);
            }
        }
        
        // Random functions
        for (let item of dices) {
            if (count <= operation.length) {
                // Positive
                if (count === 0 || operation[count - 1] === "+") {
                    let dice = item.split(/\s*[dD]\s*/);
                    if (item.includes("D") || item.includes("d")) {
                        if (dice[0] === "") {
                            let value = Math.floor(Math.random() * parseInt(dice[1])) + 1;
                            string += "( " + value + " )";
                            result += value;
                        } else {
                            for (let i = 0; i < parseInt(dice[0]); i++) {
                                let value = Math.floor(Math.random() * parseInt(dice[1])) + 1;
                                if (i === 0) {
                                    string += "( " + value;
                                } else {
                                    string += " + " + value + " ";
                                }
                                num += value;
                            }
                            string += ")";
                            result += num;
                        }
                    } else {
                        string += "( " + item + " )";
                        result += parseInt(item);
                    }
                // Negative
                } else if (count !== 0 && operation[count - 1] === "-") {
                    let dice = item.split(/\s*[dD]\s*/);
                    if (item.includes("D") || item.includes("d")) {
                        if (dice[0] === "") {
                            let value = Math.floor(Math.random() * parseInt(dice[1])) + 1;
                            string += "( " + value + " )";
                            result -= value;
                        } else {
                            for (let i = 0; i < parseInt(dice[0]); i++) {
                                let value = Math.floor(Math.random() * parseInt(dice[1])) + 1;
                                if (i === 0) {
                                    string += "( " + value;
                                } else {
                                    string += " + " + value + " ";
                                }
                                num += value;
                            }
                            string += ")";
                            result -= num;
                        }
                    } else {
                        string += "( " + item + " )";
                        result -= parseInt(item);
                    }
                }
                
                if (count < operation.length) {
                    string += " " + operation[count] + " ";
                    count++;
                }
                num = 0;
            }
        }
        string += " = " + result;
        return string;
    } catch (error) {
        console.log("Input Error: Data needs to be in string format and structured like 1d5 + 2d5 - 5");
    }
}

export {rollf} 