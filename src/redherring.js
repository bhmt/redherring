import popup from "./popup";

const tag = 'a';

document.addEventListener("mouseover", async (event) => {
    if (!event.target) {
        return;
    }

    if (event.target.tagName.toLowerCase() === tag) {
        await popup.create(event.target.href)
        return
    }

    let parent = event.target.closest(tag);
    if (parent) {
        await popup.create(parent.href)
    }
})

document.addEventListener('mousemove', (event) => popup.move(event))
document.addEventListener('mouseout', () => popup.destroy())
