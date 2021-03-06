/* tslint:disable:quotemark */

import {assert} from 'chai';

import {normalize, fieldDefs} from '../src/spec';

// describe('isStacked()') -- tested as part of stackOffset in stack.test.ts

describe('normalize()', function () {
  describe('normalizeFacetedUnit', () => {
    it('should convert single extended spec with column into a composite spec', function() {
      const spec: any = {
        "name": "faceted",
        "width": 123,
        "height": 234,
        "description": "faceted spec",
        "data": {"url": "data/movies.json"},
        "mark": "point",
        "encoding": {
          "column": {"field": "MPAA_Rating","type": "ordinal"},
          "x": {"field": "Worldwide_Gross","type": "quantitative"},
          "y": {"field": "US_DVD_Sales","type": "quantitative"}
        }
      };

      assert.deepEqual(normalize(spec), {
        "width": 123,
        "height": 234,
        "name": "faceted",
        "description": "faceted spec",
        "data": {"url": "data/movies.json"},
        "facet": {
          "column": {"field": "MPAA_Rating","type": "ordinal"}
        },
        "spec": {
          "mark": "point",
          "encoding": {
            "x": {"field": "Worldwide_Gross","type": "quantitative"},
            "y": {"field": "US_DVD_Sales","type": "quantitative"}
          }
        }
      });
    });

    it('should convert single extended spec with row into a composite spec', function() {
      const spec: any = {
        "data": {"url": "data/movies.json"},
        "mark": "point",
        "encoding": {
          "row": {"field": "MPAA_Rating","type": "ordinal"},
          "x": {"field": "Worldwide_Gross","type": "quantitative"},
          "y": {"field": "US_DVD_Sales","type": "quantitative"}
        }
      };

      assert.deepEqual(normalize(spec), {
        "data": {"url": "data/movies.json"},
        "facet": {
          "row": {"field": "MPAA_Rating","type": "ordinal"}
        },
        "spec": {
          "mark": "point",
          "encoding": {
            "x": {"field": "Worldwide_Gross","type": "quantitative"},
            "y": {"field": "US_DVD_Sales","type": "quantitative"}
          }
        }
      });
    });
  });

  describe('normalizeFacet', () => {
    it('should produce correct layered specs for mean point and vertical error bar', () => {
      assert.deepEqual(normalize({
        "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": {"filter": "datum.year == 2000"},
        facet: {
          "row": {"field": "MPAA_Rating","type": "ordinal"}
        },
        spec: {
          layer: [
            {
              "mark": "point",
              "encoding": {
                "x": {"field": "age","type": "ordinal"},
                "y": {
                  "aggregate": "mean",
                  "field": "people",
                  "type": "quantitative",
                  "axis": {"title": "population"}
                },
                "size": {"value": 2}
              }
            },
            {
              mark: 'error-bar',
              encoding: {
                "x": {"field": "age","type": "ordinal"},
                "y": {
                  "aggregate": "min",
                  "field": "people",
                  "type": "quantitative",
                  "axis": {"title": "population"}
                },
                "y2": {
                  "aggregate": "max",
                  "field": "people",
                  "type": "quantitative"
                },
                "size": {"value": 5}
              }
            }
          ]
        }
      }), {
        "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": {"filter": "datum.year == 2000"},
        facet: {
          "row": {"field": "MPAA_Rating","type": "ordinal"}
        },
        spec: {
          layer: [
            {
              "mark": "point",
              "encoding": {
                "x": {"field": "age","type": "ordinal"},
                "y": {
                  "aggregate": "mean",
                  "field": "people",
                  "type": "quantitative",
                  "axis": {"title": "population"}
                },
                "size": {"value": 2}
              }
            },
            {
              "layer": [
                {
                  "mark": "rule",
                  "encoding": {
                    "x": {"field": "age","type": "ordinal"},
                    "y": {
                      "aggregate": "min",
                      "field": "people",
                      "type": "quantitative",
                      "axis": {"title": "population"}
                    },
                    "y2": {
                      "aggregate": "max",
                      "field": "people",
                      "type": "quantitative"
                    }
                  }
                },
                {
                  "mark": "tick",
                  "encoding": {
                    "x": {"field": "age","type": "ordinal"},
                    "y": {
                      "aggregate": "min",
                      "field": "people",
                      "type": "quantitative",
                      "axis": {"title": "population"}
                    },
                    "size": {"value": 5}
                  }
                },
                {
                  "mark": "tick",
                  "encoding": {
                    "x": {"field": "age","type": "ordinal"},
                    "y": {
                      "aggregate": "max",
                      "field": "people",
                      "type": "quantitative",
                      // "axis": {"title": "population"}
                    },
                    "size": {"value": 5}
                  }
                }
              ]
            }
          ]
        }
      });
    });
  });

  describe('normalizeLayer', () => {
    it('should produce correct layered specs for mean point and vertical error bar', () => {
      assert.deepEqual(normalize({
        "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": {"filter": "datum.year == 2000"},
        layer: [
          {
            "mark": "point",
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "aggregate": "mean",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "size": {"value": 2}
            }
          },
          {
            mark: 'error-bar',
            encoding: {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "aggregate": "min",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "aggregate": "max",
                "field": "people",
                "type": "quantitative"
              },
              "size": {"value": 5}
            }
          }
        ]
      }), {
        "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": {"filter": "datum.year == 2000"},
        layer: [
          {
            "mark": "point",
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "aggregate": "mean",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "size": {"value": 2}
            }
          },
          {
            "layer": [
              {
                "mark": "rule",
                "encoding": {
                  "x": {"field": "age","type": "ordinal"},
                  "y": {
                    "aggregate": "min",
                    "field": "people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  },
                  "y2": {
                    "aggregate": "max",
                    "field": "people",
                    "type": "quantitative"
                  }
                }
              },
              {
                "mark": "tick",
                "encoding": {
                  "x": {"field": "age","type": "ordinal"},
                  "y": {
                    "aggregate": "min",
                    "field": "people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  },
                  "size": {"value": 5}
                }
              },
              {
                "mark": "tick",
                "encoding": {
                  "x": {"field": "age","type": "ordinal"},
                  "y": {
                    "aggregate": "max",
                    "field": "people",
                    "type": "quantitative",
                    // "axis": {"title": "population"}
                  },
                  "size": {"value": 5}
                }
              }
            ]
          }
        ]
      });
    });
  });

  describe('normalizeOverlay', () => {
    describe('line', () => {
      it('should be normalized correctly', () => {
        const spec: any = {
          "description": "Google's stock price over time.",
          "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
          "transform": {"filter": "datum[\"symbol\"]==='GOOG'"},
          "mark": "line",
          "encoding": {
            "x": {"field": "date", "type": "temporal"},
            "y": {"field": "price", "type": "quantitative"}
          },
          "config": {"overlay": {"line": true}}
        };
        const normalizedSpec = normalize(spec);
        assert.deepEqual(normalizedSpec, {
          "description": "Google's stock price over time.",
          "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
          "transform": {"filter": "datum[\"symbol\"]==='GOOG'"},
          "layer": [
            {
              "mark": "line",
              "encoding": {
                "x": {"field": "date","type": "temporal"},
                "y": {"field": "price","type": "quantitative"}
              }
            },
            {
              "mark": "point",
              "encoding": {
                "x": {"field": "date","type": "temporal"},
                "y": {"field": "price","type": "quantitative"}
              },
              "config": {"mark": {"filled": true}}
            }
          ]
        });
      });
    });

    describe('area', () => {
      it('with linepoint should be normalized correctly', () => {
        const spec: any = {
          "description": "Google's stock price over time.",
          "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
          "transform": {"filter": "datum[\"symbol\"]==='GOOG'"},
          "mark": "area",
          "encoding": {
            "x": {"field": "date", "type": "temporal"},
            "y": {"field": "price", "type": "quantitative"}
          },
          "config": {"overlay": {"area": 'linepoint'}}
        };
        const normalizedSpec = normalize(spec);
        assert.deepEqual(normalizedSpec, {
          "description": "Google's stock price over time.",
          "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
          "transform": {"filter": "datum[\"symbol\"]==='GOOG'"},
          "layer": [
            {
              "mark": "area",
              "encoding": {
                "x": {"field": "date","type": "temporal"},
                "y": {"field": "price","type": "quantitative"}
              }
            },
            {
              "mark": "line",
              "encoding": {
                "x": {"field": "date","type": "temporal"},
                "y": {"field": "price","type": "quantitative"}
              }
            },
            {
              "mark": "point",
              "encoding": {
                "x": {"field": "date","type": "temporal"},
                "y": {"field": "price","type": "quantitative"}
              },
              "config": {"mark": {"filled": true}}
            }
          ]
        });
      });

      it('with linepoint should be normalized correctly', () => {
        const spec: any = {
          "description": "Google's stock price over time.",
          "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
          "transform": {"filter": "datum[\"symbol\"]==='GOOG'"},
          "mark": "area",
          "encoding": {
            "x": {"field": "date", "type": "temporal"},
            "y": {"field": "price", "type": "quantitative"}
          },
          "config": {"overlay": {"area": 'line'}}
        };
        const normalizedSpec = normalize(spec);
        assert.deepEqual(normalizedSpec, {
          "description": "Google's stock price over time.",
          "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
          "transform": {"filter": "datum[\"symbol\"]==='GOOG'"},
          "layer": [
            {
              "mark": "area",
              "encoding": {
                "x": {"field": "date","type": "temporal"},
                "y": {"field": "price","type": "quantitative"}
              }
            },
            {
              "mark": "line",
              "encoding": {
                "x": {"field": "date","type": "temporal"},
                "y": {"field": "price","type": "quantitative"}
              }
            }
          ]
        });
      });
    });
  });
});

