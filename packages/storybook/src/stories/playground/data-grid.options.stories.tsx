import * as React from 'react';
import { DataGrid, DataGridOptionsProp } from '@material-ui/data-grid';
import { array, boolean, number, withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { GridOptionsProp, SortDirection } from '@material-ui/x-grid';
import { useData } from '../../hooks/useData';

export default {
  title: 'Data-Grid Demos/Options Events',
  component: DataGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/knobs/panel' },
    docs: {
      page: null,
    },
  },
};

export const Options = () => {
  const data = useData(2000, 200);
  const rowsPerPageOptions = array('paginationRowsPerPageOptions', ['25', '50', '100'], ', ');
  const sortingOrder = array('sortingOrder', ['asc', 'desc', 'null'], ', ');

  const dataGridOptionsProp: DataGridOptionsProp = {
    onRowClicked: (params) => action('onRowClicked')(params),
    onCellClicked: (params) => action('onCellClicked')(params),
    onColumnHeaderClicked: (params) => action('onColumnHeaderClicked')(params),
    onRowSelected: (params) => action('onRowSelected')(params),
    onSelectionChanged: (params) => action('onSelectionChanged', { depth: 1 })(params),
    onColumnsSorted: (params) => action('onColumnsSorted')(params),
    onPageChanged: (params) => action('onPageChanged')(params),
    onPageSizeChanged: (params) => action('onPageSizeChanged')(params),

    paginationPageSize: number('paginationPageSize', 100),
    paginationAutoPageSize: boolean('paginationAutoPageSize', false),
    paginationRowsPerPageOptions: rowsPerPageOptions.map((value) => parseInt(value, 10)),
    hideFooterRowCount: boolean('hideFooterRowCount', false),
    hideFooterPagination: boolean('hideFooterPagination', false),
    hideFooter: boolean('hideFooter', false),
    extendRowFullWidth: boolean('extendRowFullWidth', true),
    showCellRightBorder: boolean('showCellRightBorder', false),
    showColumnSeparator: boolean('showColumnSeparator', false),
    checkboxSelection: boolean('checkboxSelection', true),
    disableSelectionOnClick: boolean('disableSelectionOnClick', false),
    sortingOrder: sortingOrder.map((value) => (value === 'null' ? null : (value as SortDirection))),
    headerHeight: number('headerHeight', 56),
    rowHeight: number('rowHeight', 52),
  };

  return <DataGrid rows={data.rows} columns={data.columns} options={dataGridOptionsProp} />;
};
export const Events = () => {
  const data = useData(2000, 200);

  const options: GridOptionsProp = {
    onRowClicked: (params) => action('onRowClicked')(params),
    onCellClicked: (params) => action('onCellClicked')(params),
    onColumnHeaderClicked: (params) => action('onColumnHeaderClicked')(params),
    onRowSelected: (params) => action('onRowSelected')(params),
    onSelectionChanged: (params) => action('onSelectionChanged', { depth: 1 })(params),
    onColumnsSorted: (params) => action('onColumnsSorted')(params),
    onPageChanged: (params) => action('onPageChanged')(params),
    onPageSizeChanged: (params) => action('onPageSizeChanged')(params),
  };

  return <DataGrid rows={data.rows} columns={data.columns} options={options} />;
};
