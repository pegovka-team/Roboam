import { observer } from "mobx-react";
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
    const { favoriteTasksStore } = rootStore;
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

    return (
        <Paper square sx={{userSelect: 'none', overflow: 'hidden', width: '100%'}}>
            <AutoSizer>
                {({width, height}) => (
                    <Table
                        headerHeight={30}
                        headerRowRenderer={headerRowRenderer}
                        rowCount={finalRenderList.length}
                        rowGetter={(index) => finalRenderList[index.index]}
                        rowRenderer={x => rowRenderer(x, finalRenderList)}
                        width={width}
                        height={height}
                        rowHeight={30}
                        overscanColumnCount={20}
                        overscanIndicesGetter={bothDirectionOverscanIndicesGetter}
                    />
                )}
            </AutoSizer>
        </Paper>
    );
});

function headerRowRenderer(x: TableHeaderRowProps) {
    // todo: not implemented
    return (
      <div>
          
      </div>  
    );
}

function rowRenderer(props: TableRowProps, items: IAlgorithmData[][]) {
    const [firstItem, ...otherItems] = items[props.index];

    return (
        <div key={props.index} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
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
