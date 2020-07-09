import { useEffect, useState } from 'react';
import { getData, GridData } from '../data/data-service';

export const useData = (nbRows: number, nbCols: number, onData?: (data: GridData) => void) => {
  const [data, setData] = useState<GridData>({ rows: [], columns: [] });

  const loadData = async () => {
    const newData = await getData(nbRows, nbCols);
    if (onData != null) {
      onData(newData);
    }
    setData(newData);
  };

  useEffect(() => {
    loadData();
  }, [nbRows, nbCols]);

  return data;
};
