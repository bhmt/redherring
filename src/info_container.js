import storage from "./storage";
import URLWrapper from "./url_wrapper";

const green =  "#519755";
const red = "#E65447";
const yellow = "#FFE642";
const normal = "#27445C";

const _style = {
    zIndex: "10000000",
    display: "flex",
    position : "fixed",
    marginLeft : "auto",
    marginRight : "auto",
    alignItems: "center",
    justifyContent: "center",
    padding: "0px 5px",
    borderRadius: "5px",
    top : "5px",
    height : "22px",
    fontSize : "13px",
    color: "white",
    fontFamily : "Arial,sans-serif",
};


export default class InfoContainer {
    constructor () {
        this.id = "rh-info-container";
        this.style = _style;
    }

    _span(text) {
        let span = document.createElement("span");
        span.textContent = text;
        return span;
    }

    _error(text) {
        let span = this._span(text);
        span.style.background = red;
        span.style.color = "white";
        return span;
    }

    _warn(text) {
        let span = this._span(text);
        span.style.color = yellow;
        return span;
    }

    _default() {
        let container = document.createElement("div");
        container.id = this.id;
        Object.assign(container.style, this.style);
        return container;
    }

    _create(url, is_whitelisted, clientX, clientY) {
        let container = this._default();

        container.style.background = is_whitelisted ? green : normal

        let cover_vertical = clientY <= 27;
        let cover_horizontal = clientX <= window.innerWidth / 2;
        let side = cover_vertical && cover_horizontal ? "right" : "left";
        container.style[side] = "5px";

        url.forEach(element => {
            let [color, part] = element;
            if (color === "warn") {
                container.append(this._warn(part));
            } else if (color === "error") {
                container.append(this._error(part));
            } else {
                container.append(part);
            }
        });
    
        return container;
    }

    hide() {
        let container = document.getElementById(this.id);
        if (container)
            container.remove();
    }

    async show(anchor, clientX, clientY) {
        let url_wrapper = new URLWrapper(anchor)
        let [domain, url] = url_wrapper.parse();
        if (domain === null) {
            return;
        }

        let whitelist = await storage.get_whitelist();
        let is_whitelisted = whitelist.includes(domain);
        let container = this._create(url, is_whitelisted, clientX, clientY);
        document.body.appendChild(container);
    };
}
