import {Element} from 'bambooo';
import {Feature, Map as OlMap, Overlay, View} from 'ol';
import LayerSwitcher from 'ol-layerswitcher';
import {Coordinate} from 'ol/coordinate';
import {EsriJSON, GeoJSON} from 'ol/format';
import {Point} from 'ol/geom';
import {Heatmap} from 'ol/layer';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import {fromLonLat, ProjectionLike} from 'ol/proj';
import {OSM, TileWMS} from 'ol/source';
import * as olProj from 'ol/proj';
import * as olExtent from 'ol/extent';
import VectorSource from 'ol/source/Vector';
import {Circle, Fill, Icon, Stroke, Style} from 'ol/style';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import XYZ from 'ol/source/XYZ';

export enum SightingMapObjectType {
    Route = 'route',
    RouteOdontoceti = 'route_odontoceti',
    RouteMysticeti = 'route_mysticeti',
    Start = 'start',
    End = 'end',
    Mysticeti = 'mysticeti',
    Odontoceti = 'odontoceti',
    Testudines = 'testudines',
    Boat = 'boat'
}

export type SightingMapPopupContent = () => string|any;

/**
 * Load map options
 */
export type SightingMapLoadOptions = {
    useHeatmap?: boolean;
    useBathymetriemap?: boolean;
};

/**
 * SightingMap
 */
export class SightingMap extends Element {

    /**
     * map object
     * @protected
     */
    protected _map: OlMap;

    /**
     * map source
     * @protected
     */
    protected _source: VectorSource;

    /**
     * tooltip popup
     * @protected
     */
    protected _tooltip_popup: any;

    /**
     * Popover
     * @protected
     */
    protected _popover: any|undefined;

    /**
     * geojson Features
     * @protected
     */
    protected _geojsonFeatures: object[] = [];

    /**
     * load options
     * @protected
     */
    protected _loadOptions: SightingMapLoadOptions = {};

    /**
     * Global styles
     * @protected
     */
    protected _styles: Map<string, Style> = new Map<string, Style>([
        [SightingMapObjectType.Route, new Style({
            stroke: new Stroke({
                width: 2
            }),
            fill: new Fill({
                color: 'rgba(255,0,0,0.5)'
            })
        })],
        [SightingMapObjectType.RouteOdontoceti, new Style({
            stroke: new Stroke({
                width: 10,
                color: '#85C1E9'
            })
        })],
        [SightingMapObjectType.RouteMysticeti, new Style({
            stroke: new Stroke({
                width: 10,
                color: '#2471A3'
            })
        })],
        [SightingMapObjectType.Start, new Style({
            image: new Circle({
                radius: 7,
                fill: new Fill({color: '#69e356'}),
                stroke: new Stroke({
                    color: 'black',
                    width: 1
                })
            })
        })],
        [SightingMapObjectType.End, new Style({
            image: new Circle({
                radius: 7,
                fill: new Fill({color: 'red'}),
                stroke: new Stroke({
                    color: 'black',
                    width: 1
                })
            })
        })],
        [SightingMapObjectType.Mysticeti, new Style({
            image: new Icon({
                src: 'images/marker-mysticeti.png',
                rotateWithView: false,
                size: [500, 500],
                scale: 0.1
            })
        })],
        [SightingMapObjectType.Odontoceti, new Style({
            image: new Icon({
                src: 'images/marker-odontoceti.png',
                rotateWithView: false,
                size: [500, 500],
                scale: 0.1
            })
        })],
        [SightingMapObjectType.Testudines, new Style({
            image: new Icon({
                src: 'images/marker-testudines.png',
                rotateWithView: false,
                size: [500, 500],
                scale: 0.1
            })
        })]
    ]);

    /**
     * Constructor
     * @param {any} aelement
     */
    public constructor(aelement?: any) {
        super(jQuery('<div></div>').appendTo(aelement));
    }

    /**
     * Create Map
     * @private
     */
    private _createMap(): void {
        const tileLayer = new TileLayer({
            source: new OSM({
                wrapX: false
            })
        });

        this._source = new VectorSource({
            wrapX: false
        });

        const vector = new VectorLayer({
            source: this._source
        });

        this._map = new OlMap({
            layers: [tileLayer, vector],
            target: this._element[0],
            view: new View({
                center: fromLonLat([11.030, 47.739]),
                zoom: 2.2,
                multiWorld: true
            })
        });

        const layerSwitcher = new LayerSwitcher({
            reverse: true,
            groupSelectStyle: 'group'
        });

        this._map.addControl(layerSwitcher);
    }

    /**
     * Set height
     * @param {string|number} height
     */
    public setHeight(height: string|number): void {
        this._element.css({
            height: `${height}px`
        });
    }

    /**
     * Load
     */
    public load(options?: SightingMapLoadOptions): void {
        this._createMap();
        this._createMapToolTip();

        if (options !== undefined) {
            this._loadOptions = options;
        }
    }

