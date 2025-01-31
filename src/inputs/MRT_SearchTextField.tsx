import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useState,
} from 'react';
import {
  Collapse,
  debounce,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import { MRT_FilterTypeMenu } from '../menus/MRT_FilterTypeMenu';
import { MRT_TableInstance } from '..';

interface Props {
  tableInstance: MRT_TableInstance;
}

export const MRT_SearchTextField: FC<Props> = ({ tableInstance }) => {
  const {
    getState,
    setGlobalFilter,
    options: {
      icons: { SearchIcon, CloseIcon },
      idPrefix,
      localization,
      muiSearchTextFieldProps,
      onGlobalFilterChange,
    },
  } = tableInstance;

  const { globalFilter, showSearch } = getState();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState(globalFilter ?? '');

  const handleChange = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => {
      setGlobalFilter(event.target.value ?? undefined);
      onGlobalFilterChange?.({ event, tableInstance });
    }, 200),
    [],
  );

  const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClear = () => {
    setSearchValue('');
    setGlobalFilter(undefined);
  };

  const textFieldProps =
    muiSearchTextFieldProps instanceof Function
      ? muiSearchTextFieldProps({ tableInstance })
      : muiSearchTextFieldProps;

  return (
    <Collapse in={showSearch} orientation="horizontal">
      <TextField
        id={`mrt-${idPrefix}-search-text-field`}
        placeholder={localization.search}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setSearchValue(event.target.value);
          handleChange(event);
        }}
        value={searchValue ?? ''}
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip arrow title={localization.changeSearchMode}>
                <span>
                  <IconButton
                    aria-label={localization.changeSearchMode}
                    onClick={handleGlobalFilterMenuOpen}
                    size="small"
                    sx={{ height: '1.75rem', width: '1.75rem' }}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={localization.clearSearch}
                disabled={searchValue?.length === 0}
                onClick={handleClear}
                size="small"
                title={localization.clearSearch}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...textFieldProps}
        sx={{ justifySelf: 'end', ...textFieldProps?.sx }}
      />
      <MRT_FilterTypeMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        tableInstance={tableInstance}
      />
    </Collapse>
  );
};
