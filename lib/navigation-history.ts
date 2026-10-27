// Counts client-side page views in this tab so "Back" buttons can tell
// whether the previous page belongs to this site.
let pageViews = 0;

export function recordPageView() {
  pageViews += 1;
}

export function hasInAppHistory() {
  return pageViews > 1;
}
