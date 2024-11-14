
import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    InputAdornment,
    IconButton,
    Autocomplete,
    Grid,
    Checkbox,
    FormControl,
    InputLabel,
    Select
  } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { Type } from "../models/Type";
import { StakeHolder } from "../models/StakeHolders";
import {Filter} from "../models/Filter";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";


import DocumentAPI from "../API/DocumentAPI";
const datePattern = /^([0-9]{4})$/;

const languages = [
    { code: "GB", label: "English" },
    {
      code: "SE",
      label: "Sweden",
    },
  ];

function SearchBar(props) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [dateError, setDateError] = useState("");

    const [stakeholders, setStakeholders] = useState<StakeHolder[]>([]);
    const [documentTypes, setDocumentTypes] = useState<Type[]>([]);
    const [documentsList, setDocumentsList] = useState<
        { id: number; title: string }[]
    >([]);
    const FILTER_DEFAULTS = {
        params: {
          title: "",
          type: undefined,
          stakeholders: [],
          startDate: "",
          endDate: "",
          description: "",
          scale: "",
          location: null,
          radius: 0,
          language: "",
          minPages: 0,
          maxPages: 0,
        }
    };
    const [filter, setFilter] = useState<Filter>(FILTER_DEFAULTS);
    const [selectedStakeholders, setSelectedStakeholders] = useState<number[]>([]);

    useEffect(() => {
        // Fetch document types
      DocumentAPI.getTypes()
      .then((types: Type[]) => {
        setDocumentTypes(types);
      })
      .catch((error) => {
        console.log(error);
      });
    // Fetch stakeholders
     DocumentAPI.getStakeholders()
      .then((stakeholders: StakeHolder[]) => {
        setStakeholders(stakeholders);
      })
      .catch((error) => {
        console.log(error);
      });
    // Fetch documents names, to filter radius search
    DocumentAPI.getAllDocumentsNames()
        .then((docs: { id: number; title: string }[]) => {
          setDocumentsList(docs);
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);


    // Handle opening and closing the form
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    // Handle form submission
    const handleSubmit = () => {
      props.onSearch(filter);
      handleClose();
    };

    
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
            {/* TextField with button inside */}
            <TextField
                label="Search Title"
                value={text}
                onChange={(e) => setText(e.target.value)}
                fullWidth
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton onClick={handleOpen}>
                        <AddIcon />
                    </IconButton>
                    </InputAdornment>
                ),
                }}
            />

            {/* Dialog Form */}
            <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Advanced Search</DialogTitle>
            <DialogContent
                sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                }}
                >

                <Grid container spacing={2}>
                    {/* Title */}
                    <Grid item xs={12}>
                        <TextField
                            label="Title"
                            value={filter.params.title}
                            onChange={(e) =>
                            setFilter({
                                params: { ...filter.params, title: e.target.value },
                            })
                            }
                            fullWidth
                        />

                    </Grid>
                    {/* Type */}
                    <Grid item xs={12}>
                        <Autocomplete
                            options={documentTypes}
                            getOptionLabel={(option) => option.name}
                            value={filter.params.type || null}
                            onChange={(e, newValue) =>
                                setFilter({
                                    params: { ...filter.params, type: newValue },
                                })
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Type" />
                            )}
                        />
                    </Grid>
                    {/* Stakeholders */}
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            options={stakeholders}
                            getOptionLabel={(option) => option.name}
                            value={filter.params.stakeholders}
                            onChange={(e, newValue) =>
                                setFilter({
                                    params: { ...filter.params, stakeholders: newValue },
                                })
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Stakeholders" />
                            )}
                        />
                    </Grid>
                    {/* Start Date */}
                    <Grid item xs={6}>
                        <TextField
                            label="Start Date"
                            value={filter.params.startDate}
                            onChange={(e) =>
                                setFilter({
                                    params: { ...filter.params, startDate: e.target.value },
                                })
                            }
                            fullWidth
                            error={dateError !== ""}
                            helperText={dateError}
                        />
                    </Grid>
                    {/* End Date */}
                    <Grid item xs={6}>
                        <TextField
                            label="End Date"
                            value={filter.params.endDate}
                            onChange={(e) =>
                                setFilter({
                                    params: { ...filter.params, endDate: e.target.value },
                                })
                            }
                            fullWidth
                            error={dateError !== ""}
                            helperText={dateError}
                        />
                    </Grid>
                    {/* Language */}
                    <Grid item xs={12}>
                        <Autocomplete
                            options={languages}
                            getOptionLabel={(option) => option.label}
                            value={languages.find((lang) => lang.code === filter.params.language) || null}
                            onChange={(e, newValue) =>
                                setFilter({
                                    params: { ...filter.params, language: newValue.code },
                                })
                            }
                            renderOption={(props, option) => {
                              const { key, ...optionProps } = props;
                              return (
                                <Box
                                  key={key}
                                  component="li"
                                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                  {...optionProps}>
                                  <img
                                    loading="lazy"
                                    width="20"
                                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                    alt=""
                                  />
                                  {option.label}
                                </Box>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Language"
                                slotProps={{
                                  htmlInput: {
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                  },
                                }}
                              />
                            )}
                        />
                    </Grid>

                </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Search</Button>
                </DialogActions>
            </Dialog>

            <Button variant="contained" color="primary">
                Search
            </Button>
        </Box>
    );
}

export default SearchBar;
