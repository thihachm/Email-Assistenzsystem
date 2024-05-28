ChromeUtils.defineModuleGetter(this,"ExtensionSupport","resource:///modules/ExtensionSupport.jsm");var{XPCOMUtils}=ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm"),{ExtensionCommon}=ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm"),{ExtensionUtils}=ChromeUtils.import("resource://gre/modules/ExtensionUtils.jsm"),{promiseEvent}=ExtensionUtils,{makeWidgetId,ExtensionAPI}=ExtensionCommon;XPCOMUtils.defineLazyGetter(this,"standaloneStylesheets",(()=>{let e=[],{AppConstants:t}=ChromeUtils.import("resource://gre/modules/AppConstants.jsm");return"macosx"===t.platform?e.push("chrome://browser/content/extension-mac-panel.css"):"win"===t.platform?e.push("chrome://browser/content/extension-win-panel.css"):"linux"===t.platform&&e.push("chrome://browser/content/extension-linux-panel.css"),e})),this.calendarItemDetails=class extends ExtensionAPI{async _attachBrowser(e){let t,n=e.ownerDocument.createXULElement("browser");n.setAttribute("flex","1"),n.setAttribute("type","content"),n.setAttribute("disableglobalhistory","true"),n.setAttribute("messagemanagergroup","webext-browsers"),n.setAttribute("transparent","true"),n.setAttribute("class","webextension-popup-browser"),n.setAttribute("webextension-view-type","subview"),n.setAttribute("initialBrowsingContextGroupId",this.extension.policy.browsingContextGroupId),this.extension.remote&&(n.setAttribute("remote","true"),n.setAttribute("remoteType",this.extension.remoteType),n.setAttribute("maychangeremoteness","true")),t=this.extension.remote?promiseEvent(n,"XULFrameLoaderCreated"):promiseEvent(n,"load"),e.appendChild(n),this.extension.remote||n.contentwindow;let s=[];this.extension.manifest.calendar_item_details.browser_style&&s.push(...ExtensionParent.extensionStylesheets),s.push(...standaloneStylesheets);const i=()=>{ExtensionParent.apiManager.emit("extension-browser-inserted",n);let e=n.messageManager;e.loadFrameScript("chrome://extensions/content/ext-browser-content.js",!1,!0),e.sendAsyncMessage("Extension:InitBrowser",{allowScriptsToClose:!0,blockParser:!1,maxWidth:800,maxHeight:600,stylesheets:s})};return n.addEventListener("DidChangeBrowserRemoteness",i),t.then((()=>{i(),n.loadURI(this.extension.manifest.calendar_item_details.default_content,{triggeringPrincipal:this.extension.principal})}))}onLoadCalendarItemPanel(e,t,n,s){let i=t(n,s);return this.extension.manifest.calendar_item_details&&e.document.getElementById(n||"calendar-item-panel-iframe").contentWindow.addEventListener("load",(e=>{let t=e.target.ownerGlobal.document;console.log(this.extension.manifest.calendar_item_details);let n=makeWidgetId(this.extension.id),s=t.getElementById("event-grid-tabs"),i=t.createXULElement("tab");s.appendChild(i),i.setAttribute("label",this.extension.manifest.calendar_item_details.default_title),i.setAttribute("id",n+"-calendarItemDetails-tab"),i.setAttribute("image",this.extension.manifest.calendar_item_details.default_icon),i.querySelector(".tab-icon").style.maxHeight="19px";let o=t.getElementById("event-grid-tabpanels"),r=t.createXULElement("tabpanel");o.appendChild(r),r.setAttribute("id",n+"-calendarItemDetails-tabpanel"),r.setAttribute("flex","1"),this._attachBrowser(r)})),i}onStartup(){let e=this.extension.manifest?.calendar_item_details;if(e){let t=this.extension.localize.bind(this.extension);e.default_icon&&(e.default_icon=this.extension.getURL(t(e.default_icon))),e.default_content&&(e.default_content=this.extension.getURL(t(e.default_content))),e.default_title&&(e.default_title=t(e.default_title))}ExtensionSupport.registerWindowListener("ext-calendarItemDetails-"+this.extension.id,{chromeURLs:["chrome://messenger/content/messenger.xhtml","chrome://calendar/content/calendar-event-dialog.xhtml"],onLoadWindow:e=>{let t=e.onLoadCalendarItemPanel;e.onLoadCalendarItemPanel=this.onLoadCalendarItemPanel.bind(this,e,t.bind(e))}})}onShutdown(){ExtensionSupport.unregisterWindowListener("ext-calendarItemDetails-"+this.extension.id)}getAPI(e){return{calendar:{itemDetails:{}}}}};