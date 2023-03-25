import InfoContainer from "./info_container";

let view = new InfoContainer()
let tag = "a";

document.addEventListener("mouseover", async (event) => {
    view.hide();
    if (!event.target) {
        return;
    }
    
    if (event.target.tagName.toLowerCase() === tag) {
        await view.show(event.target.href, event.clientX, event.clientY);
        return;
    }
    
    let parent = event.target.closest(tag);
    if (parent) {
        await view.show(parent.href, event.clientX, event.clientY);
    }
});

document.addEventListener("mouseout", (_) => {
    view.hide();
});
