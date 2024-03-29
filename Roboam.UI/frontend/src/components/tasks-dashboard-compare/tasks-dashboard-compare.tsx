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
    
    const tasksIndexes: {[taskNumber: number]: number} = {};
    for (let i = 0; i < finalRenderList.length; i++) {
        tasksIndexes[finalRenderList[i][0].taskNumber] = i;
    }

    const indexToScroll = appStore.taskNumberToScroll === undefined ? undefined : tasksIndexes[appStore.taskNumberToScroll];

    return (
        <Paper square sx={{userSelect: 'none', overflow: 'hidden', width: '100%'}}>
            <AutoSizer>
                {({width, height}) => (
                    <Observer>
                        {() => (
                            <Table
                                headerHeight={30}
                                headerRowRenderer={x => (headerRowRenderer(x, finalRenderList))}
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

function headerRowRenderer(x: TableHeaderRowProps, items: IAlgorithmData[][]) {
    const algorithmNames = items[0].map(i => i.algorithmName);

    return (
      <section style={{display: 'inline-flex'}}>
          <div style={{width: 55}}>
              Task
          </div>
          {algorithmNames.map(algorithmName => (
              <div key={algorithmName} style={{width: 140}}>
                  {algorithmName}
              </div>
          ))}
      </section>  
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
