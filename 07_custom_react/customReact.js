
// what to render, where to render
function customRender(reactElement, container) {
    const domElement = document.createElement(reactElement.type)
    domElement.innerHTML = reactElement.children
    for (const attribute in reactElement.attributes) {
        if (attribute === 'children') continue
        domElement.setAttribute(attribute, reactElement.attributes[attribute])
    }
    container.appendChild(domElement)
}

const reactCompo = {
    type: 'input',
    attributes: {
        type: "text",
        placeholder: 'Enter Your text',
        style: "font-family :serif"
    },
    children: 'this is inner html, which may contain child'
}
const domRoot = document.getElementById('root');
//document.querySelector('#root')

customRender(reactCompo, domRoot)