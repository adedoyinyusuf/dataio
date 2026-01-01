const DD = {
  chart: null,
  zones: [],
  data: null,
  compData: null,
  currentLevel: 'zonal', // 'zonal' | 'state'
  currentZone: null,
  currentIndicator: null,
  currentCompIndicator: null,
  async init() {
    // --- Primary Filters Initialization ---
    const mods = await getModules();
    const fModule = document.getElementById('f-module');
    fModule.innerHTML = mods.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

    const initialModuleId = mods[0]?.id || 'ndhs';
    const years = await getYears(initialModuleId);
    const fYear = document.getElementById('f-year');
    fYear.innerHTML = years.map(y => `<option>${y}</option>`).join('');

    await this.populateIndicators(initialModuleId, years[0]);

    this.zones = (await getZones()) || ZONES;

    // Populate Zone Filter for Table
    const ddZone = document.getElementById('dd-zone');
    ddZone.innerHTML = this.zones.map(z => `<option>${z}</option>`).join('');

    // --- Comparison Filters Initialization ---
    const fCompModule = document.getElementById('f-comp-module');
    fCompModule.innerHTML = mods.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

    // Initialize comparison with same defaults as primary
    const fCompYear = document.getElementById('f-comp-year');
    fCompYear.innerHTML = years.map(y => `<option>${y}</option>`).join('');
    await this.populateComparisonIndicators(initialModuleId, years[0]);

    // --- Event Listeners ---

    // Primary Module Change
    fModule.addEventListener('change', async (e) => {
      const mid = e.target.value;
      const yList = await getYears(mid);
      fYear.innerHTML = yList.map(v => `<option>${v}</option>`).join('');
      await this.populateIndicators(mid, yList[0]);
    });

    // Primary Year Change
    fYear.addEventListener('change', async (e) => {
      await this.populateIndicators(fModule.value, e.target.value);
    });

    // Primary Category Change
    document.getElementById('f-category').addEventListener('change', (e) => {
      const cat = e.target.value;
      const items = this.data.indicators[cat]?.items || {};
      document.getElementById('f-indicator').innerHTML = Object.entries(items).map(([k, v]) => `<option value="${k}">${v.title}</option>`).join('');
    });

    // Comparison Toggle
    const compToggle = document.getElementById('comp-toggle');
    const compFilters = document.getElementById('comp-filters');
    compToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        compFilters.classList.remove('opacity-50', 'pointer-events-none');
      } else {
        compFilters.classList.add('opacity-50', 'pointer-events-none');
      }
    });

    // Comparison Module Change
    fCompModule.addEventListener('change', async (e) => {
      const mid = e.target.value;
      const yList = await getYears(mid);
      fCompYear.innerHTML = yList.map(v => `<option>${v}</option>`).join('');
      await this.populateComparisonIndicators(mid, yList[0]);
    });

    // Comparison Year Change
    fCompYear.addEventListener('change', async (e) => {
      await this.populateComparisonIndicators(fCompModule.value, e.target.value);
    });

    // Comparison Category Change
    document.getElementById('f-comp-category').addEventListener('change', (e) => {
      const cat = e.target.value;
      const items = this.compData?.indicators[cat]?.items || {};
      const fCompInd = document.getElementById('f-comp-indicator');
      fCompInd.innerHTML = '<option value="">Select Value</option>' + Object.entries(items).map(([k, v]) => `<option value="${k}">${v.title}</option>`).join('');
    });

    // Actions
    document.getElementById('f-apply').addEventListener('click', () => this.apply());
    document.getElementById('f-export-csv').addEventListener('click', () => this.export('csv'));
    document.getElementById('f-export-json').addEventListener('click', () => this.export('json'));
    document.getElementById('f-export-pdf').addEventListener('click', () => this.exportPDF());
    document.getElementById('f-share').addEventListener('click', () => this.shareInsight());

    // Share Modal
    document.getElementById('close-share-modal').addEventListener('click', () => document.getElementById('share-modal').classList.add('hidden'));
    document.getElementById('share-modal-bg').addEventListener('click', () => document.getElementById('share-modal').classList.add('hidden'));

    document.getElementById('dd-zone').addEventListener('change', () => this.loadStates());
    document.getElementById('dd-chart-type').addEventListener('change', () => this.apply());
    document.getElementById('dd-back').addEventListener('click', () => this.backToZones());

    document.getElementById('dd-back').addEventListener('click', () => this.backToZones());

    // View Toggles
    document.getElementById('view-chart').addEventListener('click', () => this.switchView('chart'));
    document.getElementById('view-map').addEventListener('click', () => this.switchView('map'));

    // Auto-load initial data
    await this.apply();
  },

  async initMap() {
    if (this.map) return; // Already initialized

    try {
      // Initialize map centered on Nigeria with appropriate zoom
      this.map = L.map('dd-map', {
        zoomControl: false,
        minZoom: 5,
        maxZoom: 10
      }).setView([9.08, 8.68], 6);

      // Add zoom control in bottom-right
      L.control.zoom({
        position: 'bottomright'
      }).addTo(this.map);

      // Add "Fit to Nigeria" button
      const fitButton = L.control({ position: 'topright' });
      fitButton.onAdd = function (map) {
        const btn = L.DomUtil.create('button', 'leaflet-bar');
        btn.innerHTML = '<i class="fas fa-compress" style="font-size: 14px;"></i>';
        btn.title = 'Fit to Nigeria';
        btn.style.cssText = 'background: white; border: 2px solid #ccc; border-radius: 4px; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center;';

        btn.onclick = function () {
          if (window.DD.geoJsonLayer) {
            map.fitBounds(window.DD.geoJsonLayer.getBounds(), { padding: [20, 20] });
          }
        };

        return btn;
      };
      fitButton.addTo(this.map);

      // Load GeoJSON with cache-busting
      const response = await fetch(`/assets/js/nigeria_states.geojson?v=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to load map data');
      this.geojsonData = await response.json();

      // Keep reference to geoJson layer to update styles later
      this.geoJsonLayer = L.geoJSON(this.geojsonData, {
        style: {
          fillColor: '#cbd5e1',
          weight: 2,
          opacity: 1,
          color: '#374151',
          fillOpacity: 0.8
        },
        onEachFeature: (feature, layer) => {
          // Add permanent label
          const stateName = feature.properties.name;
          const bounds = layer.getBounds();
          const center = bounds.getCenter();

          const label = L.marker(center, {
            icon: L.divIcon({
              className: 'state-label',
              html: `<div style="transform: translate(-50%, -50%); white-space: nowrap; font-size: 10px; font-weight: 600; color: #1f2937; text-shadow: 0 0 3px white, 0 0 3px white;">${stateName}</div>`,
              iconSize: [0, 0]
            })
          });

          if (!this.stateLabels) this.stateLabels = [];
          this.stateLabels.push(label);
          label.addTo(this.map);

          layer.on({
            mouseover: (e) => {
              const layer = e.target;
              layer.setStyle({
                weight: 3,
                color: '#111827',
                fillOpacity: 1
              });
              layer.bringToFront();

              // Show custom tooltip
              const props = layer.feature.properties;
              const value = layer.feature.properties.value;
              const formattedVal = typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : 'No Data';

              layer.bindTooltip(`
                        <div style="padding: 4px 8px; background: rgba(0,0,0,0.9); border-radius: 4px; color: white;">
                            <div style="font-weight: bold; font-size: 12px;">${props.name}</div>
                            <div style="font-size: 14px; margin-top: 2px;">${formattedVal}</div>
                        </div>
                    `, { sticky: true, direction: 'top', className: 'custom-tooltip' }).openTooltip();
            },
            mouseout: (e) => {
              this.geoJsonLayer.resetStyle(e.target);
              e.target.closeTooltip();
            },
            click: (e) => {
              // Optional: Zoom to state or filter table?
              // this.map.fitBounds(e.target.getBounds());
            }
          });
        }
      }).addTo(this.map);

      // Add custom legend
      this.addMapLegend();

    } catch (e) {
      console.error('Error initializing map:', e);
      document.getElementById('dd-map').innerHTML = `<div class="flex items-center justify-center h-full text-slate-500">Failed to load map: ${e.message}</div>`;
    }
  },

  switchView(view) {
    const chartView = document.getElementById('view-chart');
    const mapView = document.getElementById('view-map');
    const chartCanvas = document.getElementById('dd-chart');
    const mapContainer = document.getElementById('dd-map');
    const chartType = document.getElementById('dd-chart-type');

    if (view === 'map') {
      chartView.classList.remove('bg-white', 'shadow-sm', 'text-slate-700');
      chartView.classList.add('text-slate-500');

      mapView.classList.add('bg-white', 'shadow-sm', 'text-slate-700');
      mapView.classList.remove('text-slate-500');

      chartCanvas.classList.add('invisible'); // hide chart but keep layout
      mapContainer.classList.remove('hidden');
      chartType.classList.add('hidden'); // hide chart type selector

      // Initialize map if not ready
      if (!this.map) {
        this.initMap().then(() => this.updateMap());
      } else {
        // Force resize to fix Leaflet rendering issues when inside hidden div
        setTimeout(() => {
          this.map.invalidateSize();
          this.updateMap();
        }, 100);
      }

    } else {
      mapView.classList.remove('bg-white', 'shadow-sm', 'text-slate-700');
      mapView.classList.add('text-slate-500');

      chartView.classList.add('bg-white', 'shadow-sm', 'text-slate-700');
      chartView.classList.remove('text-slate-500');

      mapContainer.classList.add('hidden');
      chartCanvas.classList.remove('invisible');
      chartType.classList.remove('hidden');
    }
  },

  async updateMap() {
    if (!this.map || !this.geoJsonLayer) return;

    // Fetch national data
    const moduleId = document.getElementById('f-module').value;
    const year = document.getElementById('f-year').value;
    const cat = document.getElementById('f-category').value;
    const key = document.getElementById('f-indicator').value;

    try {
      const res = await apiClient.getAllStateDataForIndicator(moduleId, year, cat, key);
      const dataMap = new Map((res.data || []).map(d => [d.state, Number(d.value)]));

      // Find min/max for color scale
      const values = Array.from(dataMap.values());
      const min = Math.min(...values);
      const max = Math.max(...values);

      // Helper to get color based on value
      const getColor = (d) => {
        if (d === undefined || d === null) return '#e2e8f0';

        // Handle case where all values are the same
        if (max === min) return '#15803d'; // Return middle green

        // Improved color scale with better contrast
        const pct = (d - min) / (max - min);
        return pct > 0.8 ? '#064e3b' : // green-900 - darkest
          pct > 0.6 ? '#047857' : // green-700
            pct > 0.4 ? '#10b981' : // green-500
              pct > 0.2 ? '#6ee7b7' : // green-300
                '#d1fae5';  // green-100 - lightest
      };

      // Update legend with current values
      this.updateMapLegend(min, max);

      this.geoJsonLayer.eachLayer((layer) => {
        const stateName = layer.feature.properties.name;
        // Map GeoJSON state name to API state name
        // Note: This might need normalization (e.g. "Federal Capital Territory" vs "FCT")
        let matchKey = stateName;

        // Basic fuzzy matching
        if (!dataMap.has(matchKey)) {
          // Explicit mappings for known discrepancies
          if (stateName === 'Federal Capital Territory') {
            if (dataMap.has('FCT-Abuja')) matchKey = 'FCT-Abuja';
            else if (dataMap.has('FCT')) matchKey = 'FCT';
            else if (dataMap.has('Abuja')) matchKey = 'Abuja';
          } else if (stateName === 'Nassarawa' && dataMap.has('Nasarawa')) {
            matchKey = 'Nasarawa';
          }

          // If still no match, try fuzzy search
          if (!dataMap.has(matchKey)) {
            for (const [key, val] of dataMap.entries()) {
              if (key.includes(stateName) || stateName.includes(key)) {
                matchKey = key;
                break;
              }
            }
          }
        }

        const value = dataMap.get(matchKey);
        layer.feature.properties.value = value; // Store for tooltip

        layer.setStyle({
          fillColor: getColor(value),
          fillOpacity: 0.8,
          weight: 2,
          color: '#374151'
        });
      });

    } catch (e) {
      console.error('Failed to update map data', e);
    }
  },

  addMapLegend() {
    // Create legend control
    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'map-legend');
      div.style.cssText = 'background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-size: 11px;';
      div.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 6px; color: #1f2937;">Value Range</div>
        <div id="legend-content">
          <div style="margin: 3px 0; display: flex; align-items: center;">
            <div style="width: 20px; height: 15px; background: #064e3b; margin-right: 6px; border-radius: 2px;"></div>
            <span>Highest</span>
          </div>
          <div style="margin: 3px 0; display: flex; align-items: center;">
            <div style="width: 20px; height: 15px; background: #047857; margin-right: 6px; border-radius: 2px;"></div>
            <span>High</span>
          </div>
          <div style="margin: 3px 0; display: flex; align-items: center;">
            <div style="width: 20px; height: 15px; background: #10b981; margin-right: 6px; border-radius: 2px;"></div>
            <span>Medium</span>
          </div>
          <div style="margin: 3px 0; display: flex; align-items: center;">
            <div style="width: 20px; height: 15px; background: #6ee7b7; margin-right: 6px; border-radius: 2px;"></div>
            <span>Low</span>
          </div>
          <div style="margin: 3px 0; display: flex; align-items: center;">
            <div style="width: 20px; height: 15px; background: #d1fae5; margin-right: 6px; border-radius: 2px;"></div>
            <span>Lowest</span>
          </div>
        </div>
      `;
      return div;
    };

    legend.addTo(this.map);
    this.legend = legend;
  },

  updateMapLegend(min, max) {
    if (!this.legend || !this.map) return;

    const legendContent = document.getElementById('legend-content');
    if (!legendContent) return;

    const range = max - min;
    const step = range / 5;

    legendContent.innerHTML = `
      <div style="margin: 3px 0; display: flex; align-items: center;">
        <div style="width: 20px; height: 15px; background: #064e3b; margin-right: 6px; border-radius: 2px;"></div>
        <span>${(min + step * 4).toFixed(1)} - ${max.toFixed(1)}</span>
      </div>
      <div style="margin: 3px 0; display: flex; align-items: center;">
        <div style="width: 20px; height: 15px; background: #047857; margin-right: 6px; border-radius: 2px;"></div>
        <span>${(min + step * 3).toFixed(1)} - ${(min + step * 4).toFixed(1)}</span>
      </div>
      <div style="margin: 3px 0; display: flex; align-items: center;">
        <div style="width: 20px; height: 15px; background: #10b981; margin-right: 6px; border-radius: 2px;"></div>
        <span>${(min + step * 2).toFixed(1)} - ${(min + step * 3).toFixed(1)}</span>
      </div>
      <div style="margin: 3px 0; display: flex; align-items: center;">
        <div style="width: 20px; height: 15px; background: #6ee7b7; margin-right: 6px; border-radius: 2px;"></div>
        <span>${(min + step).toFixed(1)} - ${(min + step * 2).toFixed(1)}</span>
      </div>
      <div style="margin: 3px 0; display: flex; align-items: center;">
        <div style="width: 20px; height: 15px; background: #d1fae5; margin-right: 6px; border-radius: 2px;"></div>
        <span>${min.toFixed(1)} - ${(min + step).toFixed(1)}</span>
      </div>
    `;
  },

  updateNationalKPI(indicator) {
    const kpiCard = document.getElementById('national-kpi');
    const kpiValue = document.getElementById('kpi-value');
    const kpiName = document.getElementById('kpi-indicator-name');
    const kpiUnit = document.getElementById('kpi-unit');

    if (!indicator || !kpiCard) return;

    // Show the card
    kpiCard.classList.remove('hidden');

    // Update indicator name
    kpiName.textContent = indicator.title || '-';

    // Get national value
    const nationalValue = indicator.val || indicator.national_value;

    if (nationalValue !== undefined && nationalValue !== null) {
      // Format the value
      const formattedValue = typeof nationalValue === 'number'
        ? nationalValue.toLocaleString(undefined, { maximumFractionDigits: 1 })
        : nationalValue;

      kpiValue.textContent = formattedValue;

      // Update unit display
      if (indicator.unit) {
        kpiUnit.textContent = indicator.unit;
      } else {
        kpiUnit.textContent = 'percentage';
      }
    } else {
      kpiValue.textContent = 'N/A';
      kpiUnit.textContent = '';
    }
  },

  async populateIndicators(moduleId, year) {
    const data = await getData(moduleId, year);
    this.data = data;

    const fCat = document.getElementById('f-category');
    fCat.innerHTML = Object.entries(data.indicators).map(([k, v]) => `<option value="${k}">${v.title}</option>`).join('');

    const firstCat = Object.keys(data.indicators)[0];
    const fInd = document.getElementById('f-indicator');
    fInd.innerHTML = Object.entries(data.indicators[firstCat].items).map(([k, v]) => `<option value="${k}">${v.title}</option>`).join('');
  },

  async populateComparisonIndicators(moduleId, year) {
    const data = await getData(moduleId, year);
    this.compData = data;

    const fCat = document.getElementById('f-comp-category');
    fCat.innerHTML = Object.entries(data.indicators).map(([k, v]) => `<option value="${k}">${v.title}</option>`).join('');

    const firstCat = Object.keys(data.indicators)[0];
    const fInd = document.getElementById('f-comp-indicator');
    // Default to "Select Value" as requested
    fInd.innerHTML = '<option value="">Select Value</option>' + Object.entries(data.indicators[firstCat].items).map(([k, v]) => `<option value="${k}">${v.title}</option>`).join('');
  },

  async apply() {
    // Check active view
    const isMapView = !document.getElementById('dd-map').classList.contains('hidden');
    if (isMapView) {
      this.updateMap();
      // Fallthrough to chart logic partially or separate? 
      // We still need labels, titles, table data below.
    }

    // Primary Data
    const moduleId = document.getElementById('f-module').value;
    const year = document.getElementById('f-year').value;
    const cat = document.getElementById('f-category').value;
    const key = document.getElementById('f-indicator').value;
    const chartType = document.getElementById('dd-chart-type').value;

    // Comparison Data
    const compEnabled = document.getElementById('comp-toggle').checked;
    const compModuleId = document.getElementById('f-comp-module').value;
    const compYear = document.getElementById('f-comp-year').value;
    const compCat = document.getElementById('f-comp-category').value;
    const compKey = document.getElementById('f-comp-indicator').value;

    const titleEl = document.getElementById('dd-title');
    const backBtn = document.getElementById('dd-back');
    const descEl = document.getElementById('dd-analysis');

    let labels = [];
    let dataA = [];
    let dataB = [];
    let title = '';
    let indA = null;
    let indB = null;

    // Handle trend indicators differently
    indA = await getIndicator(moduleId, year, cat, key);

    if (indA && indA.isTrend) {
      // Trend indicators: use labels and datasets from API
      if (indA.labels && indA.labels.length > 0) {
        labels = indA.labels;
        // For trend data, we'll use the first dataset (usually "Total")
        const totalDataset = indA.datasets?.find(d => d.label === 'Total') || indA.datasets?.[0];
        dataA = totalDataset ? totalDataset.data.map(v => Number(v)) : [];
        title = `${indA.title} — Trends Over Time`;
      } else {
        labels = [];
        dataA = [];
        title = `${indA.title} — No Trend Data Available`;
      }
      backBtn.classList.add('hidden');

      // Disable map view for trend data
      document.getElementById('view-map').disabled = true;
      document.getElementById('view-map').title = "Map not available for trend data";
      if (isMapView) this.switchView('chart'); // Force back to chart

      // Comparison for trend data
      if (compEnabled && compKey) {
        indB = await getIndicator(compModuleId, compYear, compCat, compKey);
        if (indB && indB.isTrend && indB.labels) {
          const totalDatasetB = indB.datasets?.find(d => d.label === 'Total') || indB.datasets?.[0];
          dataB = totalDatasetB ? totalDatasetB.data.map(v => Number(v)) : [];
        }
      }
    } else {
      // Enable map view
      document.getElementById('view-map').disabled = false;
      document.getElementById('view-map').title = "";

      if (this.currentLevel === 'zonal') {
        // Zonal data for non-trend indicators
        labels = this.zones;

        // Zonal data is an array of values corresponding to zones in order
        dataA = labels.map((zone, i) => {
          const value = indA?.zonal?.[i];
          return Number(value ?? 0);
        });

        title = `${indA.title} — Zonal Breakdown`;
        backBtn.classList.add('hidden');

        if (compEnabled && compKey) {
          indB = await getIndicator(compModuleId, compYear, compCat, compKey);

          // Comparison zonal data
          dataB = labels.map((zone, i) => {
            const value = indB?.zonal?.[i];
            return Number(value ?? 0);
          });
        }
      } else {
        // State Level (Drilldown) for non-trend indicators
        const resA = await apiClient.getStateDataForIndicator(moduleId, year, cat, key, this.currentZone);
        //Sort by value desc
        const sortedA = (resA.data || []).sort((a, b) => b.value - a.value);
        labels = sortedA.map(d => d.state);
        dataA = sortedA.map(d => Number(d.value));

        title = `${indA.title} — ${this.currentZone} Breakdown`;
        backBtn.classList.remove('hidden');

        if (compEnabled && compKey) {
          const resB = await apiClient.getStateDataForIndicator(compModuleId, compYear, compCat, compKey, this.currentZone);
          const mapB = new Map((resB.data || []).map(d => [d.state, d.value]));
          dataB = labels.map(state => Number(mapB.get(state) || 0));
          indB = await getIndicator(compModuleId, compYear, compCat, compKey);
        }
      }
    }

    this.currentIndicator = indA;
    this.currentCompIndicator = indB;

    titleEl.textContent = title;
    // Update analysis text
    if (indA && indA.analysis) {
      // Strip HTML tags if present
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = indA.analysis;
      descEl.textContent = tempDiv.textContent || tempDiv.innerText || indA.analysis;
    } else {
      descEl.textContent = `Visual representation of ${indA ? indA.title : 'data'} across ${this.currentLevel === 'zonal' ? 'zones' : 'states'}.`;
    }

    const ctx = document.getElementById('dd-chart');

    let datasets = [];

    // For trend indicators, use datasets directly from API response
    if (indA && indA.isTrend && indA.datasets) {
      datasets = indA.datasets;
    } else {
      // For zonal/state data, build custom datasets
      datasets = [{
        label: indA ? `${indA.title} (${year})` : 'Dataset A',
        data: dataA,
        borderColor: indA?.color || '#0ea5e9',
        backgroundColor: indA?.color || '#0ea5e9'
      }];

      if (compEnabled && compKey) {
        datasets.push({
          label: indB ? `${indB.title} (${compYear})` : 'Dataset B',
          data: dataB,
          borderColor: '#6366f1',
          backgroundColor: '#6366f1'
        });
      }
    }

    if (this.chart) { this.chart.destroy(); }

    this.chart = new Chart(ctx, {
      type: chartType,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (evt, elements) => {
          // Only allow drilldown for non-trend zonal indicators
          if (this.currentLevel === 'zonal' && elements.length > 0 && indA && !indA.isTrend) {
            const index = elements[0].index;
            const zone = labels[index];
            this.drilldown(zone);
          }
        },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.parsed.y?.toLocaleString() ?? context.parsed}`;
              }
            }
          }
        },
        scales: (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') ? {} : {
          y: { beginAtZero: true }
        }
      }
    });

    // Update National Average KPI Card
    this.updateNationalKPI(indA);

    // Also update table filter to match if drilling down
    if (this.currentLevel === 'state') {
      document.getElementById('dd-zone').value = this.currentZone;
      await this.loadStates();
    } else if (indA && indA.isTrend) {
      // For trend indicators, load trend data table
      await this.loadTrendTable();
    } else {
      // If back to zonal, maybe reset table or keep as is?
      // Let's keep table as is or default to first zone
      await this.loadStates();
    }
  },

  drilldown(zone) {
    this.currentLevel = 'state';
    this.currentZone = zone;
    // Drilldown implies Chart View usually, but we could allow map drilldown later
    // For now, if map is active, maybe we want to keep map active?
    // But map is NATIONAL view.
    // If we drilldown, we are looking at specific zone.
    // The current Map implementation is national only for now (all states).
    // So drilling down from map is not fully supported visually yet (zooming to zone).
    // Let's switch to chart view on drilldown to be safe.
    this.switchView('chart');
    this.apply();
  },

  backToZones() {
    this.currentLevel = 'zonal';
    this.currentZone = null;
    this.apply();
  },

  async loadStates() {
    // Primary Data
    const moduleId = document.getElementById('f-module').value;
    const year = document.getElementById('f-year').value;
    const cat = document.getElementById('f-category').value;
    const key = document.getElementById('f-indicator').value;
    const zone = document.getElementById('dd-zone').value || this.zones[0];

    const resA = await apiClient.getStateDataForIndicator(moduleId, year, cat, key, zone);

    // Comparison Data
    const compEnabled = document.getElementById('comp-toggle').checked;
    const compModuleId = document.getElementById('f-comp-module').value;
    const compYear = document.getElementById('f-comp-year').value;
    const compCat = document.getElementById('f-comp-category').value;
    const compKey = document.getElementById('f-comp-indicator').value;

    let resB = { data: [] };
    if (compEnabled && compKey) {
      resB = await apiClient.getStateDataForIndicator(compModuleId, compYear, compCat, compKey, zone);
    }

    // Update Table Headers
    // Check if we need to restore standard headers (e.g. if coming from trend view)
    const thead = document.querySelector('#dd-tbody').closest('table').querySelector('thead');
    if (!document.getElementById('th-val-a')) {
      thead.innerHTML = `
        <tr>
          <th class="w-1/3">State</th>
          <th class="w-1/4">Zone</th>
          <th id="th-val-a" class="text-right">Value</th>
          <th id="th-val-b" class="text-right"></th>
        </tr>
      `;
    }

    const thA = document.getElementById('th-val-a');
    const thB = document.getElementById('th-val-b');

    // Ensure we have indicator details for headers
    if (!this.currentIndicator) {
      this.currentIndicator = await getIndicator(moduleId, year, cat, key);
    }

    const unitA = this.currentIndicator?.unit || '';
    const titleA = this.currentIndicator ? `${this.currentIndicator.title} ${unitA ? '(' + unitA + ')' : ''}` : `Value`;
    thA.textContent = titleA;

    let unitB = '';
    if (compEnabled && compKey) {
      if (!this.currentCompIndicator) {
        this.currentCompIndicator = await getIndicator(compModuleId, compYear, compCat, compKey);
      }
      unitB = this.currentCompIndicator?.unit || '';
      const titleB = this.currentCompIndicator ? `${this.currentCompIndicator.title} ${unitB ? '(' + unitB + ')' : ''}` : `Value`;
      thB.textContent = titleB;
      thB.style.display = '';
    } else {
      thB.style.display = 'none';
    }


    const tbody = document.getElementById('dd-tbody');
    const bMap = new Map((resB.data || []).map(x => [x.state, x.value]));

    // Get Zonal Fallback for comparison if state data is missing
    let compZonalValue = null;
    if (this.currentCompIndicator && Array.isArray(this.currentCompIndicator.zonal) && this.zones) {
      const zoneIdx = this.zones.indexOf(zone);
      if (zoneIdx >= 0) {
        compZonalValue = this.currentCompIndicator.zonal[zoneIdx];
      }
    }

    // Helper function to format values with units
    const formatValue = (value, unit) => {
      const num = Number(value);
      if (isNaN(num)) return '—';
      const formatted = num.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return unit ? `${formatted}${unit}` : formatted;
    };

    tbody.innerHTML = (resA.data || []).map(r => {
      let compCellHtml = '—';
      if (compEnabled && compKey) {
        if (bMap.has(r.state)) {
          compCellHtml = formatValue(bMap.get(r.state), unitB);
        } else if (compZonalValue !== null && compZonalValue !== undefined) {
          compCellHtml = `<span class="italic text-slate-500" title="Zonal Average (State data unavailable)">${formatValue(compZonalValue, unitB)}*</span>`;
        }
      }

      return `
      <tr>
        <td class="px-3 py-2 border border-slate-100 text-sm">${r.state}</td>
        <td class="px-3 py-2 border border-slate-100 text-sm">${r.zone || zone}</td>
        <td class="px-3 py-2 border border-slate-100 text-sm text-right">${formatValue(r.value, unitA)}</td>
        ${compEnabled && compKey ? `<td class="px-3 py-2 border border-slate-100 text-sm text-right">${compCellHtml}</td>` : ''}
      </tr>
      `;
    }).join('');
  },

  async loadTrendTable() {
    const moduleId = document.getElementById('f-module').value;
    const year = document.getElementById('f-year').value;
    const cat = document.getElementById('f-category').value;
    const key = document.getElementById('f-indicator').value;

    const indA = await getIndicator(moduleId, year, cat, key);

    if (!indA || !indA.isTrend || !indA.labels || !indA.datasets) {
      document.getElementById('dd-tbody').innerHTML = '<tr><td colspan="4" class="text-center py-4 text-slate-500">No trend data available</td></tr>';
      return;
    }

    // Get table header and body elements
    const thead = document.querySelector('#dd-tbody').closest('table').querySelector('thead tr');
    const tbody = document.getElementById('dd-tbody');

    // Build headers: Indicator name + each year
    const headers = [`<th class="w-1/4">${indA.title || 'Indicator'}</th>`];
    indA.labels.forEach(yearLabel => {
      headers.push(`<th class="text-right">Year: ${yearLabel}</th>`);
    });
    thead.innerHTML = headers.join('');

    // Build rows: one row per dataset (indicator subcategory)
    const rows = indA.datasets.map(ds => {
      const cells = [`<td class="px-3 py-2 border border-slate-100 text-sm font-semibold" style="color: ${ds.borderColor}">${ds.label}</td>`];

      ds.data.forEach(value => {
        const formattedValue = Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 });
        cells.push(`<td class="px-3 py-2 border border-slate-100 text-sm text-right">${formattedValue}</td>`);
      });

      return `<tr>${cells.join('')}</tr>`;
    });

    tbody.innerHTML = rows.join('');
  },

  export(type) {
    const moduleId = document.getElementById('f-module').value;
    const year = document.getElementById('f-year').value;
    const cat = document.getElementById('f-category').value;
    const key = document.getElementById('f-indicator').value;

    const rows = [];
    const cells = document.querySelectorAll('#dd-tbody tr');
    cells.forEach(tr => {
      const tds = tr.querySelectorAll('td');
      if (tds.length === 0) return;

      const record = {
        module: moduleId,
        year,
        category: cat,
        indicatorKey: key
      };

      // Handle variable column structures (e.g. Trend vs Zonal vs State)
      if (tds.length >= 4) {
        record.state = tds[0].textContent;
        record.zone = tds[1].textContent;
        record.valueA = tds[2].textContent;
        record.valueB = tds[3].textContent;
      } else {
        // Just dump all columns
        tds.forEach((td, i) => record[`col_${i}`] = td.textContent);
      }
      rows.push(record);
    });

    if (type === 'csv') {
      if (rows.length === 0) return alert('No data to export');
      const headers = Object.keys(rows[0]);
      const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => r[h]).join(','))).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `deepdive-${moduleId}-${year}.csv`; a.click(); URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `deepdive-${moduleId}-${year}.json`; a.click(); URL.revokeObjectURL(url);
    }
  },

  async exportPDF() {
    console.log("Starting PDF Export...");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    // Add Branding / Header
    doc.setFillColor(22, 101, 52); // green-800
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Dataio | Xplore", 10, 13);
    doc.setFontSize(10);
    doc.text("Deep Dive Analysis Report", 200, 13, { align: "right" });

    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    const title = document.getElementById('dd-title').textContent;
    doc.text(title, 10, 35);

    // Config info
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const mod = document.getElementById('f-module').options[document.getElementById('f-module').selectedIndex]?.text || '';
    const yr = document.getElementById('f-year').options[document.getElementById('f-year').selectedIndex]?.text || '';
    const cat = document.getElementById('f-category').options[document.getElementById('f-category').selectedIndex]?.text || '';
    doc.text(`Module: ${mod} | Year: ${yr} | Category: ${cat}`, 10, 42);

    // Analysis Text
    const analysis = document.getElementById('dd-analysis').textContent;
    const splitAnalysis = doc.splitTextToSize(analysis, 190);
    doc.text(splitAnalysis, 10, 50);
    let currentY = 50 + (splitAnalysis.length * 5) + 10;

    // Capture Chart or Map
    const chartContainer = document.querySelector('.chart-container');

    // Temporarily hide toggle buttons for clean capture
    const header = document.querySelector('.chart-header');
    const originalDisplay = header.style.display;
    // We want the chart BUT maybe not the header buttons in the screenshot? 
    // Actually the chart-container includes the header. Let's hide the buttons specifically.
    const ctrls = document.querySelector('.chart-header .flex.items-center.gap-2');
    if (ctrls) ctrls.style.visibility = 'hidden';

    try {
      const canvas = await html2canvas(chartContainer);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = 190;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Check if image fits on page
      if (currentY + pdfHeight > 280) {
        doc.addPage();
        currentY = 20;
      }

      doc.addImage(imgData, 'PNG', 10, currentY, pdfWidth, pdfHeight);
      currentY += pdfHeight + 10;

      // Add Data Table
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Data Table Summary", 10, currentY);
      currentY += 8;

      // Basic table creation 
      doc.setFontSize(9);
      const rows = document.querySelectorAll('#dd-tbody tr');
      let rowIndex = 0;
      rows.forEach(row => {
        if (rowIndex > 25) return; // Limit rows 
        const cols = row.querySelectorAll('td');
        if (cols.length > 0) {
          // Try to get relevant columns: State/Zone and Value
          let text = "";
          if (cols.length >= 3) {
            text = `${cols[0].textContent.trim()} | ${cols[2].textContent.trim()}`;
          } else {
            text = Array.from(cols).map(c => c.textContent.trim()).join(' | ');
          }

          if (currentY > 280) {
            doc.addPage();
            currentY = 20;
          }
          doc.text(text, 10, currentY);
          currentY += 5;
          rowIndex++;
        }
      });

      doc.save(`report_${new Date().getTime()}.pdf`);

    } catch (e) {
      console.error("PDF Export failed", e);
      alert("Failed to generate PDF: " + e.message);
    } finally {
      if (ctrls) ctrls.style.visibility = 'visible';
    }
  },

  async shareInsight() {
    // 1. Populate the hidden card
    const mod = document.getElementById('f-module').options[document.getElementById('f-module').selectedIndex]?.text || '';
    const year = document.getElementById('f-year').value;
    const title = document.getElementById('dd-title').textContent;
    const analysis = document.getElementById('dd-analysis').textContent;

    document.getElementById('sc-year').textContent = year;
    document.getElementById('sc-module').textContent = mod;
    document.getElementById('sc-title').textContent = title.split('—')[0].trim();
    document.getElementById('sc-desc').textContent = analysis;

    // National stat
    if (this.currentIndicator?.val) {
      const val = Number(this.currentIndicator.val).toLocaleString(undefined, { maximumFractionDigits: 1 });
      const unit = this.currentIndicator.unit === 'percentage' ? '%' : '';
      document.getElementById('sc-stat').textContent = `${val}${unit}`;
    } else {
      document.getElementById('sc-stat').textContent = 'N/A';
    }

    // 2. Clone Chart/Map
    const target = document.getElementById('sc-chart-target');
    target.innerHTML = ''; // Clear previous

    const isMap = !document.getElementById('dd-map').classList.contains('hidden');

    if (isMap) {
      // For map, we can't easily clone Leaflet DOM. We have to snapshot it first.
      const mapContainer = document.getElementById('dd-map');
      try {
        // Must temporarily show controls for capture if hidden? No, leaflet controls are fine.
        // Note: Leaflet maps might need CORS setting on tiles if not local. 
        // Assuming local geojson and vector styling, should be fine.
        const canvas = await html2canvas(mapContainer, {
          useCORS: true,
          logging: false
        });
        const img = new Image();
        img.src = canvas.toDataURL();
        img.className = 'w-full h-full object-contain';
        target.appendChild(img);
      } catch (e) {
        console.error("Map snapshot failed", e);
        target.innerHTML = '<div class="text-white/50">Map Preview Unavailable</div>';
      }
    } else {
      // For Chart.js, we can get base64 image
      const chartCanvas = document.getElementById('dd-chart');
      const img = new Image();
      img.src = chartCanvas.toDataURL();
      img.className = 'w-full h-full object-contain';
      target.appendChild(img);
    }

    // 3. Render the Card
    const cardContainer = document.getElementById('share-card');
    const shareModal = document.getElementById('share-modal');
    const previewContainer = document.getElementById('share-preview-container');

    shareModal.classList.remove('hidden'); // Show modal first to show loading state

    try {
      // Wait a tick for DOM updates
      await new Promise(r => setTimeout(r, 100));

      const cardCanvas = await html2canvas(cardContainer, {
        backgroundColor: '#0f172a', // slate-900
        scale: 2 // Retina quality
      });

      const imgUrl = cardCanvas.toDataURL('image/png');

      // Update Preview
      previewContainer.innerHTML = '';
      const previewImg = new Image();
      previewImg.src = imgUrl;
      previewImg.className = 'w-full h-full object-contain';
      previewContainer.appendChild(previewImg);

      // Configure buttons
      const btnDownload = document.getElementById('btn-download-img');
      const btnCopy = document.getElementById('btn-copy-img');

      btnDownload.onclick = () => {
        const a = document.createElement('a');
        a.href = imgUrl;
        a.download = `insight-${new Date().getTime()}.png`;
        a.click();
      };

      btnCopy.onclick = async () => {
        try {
          const blob = await (await fetch(imgUrl)).blob();
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          btnCopy.innerHTML = '<i class="fa-solid fa-check mr-2"></i>Copied!';
          setTimeout(() => btnCopy.innerHTML = '<i class="fa-regular fa-copy mr-2"></i>Copy to Clipboard', 2000);
        } catch (e) {
          console.error("Clipboard failed", e);
          alert("Clipboard access denied or not supported");
        }
      };

    } catch (e) {
      console.error("Share generation failed", e);
      previewContainer.innerHTML = '<div class="text-red-500">Failed to generate preview</div>';
    }
  }
};

// Make DD globally accessible for the fit button
window.DD = DD;

document.addEventListener('DOMContentLoaded', () => {
  DD.init();

  // Footer share button functionality
  const footerShareBtn = document.getElementById('footer-share-btn');
  if (footerShareBtn) {
    footerShareBtn.addEventListener('click', () => DD.shareInsight());
  }
});
