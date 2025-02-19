import * as React from 'react';
import {
  GridComponent,
  GridComponentProps,
  DEFAULT_GRID_OPTIONS,
  GridOptions,
  mergeOptions,
} from '@material-ui/x-grid-modules';

export type DataGridOptionsProp = Partial<
  Exclude<GridOptions, 'pagination' | 'enableMultipleColumnsSorting' | 'enableMultipleSelection'>
>;
const OPTIONS_OVERRIDES: Partial<GridOptions> = {
  pagination: true,
  enableMultipleColumnsSorting: false,
  enableMultipleSelection: false,
};

type ModuleGridType = Omit<GridComponentProps, 'licenseStatus' | 'apiRef' | 'options'>;
export interface DataGridProps extends ModuleGridType {
  options: DataGridOptionsProp;
}
const MAX_PAGE_SIZE = 100;
export const DataGrid: React.FC<DataGridProps> = React.memo(function DataGrid(
  props: DataGridProps,
) {
  const validateOptions = React.useCallback((options: DataGridOptionsProp) => {
    if (options && options.paginationPageSize && options.paginationPageSize > MAX_PAGE_SIZE) {
      throw new Error(
        `Material-UI: Option 'paginationPageSize' cannot be above ${MAX_PAGE_SIZE}. Use the @material-ui/x-grid to unlock this feature`,
      );
    }
    return options;
  }, []);

  const [internalOptions, setInternalOptions] = React.useState<GridOptions>(
    mergeOptions(DEFAULT_GRID_OPTIONS, {
      ...validateOptions(props.options),
      ...OPTIONS_OVERRIDES,
    }),
  );
  React.useEffect(() => {
    setInternalOptions((previousState) =>
      mergeOptions(previousState, {
        ...validateOptions(props.options),
        ...OPTIONS_OVERRIDES,
      }),
    );
  }, [props.options, validateOptions]);

  return (
    <GridComponent
      rows={props.rows}
      columns={props.columns}
      loading={props.loading}
      options={internalOptions}
      licenseStatus="Valid"
      className={`data-grid ${props.className || ''}`}
    />
  );
});
