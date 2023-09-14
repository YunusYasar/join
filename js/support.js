/**
 * Attempts to close the current tab. If unsuccessful, prompts the user to manually close the tab.
 */
function closeTab() {
  window.close();
    if (!newTab || newTab.closed || typeof newTab.closed == "undefined") {
    alert("Link wurde in einem neuen Tab geöffnet. Schließen Sie diesen Tab manuell.");
  }
}