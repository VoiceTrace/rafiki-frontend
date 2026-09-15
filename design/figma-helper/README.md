# Create the wireframes in Figma

Use **code.js** to generate the 34 desktop wireframes as native editable text, shapes, named sections and navigation hotspots. It creates a new page and leaves existing pages alone. The generated data and code are self-contained and request no network access.

## Browser-only option

Drag the SVG files from ../wireframes onto a Figma Design canvas. These are vector wireframes; imported text handling varies. Drag PNG files from ../boards onto a separate reference page for visual direction. SVG import does not install the prototype connections.

## Native frames and prototype links

Local plugin development requires the Figma desktop app. Create a new development plugin using Plugins → Development → New plugin, select Figma Design, and save its generated files. See [Figma's official quickstart](https://developers.figma.com/docs/plugins/plugin-quickstart-guide/).

1. Copy this folder's code.js into that generated plugin folder.
2. In the generated manifest.json, keep the **id assigned by Figma**, set main to code.js, editorType to ["figma"], documentAccess to "dynamic-page", and networkAccess to {"allowedDomains":["none"]}. The manifest.template.json in this folder shows these fields. Its placeholder ID is not an installable plugin ID.
3. Run the plugin by its name under Plugins → Development.
4. Open frame T01 for the teacher journey or S01 for the student journey, and use Figma's Present control. The helper adds the mapped navigation hotspots; detailed forms remain visual wireframes.

The helper uses the [documented Figma manifest fields](https://developers.figma.com/docs/plugins/manifest/) and [prototype reactions API](https://developers.figma.com/docs/plugins/api/properties/nodes-reactions/).

## Scope and troubleshooting

This helper does not reproduce the raster boards as editable artwork. It imports the simpler, consistent wireframes.

Native text uses Inter for body copy and Nunito ExtraBold for headings when available; unavailable font variants fall back to Inter Regular. The input HTML uses Nunito and Inter.

The helper is syntax-checked and tested against a simulated API, not a live Figma runtime. If it fails, the message identifies the error and a new page may contain partial output. Existing pages are not edited. Re-running creates another page.

The frame layout uses fixed desktop coordinates. Converting it to an auto-layout component library and implementing all form state transitions remains Figma assembly work.

