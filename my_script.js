var el = document.createElement("script");
el.textContent = "if (top !== self) {window.self = window.top;}";
document.documentElement.appendChild(el);