    /**
     * Unload
     */
    public unload(): void {
        jQuery('.popover').remove();

        if (this._tooltip_popup) {
            this._tooltip_popup.remove();
        }
    }

    /**
     * Dispose the Popup
     * @param {boolean} andRemove
     */
    public disposePopover(andRemove: boolean = false): void {
        if (this._popover) {
            this._popover.popover('dispose');

            if (andRemove) {
                this._popover.remove();
            }

            this._popover = undefined;
        }
    }

    /**
     * Create Map tooltip
     * @protected
     */
    protected _createMapToolTip(): void {
        this._tooltip_popup = jQuery('<div id="popup"></div>').appendTo(jQuery('body'));

        const overlayTooltip = new Overlay({
            element: this._tooltip_popup[0],
            offset: [10, 0],
            positioning: 'bottom-left'
        });

        this._map.addOverlay(overlayTooltip);

        this._map.on('click', (evt) => {
            const feature = this._map.forEachFeatureAtPixel(evt.pixel, (inFeature) => {
                return inFeature;
            });

            this.disposePopover();

            if (!feature) {
                return;
            }

            overlayTooltip.setPosition(evt.coordinate);
            this._popover = this._tooltip_popup.popover({
                html: true,
                content: () => {
                    const content = feature.get('content');

                    if (typeof content === 'string') {
                        return content;
                    } else if (typeof content === 'function') {
                        const returnContent = content();

                        if (typeof returnContent === 'string') {
                            return returnContent;
                        } else if (typeof returnContent === 'object') {
                            return jQuery(returnContent).html();
                        }
                    }

                    return 'None content found.';
                }
            });

            this._popover.popover('show');
        });

        this._map.on('pointermove', (evt) => {
            const pixel = this._map.getEventPixel(evt.originalEvent);
            const hit = this._map.hasFeatureAtPixel(pixel);
            const target = this._map.getTarget();

            if (target) {
                // @ts-ignore
                if ('style' in target) {
                    target.style.cursor = hit ? 'pointer' : '';
                }
            }
        });

        this._map.on('movestart', () => {
            this.disposePopover();
        });
    }

    /**
     * Set the view
     * @param {Coordinate|null} viewCenter
     * @param {number} viewZoom
     */
    public setView(viewCenter: Coordinate|null = null, viewZoom: number = 12.5): void {
        let center = fromLonLat([-17.3340221, 28.0525008]);

        if (viewCenter !== null) {
            center = fromLonLat(viewCenter);
        }

        this._map.setView(new View({
            center,
            zoom: viewZoom,
            multiWorld: true
        }));
    }

    /**
     * Add
     * @param {number[][]} coordinates
     */
    public addLineRoute(coordinates: number[][]): void {
        this._geojsonFeatures.push({
            type: 'Feature',
            properties: {
                pointtype: `${SightingMapObjectType.Route}`
            },
            geometry: {
                type: 'LineString',
                coordinates
            }
        });
    }

    /**
     * Add a raw Feature or etc.
     * @param {any} object
     */
    public addRawObject(object: any): void {
        this._geojsonFeatures.push(object);
    }

    /**
     * Add a sighting
     * @param {SightingMapObjectType|string} type
     * @param {string} id
     * @param {string|SightingMapPopupContent} content
     * @param {Coordinate} coordinate
     */
    public addSighting(type: SightingMapObjectType|string, id: string|number, content: string|SightingMapPopupContent, coordinate: Coordinate): void {
        this._geojsonFeatures.push({
            type: 'Feature',
            properties: {
                pointtype: `${type}`,
                id,
                content
            },
            geometry: {
                type: 'Point',
                coordinates: coordinate
            }
        });
    }

    public async refrech(): Promise<void> {
        await this._printLayer();
    }

    public updateSize(): void {
        this._map.updateSize();
    }

