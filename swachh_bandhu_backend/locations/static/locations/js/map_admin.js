// locations/static/locations/js/map_admin.js

// We wait for the DOM to be fully loaded before running our script.
document.addEventListener('DOMContentLoaded', function() {
    // Use a more robust way to wait for jQuery if it's not immediately available.
    if (window.jQuery) {
        (function($) {
            // This code runs inside a function to avoid conflicts with other scripts.
            
            // Find our map widget and the coordinate fields.
            const locationInput = document.getElementById('id_location');
            const latInput = document.getElementById('id_latitude');
            const lonInput = document.getElementById('id_longitude');

            if (!locationInput || !latInput || !lonInput) {
                console.error("Map admin script: Could not find required input fields.");
                return;
            }

            // Function to update lat/lon fields from the map widget.
            function updateCoordinates() {
                const locationValue = locationInput.value;
                if (locationValue) {
                    // The widget value is "latitude,longitude"
                    const parts = locationValue.split(',');
                    if (parts.length === 2) {
                        latInput.value = parseFloat(parts[0]).toFixed(6);
                        lonInput.value = parseFloat(parts[1]).toFixed(6);
                    }
                }
            }

            // The map widget is initialized dynamically, so we can't just listen
            // for a 'change' event on the input. We need to detect when the
            // value changes, which can be done by observing mutations or polling.
            // A MutationObserver is the modern and efficient way.
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                        updateCoordinates();
                    }
                });
            });

            // Start observing the 'id_location' input for changes to its 'value' attribute.
            observer.observe(locationInput, {
                attributes: true 
            });

            // Also, run it once on page load to set initial values if they exist.
            updateCoordinates();

        })(django.jQuery || window.jQuery); // Use Django's jQuery if available
    } else {
        console.error("jQuery is not loaded. Map admin script cannot run.");
    }
});