import * as R from 'ramda';
import {mapPropValueAsIndex} from 'rescape-ramda';
import numeral from 'numeral';
import {compact} from 'rescape-ramda'

const columns = [
  'siteName',
  'location',
  'coordinates',
  'junctionStage',
  'annualTonnage'
];
export const stages = [
  {key: 'source', name: 'Source', targets: ['conversion']},
  {key: 'conversion', name: 'Conversion', targets: ['demand']},
  {key: 'distribution', name: 'Distribution', targets: ['demand']},
  {key: 'demand', name: 'Demand', targets: ['sink']},
  {key: 'reconversion', name: 'Reconversion', targets: ['demand']},
  {key: 'sink', name: 'Sink', targets: []}
];
export const linkStages = R.zipWith(
  (source, target) => ({
    key: R.join('-', R.map(R.prop('key'), [source, target])),
    name: R.join(' -> ', R.map(R.prop('name'), [source, target])),
    source,
    target
  }),
  R.slice(0, -1, stages), R.slice(1, Infinity, stages)
);


const stageByName = mapPropValueAsIndex('name', stages);
const stageKey = 'junctionStage';
export const resolveLinkStage = d => d.target[stageKey];
export const resolveNodeStage = d => d[stageKey];
const siteNameAbbreviations = {
  'Residential Buildings': '(Res)',
  'Non-residential Buildings': '(non-Res)'
}
// If the location of the node has been generalized add it to the name so users know
// it isn't in an exact location.
// For demand nodes include only a site name abbreviation if one is listed above)
export const resolveNodeName = d => {
  return `${d[stageKey] === 'Demand' ? R.join(' ', compact([d.location, siteNameAbbreviations[d.siteName]])) : d.siteName} ${d.isGeneralized ? ' (general location)' : ''}\n${d.annualTonnage} t`;
}
export const resolveLinkOpacity = d => d.target[stageKey] === 'Demand' ? 0.05 : 0.2
// Used for node and link values
const valueKey = 'annualTonnage';

const BRUSSELS_LOCATION = [4.3517, 50.8503];
// Minutely move locations so they don't overlap
const aberrateLocation = (index, location, factor = .005) =>
  R.addIndex(R.map)((coord, j) => coord + factor * (index % 2 ? -index : index) * (j || -1))(location);
const aberrateBrusselsLocation = index => aberrateLocation(index, BRUSSELS_LOCATION);

/**
 * Creates a Sankey node from ; separated strings
 * @param [String] lines An array of lines that are from a spreadsheet and delimited by semicolons
 */
const createNodes = R.map(
  line => R.fromPairs(
    R.zip(
      columns,
      R.split(';', line)
    )
  )
);

