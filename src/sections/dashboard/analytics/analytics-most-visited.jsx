import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import { ItemSearch } from './filter-purchases';

export const AnalyticsMostVisited = (props) => {
  const { selectedParams, setSelectedParams } = props;

  return (
    <Card>
      <ItemSearch
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
      />
    </Card>
  );
};

AnalyticsMostVisited.propTypes = {
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func.isRequired,
};
