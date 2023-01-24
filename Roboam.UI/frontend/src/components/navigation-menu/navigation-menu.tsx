import Logotype from "../logotype/logotype";
import { ListWithSearch } from "../list-with-search/list-with-search";
import { useContext } from "react";
import { ROOT_STORE_CONTEXT } from "../../index";
import { observer } from "mobx-react";
import styled from "@emotion/styled";

export const NavigationMenu = observer(() => {
    const { rootStore } = useContext(ROOT_STORE_CONTEXT);
    const { algorithmNameStore, tagStore, detailsLevelStore, algorithmDataStore } = rootStore;

    return (
        <NavigationItemsWrapper style={{}}>
            <article style={{background: 'var(--filter-menu-background)'}}>
                <Logotype />
                <ListWithSearch
                    searchLabel={'Algorithm'}
                    search={algorithmNameStore.search}
                    onSearchChange={algorithmNameStore.handleSearchChange}
                    filteredItems={algorithmNameStore.filteredBySearchItems}
                    selectedItems={algorithmNameStore.selectedItems}
                    onSelectSingleItem={(item) => {
                        algorithmNameStore.setSelectedItem(item);
                        algorithmDataStore.load(algorithmNameStore.selectedItems, tagStore.selectedItems);
                    }}
                    onSelectMultipleItems={(item, active) => {
                        algorithmNameStore.changeSelectedItem(item, active);
                        algorithmDataStore.load(algorithmNameStore.selectedItems, tagStore.selectedItems);
                    }}
                />
                <ListWithSearch
                    searchLabel={'Task tag'}
                    search={tagStore.search}
                    onSearchChange={tagStore.handleSearchChange}
                    filteredItems={tagStore.filteredBySearchItems}
                    selectedItems={tagStore.selectedItems}
                    onSelectSingleItem={(item) => {
                        tagStore.setSelectedItem(item);
                        algorithmDataStore.load(algorithmNameStore.selectedItems, tagStore.selectedItems);
                    }}
                    onSelectMultipleItems={(item, active) => {
                        tagStore.changeSelectedItem(item, active);
                        algorithmDataStore.load(algorithmNameStore.selectedItems, tagStore.selectedItems);
                    }}
                />
                {/*<ListWithSearch*/}
                {/*    searchLabel={'Details level'}*/}
                {/*    search={detailsLevelStore.search}*/}
                {/*    onSearchChange={detailsLevelStore.handleSearchChange}*/}
                {/*    filteredItems={detailsLevelStore.filteredBySearchItems}*/}
                {/*    selectedItems={detailsLevelStore.selectedItems}*/}
                {/*    onSelectItem={detailsLevelStore.changeSelectedItem}*/}
                {/*/>*/}
            </article>
        </NavigationItemsWrapper>
    );
});

const NavigationItemsWrapper = styled.nav`
    width: 160px;
    position: sticky;
    display: flex;
    top: 0;
    left: 0;
    z-index: 10;
    height: 100vh;
    overflow: hidden;
    background: white;
    flex-shrink: 0;
    max-height: 100vh;
    border-right-width: 3px;
    border-right-color: #333333;
    userSelect: none;
`;