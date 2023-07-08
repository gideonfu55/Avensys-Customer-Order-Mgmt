import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Loading() {
  return (
    <div>
      <FontAwesomeIcon icon={faSpinner} spin />
      <span>Loading....</span>
    </div>
  );
}

export default Loading;
