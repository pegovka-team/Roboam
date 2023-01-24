import { Box, List, ListItemButton, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { observer } from "mobx-react";

interface ListWithSearchProps {
    searchLabel: string;
    search: string;
    onSearchChange: (change: string) => void;
    filteredItems: string[];
    selectedItems: string[];
    onSelectSingleItem: (item: string) => void;
    onSelectMultipleItems: (item: string, active: boolean) => void;
}

export const ListWithSearch = observer(({
    searchLabel,
    search,
    onSearchChange,
    filteredItems,
    selectedItems,
    onSelectSingleItem,
    onSelectMultipleItems
} : ListWithSearchProps) => {
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Search sx={{color: 'var(--search-color)'}} />
                <TextField
                    id='input-with-sx'
                    label={searchLabel}
                    variant='standard'
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    sx={{color: 'var(--search-color)'}}
                    InputProps={{ disableUnderline: true }}
                />
            </Box>
            <List sx={{
                maxHeight: 150,
                overflow: 'auto',
                scrollbarWidth: 'thin',
                scrollbarGutter: 'stable',
                '&::-webkit-scrollbar': {
                    width: '12px',
                    visibility: 'hidden'
                },
                '&::-webkit-scrollbar-track': {
                    background: 'var(--filter-menu-background)',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'var(--scrollbar-color)',
                    backgroundClip: 'padding-box',
                    border: '4px solid rgba(0, 0, 0, 0)',
                    visibility: 'visible'
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: 'var(--scrollbar-hover-color)'
                }
            }}>
                {filteredItems.map(i => (
                    <div key={i} 
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <ListItemButton
                            style={{width: 115, overflowX: 'hidden', paddingLeft: 8}}
                            selected={selectedItems.some(s => s === i)}
                            onClick={() => onSelectSingleItem(i)}
                        >
                            {i}
                        </ListItemButton>
                        <ListItemButton
                            style={{
                                width: 20,
                                height: 24,
                                display: 'flex',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0, 0, 0, .02)',
                                borderRadius: 50,
                                padding: 0,
                                boxShadow: '0px 0px 2px rgba(0, 0, 0, .2)'
                            }}
                            onClick={() => {
                                const selected = selectedItems.some(a => a === i);
                                onSelectMultipleItems(i, !selected);
                            }}
                        >
                            {selectedItems.some(a => a === i) ? '-' : '+'}
                        </ListItemButton>
                    </div>
                ))}
            </List>
        </>
    );
});
