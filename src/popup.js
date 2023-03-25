import storage from "./storage";

class Popup {
    constructor() {
        this.id = "rh_info_div";
        this.offset = 15;
    }

    get() {
        return document.getElementById(this.id);
    }

    async create(href) {
        let popup = this.get();
        if (popup) return;

        let url = undefined
        try {
            url = new URL(href);
        } catch (error) {
            console.log("Could not parse URL:", href);
            return;
        }

        let whitelist = await storage.get_whitelist();

        let _host = url.hostname.split(".");
        let domain = _host[_host.length - 2];
        let tld = _host[_host.length - 1];

        if (whitelist.includes(`${domain}.${tld}`)) {
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