const groups = [
  {
    material: 'Minerals',
    nodes: createNodes([
      "Other Global Imports;Shipments, location generalized;51.309933, 3.055030;Source;8,987,937",
      "Knauf (Danilith) BE;Waregemseweg 156-142 9790 Wortegem-Petegem, Belgium;50.864762, 3.479308;Conversion;657,245",
      "Other Mineral Processing Facilities;;Mock data point;Conversion;2,022,165",
      "MPRO Bruxelles;Avenue du Port 67 1000 Bruxelles, Belgium;50.867486, 4.352543;Distribution;18,632",
      "Non-residential Buildings;Anderlecht;50.831117, 4.292568;Demand;71,862;9%",
      "Non-residential Buildings;Auderghem;50.811836, 4.439129;Demand;21,663;3%",
      "Non-residential Buildings;Berchem Ste-Agathe;50.864546, 4.293651;Demand;14,243;2%",
      "Non-residential Buildings;Bruxelles;50.883771, 4.360282;Demand;117,413;15%",
      "Non-residential Buildings;Etterbeek;50.833040, 4.394748;Demand;35,405;5%",
      "Non-residential Buildings;Evere;50.869403, 4.408122;Demand;24,658;3%",
      "Non-residential Buildings;Forest;50.814891, 4.322296;Demand;36,062;5%",
      "Non-residential Buildings;Ganshoren;50.874882, 4.309024;Demand;15,950;2%",
      "Non-residential Buildings;Ixelles;50.824109, 4.378621;Demand;72,221;9%",
      "Non-residential Buildings;Jette;50.883548, 4.324707;Demand;31,202;4%",
      "Non-residential Buildings;Koekelberg;50.864177, 4.324544;Demand;12,543;2%",
      "Non-residential Buildings;Molenbeek St-Jean;50.854728, 4.319360;Demand;54,352;7%",
      "Non-residential Buildings;St-Gilles;50.829021, 4.344830;Demand;36,847;5%",
      "Non-residential Buildings;St-Josse-ten-Noode;50.854650, 4.369372;Demand;17,196;2%",
      "Non-residential Buildings;Schaerbeek;50.860953, 4.388751;Demand;79,640;10%",
      "Non-residential Buildings;Uccle;50.792253, 4.361790;Demand;53,680;7%",
      "Non-residential Buildings;Watermael-Boitsfort;50.795646, 4.423132;Demand;16,407;2%",
      "Non-residential Buildings;Woluwe-St-Lambert;50.849110, 4.430891;Demand;38,639;5%",
      "Non-residential Buildings;Woluwe-St-Pierre;50.831253, 4.440222;Demand;26,564;3%",
      "Residential Buildings;Anderlecht;50.831117, 4.292568;Demand;15,564",
      "Residential Buildings;Auderghem;50.811836, 4.439129;Demand;4,692",
      "Residential Buildings;Berchem Ste-Agathe;50.864546, 4.293651;Demand;3,085",
      "Residential Buildings;Bruxelles;50.883771, 4.360282;Demand;25,430",
      "Residential Buildings;Etterbeek;50.833040, 4.394748;Demand;7,668",
      "Residential Buildings;Evere;50.869403, 4.408122;Demand;5,340",
      "Residential Buildings;Forest;50.814891, 4.322296;Demand;7,810",
      "Residential Buildings;Ganshoren;50.874882, 4.309024;Demand;3,454",
      "Residential Buildings;Ixelles;50.824109, 4.378621;Demand;15,642",
      "Residential Buildings;Jette;50.883548, 4.324707;Demand;6,758",
      "Residential Buildings;Koekelberg;50.864177, 4.324544;Demand;2,717",
      "Residential Buildings;Molenbeek St-Jean;50.854728, 4.319360;Demand;11,772",
      "Residential Buildings;St-Gilles;50.829021, 4.344830;Demand;7,980",
      "Residential Buildings;St-Josse-ten-Noode;50.854650, 4.369372;Demand;3,724",
      "Residential Buildings;Schaerbeek;50.860953, 4.388751;Demand;17,249",
      "Residential Buildings;Uccle;50.792253, 4.361790;Demand;11,626",
      "Residential Buildings;Watermael-Boitsfort;50.795646, 4.423132;Demand;3,554",
      "Residential Buildings;Woluwe-St-Lambert;50.849110, 4.430891;Demand;8,369",
      "Residential Buildings;Woluwe-St-Pierre;50.831253, 4.440222;Demand;5,753",
      "New West Gypsum Recycling;9130 Beveren, Sint-Jansweg 9 Haven 1602, Kallo, Belgium;51.270229, 4.261048;Reconversion;87,565",
      "RecyPark South;1190 Forest, Belgium;50.810799, 4.314789;Reconversion;3,130",
      "RecyPark Nord;Rue du Rupel, 1000 Bruxelles, Belgium;50.880181, 4.377136;Reconversion;1,162",
      "Landfill;Wolfsdal 52/Z, 3530 Houthalen-Helchteren, Belgium;51.065022, 5.348650;Sink;332,488",
      "Incinerator;Quai Léon Monnoyer 8 1000 Bruxelles;50.883404, 4.380686;Sink;142,495"
    ])
  },
  {
    material: 'Metals',
    nodes: createNodes([
      "Global Imports;Shipments, location generalized;51.309933, 3.055030;Source;367,689",
      "Arcelor Steel Belgium;Lammerdries 10, 2440 Geel, Belgium;51.145051, 4.939373;Conversion;27,872",
      "Other Metal Processing Facilities;;Mock data point;Conversion;98,762",
      "Non-residential Buildings;Anderlecht;50.831117, 4.292568;Demand;17,955",
      "Non-residential Buildings;Auderghem;50.811836, 4.439129;Demand;5,413",
      "Non-residential Buildings;Berchem Ste-Agathe;50.864546, 4.293651;Demand;3,559",
      "Non-residential Buildings;Bruxelles;50.883771, 4.360282;Demand;29,336",
      "Non-residential Buildings;Etterbeek;50.833040, 4.394748;Demand;8,846",
      "Non-residential Buildings;Evere;50.869403, 4.408122;Demand;6,161",
      "Non-residential Buildings;Forest;50.814891, 4.322296;Demand;9,010",
      "Non-residential Buildings;Ganshoren;50.874882, 4.309024;Demand;3,985",
      "Non-residential Buildings;Ixelles;50.824109, 4.378621;Demand;18,045",
      "Non-residential Buildings;Jette;50.883548, 4.324707;Demand;7,796",
      "Non-residential Buildings;Koekelberg;50.864177, 4.324544;Demand;3,134",
      "Non-residential Buildings;Molenbeek St-Jean;50.854728, 4.319360;Demand;13,580",
      "Non-residential Buildings;St-Gilles;50.829021, 4.344830;Demand;9,206",
      "Non-residential Buildings;St-Josse-ten-Noode;50.854650, 4.369372;Demand;4,297",
      "Non-residential Buildings;Schaerbeek;50.860953, 4.388751;Demand;19,898",
      "Non-residential Buildings;Uccle;50.792253, 4.361790;Demand;13,412",
      "Non-residential Buildings;Watermael-Boitsfort;50.795646, 4.423132;Demand;4,099",
      "Non-residential Buildings;Woluwe-St-Lambert;50.849110, 4.430891;Demand;9,654",
      "Non-residential Buildings;Woluwe-St-Pierre;50.831253, 4.440222;Demand;6,637",
      "Residential Buildings;Anderlecht;50.831117, 4.292568;Demand;8,978",
      "Residential Buildings;Auderghem;50.811836, 4.439129;Demand;2,706",
      "Residential Buildings;Berchem Ste-Agathe;50.864546, 4.293651;Demand;1,779",
      "Residential Buildings;Bruxelles;50.883771, 4.360282;Demand;14,668",
      "Residential Buildings;Etterbeek;50.833040, 4.394748;Demand;4,423",
      "Residential Buildings;Evere;50.869403, 4.408122;Demand;3,080",
      "Residential Buildings;Forest;50.814891, 4.322296;Demand;4,505",
      "Residential Buildings;Ganshoren;50.874882, 4.309024;Demand;1,993",
      "Residential Buildings;Ixelles;50.824109, 4.378621;Demand;9,022",
      "Residential Buildings;Jette;50.883548, 4.324707;Demand;3,898",
      "Residential Buildings;Koekelberg;50.864177, 4.324544;Demand;1,567",
      "Residential Buildings;Molenbeek St-Jean;50.854728, 4.319360;Demand;6,790",
      "Residential Buildings;St-Gilles;50.829021, 4.344830;Demand;4,603",
      "Residential Buildings;St-Josse-ten-Noode;50.854650, 4.369372;Demand;2,148",
      "Residential Buildings;Schaerbeek;50.860953, 4.388751;Demand;9,949",
      "Residential Buildings;Uccle;50.792253, 4.361790;Demand;6,706",
      "Residential Buildings;Watermael-Boitsfort;50.795646, 4.423132;Demand;2,050",
      "Residential Buildings;Woluwe-St-Lambert;50.849110, 4.430891;Demand;4,827",
      "Residential Buildings;Woluwe-St-Pierre;50.831253, 4.440222;Demand;3,319",
      "Metallo Belgium;Nieuwe Dreef 33, 2340 Beerse, Belgium;51.318025, 4.817432;Reconversion;54,585",
      "RecyPark South;1190 Forest, Belgium;50.810799, 4.314789;Reconversion;101",
      "RecyPark Nord;Rue du Rupel, 1000 Bruxelles, Belgium;50.880181, 4.377136;Reconversion;67",
      "Other Metal Recycling Facilities;;Mock data point;Reconversion;117,882",
      "Landfill;Wolfsdal 52/Z, 3530 Houthalen-Helchteren, Belgium;51.065022, 5.348650;Sink;88,716",
      "Incinerator;Quai Léon Monnoyer 8 1000 Bruxelles;50.883404, 4.380686;Sink;101,262"
    ])
  },
  {
    material: 'Wood',
    nodes: createNodes([
      "Forêt de Soignes;Watermael-Boitsfort Belgium ;50.777072, 4.409960;Source;6,288",
      "Germany Imports;Germany, nearest point;50.786952, 6.102697;Source;66,812",
      "Netherlands Imports;Netherlans, nearest point;51.467197, 4.609125;Source;52,352",
      "Other Global Imports;Shipments, location generalized;51.309933, 3.055030;Source;323,384",
      "Barthel Pauls Sawmill;Pôle Ardenne Bois 1, 6671 Bovigny, Belgium;50.259872, 5.933474;Conversion;114,750",
      "Other Wood Processing Facilities;;Mock data point;Conversion;78,652",
      "Lochten & Germeau;Bd de l’Humanité, 51, 1190 Vorst, Belgium;50.820974, 4.314469;Distribution; NA, only for directional/path",
      "Non-residential Buildings;Anderlecht;50.831117, 4.292568;Demand;10,895",
      "Non-residential Buildings;Auderghem;50.811836, 4.439129;Demand;3,284",
      "Non-residential Buildings;Berchem Ste-Agathe;50.864546, 4.293651;Demand;2,159",
      "Non-residential Buildings;Bruxelles;50.883771, 4.360282;Demand;17,800",
      "Non-residential Buildings;Etterbeek;50.833040, 4.394748;Demand;5,368",
      "Non-residential Buildings;Evere;50.869403, 4.408122;Demand;3,738",
      "Non-residential Buildings;Forest;50.814891, 4.322296;Demand;5,467",
      "Non-residential Buildings;Ganshoren;50.874882, 4.309024;Demand;2,418",
      "Non-residential Buildings;Ixelles;50.824109, 4.378621;Demand;10,949",
      "Non-residential Buildings;Jette;50.883548, 4.324707;Demand;4,730",
      "Non-residential Buildings;Koekelberg;50.864177, 4.324544;Demand;1,902",
      "Non-residential Buildings;Molenbeek St-Jean;50.854728, 4.319360;Demand;8,240",
      "Non-residential Buildings;St-Gilles;50.829021, 4.344830;Demand;5,586",
      "Non-residential Buildings;St-Josse-ten-Noode;50.854650, 4.369372;Demand;2,607",
      "Non-residential Buildings;Schaerbeek;50.860953, 4.388751;Demand;12,074",
      "Non-residential Buildings;Uccle;50.792253, 4.361790;Demand;8,138",
      "Non-residential Buildings;Watermael-Boitsfort;50.795646, 4.423132;Demand;2,487",
      "Non-residential Buildings;Woluwe-St-Lambert;50.849110, 4.430891;Demand;5,858",
      "Non-residential Buildings;Woluwe-St-Pierre;50.831253, 4.440222;Demand;4,027",
      "Residential Buildings;Anderlecht;50.831117, 4.292568;Demand;5,447",
      "Residential Buildings;Auderghem;50.811836, 4.439129;Demand;1,642",
      "Residential Buildings;Berchem Ste-Agathe;50.864546, 4.293651;Demand;1,080",
      "Residential Buildings;Bruxelles;50.883771, 4.360282;Demand;8,900",
      "Residential Buildings;Etterbeek;50.833040, 4.394748;Demand;2,684",
      "Residential Buildings;Evere;50.869403, 4.408122;Demand;1,869",
      "Residential Buildings;Forest;50.814891, 4.322296;Demand;2,734",
      "Residential Buildings;Ganshoren;50.874882, 4.309024;Demand;1,209",
      "Residential Buildings;Ixelles;50.824109, 4.378621;Demand;5,475",
      "Residential Buildings;Jette;50.883548, 4.324707;Demand;2,365",
      "Residential Buildings;Koekelberg;50.864177, 4.324544;Demand;951",
      "Residential Buildings;Molenbeek St-Jean;50.854728, 4.319360;Demand;4,120",
      "Residential Buildings;St-Gilles;50.829021, 4.344830;Demand;2,793",
      "Residential Buildings;St-Josse-ten-Noode;50.854650, 4.369372;Demand;1,304",
      "Residential Buildings;Schaerbeek;50.860953, 4.388751;Demand;6,037",
      "Residential Buildings;Uccle;50.792253, 4.361790;Demand;4,069",
      "Residential Buildings;Watermael-Boitsfort;50.795646, 4.423132;Demand;1,244",
      "Residential Buildings;Woluwe-St-Lambert;50.849110, 4.430891;Demand;2,929",
      "Residential Buildings;Woluwe-St-Pierre;50.831253, 4.440222;Demand;2,014",
      "Rotor Deconstruction;Prévinairestraat / Rue Prévinaire 58 1070 Anderlecht;50.839714, 4.352730;Reconversion;15,462",
      "PAC Uccle;Boulevard de la Deuxième Armée Britannique 625-667 1190 Forest, Belgium;50.801647, 4.305641;Reconversion;189",
      "PAC Saint-Josse;Rue Verboeckhaven 39-17 1210 Saint-Josse-ten-Noode, Belgium;50.854094, 4.375173;Reconversion;126",
      "PAC Woluwe-Saint-Pierre;Avenue du Parc de Woluwe 86-44 1160 Auderghem, Belgium;50.823228, 4.427453;Reconversion;63",
      "PAC d’Auderghem/Watermael-Boitsfort;1860 chaussée de Wavre, 1160 Auderghem;50.809948, 4.445271;Reconversion;252",
      "RecyPark South;1190 Forest, Belgium;50.810799, 4.314789;Reconversion;668",
      "RecyPark Nord;Rue du Rupel, 1000 Bruxelles, Belgium;50.880181, 4.377136;Reconversion;445",
      "Landfill;Wolfsdal 52/Z, 3530 Houthalen-Helchteren, Belgium;51.065022, 5.348650;Sink;24,678",
      "Incinerator;Quai Léon Monnoyer 8 1000 Bruxelles;50.883404, 4.380686;Sink;56,241"
    ])
  }
];

