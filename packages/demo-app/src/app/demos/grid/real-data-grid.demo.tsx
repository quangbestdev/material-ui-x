import * as React from 'react';
import { XGrid, LicenseInfo, RowModel, Columns, GridOptions } from '@material-ui/x-grid';
import pkg from '@material-ui/x-grid/package.json';
import { commodityColumns, employeeColumns } from '@material-ui/x-grid-data-generator';
import { AppBreadcrumbs } from '../../app-breadcrumbs';
import { MainContainer } from './components/main-container';
import { SettingsPanel } from './components/settings-panel';
// eslint-disable-next-line no-restricted-imports
import '@material-ui/x-grid-data-generator/dist/demo-style.css';
import { useTheme } from '../theme';

// eslint-disable-next-line no-console
console.info(
  '*******************************\n' +
    `    GRID VERSION: ${pkg.version}   \n` +
    '*******************************',
);

LicenseInfo.setLicenseKey(
  '80dab07483993e147508c3a1d6b127e5T1JERVI6ZGVtb2FwcCxFWFBJUlk9MTYyNDA5OTE1NjQzNSxLRVlWRVJTSU9OPTE=',
);

const loadFile = async (file: string) => {
  const response = await fetch(file);
  const data = await response.json();

  return data;
};

const mapDates = (data: RowModel[], columns: Columns): RowModel[] => {
  const dateCols = columns.filter((c) => c.type === 'date' || c.type === 'dateTime');

  if (dateCols.length === 0) {
    return data;
  }

  const mappedData = data.map((row) => {
    dateCols.forEach((dateCol) => {
      row[dateCol.field] = new Date(row[dateCol.field]);
    });

    return row;
  });

  return mappedData;
};

export function RealDataGridDemo() {
  const [size, setSize] = React.useState(100);
  const [type, setType] = React.useState('commodity');

  const [rows, setRows] = React.useState<any>([]);
  const [cols, setCols] = React.useState<any>([]);
  const [pagination, setPagination] = React.useState<Partial<GridOptions>>({});
  const [loading, setLoading] = React.useState(false);
  const { themeId, toggleTheme } = useTheme();

  React.useEffect(() => {
    const gridColumns = type === 'commodity' ? commodityColumns : employeeColumns;
    setRows([]);
    setCols(gridColumns);
    setLoading(true);

    loadFile(`./static-data/${type}-1000.json`).then(
      (data) => {
        if (size > 1000) {
          while (data.length < size) {
            data = [...data, ...data];
          }
          data = data.map((row, idx) => ({ ...row, ...{ id: idx } }));
        }
        data.length = size;
        data = mapDates(data, gridColumns as Columns);

        // eslint-disable-next-line no-console
        console.log(`Setting rows with length ${data.length}`);
        setRows(data);
        setLoading(false);
      },
      () => {
        setRows([]);
      },
    );
  }, [setRows, type, size]);

  const onApplyClick = (settings: {
    size: number;
    type: string;
    selectedTheme: string;
    pagesize: number;
  }) => {
    if (size !== settings.size) {
      setSize(settings.size);
    }
    if (type !== settings.type) {
      setType(settings.type.toLowerCase());
    }
    if (settings.selectedTheme !== themeId) {
      toggleTheme();
    }

    const newPagination: Partial<GridOptions> = {
      pagination: settings.pagesize !== -1,
      paginationAutoPageSize: settings.pagesize === 0,
      paginationPageSize: settings.pagesize > 0 ? settings.pagesize : undefined,
    };

    setPagination((p) => {
      if (
        p.pagination === newPagination.pagination &&
        p.paginationAutoPageSize === newPagination.paginationAutoPageSize &&
        p.paginationPageSize === newPagination.paginationPageSize
      ) {
        return p;
      }
      return newPagination;
    });
  };

  return (
    <React.Fragment>
      <AppBreadcrumbs name="NEW* Material-UI X Grid" />
      <SettingsPanel onApply={onApplyClick} size={size} type={type} />
      <MainContainer>
        <div style={{ display: 'flex', boxSizing: 'border-box' }} className="fill-space">
          <div className="grow">
            <XGrid
              rows={rows as any}
              columns={cols as any}
              loading={loading}
              options={{ checkboxSelection: true, ...pagination }}
            />
          </div>
        </div>
      </MainContainer>
    </React.Fragment>
  );
}
