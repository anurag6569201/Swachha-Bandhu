// locations/static/locations/js/map_admin.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("MAP_ADMIN_DEBUG: DOMContentLoaded fired. Script starting.");

    // Check if jQuery is loaded. It's crucial for django.jQuery or window.jQuery to be available.
    if (window.jQuery) {
        console.log("MAP_ADMIN_DEBUG: jQuery detected.");
        (function($) { // Use an IIFE to encapsulate jQuery scope

            // --- 1. Get Element References ---
            // These are your Django model fields
            const latInput = document.getElementById('id_latitude');
            const lonInput = document.getElementById('id_longitude');

            // These are the inputs *within* the MapWidgets overlay that it uses internally
            const mwOverlayLatInput = document.getElementById('location-mw-overlay-latitude');
            const mwOverlayLonInput = document.getElementById('location-mw-overlay-longitude');

            // This is the hidden input field that MapWidgets itself updates with "lat,lng" string
            const mapWidgetHiddenInput = document.getElementById('id_location');

            // Log the status of each element
            console.log("MAP_ADMIN_DEBUG: Element check - id_latitude:", latInput ? "Found" : "NOT FOUND");
            console.log("MAP_ADMIN_DEBUG: Element check - id_longitude:", lonInput ? "Found" : "NOT FOUND");
            console.log("MAP_ADMIN_DEBUG: Element check - location-mw-overlay-latitude:", mwOverlayLatInput ? "Found" : "NOT FOUND");
            console.log("MAP_ADMIN_DEBUG: Element check - location-mw-overlay-longitude:", mwOverlayLonInput ? "Found" : "NOT FOUND");
            console.log("MAP_ADMIN_DEBUG: Element check - id_location (hidden):", mapWidgetHiddenInput ? "Found" : "NOT FOUND");

            // Critical check: If any main elements are missing, stop execution and log error.
            if (!latInput || !lonInput || !mwOverlayLatInput || !mwOverlayLonInput || !mapWidgetHiddenInput) {
                console.error("MAP_ADMIN_ERROR: One or more required input fields not found. Check HTML IDs.");
                // Provide a direct guide for the user
                console.info("MAP_ADMIN_INFO: Please inspect your HTML (F12 -> Elements tab) and verify the IDs 'id_latitude', 'id_longitude', 'location-mw-overlay-latitude', 'location-mw-overlay-longitude', and 'id_location' exist and are correct.");
                return; // Stop script execution
            }

            // --- 2. Define Synchronization Functions ---

            // This function takes values from the MapWidget's internal overlay inputs
            // and copies them to your Django form's latitude/longitude fields.
            function syncOverlayToDjangoFields() {
                const overlayLat = mwOverlayLatInput.value;
                const overlayLon = mwOverlayLonInput.value;

                console.log(`MAP_ADMIN_DEBUG: syncOverlayToDjangoFields called. Overlay Lat: '${overlayLat}', Lon: '${overlayLon}'`);

                if (overlayLat && overlayLon) {
                    latInput.value = parseFloat(overlayLat).toFixed(6);
                    lonInput.value = parseFloat(overlayLon).toFixed(6);
                    console.log(`MAP_ADMIN_DEBUG: Django fields updated to Lat: '${latInput.value}', Lon: '${lonInput.value}' from overlay.`);
                } else {
                    // If overlay fields are empty, clear Django fields too
                    latInput.value = '';
                    lonInput.value = '';
                    console.log("MAP_ADMIN_DEBUG: Overlay fields empty, clearing Django lat/lon fields.");
                }
            }

            // This function takes the combined "lat,lng" string from the hidden map widget input
            // and parses it to update your Django form's latitude/longitude fields.
            function syncHiddenMapWidgetInputToDjangoFields() {
                const locationValue = mapWidgetHiddenInput.value;
                console.log(`MAP_ADMIN_DEBUG: syncHiddenMapWidgetInputToDjangoFields called. Hidden Input Value: '${locationValue}'`);

                if (locationValue) {
                    const parts = locationValue.split(',');
                    if (parts.length === 2) {
                        latInput.value = parseFloat(parts[0]).toFixed(6);
                        lonInput.value = parseFloat(parts[1]).toFixed(6);
                        console.log(`MAP_ADMIN_DEBUG: Django fields updated to Lat: '${latInput.value}', Lon: '${lonInput.value}' from hidden input.`);
                    } else {
                        console.warn(`MAP_ADMIN_WARN: Hidden input value '${locationValue}' is not in 'lat,lng' format.`);
                    }
                } else {
                    latInput.value = '';
                    lonInput.value = '';
                    console.log("MAP_ADMIN_DEBUG: Hidden input empty, clearing Django lat/lon fields.");
                }
            }

            // --- 3. Attach Event Listeners ---

            // Method 1: Observe the hidden `id_location` input for value changes (most reliable for map interaction)
            // This is how MapWidgets communicates the selected point.
            const hiddenInputObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                        console.log("MAP_ADMIN_DEBUG: MutationObserver detected 'value' attribute change on 'id_location'.");
                        syncHiddenMapWidgetInputToDjangoFields();
                    }
                });
            });

            // Start observing the 'id_location' hidden input
            hiddenInputObserver.observe(mapWidgetHiddenInput, {
                attributes: true // Watch for attribute changes
            });
            console.log("MAP_ADMIN_DEBUG: MutationObserver attached to 'id_location'.");

            // Method 2: Listen for changes on the *overlay* latitude/longitude inputs
            // This covers manual edits directly in the overlay coordinate fields.
            $(mwOverlayLatInput).on('change keyup paste', function() {
                console.log("MAP_ADMIN_DEBUG: Change/keyup/paste event on 'location-mw-overlay-latitude'.");
                syncOverlayToDjangoFields();
            });
            $(mwOverlayLonInput).on('change keyup paste', function() {
                console.log("MAP_ADMIN_DEBUG: Change/keyup/paste event on 'location-mw-overlay-longitude'.");
                syncOverlayToDjangoFields();
            });
            console.log("MAP_ADMIN_DEBUG: Change/keyup/paste listeners attached to overlay fields.");

            // --- 4. Initial Synchronization on Page Load ---
            // Give MapWidgets a moment to initialize and populate its fields if editing an existing instance.
            setTimeout(function() {
                console.log("MAP_ADMIN_DEBUG: Initiating initial sync after 500ms delay.");

                // Attempt to sync from the hidden map widget input first
                if (mapWidgetHiddenInput.value) {
                    console.log("MAP_ADMIN_DEBUG: Initial sync from hidden map widget input.");
                    syncHiddenMapWidgetInputToDjangoFields();
                } else if (mwOverlayLatInput.value && mwOverlayLonInput.value) {
                    // Fallback: if hidden input is empty, but overlay fields have values (less common)
                    console.log("MAP_ADMIN_DEBUG: Initial sync from overlay fields (fallback).");
                    syncOverlayToDjangoFields();
                } else {
                    console.log("MAP_ADMIN_DEBUG: No initial values found for sync.");
                }

                // Check readonly status (for final confirmation of previous issue)
                if (latInput.readOnly) {
                    console.error("MAP_ADMIN_ERROR: 'id_latitude' is still readonly. This will prevent updates.");
                }
                if (lonInput.readOnly) {
                    console.error("MAP_ADMIN_ERROR: 'id_longitude' is still readonly. This will prevent updates.");
                }

            }, 500); // 500ms delay to allow MapWidgets to fully render

            console.log("MAP_ADMIN_DEBUG: Script initialization complete.");

        })(django.jQuery || window.jQuery); // Use Django's jQuery if available
    } else {
        console.error("MAP_ADMIN_ERROR: jQuery is not loaded. Map admin script cannot run.");
        console.info("MAP_ADMIN_INFO: Ensure 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js' is loaded before 'map_admin.js' in your admin.py Media class.");
    }
});