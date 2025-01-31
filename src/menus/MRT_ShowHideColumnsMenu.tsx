import React, { FC, useMemo } from 'react';
import { Button, Menu, Divider, Box } from '@mui/material';
import { MRT_ShowHideColumnsMenuItems } from './MRT_ShowHideColumnsMenuItems';
import { MRT_TableInstance } from '..';

interface Props {
  anchorEl: HTMLElement | null;
  isSubMenu?: boolean;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  tableInstance: MRT_TableInstance;
}

export const MRT_ShowHideColumnsMenu: FC<Props> = ({
  anchorEl,
  isSubMenu,
  setAnchorEl,
  tableInstance,
}) => {
  const {
    getAllColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsVisible,
    getIsSomeColumnsPinned,
    getState,
    toggleAllColumnsVisible,
    getAllLeafColumns,
    options: { localization },
  } = tableInstance;

  const { isDensePadding } = getState();

  const hideAllColumns = () => {
    getAllLeafColumns()
      .filter((col) => col.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(false));
  };

  const allDisplayColumns = useMemo(
    () => getAllColumns().filter((col) => col.columnDefType === 'display'),
    [getAllColumns()],
  );

  const allDataColumns = useMemo(() => {
    const dataColumns = getAllColumns().filter(
      (col) => col.columnDefType !== 'display',
    );
    return getIsSomeColumnsPinned()
      ? [
          ...dataColumns.filter((c) => c.getIsPinned() === 'left'),
          ...dataColumns.filter((c) => c.getIsPinned() === false),
          ...dataColumns.filter((c) => c.getIsPinned() === 'right'),
        ]
      : dataColumns;
  }, [getAllColumns(), getState().columnPinning, getIsSomeColumnsPinned()]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={() => setAnchorEl(null)}
      MenuListProps={{
        dense: isDensePadding,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isSubMenu ? 'center' : 'space-between',
          p: '0.5rem',
          pt: 0,
        }}
      >
        {!isSubMenu && (
          <Button
            disabled={!getIsSomeColumnsVisible()}
            onClick={hideAllColumns}
          >
            {localization.hideAll}
          </Button>
        )}
        <Button
          disabled={getIsAllColumnsVisible()}
          onClick={() => toggleAllColumnsVisible(true)}
        >
          {localization.showAll}
        </Button>
      </Box>
      <Divider />
      {allDisplayColumns.map((column, index) => (
        <MRT_ShowHideColumnsMenuItems
          column={column}
          isSubMenu={isSubMenu}
          key={`${index}-${column.id}`}
          tableInstance={tableInstance}
        />
      ))}
      <Divider />
      {allDataColumns.map((column, index) => (
        <MRT_ShowHideColumnsMenuItems
          column={column}
          isSubMenu={isSubMenu}
          key={`${index}-${column.id}`}
          tableInstance={tableInstance}
        />
      ))}
    </Menu>
  );
};