/**
 * Resolves the lat/lon based on the given coordinates string. If it is NA then default to BRUSSELS_LOCATION
 * @param {String} coordinates comma separated lon/lat. We flip this since the software wants [lat, lon]
 * @return [Float] lat/lon array
 */
const resolveLocation = (coordinates, i) =>
  R.ifElse(
    R.equals('Mock data point'),
    R.always({
      isGeneralized: true,
      location: aberrateBrusselsLocation(i)
    }),
    coord => ({
      isGeneralized: false,
      location: aberrateLocation(i, R.reverse(R.map(parseFloat, R.split(',', coord))), 0.00005)
    })
  )(coordinates);

/**
 * Creates Sankey Links for the given ordered stages for the given nodes by stage
 * @param [Object] stages Array of stage objects.
 * @param [Object] nodesByStages Keyed by stage key and valued by an array of nodes
 * @return {*}
 */
const createLinks = (stages, nodesByStages) => R.addIndex(R.chain)(
  (sourceStage, i) => {
    // Get the current stage as the source
    const sources = nodesByStages[sourceStage.key];
    if (!sources)
      return [];
    const targetStages = sourceStage.targets
    // If no more stages contain nodes, we're done
    if (!targetStages.length)
      return [];
    const targets = compact(R.chain(targetStage => nodesByStages[targetStage], targetStages));
    return R.chain(
      source => R.map(
        target => ({
          source: source.index,
          target: target.index,
          value: numeral(R.prop(valueKey, source)).value()
        }),
        targets),
      sources
    );
  },
  stages
);

const groupToNodesAndLinks = (accumulatedGraph, group) => {
  const nodeCount = R.length(accumulatedGraph.nodes || 0);
  // Accumulate nodes for each stage
  const nodesByStages = R.addIndex(R.reduce)(
    (accum, node, i) => {
      const {location, isGeneralized} = resolveLocation(node.coordinates, i);
      return R.mergeWith(
        (l, r) => R.concat(l, r),
        accum,
        {
          [stageByName[node[stageKey]].key]: [
            R.merge(
              node,
              {
                index: i + nodeCount,
                material: group.material,
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: location
                },
                name: node['siteName'],
                value: numeral(R.prop(valueKey, node)).value(),
                isGeneralized,
                properties: {}
              }
            )
          ]
        }
      );
    },
    {},
    group.nodes);

  // Naively create a link between every node of consecutive stages
  return R.mergeWith(
    R.concat,
    accumulatedGraph,
    {
      // Flatten nodesByStages values to get all nodes
      nodes: R.flatten(R.values(nodesByStages)),
      links: createLinks(stages, nodesByStages)
    }
  );
};

export default R.reduce(
  groupToNodesAndLinks,
  {nodes: [], links: []},
  groups
);