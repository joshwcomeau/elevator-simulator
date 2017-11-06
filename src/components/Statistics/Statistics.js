// @flow
import React from 'react';
import { connect } from 'react-redux';

import { getAverageStats } from '../../reducers/stats.reducer';

type Props = {
  stats: {
    averageWait: ?number,
    averageRide: ?number,
    averageTotal: ?number,
  },
};

const Statistics = ({ stats }: Props) => {
  return (
    <div>
      Average wait: {stats.averageWait || '--'}
      <br />
      Average ride: {stats.averageRide || '--'}
      <br />
      Average total: {stats.averageTotal || '--'}
      <br />
    </div>
  );
};

const mapStateToProps = state => ({
  stats: getAverageStats(state),
});

export default connect(mapStateToProps)(Statistics);
