# Second website — corporate design

Public path: `/vs-reclama/reklama-pro/`.
Original site remains at `/vs-reclama/reklama-2/` and is not modified by this version.

All 35 public pages, their content, catalog data, galleries and request-form logic
were carried across from the original. Navigation between pages stays within this
directory. Images/fonts are intentionally shared from `../reklama-2/assets/`;
do not remove that asset directory while either site uses it.

New presentation: `corporate-theme.css`, `corporate-home.css`, `corporate.js`.
Existing component styles and JavaScript are independent copies, not shared with
the original website. Changes here do not change the first site's behavior.

The second version is `noindex,follow` during comparison to avoid indexing a
duplicate set of pages. Remove that meta tag only when choosing it as the primary
public version. Email sending is intentionally not connected: forms prepare a
message that visitors can copy, save, or open in their email app.
