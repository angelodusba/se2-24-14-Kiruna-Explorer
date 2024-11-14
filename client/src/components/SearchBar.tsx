import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

function SearchBar(props) {
    const [type, setType] = useState('title');
    const [search, setSearch] = useState('');

    const typeSearch = [
        {
            value: 'title',
            label: 'Title',
        },
        {
            value: 'radius',
            label: 'Radius',
        },
        {
            value: 'type',
            label: 'Type',
        },
    ];
    
    return (
        <Box
            sx={{
                position: "absolute",
                display: 'flex',
                justifyContent: 'center',
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                width: "30%",
            }}
        >
            {/* text field for search */}
            <TextField
                sx={{
                    flex: 1,
                    marginRight: 1,
                    "& .MuiFab-primary": {
                        backgroundColor: "#ffffff",
                        "&:hover": {
                            backgroundColor: "#ffffff",
                        },
                    },
                    "& .MuiInputBase-root": {
                        backgroundColor: "#ffffff",
                    },
                }}
                onChange={(event) => setSearch(event.target.value)}
            />
            {/* text field for type */}
            <TextField
                select
                label=""
                value={type}
                onChange={(event) => setType(event.target.value)}
                SelectProps={{
                    native: true,
                }}
                variant="outlined"
                sx={{
                    flex: 1,
                    marginRight: 1,
                    "& .MuiFab-primary": {
                        backgroundColor: "#ffffff",
                        "&:hover": {
                            backgroundColor: "#ffffff",
                        },
                    },
                    "& .MuiInputBase-root": {
                        backgroundColor: "#ffffff",
                    },
                    label: {
                        color: '#000000', // Text fill color
                    }
                }}
            >
                {typeSearch.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </TextField>
            <Button variant="contained" color="primary"
                onClick={() => props.onSearch(search, type)}>
                Search
            </Button>
        </Box>
    );
}

export default SearchBar;
