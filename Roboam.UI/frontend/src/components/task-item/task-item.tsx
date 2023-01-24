import { observer } from "mobx-react";
import { useContext } from "react";
import { ROOT_STORE_CONTEXT } from "../../index";
import { Star } from "@mui/icons-material";
import ScoreItem from "../score-item";
import { IAlgorithmData } from "../../models/algorithm-data";

interface TaskItemProps {
    item: IAlgorithmData;
    disableStar?: boolean;
    disableTaskNumber?: boolean;
    selected?: boolean;
}

const TaskItem = observer(({item, disableStar, disableTaskNumber, selected}: TaskItemProps) => {
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
            boxShadow: selected ? '0px 0px 3px red' : undefined,
            borderRadius: selected ? 15 : undefined
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
            <div style={{ paddingLeft: 8, color: 'gray', fontSize: '10px', width: 32 }}>
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

export default TaskItem;
