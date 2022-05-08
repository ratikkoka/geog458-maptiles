mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        let map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 11, // starting zoom
            center: [-122.3459435, 47.6002614] // starting center
        });

        map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

            map.addSource('basemap-tiles', {
                'type': 'raster',
                'tiles': [
                    'assets/basemap/{z}/{x}/{y}.png'
                ],
                'tileSize': 256,
                'attribution': 'Map tiles designed by Ratik Koka</a>'
            });

            map.addSource('parks-tiles', {
                'type': 'raster',
                'tiles': [
                    'assets/parks/{z}/{x}/{y}.png'
                ],
                'tileSize': 256,
                'attribution': 'Source: Seattle City GeoData</a>'
            });

            map.addSource('basemap-parks-tiles', {
                'type': 'raster',
                'tiles': [
                    'assets/basemap-parks/{z}/{x}/{y}.png'
                ],
                'tileSize': 256,
                'attribution': 'Map tiles designed by Ratik Koka</a>'
            });

            map.addSource('bisex-tiles', {
                'type': 'raster',
                'tiles': [
                    'assets/bisexual-basemap/{z}/{x}/{y}.png'
                ],
                'tileSize': 256,
                'attribution': 'Map tiles designed by Ratik Koka</a>'
            });

            map.addLayer({
                'id': 'Basemap',
                'type': 'raster',
                'layout': {
                    'visibility': 'none'
                },
                'source': 'basemap-tiles'
            });

            map.addLayer({
                'id': 'Parks',
                'type': 'raster',
                'layout': {
                    'visibility': 'none'
                },
                'source': 'parks-tiles'
            });

            map.addLayer({
                'id': 'Parks on Basemap',
                'type': 'raster',
                'layout': {
                    'visibility': 'none'
                },
                'source': 'basemap-parks-tiles'
            });

            map.addLayer({
                'id': 'Bisexual Basemap',
                'type': 'raster',
                'layout': {
                    'visibility': 'none'
                },
                'source': 'bisex-tiles'
            });

            map.addControl(new mapboxgl.ScaleControl({unit: 'imperial'}), 'bottom-left');
            map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        });


        // After the last frame rendered before the map enters an "idle" state.
        map.on('idle', () => {
            // If these two layers were not added to the map, abort
            if (!map.getLayer('Basemap') || !map.getLayer('Parks') || !map.getLayer('Parks on Basemap') || !map.getLayer('Bisexual Basemap')) {
                return;
            }

            // Enumerate ids of the layers.
            const toggleableLayerIds = ['Basemap', 'Parks', 'Parks on Basemap', 'Bisexual Basemap'];

            // Set up the corresponding toggle button for each layer.
            for (const id of toggleableLayerIds) {
                // Skip layers that already have a button set up.
                if (document.getElementById(id)) {
                    continue;
                }

                // Create a link.
                const link = document.createElement('a');
                link.id = id;
                link.href = '#';
                link.textContent = id;
                link.className = 'inactive';

                // Show or hide layer when the toggle is clicked.
                link.onclick = function (e) {
                    const clickedLayer = this.textContent;
                    // preventDefault() tells the user agent that if the event does not get explicitly handled, 
                    // its default action should not be taken as it normally would be.
                    e.preventDefault();
                    // The stopPropagation() method prevents further propagation of the current event in the capturing 
                    // and bubbling phases. It does not, however, prevent any default behaviors from occurring; 
                    // for instance, clicks on links are still processed. If you want to stop those behaviors, 
                    // see the preventDefault() method.
                    e.stopPropagation();

                    const visibility = map.getLayoutProperty(
                        clickedLayer,
                        'visibility'
                    );

                    // Toggle layer visibility by changing the layout object's visibility property.
                    // if it is currently visible, after the clicking, it will be turned off.
                    if (visibility === 'visible') {
                        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                        this.className = '';
                    } else { //otherise, it will be turned on.
                        this.className = 'active';
                        map.setLayoutProperty(
                            clickedLayer,
                            'visibility',
                            'visible'
                        );
                    }
                };

                // in the menu place holder, insert the layer links.
                const layers = document.getElementById('menu');
                layers.appendChild(link);
            }
        });