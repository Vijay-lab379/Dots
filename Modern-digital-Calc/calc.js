
let buttons = document.querySelectorAll("li")
let screen = document.querySelector(".display")

let js_evaluatable = (string) => {

    // √, log logic 
    string = string.replace(/√\(/g, "Math.sqrt(")
        .replace(/(\d)\(/g, "$1*(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/\)(\d)/g, ")*$1")
        .replace(/\)\(/g, ")*(");

    return string
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        if (screen.textContent.trim() === "Welcome" || screen.textContent.trim() === "Syntax Error") {
            screen.textContent = ""
        }
        switch (button.textContent) {
            case "AC":
                screen.textContent = ""
                break;
            case "=":
                try {
                    console.log("Original:", screen.textContent);
                    let expresion = js_evaluatable(screen.textContent)
                    console.log("Converted:", expresion);
                    let result = new Function('return ' + expresion)()
                    console.log("Result:", result);
                    screen.textContent = screen.textContent != "" ? result : "";
                }
                catch {
                    screen.textContent = "Syntax Error"
                }
                break;
            case "Del":
                let length = screen.textContent.length
                screen.textContent[length - 2] == "g" ?
                    screen.textContent = screen.textContent.slice(0, -4) :
                    screen.textContent[length - 2] == "√" ?
                        screen.textContent = screen.textContent.slice(0, -2) :
                        screen.textContent = screen.textContent.slice(0, -1);
                break;
            case "√":
                screen.textContent += "√("
                break;
            case "log":
                screen.textContent += "log("
                break;
            default:
                screen.textContent += button.textContent
        }
    })
})