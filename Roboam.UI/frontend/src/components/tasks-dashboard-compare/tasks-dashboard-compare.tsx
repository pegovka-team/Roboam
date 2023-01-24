import { observer } from "mobx-react";
import { IAlgorithmData } from "../../models/algorithm-data";
import { Paper } from "@mui/material";
import {
    AutoSizerProps,
    Table as _Table, TableHeaderRowProps,
    TableProps,
    TableRowProps
} from "react-virtualized";
import React, { FC } from "react";
import { AutoSizer as _AutoSizer } from "react-virtualized/dist/es/AutoSizer";
import { bothDirectionOverscanIndicesGetter } from "../tasks-dashboard/tasks-dashboard";
import TaskItem from "../task-item/task-item";

// https://github.com/bvaughn/react-virtualized/issues/1739
const AutoSizer = _AutoSizer as unknown as FC<AutoSizerProps>;
const Table = _Table as unknown as FC<TableProps>;

const TasksDashboardCompare = observer(({tasks}: {tasks: IAlgorithmData[]}) => {
    const byTaskNumber: {[taskNumber: string]: IAlgorithmData[]} = {};
    for (const task of tasks) {
        if (byTaskNumber[task.taskNumber]) {
            byTaskNumber[task.taskNumber].push(task);
        } else {
            byTaskNumber[task.taskNumber] = [task];
        }
    }

    const renderList: IAlgorithmData[][] = [];
    for (const [_, elements] of Object.entries(byTaskNumber)) {
        const data: IAlgorithmData[] = [];
        for (let i = 0; i < elements.length; i++) {
            data.push(elements[i]);
        }
        renderList.push(data);
    }

    return (
        <Paper square sx={{userSelect: 'none', overflow: 'hidden', width: '100%'}}>
            <AutoSizer>
                {({width, height}) => (
                    <Table
                        headerHeight={30}
                        headerRowRenderer={headerRowRenderer}
                        rowCount={renderList.length}
                        rowGetter={(index) => renderList[index.index]}
                        rowRenderer={x => rowRenderer(x, renderList)}
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