describe('normalizeRangedUnitSpec',  () => {
  it('should convert y2 -> y if there is no y in the encoding', function() {
    const spec: any = {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "y2": {"field": "age","type": "ordinal"},
        "x": {"aggregate": "min", "field": "people", "type": "quantitative"},
        "x2": {"aggregate": "max", "field": "people", "type": "quantitative"}
      }
    };

    assert.deepEqual(normalize(spec), {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "y": {"field": "age","type": "ordinal"},
        "x": {"aggregate": "min", "field": "people", "type": "quantitative"},
        "x2": {"aggregate": "max", "field": "people", "type": "quantitative"}
      }
    });
  });

  it('should do nothing if there is no missing x or y', function() {
    const spec: any = {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "y": {"field": "age","type": "ordinal"},
        "x": {"aggregate": "min", "field": "people", "type": "quantitative"},
        "x2": {"aggregate": "max", "field": "people", "type": "quantitative"}
      }
    };

    assert.deepEqual(normalize(spec), spec);
  });

  it('should convert x2 -> x if there is no x in the encoding', function() {
    const spec: any = {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "x2": {"field": "age","type": "ordinal"},
        "y": {"aggregate": "min", "field": "people", "type": "quantitative"},
        "y2": {"aggregate": "max", "field": "people", "type": "quantitative"}
      }
    };

    assert.deepEqual(normalize(spec), {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "x": {"field": "age","type": "ordinal"},
        "y": {"aggregate": "min", "field": "people", "type": "quantitative"},
        "y2": {"aggregate": "max", "field": "people", "type": "quantitative"}
      }
    });
  });
});

