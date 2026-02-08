
let buttons = document.querySelectorAll("li")
let screen = document.querySelector(".display")

let js_evaluatable = (string)=>{
    return string = string.replace(/√\(/,"Math.sqrt(")
                    .replace(/log\(/,"Math.log10(")
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        if (screen.textContent.trim() === "Welcome"||screen.textContent.trim()==="Syntax Error") {
            screen.textContent = ""
        }
        switch (button.textContent) {
            case "AC":
                screen.textContent = ""
                break;
            case "=":
                try {
                    let expresion = js_evaluatable(screen.textContent)
                    let result = new Function('return ' + expresion)()
                    screen.textContent = screen.textContent != "" ? result : "";
                }
                catch {
                    screen.textContent = "Syntax Error"
                }
                break;
            case "(":
                let last_character = screen.textContent.trim().slice(-1)
                if (/[0-9)]/.test(last_character)) {
                    screen.textContent += "*"
                }
                screen.textContent += "("
                break;
            case "Del":
                let length = screen.textContent.length
                screen.textContent[length-2]=="g"?
                screen.textContent =screen.textContent.slice(0,-4):
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