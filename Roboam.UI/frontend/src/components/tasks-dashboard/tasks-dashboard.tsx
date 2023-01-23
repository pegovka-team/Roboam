import { Star } from "@mui/icons-material";
import ScoreItem from "../score-item";
import { Paper } from "@mui/material";
import { FC, Fragment, useContext } from "react";
import { IAlgorithmData } from "../../models/algorithm-data";
import { ROOT_STORE_CONTEXT } from "../../index";
import { observer } from "mobx-react";
import {
    AutoSizer as _AutoSizer,
    AutoSizerProps,
    Grid as _Grid,
    GridCellProps,
    GridProps,
    OverscanIndices,
    OverscanIndicesGetterParams
} from "react-virtualized";

// https://github.com/bvaughn/react-virtualized/issues/1739
const AutoSizer = _AutoSizer as unknown as FC<AutoSizerProps>;
const Grid = _Grid as unknown as FC<GridProps>;

const rowsCount = 24;

const TasksDashboard = observer(({tasks}: {tasks: IAlgorithmData[]}) => {
    if (tasks.length === 0)
        return <div>Loading..</div>;
    
    const columnsCount = Math.ceil(tasks.length / rowsCount);
    
    return (
        <Paper square sx={{userSelect: 'none', overflow: 'hidden', height: '100vh', width: '100%'}}>
            <AutoSizer disableHeight>
                {({width}) => (
                    <Grid
                        style={{paddingBlockStart: '8px', paddingInlineStart: '8px' }}
                        cellRenderer={it => cellRenderer(it, tasks)}
                        columnWidth={200}
                        columnCount={columnsCount}
                        height={window.innerHeight}
                        rowHeight={30}
                        rowCount={rowsCount}
                        width={width}
                        overscanColumnCount={5}
                        overscanIndicesGetter={bothDirectionOverscanIndicesGetter}
                    />)}
            </AutoSizer>
        </Paper>
    );
});

export function bothDirectionOverscanIndicesGetter({
   cellCount,
   overscanCellsCount,
   startIndex,
   stopIndex,
}: OverscanIndicesGetterParams): OverscanIndices {
    return {
        overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
        overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
    }
}

function cellRenderer({columnIndex, rowIndex, style}: GridCellProps, items: IAlgorithmData[]) {
    const item = items[rowsCount * columnIndex + rowIndex];
    
    if (!item) {
        return <Fragment />;
    }
    
    return (
        <div style={style} key={`${columnIndex}-${rowIndex}`}>
            <TaskItem item={item}/>
        </div>
    );
}

interface TaskItemProps {
    item: IAlgorithmData;
    disableStar?: boolean;
    disableTaskNumber?: boolean;
}

export const TaskItem = observer(({item, disableStar, disableTaskNumber}: TaskItemProps) => {
    const { rootStore } = useContext(ROOT_STORE_CONTEXT);
    const { favoriteTasksStore } = rootStore;
    const { favoriteTasksMap } = favoriteTasksStore;

    return (
        <div key={item.taskNumber} style={{
            display: 'flex',
            height: '28px',
            lineHeight: '28px',
            alignItems: 'center',
            justifyContent: 'left',
        }}>
            {disableStar ? null : (
                <div style={{ width: 25, height: 24 }}>
                    {favoriteTasksMap[item.taskNumber]
                        ? <Star sx={{color: 'gold'}} onClick={() => favoriteTasksStore.deleteFavorite(item.taskNumber)} />
                        : <Star sx={{color: 'lightgray'}} onClick={() => favoriteTasksStore.setFavorite(item.taskNumber)} />
                    }
                </div>
            )}
            {disableTaskNumber ? null : (
                <div style={{ width: 30, fontSize: '12px' }}>{item.taskNumber}</div>
            )}
            <div style={{ width: 100, height: 22 }}>
                <ScoreItem
                    width={100}
                    algorithmName={item.algorithmName}
                    algorithmCurrentScore={item.algorithmCurrentScore}
                    algorithmMax={item.algorithmMax}
                    localMax={item.localMax}
                    globalMax={item.globalMax}
                    precision={0}
                />
            </div>
            <div style={{ paddingLeft: 8, color: 'gray', fontSize: '10px' }}>
                {getTimeInterval(item.bestSentTimeMin)}
            </div>
        </div>
    );
});

function getTimeInterval(minutes: number): string {
    if (minutes <= 1) {
        return 'now';
    }
    if (minutes <= 5) {
        return '< 5m';
    }
    if (minutes <= 10) {
        return '< 10m';
    }
    if (minutes <= 30) {
        return '< 30m';
    }
    if (minutes <= 60) {
        return '< 60m';
    }
    return '';
}

export default TasksDashboard;
