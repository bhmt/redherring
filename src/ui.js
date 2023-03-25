import storage from "./storage";

const rh_whitelist_storage_id = "rh-whitelist-storage-id";

document.getElementById(rh_whitelist_storage_id).addEventListener("input", (_) => {
    let whitelist_text_box = document.getElementById(rh_whitelist_storage_id);
    if (!whitelist_text_box)
        return

    let whitelist = whitelist_text_box.value
        .split("\n")
        .filter(link => link)
        .map(link => link.trim());

    storage.set_whitelist(whitelist);
});

document.addEventListener("DOMContentLoaded", () => {
    storage.get_whitelist()
        .then(
            data => {
                if (data.length === 0) {
                    return;
                }

                let whitelist_text_box = document.getElementById(rh_whitelist_storage_id);
                whitelist_text_box.value = data.join("\n");
            }
        ).catch(err => console.log(err));
});

const tabs = document.querySelectorAll(".rh-tabs li");
const tabContents = document.querySelectorAll(".rh-tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const target = tab.querySelector("a")?.getAttribute("href");
        if (target) {
            tabContents.forEach(tc => {
                tc.classList.remove("active");
                if (tc.getAttribute("id") === target.substring(1)) {
                    tc.classList.add("active");
                }
            });
        }
    });
});
