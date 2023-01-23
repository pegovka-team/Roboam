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
import TaskItem from "../task-item/task-item";

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

export default TasksDashboard;
