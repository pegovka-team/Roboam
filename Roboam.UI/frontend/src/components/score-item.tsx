import styled from "@emotion/styled";
import { Tooltip } from "@mui/material";

interface ScoreItemProps {
    width: number;
    algorithmCurrentScore: number;
    algorithmMax: number;
    localMax: number;
    globalMax?: number;
    precision?: number;
    algorithmName: string;
}

const TooltipTextWrapper = styled.div`
    white-space: pre-line;
    padding: 8px;
    margin: 0px;
`;

const tooltipText = (algorithmName: string, currentScore: number, currentMax: number, localMax: number, globalMax?: number) => {
    return (
        <TooltipTextWrapper>
            {`${algorithmName}\n
Last result: ${currentScore}\n
Best for this algo: ${currentMax}\n
Best for all algos: ${localMax}\n
${globalMax && `Best in the world: ${globalMax}`}`}
        </TooltipTextWrapper>
    );
}

export default function ScoreItem({width, algorithmCurrentScore, algorithmMax, localMax, globalMax, precision, algorithmName}: ScoreItemProps) {
    const limit = globalMax ?? localMax;
    const algorithmCurrentScoreWidth = limit > 0 ? width * (algorithmCurrentScore / limit) : 0;
    const algorithmMaxWidth = limit > 0 ? (width * (algorithmMax / limit)) : 0;
    const localMaxWidth = limit > 0 ? (width * (localMax / limit)) : 0;

    return (
        <Tooltip
            followCursor
            enterDelay={500}
            enterNextDelay={250}
            disableInteractive
            title={tooltipText(algorithmName, algorithmCurrentScore, algorithmMax, localMax, globalMax)}
            placement={"right-start"}
        >
            <ScoreContainer width={width}>
                <div>{"\u00a0"}</div>
                {localMax <= limit && algorithmMax < localMax && (
                    <Spark
                        width={localMaxWidth}
                        background={"repeating-linear-gradient(45deg, var(--background), var(--background) 4px, var(--score-item-background), var(--score-item-background) 5.5px)"}
                        sparkColor={"var(--local-max-background)"}
                    />
                )}
                <AlgorithmMaxScoreBackground
                    width={algorithmMaxWidth}
                    background={algorithmMax === limit ? "var(--score-item-with-best-result-background)" : "var(--score-item-background)"}
                />
                {algorithmCurrentScore < algorithmMax && (
                    <Spark
                        width={algorithmCurrentScoreWidth}
                        background={"transparent"}
                        sparkColor={"var(--current-score-spark-background)"}
                    />
                )}
                <AlgorithmMaxResult>
                    {precision ? algorithmMax.toFixed(precision) : algorithmMax}
                </AlgorithmMaxResult>
            </ScoreContainer>
        </Tooltip>
    )
}

const ScoreContainer = styled.div<{width: number}>`
    background: white;
    border: 0.5px solid black;
    border-radius: 4px;
    width: ${props => props.width}px;
    height: 20px;
    line-height: 20px;
    font-weight: bold;
    display: inline-block;
    position: relative;
    overflow: hidden;
`;

const AlgorithmMaxScoreBackground = styled.div<{width: number, background: string}>`
    background: ${props => props.background};
    border-radius: 2px 0 0 2px;
    height: 100%;
    position: absolute;
    top: 0;
    width: ${props => props.width}px;
`;

const Spark = styled.div<{width: number, background: string, sparkColor: string}>`
    background: ${props => props.background};
    width: ${props => props.width}px;
    border-width: 0px;
    border-right-width: 3px;
    border-right-color: ${props => props.sparkColor};
    border-style: solid;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`;

const AlgorithmMaxResult = styled.div`
    font-size: 10px;
    position: absolute;
    top: 0;
    left: 4px;
`;