    /**
     * Print layer, move old layer and add new layer with new information
     * @protected
     */
    protected async _printLayer(): Promise<void> {
        // first clear layers ------------------------------------------------------------------------------------------
        const layerNameList = [
            'sigthing_layer',
            'sigthing_heat_layer',
            'sigthing_bathymetrie_layer',
            'sigthing_idee_es_layer'
        ];

        this._map.getLayers().forEach((layer) => {
            if (layer === undefined || layer === null) {
                return;
            }

            if (layer.get === undefined) {
                return;
            }

            const layerName = layer.get('name');

            if (layerName) {
                if (layerNameList.indexOf(layerName) > -1) {
                    this._map.removeLayer(layer);
                }
            }
        });

        // Bathymetriemap ----------------------------------------------------------------------------------------------

        if (this._loadOptions.useBathymetriemap !== undefined && this._loadOptions.useBathymetriemap) {
            /*const bathymetrieLayer = new TileLayer({
                opacity: 0.7,
                source: new WMTS({
                    //url: 'https://tiles.emodnet-bathymetry.eu/2020/{Layer}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
                    url: 'https://ows.emodnet-bathymetry.eu/wms',
                    layer: 'baselayer',
                    requestEncoding: 'REST',
                    matrixSet: 'inspire_quad',
                    format: 'image/png',
                    projection: 'EPSG:4326',
                    tileGrid: this._inspireWgs84Grid(12),
                    style: 'default'
                })
            });

            bathymetrieLayer.set('title', 'EMODnet Bathymetry');
            bathymetrieLayer.set('name', 'sigthing_bathymetrie_layer');
            this._map.addLayer(bathymetrieLayer);*/

            const bathymetry = new TileLayer({
                source: new TileWMS({
                    url: 'https://ows.emodnet-bathymetry.eu/wms',
                    params: {
                        LAYERS: 'mean_atlas_land'
                    }
                })
            });

            bathymetry.set('title', 'EMODnet Bathymetry');
            bathymetry.set('name', 'sigthing_bathymetrie_layer');
            bathymetry.set('base', true);
            bathymetry.setVisible(false);
            this._map.addLayer(bathymetry);
        }

        // TMS Relieve ES Map ------------------------------------------------------------------------------------------

        const tmsEs = new TileLayer({
            source: new XYZ({
                url: 'https://tms-relieve.idee.es/1.0.0/relieve/{z}/{x}/{-y}.jpeg',
                projection: 'EPSG:3857' as ProjectionLike
            }),
            visible: true
        });

        tmsEs.set('title', 'IDEE ES');
        tmsEs.set('name', 'sigthing_idee_es_layer');
        tmsEs.set('base', true);

        this._map.addLayer(tmsEs);

        // reprint layers ----------------------------------------------------------------------------------------------

        const geojsonObject = {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'EPSG:4326'
                }
            },
            features: this._geojsonFeatures
        };

        const geoJsonObj = new GeoJSON();
        const features = geoJsonObj.readFeatures(geojsonObject, {
            featureProjection: 'EPSG:3857'
        });

        const vectorSource = new VectorSource({
            features
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: (feature: Feature): Style[] => {
                const styles: Style[] = [];

                const props = feature.getProperties() || {};

                if (props.pointtype) {
                    const globalStyle = this._styles.get(props.pointtype);

                    if (globalStyle) {
                        styles.push(globalStyle);
                    } else if (props.pointtype === SightingMapObjectType.Boat) {
                        const pstart = props.start as number[];
                        const pend = props.end as number[];

                        const dx = pend[0] - pstart[0];
                        const dy = pend[1] - pstart[1];
                        const rotation = Math.atan2(dy, dx);

                        styles.push(new Style({
                            geometry: new Point(fromLonLat(pstart)),
                            image: new Icon({
                                src: 'images/boat.png',
                                anchor: [0.75, 0.5],
                                rotateWithView: false,
                                rotation: -rotation,
                                size: [752, 752],
                                scale: 0.08
                            })
                        }));
                    }
                }

                return styles;
            }
        });

        vectorLayer.set('name', 'sigthing_layer');
        vectorLayer.set('title', 'Sightings');
        vectorLayer.setZIndex(99);
        this._map.addLayer(vectorLayer);

        // Heatmap -----------------------------------------------------------------------------------------------------

        if (this._loadOptions.useHeatmap !== undefined && this._loadOptions.useHeatmap) {
            const blur = 20;
            const radius = 10;

            const heatmaplayer = new Heatmap({
                title: 'HeatMap',
                // @ts-ignore
                source: vectorSource,
                blur,
                radius,
                weight: (): number => {
                    return 10;
                }
            });

            heatmaplayer.set('name', 'sigthing_heat_layer');

            this._map.addLayer(heatmaplayer);
        }
    }

    protected _inspireWgs84Grid(levels: number): WMTSTileGrid {
        const projection = olProj.get('EPSG:4326');

        const projectionExtent = projection.getExtent();
        const resolution = olExtent.getWidth(projectionExtent) / 512;

        const resolutions = new Array(levels);
        const matrixIds = new Array(levels);

        for (let z = 0; z < levels; z++) {
            // eslint-disable-next-line no-mixed-operators
            resolutions[z] = resolution / 2 ** z;
            matrixIds[z] = z;
        }

        return new WMTSTileGrid({
            origin: olExtent.getTopLeft(projectionExtent),
            resolutions,
            matrixIds
        });
    }

    public async addAreaByJson(jsonFileUrl: string, title: string, name: string): Promise<void> {
        const response = await fetch(jsonFileUrl);

        const esriJsonObject = await response.json();

        const esriJsonObj = new EsriJSON();
        const features = esriJsonObj.readFeatures(esriJsonObject, {
            featureProjection: 'EPSG:3857'
        });

        const vectorSource = new VectorSource({
            features
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource
        });

        vectorLayer.set('title', title);
        vectorLayer.set('name', name);
        vectorLayer.setZIndex(50);
        this._map.addLayer(vectorLayer);
    }

}