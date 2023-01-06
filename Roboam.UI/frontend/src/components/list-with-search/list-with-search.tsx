import { Box, List, ListItemButton, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { observer } from "mobx-react";

interface ListWithSearchProps {
    searchLabel: string;
    search: string;
    onSearchChange: (change: string) => void;
    filteredItems: string[];
    selectedItems: string[];
    onSelectItem: (item: string, active: boolean) => void;
}

export const ListWithSearch = observer(({
    searchLabel,
    search,
    onSearchChange,
    filteredItems,
    selectedItems,
    onSelectItem
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
                    <ListItemButton
                        key={i}
                        selected={selectedItems.some(s => s === i)}
                        onClick={() => {
                            const selected = selectedItems.some(a => a === i);
                            onSelectItem(i, !selected);
                        }}
                    >
                        {i}
                    </ListItemButton>
                ))}
            </List>
        </>
    );
});
