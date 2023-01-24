import { Observer, observer } from "mobx-react";
import { IAlgorithmData } from "../../models/algorithm-data";
import { Paper } from "@mui/material";
import {
    AutoSizerProps,
    Table as _Table, TableHeaderRowProps,
    TableProps,
    TableRowProps
} from "react-virtualized";
import React, { FC, useContext } from "react";
import { AutoSizer as _AutoSizer } from "react-virtualized/dist/es/AutoSizer";
import { bothDirectionOverscanIndicesGetter } from "../tasks-dashboard/tasks-dashboard";
import TaskItem from "../task-item/task-item";
import { ROOT_STORE_CONTEXT } from "../../index";

// https://github.com/bvaughn/react-virtualized/issues/1739
const AutoSizer = _AutoSizer as unknown as FC<AutoSizerProps>;
const Table = _Table as unknown as FC<TableProps>;

const TasksDashboardCompare = observer(({tasks}: {tasks: IAlgorithmData[]}) => {
    const { rootStore } = useContext(ROOT_STORE_CONTEXT);
    const { favoriteTasksStore, appStore } = rootStore;
    const { favoriteTasksMap } = favoriteTasksStore;

    const byTaskNumber: {[taskNumber: number]: IAlgorithmData[]} = {};
    for (const task of tasks) {
        if (byTaskNumber[task.taskNumber]) {
            byTaskNumber[task.taskNumber].push(task);
        } else {
            byTaskNumber[task.taskNumber] = [task];
        }
    }

    const renderList: IAlgorithmData[][] = [];
    const renderFavoritesList: IAlgorithmData[][] = [];
    for (const [taskNumber, elements] of Object.entries(byTaskNumber)) {
        const data: IAlgorithmData[] = [];
        for (let i = 0; i < elements.length; i++) {
            data.push(elements[i]);
        }
        if (favoriteTasksMap[Number.parseInt(taskNumber)]) {
            renderFavoritesList.push(data);
        } else {
            renderList.push(data);
        }
    }
    
    const finalRenderList = [
        ...renderFavoritesList,
        ... renderList
    ];

    const indexToScroll = getIndexToScroll(appStore.taskNumberToScroll, renderFavoritesList, renderList, favoriteTasksMap);

    return (
        <Paper square sx={{userSelect: 'none', overflow: 'hidden', width: '100%'}}>
            <AutoSizer>
                {({width, height}) => (
                    <Observer>
                        {() => (
                            <Table
                                headerHeight={30}
                                headerRowRenderer={headerRowRenderer}
                                rowCount={finalRenderList.length}
                                rowGetter={(index) => finalRenderList[index.index]}
                                rowRenderer={x => rowRenderer(x, finalRenderList, indexToScroll)}
                                width={width}
                                height={height}
                                rowHeight={30}
                                overscanColumnCount={20}
                                overscanIndicesGetter={bothDirectionOverscanIndicesGetter}
                                scrollToIndex={indexToScroll}
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
    favoriteTasks: IAlgorithmData[][],
    tasks: IAlgorithmData[][],
    favoriteTasksMap: Record<number, boolean>
) {
    if (taskNumberToScroll === undefined) {
        return undefined;
    }
    if (favoriteTasksMap[taskNumberToScroll]) {
        return favoriteTasks.findIndex(x => x[0].taskNumber === taskNumberToScroll);
    }
    return favoriteTasks.filter(t => t[0].taskNumber > taskNumberToScroll).length + taskNumberToScroll - 1
}

function headerRowRenderer(x: TableHeaderRowProps) {
    // todo: not implemented
    return (
      <div>
          
      </div>  
    );
}

function rowRenderer(props: TableRowProps, items: IAlgorithmData[][], indexToScroll: number | undefined) {
    const [firstItem, ...otherItems] = items[props.index];
    const selected = indexToScroll === props.index;

    return (
        <div key={props.index} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            boxShadow: selected ? '0px 0px 3px red' : undefined,
            borderRadius: selected ? 15 : undefined,
            maxWidth: 'fit-content',
            ...props.style
        }}>
            <TaskItem key={`${props.index}_${firstItem.taskNumber}`} item={firstItem} />

            {otherItems.map((data, ind) => (
                <TaskItem
                    key={`${props.index}_${ind}`}
                    item={data}
                    disableStar
                    disableTaskNumber
                />
            ))}
        </div>
    )
}

export default TasksDashboardCompare;
