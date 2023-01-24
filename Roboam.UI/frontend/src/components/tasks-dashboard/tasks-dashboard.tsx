import { Paper } from "@mui/material";
import { FC, Fragment, useContext } from "react";
import { IAlgorithmData } from "../../models/algorithm-data";
import { ROOT_STORE_CONTEXT } from "../../index";
import { Observer, observer } from "mobx-react";
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

const rowHeight = 30;

const TasksDashboard = observer(({tasks}: {tasks: IAlgorithmData[]}) => {
    const { rootStore } = useContext(ROOT_STORE_CONTEXT);
    const { appStore, favoriteTasksStore } = rootStore;
    const { favoriteTasksMap } = favoriteTasksStore;

    if (tasks.length === 0)
        return <div>Loading..</div>;

    const favorite: IAlgorithmData[] = [];
    const otherTasks: IAlgorithmData[] = [];

    for (const task of tasks) {
        if (favoriteTasksMap[task.taskNumber]) {
            favorite.push(task);
        } else {
            otherTasks.push(task);
        }
    }

    const allTasks = [
        ...favorite,
        ...otherTasks
    ]
    
    const rowsCount = Math.floor(appStore.screenHeight / rowHeight) - 1; 
    const columnsCount = Math.ceil(allTasks.length / rowsCount);
    const indexToScroll = getIndexToScroll(appStore.taskNumberToScroll, favorite, otherTasks, favoriteTasksMap);
    
    return (
        <Paper square sx={{userSelect: 'none', overflow: 'hidden', height: '100vh', width: '100%'}}>
            <AutoSizer disableHeight>
                {({width}) => (
                    <Observer>
                        {() => (
                            <Grid
                                style={{paddingBlockStart: '8px', paddingInlineStart: '8px' }}
                                cellRenderer={it => cellRenderer(it, allTasks, rowsCount, indexToScroll)}
                                columnWidth={200}
                                columnCount={columnsCount}
                                height={appStore.screenHeight}
                                rowHeight={rowHeight}
                                rowCount={rowsCount}
                                width={width}
                                overscanColumnCount={5}
                                overscanIndicesGetter={bothDirectionOverscanIndicesGetter}
                                scrollToColumn={
                                    indexToScroll === undefined
                                        ? undefined
                                        : Math.ceil(indexToScroll / rowsCount)
                                }
                                scrollToAlignment='center'
                            />
                        )}
                    </Observer>
                )}
            </AutoSizer>
        </Paper>
    );
});

function getIndexToScroll(
    taskNumberToScroll: number | undefined,
    favoriteTasks: IAlgorithmData[],
    tasks: IAlgorithmData[],
    favoriteTasksMap: Record<number, boolean>
) {
    if (taskNumberToScroll === undefined) {
        return undefined;
    }
    if (favoriteTasksMap[taskNumberToScroll]) {
        return favoriteTasks.findIndex(x => x.taskNumber === taskNumberToScroll);
    }
    return favoriteTasks.filter(t => t.taskNumber > taskNumberToScroll).length + taskNumberToScroll - 1;
}

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

function cellRenderer({columnIndex, rowIndex, style}: GridCellProps, items: IAlgorithmData[], rowsCount: number, idToScroll?: number) {
    const index = rowsCount * columnIndex + rowIndex;
    const item = items[index];

    if (!item) {
        return <Fragment />;
    }
    return (
        <div style={style} key={`${columnIndex}-${rowIndex}`}>
            <TaskItem item={item} selected={index === idToScroll}/>
        </div>
    );
}

export default TasksDashboard;
