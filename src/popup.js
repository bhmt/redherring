import storage from "./storage";

class Popup {
    constructor() {
        this.id = "rh_info_div";
        this.offset = 15;
    }

    _fmt(url) {
        if (url == undefined) {
            return ''
        }

        try {
            let host = url.hostname.split(".").slice(-2);
            let h = `${host[0]}.${host[1]}`
            return h
        } catch (error) {
            console.log("Could not format hostname:", url.hostname)
        }

        return ''
    }

    _url(href) {
        let url = undefined;

        try {
            url = new URL(href);
        } catch (error) {
            console.log("Could not parse href to url:", href);
        }

        return url;
    }

    _window() {
        let url = this._url(window.location.href);
        return this._fmt(url);
    }

    _link(href) {
        let url = this._url(href);
        let linkFmt = this._fmt(url);
        return [url, linkFmt];
    }

    get() {
        return document.getElementById(this.id);
    }

    async create(href) {
        let popup = this.get();
        if (popup) return;

        let [url, linkFmt] = this._link(href);
        if (url === undefined) return;

        let windowFmt = this._window();
        if (linkFmt === windowFmt) return;

        let whitelist = await storage.get_whitelist();
        if (whitelist.includes(linkFmt)) {
            this.destroy();
            return;
        }

        const protocol = url.protocol;
        const hostname = url.hostname;

        const protocolDisplay = protocol !== 'https:' ? `<strong>${protocol.slice(0, -1)}</strong>://` : '';
        const formattedHostname = hostname.split('').map(char => {
            if (!/[a-zA-Z.]/.test(char)) {
                return `<span class="suspicious">${char}</span>`;
            }
            return char;
        }).join('');

        popup = document.createElement('div');
        popup.id = this.id;
        popup.innerHTML = `${protocolDisplay}${formattedHostname}`;
        document.body.appendChild(popup);
    }

    destroy() {
        let popup = this.get()
        if (!popup) return;
        popup.remove();
    }

    move(event) {
        let popup = this.get();
        if (!popup) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;

        let top = event.clientY + this.offset;
        let left = event.clientX + this.offset;

        if (left + popupWidth > viewportWidth) {
            left = event.clientX - popupWidth - this.offset;
        }

        if (top + popupHeight > viewportHeight) {
            top = event.clientY - popupHeight - this.offset;
        }

        if (top < 0) {
            top = this.offset;
        }
        if (left < 0) {
            left = this.offset;
        }

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
    }
}

const popup = new Popup()
export default popup;
