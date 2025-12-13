import os
import sys

from version import __version__

__manifest__ = """{{
    "manifest_version": 3,
    "name": "Red Herring Phishing Indicator",
    "version": "{version}",
    "description": "Indicate possible phishing links.",
    "icons": {{
        "16": "{icon16}",
        "32": "{icon32}",
        "48": "{icon48}",
        "180": "{icon180}",
        "192": "{icon192}",
        "512": "{icon512}"
    }},
    "content_scripts": [
        {{
            "matches": [
                "*://*/*"
            ],
            "js": [
                "redherring.js"
            ],
            "css": [
                "popup.css"
            ]
        }}
    ],
    "permissions": [
        "storage"
    ],
    "action": {{
        "default_icon": "{icon512}",
        "default_title": "Red Herring",
        "default_popup": "ui.html"
    }},
    "browser_specific_settings": {{
        "gecko": {{
            "id": "redherring@bhmt"
        }}
    }}
}}
"""


def _manifest_mozilla() -> str:
    icon = "icons/redherring.svg"

    return __manifest__.format(
        version=__version__,
        icon16=icon,
        icon32=icon,
        icon48=icon,
        icon180=icon,
        icon192=icon,
        icon512=icon,
    )


def _manifest_chrome() -> str:
    icon = "icons/redherring{}.png"

    return __manifest__.format(
        version=__version__,
        icon16=icon.format("16"),
        icon32=icon.format("32"),
        icon48=icon.format("48"),
        icon180=icon.format("180"),
        icon192=icon.format("192"),
        icon512=icon.format("512"),
    )


def _get_manifest(browser="mozilla"):
    return {
        "mozilla": _manifest_mozilla,
        "chrome": _manifest_chrome,
    }.get(browser)


def manifest(browser: str):
    manifest = _get_manifest(browser)
    content = manifest()

    with open(os.path.join("public", "manifest.json"), "w") as f:
        f.write(content)


if __name__ == "__main__":
    browser = sys.argv[-1]
    manifest(browser)
