chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == 'showPageAction') {
        if (sender)
            chrome.pageAction.show(sender.tab.id);
    }
});
