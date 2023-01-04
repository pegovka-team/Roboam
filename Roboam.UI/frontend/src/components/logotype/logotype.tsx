import styled from "@emotion/styled";

const LogotypeWrapper = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-inline-start: 8px;
    margin-block-start: 4px;
`;

export default function Logotype() {
    return (
        <LogotypeWrapper>
            Roboam
        </LogotypeWrapper>
    );
}