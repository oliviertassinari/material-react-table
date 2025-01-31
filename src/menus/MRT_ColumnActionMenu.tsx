import React, { FC, useState } from 'react';
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import type { MRT_Header, MRT_TableInstance } from '..';
import { MRT_FilterTypeMenu } from './MRT_FilterTypeMenu';
import { MRT_ShowHideColumnsMenu } from './MRT_ShowHideColumnsMenu';

export const commonMenuItemStyles = {
  py: '6px',
  my: 0,
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const commonListItemStyles = {
  display: 'flex',
  alignItems: 'center',
};

interface Props {
  anchorEl: HTMLElement | null;
  header: MRT_Header;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  tableInstance: MRT_TableInstance;
}

export const MRT_ColumnActionMenu: FC<Props> = ({
  anchorEl,
  header,
  setAnchorEl,
  tableInstance,
}) => {
  const {
    getState,
    toggleAllColumnsVisible,
    setColumnOrder,
    options: {
      enableColumnFilters,
      enableColumnPinning,
      enableGrouping,
      enableHiding,
      enableSorting,
      icons: {
        ArrowRightIcon,
        ClearAllIcon,
        ViewColumnIcon,
        DynamicFeedIcon,
        FilterListIcon,
        FilterListOffIcon,
        PushPinIcon,
        SortIcon,
        VisibilityOffIcon,
      },
      idPrefix,
      localization,
      setShowFilters,
    },
  } = tableInstance;

  const { column } = header;

  const { isDensePadding, columnVisibility } = getState();

  const [filterMenuAnchorEl, setFilterMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const [showHideColumnsMenuAnchorEl, setShowHideColumnsMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const handleClearSort = () => {
    column.resetSorting();
    setAnchorEl(null);
  };

  const handleSortAsc = () => {
    column.toggleSorting(false);
    setAnchorEl(null);
  };

  const handleSortDesc = () => {
    column.toggleSorting(true);
    setAnchorEl(null);
  };

  const handleHideColumn = () => {
    column.toggleVisibility(false);
    setAnchorEl(null);
  };

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection);
  };

  const handleGroupByColumn = () => {
    column.toggleGrouping();
    setColumnOrder((old) => ['mrt-expand', ...old]);
    setAnchorEl(null);
  };

  const handleClearFilter = () => {
    column.setColumnFilterValue('');
    setAnchorEl(null);
  };

  const handleFilterByColumn = () => {
    setShowFilters(true);
    setTimeout(
      () =>
        document
          .getElementById(
            // @ts-ignore
            header.muiTableHeadCellFilterTextFieldProps?.id ??
              `mrt-${idPrefix}-${header.id}-filter-text-field`,
          )
          ?.focus(),
      200,
    );
    setAnchorEl(null);
  };

  const handleShowAllColumns = () => {
    toggleAllColumnsVisible(true);
    setAnchorEl(null);
  };

  const handleOpenFilterModeMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setFilterMenuAnchorEl(event.currentTarget);
  };

  const handleOpenShowHideColumnsMenu = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    setShowHideColumnsMenuAnchorEl(event.currentTarget);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={() => setAnchorEl(null)}
      MenuListProps={{
        dense: isDensePadding,
      }}
    >
      {enableSorting &&
        column.getCanSort() && [
          <MenuItem
            disabled={!column.getIsSorted()}
            key={0}
            onClick={handleClearSort}
            sx={commonMenuItemStyles}
          >
            <Box sx={commonListItemStyles}>
              <ListItemIcon>
                <ClearAllIcon />
              </ListItemIcon>
              {localization.clearSort}
            </Box>
          </MenuItem>,
          <MenuItem
            disabled={column.getIsSorted() === 'asc'}
            key={1}
            onClick={handleSortAsc}
            sx={commonMenuItemStyles}
          >
            <Box sx={commonListItemStyles}>
              <ListItemIcon>
                <SortIcon />
              </ListItemIcon>
              {localization.sortByColumnAsc?.replace(
                '{column}',
                String(column.header),
              )}
            </Box>
          </MenuItem>,
          <MenuItem
            divider={enableColumnFilters || enableGrouping || enableHiding}
            key={2}
            disabled={column.getIsSorted() === 'desc'}
            onClick={handleSortDesc}
            sx={commonMenuItemStyles}
          >
            <Box sx={commonListItemStyles}>
              <ListItemIcon>
                <SortIcon style={{ transform: 'rotate(180deg) scaleX(-1)' }} />
              </ListItemIcon>
              {localization.sortByColumnDesc?.replace(
                '{column}',
                String(column.header),
              )}
            </Box>
          </MenuItem>,
        ]}
      {enableColumnFilters &&
        column.getCanColumnFilter() && [
          <MenuItem
            disabled={!column.getColumnFilterValue()}
            key={0}
            onClick={handleClearFilter}
            sx={commonMenuItemStyles}
          >
            <Box sx={commonListItemStyles}>
              <ListItemIcon>
                <FilterListOffIcon />
              </ListItemIcon>
              {localization.clearFilter}
            </Box>
          </MenuItem>,
          <MenuItem
            divider={enableGrouping || enableHiding}
            key={1}
            onClick={handleFilterByColumn}
            sx={commonMenuItemStyles}
          >
            <Box sx={commonListItemStyles}>
              <ListItemIcon>
                <FilterListIcon />
              </ListItemIcon>
              {localization.filterByColumn?.replace(
                '{column}',
                String(column.header),
              )}
            </Box>
            {!column.filterSelectOptions && (
              <IconButton
                onClick={handleOpenFilterModeMenu}
                onMouseEnter={handleOpenFilterModeMenu}
                size="small"
                sx={{ p: 0 }}
              >
                <ArrowRightIcon />
              </IconButton>
            )}
          </MenuItem>,
          <MRT_FilterTypeMenu
            anchorEl={filterMenuAnchorEl}
            header={header}
            key={2}
            onSelect={handleFilterByColumn}
            setAnchorEl={setFilterMenuAnchorEl}
            tableInstance={tableInstance}
          />,
        ]}
      {enableGrouping &&
        column.getCanGroup() && [
          <MenuItem
            divider={enableColumnPinning}
            key={0}
            onClick={handleGroupByColumn}
            sx={commonMenuItemStyles}
          >
            <Box sx={commonListItemStyles}>
              <ListItemIcon>
                <DynamicFeedIcon />
              </ListItemIcon>
              {localization[
                column.getIsGrouped() ? 'ungroupByColumn' : 'groupByColumn'
              ]?.replace('{column}', String(column.header))}
            </Box>
          </MenuItem>,
        ]}
      {enableColumnPinning &&
        column.getCanPin() && [
          <MenuItem
            disabled={column.getIsPinned() === 'left'}
            key={0}
            onClick={() => handlePinColumn('left')}
            sx={commonMenuItemStyles}
          >
            <Box sx={commonListItemStyles}>
              <ListItemIcon>
                <PushPinIcon style={{ transform: 'rotate(90deg)' }} />
              </ListItemIcon>
              {localization.pinToLeft}
            </Box>
          </MenuItem>,
          <MenuItem
            disabled={column.getIsPinned() === 'right'}
            key={0}
            onClick={() => handlePinColumn('right')}
            sx={commonMenuItemStyles}
          >
            <Box sx={commonListItemStyles}>
              <ListItemIcon>
                <PushPinIcon style={{ transform: 'rotate(-90deg)' }} />
              </ListItemIcon>
              {localization.pinToRight}
            </Box>
          </MenuItem>,
          <MenuItem
            disabled={!column.getIsPinned()}
            divider={enableHiding}
            key={0}
            onClick={() => handlePinColumn(false)}
            sx={commonMenuItemStyles}
          >
            <Box sx={commonListItemStyles}>
              <ListItemIcon>
                <PushPinIcon />
              </ListItemIcon>
              {localization.unpin}
            </Box>
          </MenuItem>,
        ]}
      {enableHiding && [
        <MenuItem
          disabled={column.enableHiding === false}
          key={0}
          onClick={handleHideColumn}
          sx={commonMenuItemStyles}
        >
          <Box sx={commonListItemStyles}>
            <ListItemIcon>
              <VisibilityOffIcon />
            </ListItemIcon>
            {localization.hideColumn?.replace(
              '{column}',
              String(column.header),
            )}
          </Box>
        </MenuItem>,
        <MenuItem
          disabled={
            !Object.values(columnVisibility).filter((visible) => !visible)
              .length
          }
          key={1}
          onClick={handleShowAllColumns}
          sx={commonMenuItemStyles}
        >
          <Box sx={commonListItemStyles}>
            <ListItemIcon>
              <ViewColumnIcon />
            </ListItemIcon>
            {localization.showAllColumns?.replace(
              '{column}',
              String(column.header),
            )}
          </Box>
          <IconButton
            onClick={handleOpenShowHideColumnsMenu}
            onMouseEnter={handleOpenShowHideColumnsMenu}
            size="small"
            sx={{ p: 0 }}
          >
            <ArrowRightIcon />
          </IconButton>
        </MenuItem>,
        <MRT_ShowHideColumnsMenu
          anchorEl={showHideColumnsMenuAnchorEl}
          isSubMenu
          key={2}
          setAnchorEl={setShowHideColumnsMenuAnchorEl}
          tableInstance={tableInstance}
        />,
      ]}
    </Menu>
  );
};
