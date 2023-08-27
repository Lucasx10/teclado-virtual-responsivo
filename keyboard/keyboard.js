var caixa = document.querySelectorAll(".use-keyboard-input")

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    content: {
        value: "",
        capsLock: false,
    },

    init() {
        // Criar elementos principais "main"
        this.elements.main = document.createElement("div")
        this.elements.keysContainer = document.createElement("div")

        // Adicionar as classes css
        this.elements.main.classList.add("keyboard", "keyboard--hidden")
        this.elements.keysContainer.classList.add("keyboard__keys")
        this.elements.keysContainer.appendChild(this._createKeys())

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key")

        // Adicionar ao DOM 
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main)

        // Colocar conteudo na caixa de texto
        caixa.forEach(element => {
            element.addEventListener("focus", () => {
                Keyboard.open(element.value, currentValue => {
                        element.value = currentValue;
                });
            });
        });
    },

    _createKeys() {
        // Como criar todas as teclas
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // Criar HTML Icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        }

        keyLayout.forEach( (key) => {
            const keyElement = document.createElement("button");
            keyElement.textContent = key;

            // Adição de atributos e classes especificas
            keyElement.setAttribute("type", "button")
            keyElement.classList.add("keyboard__key")

            // Casos de teclas especiais
            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.content.value = this.content.value.substring(0, this.content.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extrawide");
                    keyElement.innerHTML = createIconHTML("space_bar"); // Adiciona o ícone do espaço
                    
                    keyElement.addEventListener("click", () => {
                        this.content.value += " "; // Adicionar espaço ao valor
                        this._triggerEvent("oninput");
                    });

                    break;
                
                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.content.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;
                
                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toogleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.content.capslock);
                    });

                    break;
                    
                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.content.value += this.content.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            // Adição final das teclas
            fragment.appendChild(keyElement);

            // Colocar quebra de linha depois dessas teclas
            if (key == "backspace" || key == "p" || key == "enter" || key == "?") {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.content.value);
        }
    },

    open(initialValue, oninput, onclose) {
        this.content.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.content.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    },

    _toogleCapsLock() {
        this.content.capsLock = !this.content.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.content.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();

});