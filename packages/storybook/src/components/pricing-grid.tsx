import * as React from 'react';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { XGrid, ColDef, GridApi, GridOptionsProp } from '@material-ui/x-grid';
import {
  PricingModel,
  subscribeCurrencyPair,
  pricingColumns,
} from '../data/streaming/pricing-service';
import { currencyPairs } from '../data/currency-pairs';

export interface PricingGridProps {
  min?: number;
  max?: number;
  options?: GridOptionsProp;
}
export const PricingGrid: React.FC<PricingGridProps> = (p) => {
  const [columns] = React.useState<ColDef[]>(pricingColumns);
  const [rows] = React.useState<PricingModel[]>([]);

  const [started, setStarted] = React.useState<boolean>(false);
  const gridApiRef = React.useRef<GridApi>(null);
  const stopButton = React.useRef<HTMLButtonElement>(null);

  const subscription: Subscription = new Subscription();
  const handleNewPrice = (pricingModel: PricingModel) => {
    if (gridApiRef && gridApiRef.current) {
      gridApiRef.current.updateRowData([pricingModel]);
    }
  };

  const subscribeToStream = () => {
    if (!started && stopButton && stopButton.current != null) {
      const cancel$ = fromEvent<HTMLButtonElement>(stopButton.current, 'click').pipe(
        tap(() => {
          setImmediate(() => setStarted(false));
        }),
      );

      for (let i = 0, len = currencyPairs.length; i < len; i += 1) {
        const data$ = subscribeCurrencyPair(currencyPairs[i], i, p.min, p.max);
        subscription.add(data$.pipe(takeUntil(cancel$)).subscribe((data) => handleNewPrice(data)));
      }
      setStarted(true);
    }
  };

  React.useEffect(() => {
    return () => {
      subscription.unsubscribe();
    };
  }, [stopButton]);

  const onStartStreamBtnClick = () => {
    if (!started) {
      subscribeToStream();
    }
  };
  return (
    <React.Fragment>
      <div>
        <button
          type="button"
          ref={stopButton}
          onClick={onStartStreamBtnClick}
          style={{ padding: 5, textTransform: 'capitalize', margin: 10 }}
        >
          {started ? 'Stop' : 'Start'} Ticking
        </button>
      </div>
      <div style={{ width: 800, height: 600 }}>
        <XGrid rows={rows} columns={columns} apiRef={gridApiRef} {...p} />
      </div>
    </React.Fragment>
  );
};
