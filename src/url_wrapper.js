export default class URLWrapper {
    constructor(anchor) {
        this.anchor = anchor;
        this.url = null;
        this.domain = null;

        // proto | user|pass |       host         | port
        //    ssh:guest:guest@subdomain.domain.tld:22
        this.proto = null;
        this.user = [];
        this.pass = [];
        this.host = [];
        this.port = null;
    }

    _is_not_letter = (char) => !"abcdefghijklmnopqrstuvwxyz".includes(char);
    _create_error = (element) => ["error", element];
    _create_warn = (element) => ["warn", element];
    _create_info = (element) => ["info", element];

    _check_section(section) {
        if (section.length === 0) return [];

        let out = [];
        let new_section = 0;
        let special = this._is_not_letter(section[0]);

        for (let i = 1; i < section.length; i++) {
            let current = this._is_not_letter(section[i]);
            if (current === special)
                continue;

            let _part = special
                ? this._create_error(section.slice(new_section, i))
                : this._create_info(document.createTextNode(section.slice(new_section, i)));
            out.push(_part)

            new_section = i;
            special = current;
        }

        let _part = special
            ? this._create_error(section.slice(new_section))
            : this._create_info(document.createTextNode(section.slice(new_section)));
        out.push(_part)

        return out;
    };

    _split() {
        // proto
        this.proto = this.url.protocol === "https:"
            ? this._create_info(document.createTextNode(this.url.protocol))
            : this._create_warn(this.url.protocol);

        // user, pass
        this.user = this._check_section(this.url.username);
        this.pass = this._check_section(this.url.password);

        // host
        let _host = this.url.hostname.split(".");
        let domain = _host[_host.length - 2];
        let tld = _host[_host.length - 1];

        for (let i = 0; i < _host.length - 1; i++) {
            this.host.push(...this._check_section(_host[i]));
            this.host.push(this._create_warn("."));
        }
        this.host.push(this._create_warn(tld));

        // port
        this.port = this._create_warn(this.url.port);

        // domain
        this.domain = `${domain}.${tld}`;
    };

    _join() {
        let userpass = [];
        if (this.user.length !== 0) {
            userpass.push(...this.user);
            userpass.push(this._create_warn(":"));
        }
        if (this.length !== 0 && this.pass.length !== 0) {
            userpass.push(...this.pass);
            userpass.push(this._create_warn("@"));
        }

        return [this.proto, this._create_info(document.createTextNode("//")), ...userpass, ...this.host, this.port];
    };

    parse() {
        try {
            this.url = new URL(this.anchor);
        } catch (e) {
            return [null, null];
        }

        this._split();
        let parts = this._join();
        return [this.domain, parts];
    };
};
