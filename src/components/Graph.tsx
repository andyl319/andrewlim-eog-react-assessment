import React, { useRef, useState } from 'react';
import Dygraph from 'dygraphs';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { makeStyles } from '@material-ui/core/styles';
import { Measurement } from '../Features/Measurements/reducer';
import './graph.css';

const useStyles = makeStyles(theme => ({
  graphContainer: {
    width: '1400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  graph: {
    minWidth: '1200px',
    height: '500px',
  },
}));

type GraphProps = {
  labels: Array<string>;
  data: { [label: string]: Array<Measurement> };
  pause: boolean;
  togglePause: (b: boolean) => void;
  handleUserScroll: (e: any) => void;
};

type LegendValues = {
  xHTML: string;
  series: Array<any>;
};

const createCSV = (labels: Array<string>, data: { [label: string]: Array<Measurement> }) => {
  const csv: any[] = [];

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const labelData = data[label];

    for (let j = 0; j < labelData.length; j++) {
      const point = labelData[j];

      if (i === 0) {
        const row = Array(labels.length + 1).fill(null);
        row[0] = new Date(point.at);
        row[1] = point.value;
        csv.push(row);
      } else if (j < csv.length) {
        const row = csv[j];
        row.splice(i + 1, 1, point.value);
      }
    }
  }

  return csv;
};

const legendFormatter = (data: LegendValues) => {
  let html = `<div>Time: ${data.xHTML}</div>`;
  data.series.forEach((series, i) => {
    if (!series.isVisible) return;
    let { yHTML } = series;
    const labeledData = `
        <div class="dygraph-legend-row">
          ${series.dashHTML}
          <div>${series.labelHTML}: ${yHTML}</div>
        </div>`;
    html += labeledData;
  });
  return html;
};

export default ({ labels, data, togglePause, pause, handleUserScroll }: GraphProps) => {
  const classes = useStyles();
  const graphRef = useRef<HTMLDivElement>(null);
  const [graph, setGraph] = useState<any>(null);

  React.useEffect(() => {
    const createGraph = () => {
      if (graphRef.current !== null) {
        const csv = createCSV(labels, data);

        if (graph === null) {
          if (csv.length > 0) {
            const g = new Dygraph(graphRef.current, csv, {
              labels: ['Date', ...labels],
              legendFormatter: legendFormatter,
              legend: 'follow',
            });
            setGraph(g);
          }
        } else {
          graph.updateOptions({
            file: csv,
            labels: ['Date', ...labels],
          });
          setGraph(graph);
        }
      }
    };

    createGraph();
  }, [labels, data, graph]);

  if (labels.length === 0 && graph) {
    graph.destroy();
    setGraph(null);
  }

  return (
    <Card raised className={classes.graphContainer}>
      <CardHeader title="Metrics" />
      {labels.length === 0 ? (
        <LinearProgress />
      ) : (
        <>
          <CardContent style={{ width: '100%', height: '100%' }}>
            <div id="graph" onWheel={handleUserScroll} className={classes.graph} ref={graphRef} />
            <IconButton color="primary" onClick={() => togglePause(!pause)}>
              {pause ? <PlayCircleFilledIcon /> : <PauseCircleFilledIcon />}
            </IconButton>
            <Typography>
              *Scroll up on the graph in order to scroll back in time. Scroll down in order to scroll forward in time.
            </Typography>
          </CardContent>
        </>
      )}
    </Card>
  );
};
