import React, { useRef, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Measurement } from '../Features/Measurements/reducer';

const useStyles = makeStyles(theme => ({
  KPIContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    minWidth: '200px;',
  },
}));

type KPIProps = {
  measurement: Measurement;
};

export default ({ measurement }: KPIProps) => {
  const classes = useStyles();

  return (
    <Card raised className={classes.KPIContainer}>
      <CardHeader title={measurement.metric} />
      <Typography>{measurement.value}</Typography>
      <Typography>{measurement.unit}</Typography>
    </Card>
  );
};
