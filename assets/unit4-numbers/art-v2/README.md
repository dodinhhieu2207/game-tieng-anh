# Lesson 4 raster interaction kit

Created with built-in OpenAI imagegen, then separated into individual transparent PNG sprites by tools/extract_unit4_numbers_art.cjs. Approved backgrounds, vocabulary pictures, App Outfit font and Higgs voices retained.

Prompt set: four isolated 2x2 transparent sprite sheets, no text or scene, mint enamel / warm brass / cream, softly painted dimensional preschool mobile game artwork. Garden: cute golden firefly body with face and antennae (no wings), one separate translucent mint wing, glowing garden lantern, empty collection socket. Lift: backless cabin frame with transparent center, one door panel, lever, indicator. Belt: conveyor chassis, round roller, diverter paddle, collection tray. Repair: unlit lantern, empty repair socket, blank button and blank mission plaque. Lift and repair sheets received imagegen alpha-cleanup edits to remove white background and grid lines while retaining opaque object interiors.

Cell crops are recorded in extraction source. Cropping/alpha trimming and frame fitting are export operations; drawing is generated artwork. Cabin and panel are UI frames normalized to their runtime rectangles. Wing and body retain separate pivots. Old native SVG kit is retained as historical source; art-v2 PNGs are used by live renderer and DOM controls.

Runtime placement: body/wing in Firefly containers; lanterns in garden progress and Repair; off lantern in Repair and lift floor indicators; cabin/door/lever in Lift; belt/roller/diverter/tray in Belt; ten-slot in DOM counters; repair-slot in Repair canvas; control and plaque use CSS image borders so text remains live and readable.