describe('fieldDefs()', function() {
  it('should get all non-duplicate fieldDefs from an encoding', function() {
    const spec: any = {
      "data": {"url": "data/cars.json"},
      "mark": "point",
      "encoding": {
        "x": {"field": "Horsepower","type": "quantitative"},
        "y": {"field": "Miles_per_Gallon","type": "quantitative"}
      }
    };

    assert.deepEqual(fieldDefs(spec), [
      {"field": "Horsepower","type": "quantitative"},
      {"field": "Miles_per_Gallon","type": "quantitative"}
    ]);
  });

  it('should get all non-duplicate fieldDefs from all layer in a LayerSpec', function() {
    const layerSpec: any = {
      "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
      "transform": {"filter": "datum.symbol==='GOOG'"},
      "layer": [
        {
          "description": "Google's stock price over time.",
          "mark": "line",
          "encoding": {
            "x": {"field": "date","type": "temporal"},
            "y": {"field": "price","type": "quantitative"}
          }
        },
        {
          "description": "Google's stock price over time.",
          "mark": "point",
          "encoding": {
            "x": {"field": "date","type": "temporal"},
            "y": {"field": "price","type": "quantitative"},
            "color": {"field": "symbol", "type": "nominal"}
          },
          "config": {"mark": {"filled": true}}
        }
      ]
    };

    assert.deepEqual(fieldDefs(layerSpec), [
      {"field": "date","type": "temporal"},
      {"field": "price","type": "quantitative"},
      {"field": "symbol", "type": "nominal"}
    ]);
  });

  it('should get all non-duplicate fieldDefs from all layer in a LayerSpec (merging duplicate fields with different scale types)', function() {
    const layerSpec: any = {
      "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
      "transform": {"filter": "datum.symbol==='GOOG'"},
      "layer": [
        {
          "description": "Google's stock price over time.",
          "mark": "line",
          "encoding": {
            "x": {"field": "date","type": "temporal"},
            "y": {"field": "price","type": "quantitative"}
          }
        },
        {
          "description": "Google's stock price over time.",
          "mark": "point",
          "encoding": {
            "x": {"field": "date","type": "temporal"},
            "y": {"field": "price","type": "quantitative"},
            "color": {"field": "date","type": "temporal", "scale": {"type": "pow"}}
          },
          "config": {"mark": {"filled": true}}
        }
      ]
    };

    assert.deepEqual(fieldDefs(layerSpec), [
      {"field": "date","type": "temporal"},
      {"field": "price","type": "quantitative"}
    ]);
  });

  it('should get all non-duplicate fieldDefs from facet and layer in a FacetSpec', function() {
    const facetSpec: any = {
      "data": {"url": "data/movies.json"},
      "facet": {"row": {"field": "MPAA_Rating","type": "ordinal"}},
      "spec": {
        "mark": "point",
        "encoding": {
          "x": {"field": "Worldwide_Gross","type": "quantitative"},
          "y": {"field": "US_DVD_Sales","type": "quantitative"}
        }
      }
    };

    assert.deepEqual(fieldDefs(facetSpec), [
      {"field": "MPAA_Rating","type": "ordinal"},
      {"field": "Worldwide_Gross","type": "quantitative"},
      {"field": "US_DVD_Sales","type": "quantitative"}
    ]);
  });
});
