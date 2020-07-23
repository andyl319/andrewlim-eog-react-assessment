import React, { useRef, useState } from 'react';
import Dygraph from 'dygraphs';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Measurement } from '../Features/Measurements/reducer';

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

export default ({ labels, data }: GraphProps) => {
  const classes = useStyles();
  const graphRef = useRef<HTMLDivElement>(null);
  const [graph, setGraph] = useState<any>({});

  React.useEffect(() => {
    const createGraph = () => {
      if (graphRef.current !== null) {
        const csv = createCSV(labels, data);
        // console.log(csv);

        if (Object.keys(graph).length === 0) {
          if (csv.length > 0) {
            const g = new Dygraph(graphRef.current, csv, {
              labels: ['Date', ...labels],
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

  if (labels.length === 0 && Object.keys(graph).length > 0) {
    graph.destroy();
    setGraph(null);
  }
  return (
    <Card className={classes.graphContainer}>
      <CardHeader title="Metrics" />
      {labels.length === 0 ? (
        <LinearProgress />
      ) : (
        <>
          <CardContent>
            <div className={classes.graph} ref={graphRef} />
          </CardContent>
        </>
      )}
    </Card>
  );
};
